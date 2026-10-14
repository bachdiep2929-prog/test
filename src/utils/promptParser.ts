import { FashionStyle, Occasion, WardrobeCategory, WardrobeItem } from '../types/index';

export interface ParsedFashionPrompt {
  raw: string;
  // Hard bans (cannot appear in outfit)
  bannedCategories: WardrobeCategory[];
  bannedKeywords: string[]; // e.g. 'sơ mi', 'skinny', 'cao gót', 'khoác dày', 'jean'
  bannedColors: string[];

  // Must haves / high priorities
  requiredCategories: WardrobeCategory[];
  requiredKeywords: string[]; // e.g. 'blazer hồng', 'giày bệt', 'váy đen', 'polo'
  preferredColors: string[];
  preferredStyles: FashionStyle[];

  // Comfort and Formality overrides
  comfortPreferred: boolean;
  formalityOverride?: 'casual' | 'smart_casual' | 'formal';
  
  // Outerwear preference: 'ban' | 'require_light' | 'require_any' | 'auto'
  outerwearPreference: 'ban' | 'require_light' | 'require_any' | 'auto';

  // Specific piece identifiers (if user mentions an ID or exact name)
  targetItemId?: string;
}

// Helper to remove accents for normalized searching if needed, while keeping original text
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

export function parseFashionPrompt(customPrompt?: string): ParsedFashionPrompt {
  const result: ParsedFashionPrompt = {
    raw: customPrompt || '',
    bannedCategories: [],
    bannedKeywords: [],
    bannedColors: [],
    requiredCategories: [],
    requiredKeywords: [],
    preferredColors: [],
    preferredStyles: [],
    comfortPreferred: false,
    outerwearPreference: 'auto',
  };

  if (!customPrompt || !customPrompt.trim()) {
    return result;
  }

  const text = normalizeText(customPrompt);

  // 1. NEGATIONS / HARD BANS ("không muốn", "không thích", "không mặc", "không đi", "không dùng", "đừng", "tuyệt đối không", "tránh")
  const negationRegex = /(?:không\s+muốn(?:\s+mặc)?|không\s+thích|không\s+mặc|không\s+đi|không\s+dùng|không\s+sử\s+dụng|không\s+chọn|không\s+mang|tuyệt\s+đối\s+không|đừng|tránh|bỏ\s+qua)\s+([^,.;!?]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = negationRegex.exec(text)) !== null) {
    const negatedPhrase = match[1].trim();

    // Check what was negated
    if (negatedPhrase.includes('sơ mi') || negatedPhrase.includes('áo sơ mi')) {
      result.bannedKeywords.push('sơ mi', 'áo sơ mi');
    }
    if (negatedPhrase.includes('áo thun') || negatedPhrase.includes('t-shirt')) {
      result.bannedKeywords.push('áo thun', 'thun');
    }
    if (negatedPhrase.includes('polo')) {
      result.bannedKeywords.push('polo');
    }
    if (negatedPhrase.includes('váy') || negatedPhrase.includes('chân váy')) {
      result.bannedCategories.push('Váy');
      result.bannedKeywords.push('chân váy', 'váy');
      // If user says "không muốn mặc váy", they also likely don't want dresses
      result.bannedCategories.push('Đầm');
      result.bannedKeywords.push('đầm');
    }
    if (negatedPhrase.includes('đầm')) {
      result.bannedCategories.push('Đầm');
      result.bannedKeywords.push('đầm');
    }
    if (negatedPhrase.includes('quần jean') || negatedPhrase.includes('jean') || negatedPhrase.includes('jeans') || negatedPhrase.includes('bò')) {
      result.bannedKeywords.push('jean', 'denim', 'jeans');
    }
    if (negatedPhrase.includes('skinny') || negatedPhrase.includes('quần bó') || negatedPhrase.includes('bó sát')) {
      result.bannedKeywords.push('skinny', 'bó', 'legging');
    }
    if (negatedPhrase.includes('quần short') || negatedPhrase.includes('short')) {
      result.bannedKeywords.push('quần short', 'short');
    }
    if (negatedPhrase.includes('cao gót') || negatedPhrase.includes('giày cao gót') || negatedPhrase.includes('guốc')) {
      result.bannedKeywords.push('cao gót', 'mũi nhọn', 'gót nhọn');
    }
    if (negatedPhrase.includes('boot') || negatedPhrase.includes('bốt')) {
      result.bannedKeywords.push('boot', 'bốt');
    }
    if (negatedPhrase.includes('blazer')) {
      result.bannedKeywords.push('blazer');
    }
    if (negatedPhrase.includes('áo khoác') || negatedPhrase.includes('khoác')) {
      result.outerwearPreference = 'ban';
      result.bannedCategories.push('Áo khoác');
    }

    // Negated colors
    if (negatedPhrase.includes('màu đen') || negatedPhrase.includes('màu tối')) {
      result.bannedColors.push('Đen');
    }
    if (negatedPhrase.includes('màu trắng') || negatedPhrase.includes('màu sáng')) {
      result.bannedColors.push('Trắng');
    }
    if (negatedPhrase.includes('màu be')) {
      result.bannedColors.push('Be');
    }
  }

  // 2. HARD MUST-HAVES & SPECIFIC REQUESTS
  // Check for Dress / Skirt requests (when NOT negated)
  if (!result.bannedCategories.includes('Váy') && !result.bannedCategories.includes('Đầm')) {
    if (text.includes('muốn mặc váy') || text.includes('thích mặc váy') || text.includes('mặc váy') || text.includes('chân váy')) {
      result.requiredCategories.push('Váy');
      result.requiredKeywords.push('váy');
    }
    if (text.includes('muốn mặc đầm') || text.includes('thích mặc đầm') || text.includes('mặc đầm')) {
      result.requiredCategories.push('Đầm');
      result.requiredKeywords.push('đầm');
    }
  }

  // Flat shoes request
  if (text.includes('giày bệt') || text.includes('ballet') || text.includes('không đi giày cao gót') || text.includes('không thích giày cao gót')) {
    result.requiredKeywords.push('ballet', 'bệt', 'sneaker', 'sandal');
    result.bannedKeywords.push('cao gót', 'mũi nhọn');
  }

  // Outerwear requests
  if (result.outerwearPreference !== 'ban') {
    if (text.includes('áo khoác mỏng') || text.includes('chống nắng') || text.includes('khoác mỏng') || text.includes('khoác nhẹ')) {
      result.outerwearPreference = 'require_light';
      result.requiredCategories.push('Áo khoác');
      result.requiredKeywords.push('gió', 'siêu nhẹ', 'chống nước', 'mỏng');
    } else if ((text.includes('blazer') && (text.includes('hồng') || text.includes('tweed'))) || text.includes('blazer dạ tweed')) {
      result.outerwearPreference = 'require_any';
      result.requiredCategories.push('Áo khoác');
      result.requiredKeywords.push('blazer', 'tweed', 'hồng');
    } else if (text.includes('cần áo khoác') || text.includes('phải có áo khoác') || text.includes('thêm áo khoác') || text.includes('muốn mặc áo khoác')) {
      result.outerwearPreference = 'require_any';
      result.requiredCategories.push('Áo khoác');
    }
  }

  // 3. COLOR PREFERENCES
  // Black
  if ((text.includes('thích màu đen') || text.includes('màu đen') || text.includes('váy đen') || text.includes('đầm đen') || text.includes('tone đen')) && !result.bannedColors.includes('Đen')) {
    result.preferredColors.push('Đen');
    result.requiredKeywords.push('đen');
  }
  // Beige / Cream
  if ((text.includes('thích màu be') || text.includes('màu be') || text.includes('màu kem') || text.includes('tone be')) && !result.bannedColors.includes('Be')) {
    result.preferredColors.push('Be', 'Kem');
    result.requiredKeywords.push('be', 'kem');
  }
  // White
  if ((text.includes('thích màu trắng') || text.includes('màu trắng') || text.includes('tone trắng')) && !result.bannedColors.includes('Trắng')) {
    result.preferredColors.push('Trắng');
    result.requiredKeywords.push('trắng');
  }
  // Pastel / Pink
  if (text.includes('hồng') || text.includes('pastel')) {
    result.preferredColors.push('Hồng pastel', 'Xanh pastel');
    result.requiredKeywords.push('hồng');
  }
  // Blue
  if (text.includes('thích màu xanh') || text.includes('màu xanh') || text.includes('tone xanh')) {
    result.preferredColors.push('Xanh pastel', 'Xanh navy');
    result.requiredKeywords.push('xanh');
  }

  // 4. STYLE & FORMALITY OVERRIDES
  if (text.includes('thoải mái') || text.includes('dễ chịu') || text.includes('không gò bó') || text.includes('không muốn quá formal') || text.includes('không formal') || text.includes('năng động')) {
    result.comfortPreferred = true;
    result.formalityOverride = 'casual';
    result.preferredStyles.push('Casual', 'Smart Casual');
  }

  if (text.includes('lịch sự') || text.includes('chỉn chu') || text.includes('nhà hàng') || text.includes('trang trọng') || text.includes('sang trọng')) {
    result.formalityOverride = 'formal';
    result.preferredStyles.push('Smart Casual', 'Elegant', 'Office');
  }

  if (text.includes('nữ tính') || text.includes('dịu dàng') || text.includes('bánh bèo') || text.includes('tiểu thư')) {
    result.preferredStyles.push('Feminine', 'Elegant');
  }

  if (text.includes('đơn giản') || text.includes('tối giản') || text.includes('basic') || text.includes('minimal')) {
    result.preferredStyles.push('Minimal', 'Casual');
  }

  if (text.includes('hàn quốc') || text.includes('vintage') || text.includes('cổ điển') || text.includes('retro')) {
    result.preferredStyles.push('Vintage', 'Casual');
  }

  if (text.includes('cá tính') || text.includes('streetwear') || text.includes('ngầu') || text.includes('phóng khoáng')) {
    result.preferredStyles.push('Streetwear', 'Casual');
  }

  return result;
}

