import { FormalityLevel, Occasion, TemperatureTier, WardrobeItem, WeatherInfo } from '../types';

export function getTemperatureTier(temp: number): TemperatureTier {
  if (temp > 32) return 'Rất nóng';
  if (temp >= 28) return 'Nóng';
  if (temp >= 23) return 'Ấm áp';
  if (temp >= 18) return 'Mát mẻ';
  if (temp >= 10) return 'Lạnh';
  return 'Rất lạnh';
}

export function getDefaultFormalityForOccasion(occasion: Occasion): FormalityLevel {
  switch (occasion) {
    case 'Đi làm':
      return 'Smart Casual';
    case 'Họp':
    case 'Trang trọng':
      return 'Formal';
    case 'Sự kiện':
      return 'Business Casual';
    case 'Tiệc':
      return 'Formal';
    case 'Hẹn hò':
      return 'Smart Casual';
    case 'Đi học':
    case 'Bình thường':
    case 'Đi chơi':
    case 'Cà phê':
    case 'Dã ngoại':
    case 'Đi biển':
    case 'Đi núi':
      return 'Casual';
    case 'Tập thể thao':
      return 'Casual';
    case 'Du lịch':
      return 'Casual';
    default:
      return 'Casual';
  }
}

export interface WeatherConstraints {
  tier: TemperatureTier;
  isHot: boolean;        // temp >= 28
  isVeryHot: boolean;    // temp > 32
  isPleasant: boolean;   // 23 <= temp < 28
  isCool: boolean;       // 18 <= temp < 23
  isCold: boolean;       // 10 <= temp < 18
  isVeryCold: boolean;   // temp < 10
  isRainy: boolean;
  isSunny: boolean;
  isWindy: boolean;
  bannedFabrics: string[];
  bannedKeywords: string[];
  preferredFabrics: string[];
  outerwearRequired: boolean;
  outerwearBanned: boolean;
}

export function analyzeWeather(weather: WeatherInfo, customPromptOuterwear?: string): WeatherConstraints {
  const temp = weather.temp;
  const condition = (weather.condition || '').toLowerCase();
  const tier = getTemperatureTier(temp);

  const isVeryHot = temp > 32;
  const isHot = temp >= 28;
  const isPleasant = temp >= 23 && temp < 28;
  const isCool = temp >= 18 && temp < 23;
  const isCold = temp >= 10 && temp < 18;
  const isVeryCold = temp < 10;

  const isRainy = condition.includes('mưa') || condition.includes('dông');
  const isSunny = condition.includes('nắng') || condition.includes('trong') || condition.includes('quang');
  const isWindy = condition.includes('gió') || condition.includes('bão');

  const bannedFabrics: string[] = [];
  const bannedKeywords: string[] = [];
  const preferredFabrics: string[] = [];

  let outerwearRequired = false;
  let outerwearBanned = false;

  // Temperature rules
  if (isVeryHot || isHot) {
    bannedFabrics.push('nỉ bông', 'len dày', 'dạ tweed', 'dạ len', 'lông thú', 'phao dày', 'da dày');
    bannedKeywords.push('puffer', 'áo phao', 'len cổ lọ', 'áo len dày', 'hoodie nỉ bông dày', 'boots cao cổ', 'găng tay');
    preferredFabrics.push('linen', 'cotton', 'lụa', 'satin', 'voan', 'kaki mỏng');

    // In hot weather, outerwear is banned unless user explicitly asks for sun-protection or light windbreaker
    if (customPromptOuterwear === 'require_light') {
      outerwearRequired = true;
    } else if (customPromptOuterwear === 'require_any') {
      outerwearRequired = true;
    } else {
      outerwearBanned = true;
    }
  } else if (isPleasant) {
    // 23 - 27C: very comfortable, light layer possible but not forced
    bannedFabrics.push('lông thú', 'phao siêu dày');
    preferredFabrics.push('cotton', 'linen', 'denim', 'dệt kim');
  } else if (isCool) {
    // 18 - 22C: light outerwear, sweater, long pants preferred
    outerwearRequired = true;
    bannedKeywords.push('áo hai dây', 'tank top');
    preferredFabrics.push('len mỏng', 'dạ mỏng', 'kaki', 'denim dày', 'tweed');
  } else if (isCold) {
    // 10 - 17C: warm layers, trench coat, sweater, boots, scarf
    outerwearRequired = true;
    bannedKeywords.push('short', 'sandal quai mảnh', 'áo hai dây', 'tank top', 'croptop');
    preferredFabrics.push('len', 'dạ', 'da', 'tweed', 'nỉ bông');
  } else if (isVeryCold) {
    // < 10C: heavy winter wear strictly required
    outerwearRequired = true;
    bannedKeywords.push('short', 'sandal', 'quần đùi', 'áo hai dây', 'tank top', 'croptop', 'váy ngắn mỏng', 'mule');
    preferredFabrics.push('phao', 'puffer', 'len dày', 'dạ dày', 'lông');
  }

  // Rain rules
  if (isRainy) {
    bannedKeywords.push('giày vải canvas', 'suede', 'da lộn');
  }

  return {
    tier,
    isHot,
    isVeryHot,
    isPleasant,
    isCool,
    isCold,
    isVeryCold,
    isRainy,
    isSunny,
    isWindy,
    bannedFabrics,
    bannedKeywords,
    preferredFabrics,
    outerwearRequired,
    outerwearBanned,
  };
}

export function isItemWeatherCompatible(item: WardrobeItem, weatherConstraints: WeatherConstraints): boolean {
  const name = item.name.toLowerCase();
  const material = (item.material || '').toLowerCase();
  const category = item.category;

  // Check banned keywords
  for (const kw of weatherConstraints.bannedKeywords) {
    if (name.includes(kw) || material.includes(kw)) {
      return false;
    }
  }

  // Check banned fabrics
  for (const fab of weatherConstraints.bannedFabrics) {
    if (material.includes(fab)) {
      return false;
    }
  }

  // Check outerwear policy
  if (category === 'Áo khoác') {
    if (weatherConstraints.outerwearBanned) {
      // If hot, only permit lightweight UV / windbreaker if requested
      if (!name.includes('siêu nhẹ') && !name.includes('gió') && !name.includes('chống nắng') && !name.includes('mỏng')) {
        return false;
      }
    }
    if (weatherConstraints.isVeryCold) {
      // Must be warm coat
      if (name.includes('siêu nhẹ') || name.includes('mỏng')) {
        return false;
      }
    }
  }

  return true;
}
