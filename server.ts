import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK if key is available
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// API endpoint for AI fashion stylist
app.post('/api/stylist', async (req: Request, res: Response) => {
  try {
    const { profile, wardrobe, weather, occasion, customPrompt, seedPiece } = req.body;

    if (!aiClient) {
      return res.status(503).json({ error: 'Gemini API not configured, fallback to client stylist' });
    }

    const wardrobeItems: any[] = Array.isArray(wardrobe) ? wardrobe : [];
    if (wardrobeItems.length === 0) {
      return res.status(400).json({ error: 'Wardrobe is empty' });
    }

    // Build comprehensive wardrobe inventory grouped by categories with exact IDs
    const wardrobeInventory = wardrobeItems
      .map((w: any) => `- [ID: ${w.id}] [${w.category}] ${w.name} (Màu: ${w.color || 'Trắng'}, Chất liệu: ${w.material || 'Cotton'}, Style: ${w.style || 'Casual'}, Mùa: ${w.season || '4 Mùa'})`)
      .join('\n');

    const prompt = `
Bạn là GUSTYLE - Trợ lý Thời trang Cá nhân AI cao cấp, thẩm mỹ tinh tế, sử dụng tiếng Việt chuẩn mực.
Nhiệm vụ của bạn là phối một set trang phục (Outfit) hoàn chỉnh từ TỦ ĐỒ CỦA NGƯỜI DÙNG dựa trên thứ tự ưu tiên tuyệt đối sau:

THỨ TỰ ƯU TIÊN:
1. YÊU CẦU BẮT BUỘC TRONG GHI CHÚ (customPrompt):
   GHI CHÚ THỰC TẾ TỪ NGƯỜI DÙNG: "${customPrompt ? customPrompt.trim() : 'Không có ghi chú cụ thể'}"
   - "Không muốn / Không thích / Không mặc / Không sử dụng / Tuyệt đối không..." là HARD CONSTRAINT: BẮT BUỘC LOẠI BỎ hoàn toàn loại trang phục, màu sắc hoặc chi tiết đó (Ví dụ: "Không mặc sơ mi" -> cấm chọn bất kỳ áo sơ mi nào; "Không đi giày cao gót" -> cấm chọn giày cao gót; "Không thích skinny" -> cấm chọn quần skinny; "Không muốn mặc quần jean" -> cấm chọn quần jean).
   - "Phải có / Bắt buộc / Cần / Muốn mặc / Thích..." là PREFERENCE ƯU TIÊN CAO: Bắt buộc chọn nếu có trong tủ đồ (Ví dụ: "Muốn mặc váy đen" -> chọn váy đen; "Cần áo khoác mỏng" -> chọn áo khoác gió siêu nhẹ hoặc cardigan mỏng; "Muốn dùng chiếc blazer hồng" -> chọn blazer dạ tweed hồng).
   - Ghi chú có quyền thay đổi phong cách của dịp (Ví dụ: Dịp "Đi làm" nhưng ghi "Không muốn quá formal, muốn thoải mái" -> phối Smart Casual / Casual thoải mái, không phối âu phục cứng nhắc).
2. MÓN ĐỒ CHỈ ĐỊNH (seedPiece nếu có): ${seedPiece ? `Bắt buộc phối cùng món [ID: ${seedPiece.id}] ${seedPiece.name}` : 'Không có'}
3. THỜI TIẾT: ${weather?.temp || 29}°C, ${weather?.condition || 'Nắng nhẹ'} tại ${weather?.city || 'TP. Hồ Chí Minh'}.
   - QUY TẮC ÁO KHOÁC: Nhiệt độ ấm áp/nóng (>= 26°C) KHÔNG TỰ ĐỘNG THÊM ÁO KHOÁC DÀY trừ khi người dùng yêu cầu ("cần áo khoác mỏng chống nắng" -> chỉ chọn áo gió nhẹ/cardigan mỏng). Trời lạnh (<= 22°C) mới ưu tiên áo khoác giữ ấm.
4. DỊP SỬ DỤNG: ${occasion || 'Đi làm'}.
5. TỦ ĐỒ HIỆN TẠI: BẮT BUỘC CHỌN CÁC MÓN CÓ SẴN TRONG TỦ ĐỒ DƯỚI ĐÂY BẰNG MÃ ID CHÍNH XÁC.

DANH SÁCH TOÀN BỘ TỦ ĐỒ HIỆN TẠI (CHỌN THEO MÃ ID):
${wardrobeInventory}

YÊU CẦU ĐẦU RA:
Trả về DUY NHẤT một chuỗi JSON hợp lệ (không bọc markdown, không thêm text ngoài JSON) với cấu trúc sau:
{
  "title": "Tên set trang phục ngắn gọn, sang trọng",
  "style": "${profile?.favoriteStyles?.[0] || 'Minimal'}",
  "reason": "Giải thích chi tiết 2 câu vì sao outfit này đáp ứng đúng ghi chú của người dùng và thời tiết hiện tại",
  "description": "Mô tả set đồ và cách phối chi tiết 2-3 câu",
  "selectedItemIds": ["MÃ_ID_1", "MÃ_ID_2", "MÃ_ID_3", "MÃ_ID_4"]
}

LƯU Ý QUAN TRỌNG:
- Trong mảng "selectedItemIds", chỉ điền các mã ID thực sự có trong danh sách trên (ví dụ: "AO-004", "QUAN-004", "GIAY-001", "TUI-001", "PK-001").
- Một set đồ hoàn chỉnh thông thường gồm: 1 Áo + 1 Quần/Váy (hoặc 1 Đầm) + 1 Đôi Giày + 1 Túi xách/Phụ kiện phù hợp. Nếu trời lạnh hoặc người dùng yêu cầu thì thêm 1 Áo khoác.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const responseText = response.text?.trim() || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Map each returned ID to the actual item in the wardrobe
    const itemMap = new Map(wardrobeItems.map((w: any) => [w.id, w]));
    const matchedItems: any[] = [];

    const selectedIds: string[] = Array.isArray(parsed.selectedItemIds) ? parsed.selectedItemIds : [];

    // If seedPiece was specified, guarantee it is included
    if (seedPiece && !selectedIds.includes(seedPiece.id)) {
      selectedIds.unshift(seedPiece.id);
    }

    for (const id of selectedIds) {
      const found = itemMap.get(id);
      if (found) {
        matchedItems.push({
          id: found.id,
          name: found.name,
          category: found.category,
          imageUrl: found.imageUrl,
          isFromWardrobe: true,
          color: found.color,
          material: found.material,
        });
      }
    }

    // Safety fallback: if no items matched from Gemini IDs, fall back to client stylist
    if (matchedItems.length === 0) {
      return res.status(503).json({ error: 'Gemini did not return matching wardrobe IDs, falling back to client stylist' });
    }

    // Hero image is the primary garment's actual image (e.g. dress or top)
    const heroItem = matchedItems.find(it => it.category === 'Đầm' || it.category === 'Áo') || matchedItems[0];
    const outfitImageUrl = heroItem.imageUrl;

    return res.json({
      outfit: {
        id: 'outfit_gemini_' + Date.now(),
        title: parsed.title || 'Set Đồ Cá Nhân Hóa Chuẩn Gu',
        style: parsed.style || profile?.favoriteStyles?.[0] || 'Smart Casual',
        occasion: occasion || 'Đi làm',
        weatherSuitability: `${weather?.temp || 29}°C, ${weather?.condition || 'Nắng nhẹ'} tại ${weather?.city || 'TP. Hồ Chí Minh'}`,
        description: parsed.description || 'Bản phối được AI Stylist thiết kế riêng theo ghi chú và thời tiết của bạn.',
        reason: parsed.reason || 'Sự kết hợp chuẩn mực tôn vóc dáng và phù hợp hoàn hảo với ngày hôm nay.',
        imageUrl: outfitImageUrl,
        items: matchedItems,
        isFavorite: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
      },
      stylistNote: parsed.reason || 'Gợi ý trực tiếp từ trí tuệ nhân tạo Gemini Stylist.',
    });
  } catch (error) {
    console.error('Gemini Stylist error:', error);
    return res.status(503).json({ error: 'Failed to generate outfit with Gemini, falling back to client stylist' });
  }
});

// Setup Vite middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`GUSTYLE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
