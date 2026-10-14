export type Gender = 'female' | 'male' | 'other' | 'undisclosed';

export type FashionStyle = 
  | 'Casual'
  | 'Minimal'
  | 'Streetwear'
  | 'Formal'
  | 'Smart Casual'
  | 'Feminine'
  | 'Elegant'
  | 'Sporty'
  | 'Vintage'
  | 'Y2K'
  | 'Office'
  | 'Date'
  | 'Party'
  | 'Classic'
  | 'Resort';

export type WardrobeCategory = 
  | 'Quần'
  | 'Áo'
  | 'Váy'
  | 'Đầm'
  | 'Áo khoác'
  | 'Giày'
  | 'Mũ'
  | 'Túi'
  | 'Phụ kiện';

export type Occasion = 
  | 'Đi học'
  | 'Đi làm'
  | 'Đi chơi'
  | 'Hẹn hò'
  | 'Tiệc'
  | 'Du lịch'
  | 'Tập thể thao'
  | 'Bình thường'
  | 'Trang trọng'
  | 'Họp'
  | 'Cà phê'
  | 'Dã ngoại'
  | 'Đi biển'
  | 'Đi núi'
  | 'Sự kiện'
  | 'Dạo phố'
  | 'Nghỉ dưỡng'
  | 'Dạ tiệc'
  | 'Chạy bộ'
  | 'Ở nhà'
  | 'Concert';

export type FormalityLevel = 
  | 'Casual'
  | 'Smart Casual'
  | 'Business Casual'
  | 'Formal'
  | 'Very Formal';

export type TemperatureTier = 
  | 'Rất nóng'  // > 32°C
  | 'Nóng'      // 28°C - 32°C
  | 'Ấm áp'     // 23°C - 27°C
  | 'Mát mẻ'    // 18°C - 22°C
  | 'Lạnh'      // 10°C - 17°C
  | 'Rất lạnh'; // < 10°C

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  country: string;
  city: string;
  favoriteStyles: FashionStyle[];
  isOnboarded: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  colorHex?: string;
  material?: string;
  style: FashionStyle;
  season: 'Xuân - Hè' | 'Thu - Đông' | '4 Mùa';
  weather?: string;
  temperatureRange?: string;
  occasions?: Occasion[];
  formality?: FormalityLevel;
  imageDescription?: string;
  wearCount: number;
  isFavorite: boolean;
  imageUrl: string;
  notes?: string;
  dateAdded: string;
}

export interface OutfitItemRef {
  id: string;
  name: string;
  category: WardrobeCategory;
  imageUrl: string;
  isFromWardrobe: boolean;
  color?: string;
  material?: string;
}

export interface Outfit {
  id: string;
  title: string;
  style: FashionStyle;
  occasion: Occasion;
  weatherSuitability: string;
  temperatureRange?: string;
  formality?: FormalityLevel;
  weatherType?: string;
  hasOuterwear?: boolean;
  accessories?: string[];
  description: string;
  reason: string;
  imageDescription?: string;
  imageUrl: string;
  items: OutfitItemRef[];
  isFavorite: boolean;
  isSaved: boolean;
  createdAt: string;
  lastWornDate?: string;
}

export interface CalendarDayPlan {
  id: string;
  dayOfWeek: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6' | 'Thứ 7' | 'Chủ nhật';
  dateFormatted: string;
  occasion: Occasion;
  weather: {
    temp: number;
    condition: string;
    icon: string;
  };
  assignedOutfitId?: string;
  isWorn: boolean;
}

export interface WeatherInfo {
  city: string;
  country: string;
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  advice: string;
}

export interface ThemeTokens {
  name: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryBg: string;
  primaryBorder: string;
  badgeBg: string;
  badgeText: string;
  softGradient: string;
  ringColor: string;
}

export interface WearHistoryItem {
  id: string;
  outfitId: string;
  outfitTitle: string;
  date: string;
  occasion: Occasion;
  notes?: string;
}
