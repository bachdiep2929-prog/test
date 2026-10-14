import { UserProfile, WardrobeItem, Outfit, Occasion, WeatherInfo, FashionStyle, OutfitItemRef } from '../types';
import { parseFashionPrompt, evaluateItemAgainstPrompt } from '../utils/promptParser';

export interface StylistRequest {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  weather: WeatherInfo;
  occasion: Occasion;
  customPrompt?: string;
  seedPiece?: WardrobeItem;
}

export interface StylistResponse {
  outfit: Outfit;
  stylistNote: string;
}

export async function generateOutfitWithAI(req: StylistRequest): Promise<StylistResponse> {
  // Attempt to call server API first (full-stack with Gemini AI)
  try {
    const res = await fetch('/api/stylist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.outfit && Array.isArray(data.outfit.items) && data.outfit.items.length > 0) {
        return data as StylistResponse;
      }
    }
  } catch {
    // Graceful fallback to client-side rule & combinatorial stylist engine
  }

  // Client-side rule & combinatorial fashion engine
  return generateClientStylistOutfit(req);
}

// Client Fallback Stylist Engine
export function generateClientStylistOutfit(req: StylistRequest): Promise<StylistResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { profile, wardrobe, weather, occasion, customPrompt, seedPiece } = req;
      
      // 1. Parse natural language custom prompt
      const parsedPrompt = parseFashionPrompt(customPrompt);

      // 2. Determine target fashion style considering user note override
      let targetStyle: FashionStyle = seedPiece?.style || profile.favoriteStyles[0] || 'Smart Casual';

      if (parsedPrompt.preferredStyles.length > 0) {
        targetStyle = parsedPrompt.preferredStyles[0];
      } else if (parsedPrompt.formalityOverride === 'casual') {
        // If occasion was 'Đi làm' but user note said "không muốn quá formal, muốn thoải mái"
        targetStyle = 'Smart Casual';
      } else if (parsedPrompt.formalityOverride === 'formal') {
        targetStyle = 'Elegant';
      } else if (occasion === 'Đi chơi') {
        targetStyle = profile.favoriteStyles.includes('Casual') ? 'Casual' : 'Feminine';
      } else if (occasion === 'Tiệc') {
        targetStyle = 'Party';
      } else if (occasion === 'Hẹn hò') {
        targetStyle = 'Feminine';
      }

      // 3. Filter and score all wardrobe items against constraints and preferences
      const scoredItems = wardrobe.map((item) => {
        const evalResult = evaluateItemAgainstPrompt(item, parsedPrompt);
        
        let totalScore = evalResult.score;

        // Weather suitability scoring
        const temp = weather?.temp ?? 28;
        if (temp >= 26) {
          // Warm / hot weather
          if (item.season === 'Xuân - Hè' || item.season === '4 Mùa') totalScore += 15;
          if (item.material?.includes('Linen') || item.material?.includes('Cotton') || item.material?.includes('Satin') || item.material?.includes('Voan')) {
            totalScore += 20;
          }
          if (item.material?.includes('Nỉ') || item.material?.includes('Len dày') || item.material?.includes('Dạ')) {
            totalScore -= 40; // Penalize heavy winter fabrics in hot weather
          }
        } else {
          // Cold weather
          if (item.season === 'Thu - Đông') totalScore += 20;
          if (item.material?.includes('Len') || item.material?.includes('Dạ') || item.material?.includes('Nỉ')) {
            totalScore += 25;
          }
        }

        // Style matching
        if (item.style === targetStyle) {
          totalScore += 25;
        }

        // Favor favorite items slightly
        if (item.isFavorite) {
          totalScore += 10;
        }

        // Wear diversity: slightly favor items worn less often to prevent repetitive outfits
        totalScore -= Math.min(item.wearCount * 2, 20);

        return {
          item,
          allowed: evalResult.allowed,
          score: totalScore,
        };
      });

      // Split into categories, keeping only allowed items and sorting by score descending
      const getCategoryScoredItems = (cat: string) =>
        scoredItems
          .filter(si => si.allowed && si.item.category === cat)
          .sort((a, b) => b.score - a.score);

      const availableTopsScored = getCategoryScoredItems('Áo');
      const availableBottomsScored = getCategoryScoredItems('Quần');
      const availableSkirtsScored = getCategoryScoredItems('Váy');
      const availableDressesScored = getCategoryScoredItems('Đầm');
      const availableOutersScored = getCategoryScoredItems('Áo khoác');
      const availableShoesScored = getCategoryScoredItems('Giày');
      const availableBagsScored = getCategoryScoredItems('Túi');
      const availableAccsScored = [
        ...getCategoryScoredItems('Phụ kiện'),
        ...getCategoryScoredItems('Mũ'),
      ].sort((a, b) => b.score - a.score);

      const availableTops = availableTopsScored.map(s => s.item);
      const availableBottoms = availableBottomsScored.map(s => s.item);
      const availableSkirts = availableSkirtsScored.map(s => s.item);
      const availableDresses = availableDressesScored.map(s => s.item);
      const availableOuters = availableOutersScored.map(s => s.item);
      const availableShoes = availableShoesScored.map(s => s.item);
      const availableBags = availableBagsScored.map(s => s.item);
      const availableAccs = availableAccsScored.map(s => s.item);

      const selectedItems: OutfitItemRef[] = [];

      // 4. MAIN BODY SELECTION (SeedPiece, Dress, or Top + Bottom/Skirt)
      if (seedPiece) {
        selectedItems.push({
          id: seedPiece.id,
          name: seedPiece.name,
          category: seedPiece.category,
          imageUrl: seedPiece.imageUrl,
          isFromWardrobe: true,
          color: seedPiece.color,
        });

        if (seedPiece.category === 'Áo') {
          // Pick bottom or skirt
          const pickFrom = (parsedPrompt.requiredCategories.includes('Váy') && availableSkirts.length > 0)
            ? availableSkirts
            : (availableBottoms.length > 0 ? availableBottoms : availableSkirts);
          if (pickFrom[0]) {
            selectedItems.push({
              id: pickFrom[0].id,
              name: pickFrom[0].name,
              category: pickFrom[0].category,
              imageUrl: pickFrom[0].imageUrl,
              isFromWardrobe: true,
              color: pickFrom[0].color,
            });
          }
        } else if (seedPiece.category === 'Quần' || seedPiece.category === 'Váy') {
          if (availableTops[0]) {
            selectedItems.push({
              id: availableTops[0].id,
              name: availableTops[0].name,
              category: availableTops[0].category,
              imageUrl: availableTops[0].imageUrl,
              isFromWardrobe: true,
              color: availableTops[0].color,
            });
          }
        }
      } else {
        // Determine whether to wear a Dress vs (Top + Skirt/Pants)
        const userWantsSkirt = parsedPrompt.requiredCategories.includes('Váy');
        const userWantsDress = parsedPrompt.requiredCategories.includes('Đầm');
        const dressAllowed = !parsedPrompt.bannedCategories.includes('Đầm') && availableDresses.length > 0;
        const skirtAllowed = !parsedPrompt.bannedCategories.includes('Váy') && availableSkirts.length > 0;

        let useDress = false;
        if (userWantsDress && dressAllowed) {
          useDress = true;
        } else if (userWantsSkirt && !userWantsDress && skirtAllowed) {
          useDress = false; // explicitly requested skirt, not dress
        } else if (
          dressAllowed && 
          !userWantsSkirt &&
          (occasion === 'Tiệc' || occasion === 'Hẹn hò' || targetStyle === 'Party' || targetStyle === 'Feminine') &&
          availableDressesScored[0]?.score > (availableTopsScored[0]?.score || 0)
        ) {
          useDress = true;
        }

        if (useDress && availableDresses[0]) {
          selectedItems.push({
            id: availableDresses[0].id,
            name: availableDresses[0].name,
            category: availableDresses[0].category,
            imageUrl: availableDresses[0].imageUrl,
            isFromWardrobe: true,
            color: availableDresses[0].color,
          });
        } else {
          // Top + Bottom / Skirt
          const top = availableTops[0] || wardrobe.find(w => w.category === 'Áo');
          if (top) {
            selectedItems.push({
              id: top.id,
              name: top.name,
              category: top.category,
              imageUrl: top.imageUrl,
              isFromWardrobe: true,
              color: top.color,
            });
          }

          // Choose between skirt or pants
          let bottomItem: WardrobeItem | undefined;
          if (userWantsSkirt && availableSkirts.length > 0) {
            bottomItem = availableSkirts[0];
          } else if (parsedPrompt.bannedCategories.includes('Váy')) {
            bottomItem = availableBottoms[0];
          } else if (availableSkirts.length > 0 && availableBottoms.length > 0) {
            // Pick the higher-scoring piece
            bottomItem = availableSkirtsScored[0].score > availableBottomsScored[0].score ? availableSkirts[0] : availableBottoms[0];
          } else {
            bottomItem = availableBottoms[0] || availableSkirts[0];
          }

          if (bottomItem) {
            selectedItems.push({
              id: bottomItem.id,
              name: bottomItem.name,
              category: bottomItem.category,
              imageUrl: bottomItem.imageUrl,
              isFromWardrobe: true,
              color: bottomItem.color,
            });
          }
        }
      }

      // 5. SHOES SELECTION
      if (!selectedItems.some(i => i.category === 'Giày') && availableShoes.length > 0) {
        selectedItems.push({
          id: availableShoes[0].id,
          name: availableShoes[0].name,
          category: availableShoes[0].category,
          imageUrl: availableShoes[0].imageUrl,
          isFromWardrobe: true,
          color: availableShoes[0].color,
        });
      }

      // 6. OUTERWEAR SELECTION (Strict weather & customPrompt rules, NO random!)
      const temp = weather?.temp ?? 28;
      let shouldAddOuterwear = false;

      if (parsedPrompt.outerwearPreference === 'ban') {
        shouldAddOuterwear = false;
      } else if (parsedPrompt.outerwearPreference === 'require_light' || parsedPrompt.outerwearPreference === 'require_any') {
        shouldAddOuterwear = true;
      } else {
        // 'auto' mode: ONLY add outerwear if weather is actually chilly (<= 22°C) or raining!
        // At 29°C in sunny conditions, DO NOT add outerwear!
        if (temp <= 22 || weather?.condition?.toLowerCase().includes('mưa') || weather?.condition?.toLowerCase().includes('lạnh')) {
          shouldAddOuterwear = true;
        }
      }

      if (shouldAddOuterwear && availableOuters.length > 0 && !selectedItems.some(i => i.category === 'Áo khoác')) {
        let bestOuter = availableOuters[0];
        // If lightweight requested, find lightweight windbreaker or cardigan
        if (parsedPrompt.outerwearPreference === 'require_light') {
          const lightOuter = availableOuters.find(o => o.name.includes('gió') || o.name.includes('siêu nhẹ') || o.name.includes('mỏng') || o.category === 'Áo khoác');
          if (lightOuter) bestOuter = lightOuter;
        }
        selectedItems.push({
          id: bestOuter.id,
          name: bestOuter.name,
          category: bestOuter.category,
          imageUrl: bestOuter.imageUrl,
          isFromWardrobe: true,
          color: bestOuter.color,
        });
      }

      // 7. BAG SELECTION
      if (!selectedItems.some(i => i.category === 'Túi') && availableBags.length > 0) {
        selectedItems.push({
          id: availableBags[0].id,
          name: availableBags[0].name,
          category: availableBags[0].category,
          imageUrl: availableBags[0].imageUrl,
          isFromWardrobe: true,
          color: availableBags[0].color,
        });
      }

      // 8. ACCESSORY SELECTION (1 matching accessory)
      if (availableAccs.length > 0 && !selectedItems.some(i => i.category === 'Phụ kiện' || i.category === 'Mũ')) {
        const acc = availableAccs[0];
        selectedItems.push({
          id: acc.id,
          name: acc.name,
          category: acc.category,
          imageUrl: acc.imageUrl,
          isFromWardrobe: true,
          color: acc.color,
        });
      }

      // 9. DYNAMIC EXPRESSIVE TITLE & REASON
      const primaryItem = selectedItems.find(it => it.category === 'Đầm' || it.category === 'Áo') || selectedItems[0];
      const outfitImageUrl = primaryItem.imageUrl; // Hero piece image

      // Generate meaningful title
      let title = `${targetStyle} Thanh Lịch Cho ${occasion}`;
      if (parsedPrompt.comfortPreferred) {
        title = `Bản Phối ${targetStyle} Thoải Mái & Tự Tin`;
      } else if (parsedPrompt.preferredColors.includes('Be') || parsedPrompt.preferredColors.includes('Kem')) {
        title = `Sắc Be Nhã Nhặn Chuẩn Phong Cách ${targetStyle}`;
      } else if (parsedPrompt.preferredColors.includes('Đen')) {
        title = `Set Đồ Tone Đen Quyến Rũ & Cá Tính`;
      } else if (targetStyle === 'Feminine') {
        title = `Hơi Thở Nữ Tính Dịu Dàng Cho ${occasion}`;
      }

      // Generate reasoning that directly explains adherence to user prompt
      const notesParts: string[] = [];
      if (customPrompt) {
        if (parsedPrompt.bannedKeywords.length > 0) {
          notesParts.push(`Đã loại bỏ ${parsedPrompt.bannedKeywords.slice(0, 2).join(', ')} theo ghi chú của bạn.`);
        }
        if (parsedPrompt.preferredColors.length > 0) {
          notesParts.push(`Ưu tiên gam màu ${parsedPrompt.preferredColors.join(', ')}.`);
        }
        if (parsedPrompt.comfortPreferred) {
          notesParts.push('Tối ưu phom dáng suông rộng, chất liệu thoáng mát giúp vận động dễ chịu.');
        }
        if (parsedPrompt.outerwearPreference === 'require_light') {
          notesParts.push('Đã bổ sung áo khoác mỏng nhẹ che nắng theo yêu cầu.');
        }
      }

      const weatherText = `${weather.temp}°C tại ${weather.city}`;
      const defaultReason = `Phù hợp với thời tiết ${weatherText} và dịp ${occasion}. Tận dụng tối đa ${selectedItems.length} món đồ có sẵn trong tủ đồ để tạo diện mạo chỉn chu nhất.`;
      const finalReason = notesParts.length > 0 ? `${notesParts.join(' ')} ${defaultReason}` : defaultReason;

      const newOutfit: Outfit = {
        id: 'outfit_client_' + Date.now(),
        title,
        style: targetStyle,
        occasion,
        weatherSuitability: `Thích hợp: ${weather.temp - 2}°C - ${weather.temp + 2}°C, ${weather.condition}`,
        description: `Bản phối gồm ${selectedItems.map(it => it.name).join(', ')}.`,
        reason: finalReason,
        imageUrl: outfitImageUrl,
        items: selectedItems,
        isFavorite: false,
        isSaved: false,
        createdAt: new Date().toISOString(),
      };

      resolve({
        outfit: newOutfit,
        stylistNote: finalReason,
      });
    }, 400);
  });
}