// Evaluates an item against the parsed prompt rules
export function evaluateItemAgainstPrompt(item: WardrobeItem, parsed: ParsedFashionPrompt): {
  allowed: boolean;
  score: number;
  reason?: string;
} {
  const itemName = item.name.toLowerCase();
  const itemColor = (item.color || '').toLowerCase();
  const itemMaterial = (item.material || '').toLowerCase();
  const itemStyle = item.style;

  // 1. HARD BANS CHECK
  if (parsed.bannedCategories.includes(item.category)) {
    return { allowed: false, score: -100, reason: `Danh mục ${item.category} bị cấm trong ghi chú` };
  }

  for (const bannedKw of parsed.bannedKeywords) {
    if (itemName.includes(bannedKw) || itemMaterial.includes(bannedKw)) {
      return { allowed: false, score: -100, reason: `Chứa từ cấm '${bannedKw}'` };
    }
  }

  for (const bannedColor of parsed.bannedColors) {
    if (item.color.toLowerCase() === bannedColor.toLowerCase()) {
      return { allowed: false, score: -100, reason: `Màu ${item.color} bị cấm trong ghi chú` };
    }
  }

  // 2. SCORING BONUSES
  let score = 0;

  // Color preference
  if (parsed.preferredColors.some(c => c.toLowerCase() === item.color.toLowerCase())) {
    score += 30;
  }

  // Style preference
  if (parsed.preferredStyles.includes(itemStyle)) {
    score += 25;
  }

  // Required category / keyword match
  if (parsed.requiredCategories.includes(item.category)) {
    score += 40;
  }

  for (const reqKw of parsed.requiredKeywords) {
    if (itemName.includes(reqKw)) {
      score += 45;
    }
  }

  // Comfort bonus
  if (parsed.comfortPreferred) {
    if (item.style === 'Casual' || item.style === 'Smart Casual') score += 15;
    if (itemName.includes('oversize') || itemName.includes('suông') || itemName.includes('rộng') || itemName.includes('cotton') || itemName.includes('linen')) {
      score += 20;
    }
    if (itemName.includes('skinny') || itemName.includes('bó')) {
      score -= 30;
    }
  }

  return { allowed: true, score };
}
