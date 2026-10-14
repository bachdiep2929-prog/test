import { UserProfile, WardrobeItem, Outfit, CalendarDayPlan, WearHistoryItem } from '../types';
import { INITIAL_USER_PROFILE, SAMPLE_WARDROBE_ITEMS, INITIAL_OUTFITS, INITIAL_CALENDAR_DAYS } from '../data/mockData';

const STORAGE_KEYS = {
  USER_PROFILE: 'gustyle_user_profile',
  WARDROBE: 'gustyle_wardrobe_items',
  OUTFITS: 'gustyle_outfits',
  CALENDAR: 'gustyle_calendar_plan',
  WEAR_HISTORY: 'gustyle_wear_history',
};

// Safe JSON helper
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// User Profile
export function loadUserProfile(): UserProfile {
  return safeGet<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
}

export function saveUserProfile(profile: UserProfile): void {
  safeSet(STORAGE_KEYS.USER_PROFILE, profile);
}

// Wardrobe Items
export function loadWardrobeItems(): WardrobeItem[] {
  const items = safeGet<WardrobeItem[]>(STORAGE_KEYS.WARDROBE, SAMPLE_WARDROBE_ITEMS);
  const sampleMap = new Map(SAMPLE_WARDROBE_ITEMS.map((i) => [i.id, i]));
  
  // Clean legacy items from old pre-catalog sessions (e.g. top_01, bot_01...)
  const isLegacyItem = (id: string) => /^(top|bot|skirt|dress|outer|shoe|bag|hat|acc)_\d+/i.test(id);
  const validItems = items.filter(i => !isLegacyItem(i.id));

  // Update canonical items with accurate photography, categories, names, material and imageDescription
  const updatedItems = validItems.map((item) => {
    const sample = sampleMap.get(item.id);
    if (sample) {
      return {
        ...item,
        imageUrl: sample.imageUrl,
        name: sample.name,
        category: sample.category,
        color: sample.color,
        colorHex: sample.colorHex,
        material: sample.material,
        imageDescription: sample.imageDescription,
        style: sample.style,
        season: sample.season,
        notes: item.notes || sample.notes,
      };
    }
    return item;
  });

  // Auto-merge new sample items
  const existingIds = new Set(updatedItems.map((i) => i.id));
  const missingItems = SAMPLE_WARDROBE_ITEMS.filter((i) => !existingIds.has(i.id));
  const merged = [...updatedItems, ...missingItems];
  safeSet(STORAGE_KEYS.WARDROBE, merged);
  return merged;
}

export function saveWardrobeItems(items: WardrobeItem[]): void {
  safeSet(STORAGE_KEYS.WARDROBE, items);
}

// Outfits
export function loadOutfits(): Outfit[] {
  const outfits = safeGet<Outfit[]>(STORAGE_KEYS.OUTFITS, INITIAL_OUTFITS);
  const initialMap = new Map(INITIAL_OUTFITS.map((o) => [o.id, o]));
  
  // Check if legacy outfit items exist (e.g. top_01)
  const isLegacyOutfit = (outfit: Outfit) => 
    outfit.items.some(i => /^(top|bot|skirt|dress|outer|shoe|bag|hat|acc)_\d+/i.test(i.id));

  const validOutfits = outfits.filter(o => !isLegacyOutfit(o));

  const updatedOutfits = validOutfits.map((outfit) => {
    const canonical = initialMap.get(outfit.id);
    if (canonical) {
      return {
        ...outfit,
        items: canonical.items,
        imageUrl: canonical.imageUrl,
      };
    }
    return outfit;
  });

  // Auto-merge missing initial outfits
  const existingIds = new Set(updatedOutfits.map(o => o.id));
  const missingOutfits = INITIAL_OUTFITS.filter(o => !existingIds.has(o.id));
  const merged = [...updatedOutfits, ...missingOutfits];

  safeSet(STORAGE_KEYS.OUTFITS, merged);
  return merged;
}

export function saveOutfits(outfits: Outfit[]): void {
  safeSet(STORAGE_KEYS.OUTFITS, outfits);
}

// Calendar Plans
export function loadCalendarDays(): CalendarDayPlan[] {
  return safeGet<CalendarDayPlan[]>(STORAGE_KEYS.CALENDAR, INITIAL_CALENDAR_DAYS);
}

export function saveCalendarDays(plans: CalendarDayPlan[]): void {
  safeSet(STORAGE_KEYS.CALENDAR, plans);
}

// Wear History
export function loadWearHistory(): WearHistoryItem[] {
  return safeGet<WearHistoryItem[]>(STORAGE_KEYS.WEAR_HISTORY, [
    {
      id: 'hist_1',
      outfitId: 'outfit_hero_01',
      outfitTitle: 'Minimal Chic Tinh Tế Cho Ngày Làm Việc',
      date: '2026-09-29',
      occasion: 'Đi làm',
      notes: 'Rất thoải mái và được đồng nghiệp khen tinh tế.',
    },
    {
      id: 'hist_2',
      outfitId: 'outfit_03',
      outfitTitle: 'Parisian Casual Với Blazer Và Jeans',
      date: '2026-09-25',
      occasion: 'Đi chơi',
      notes: 'Đi dạo phố cuối tuần tại Landmark 81.',
    }
  ]);
}

export function recordWearHistory(item: WearHistoryItem): WearHistoryItem[] {
  const history = loadWearHistory();
  const updated = [item, ...history];
  safeSet(STORAGE_KEYS.WEAR_HISTORY, updated);
  return updated;
}

// Reset data to defaults
export function resetAppToDefaults(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.WARDROBE);
  localStorage.removeItem(STORAGE_KEYS.OUTFITS);
  localStorage.removeItem(STORAGE_KEYS.CALENDAR);
  localStorage.removeItem(STORAGE_KEYS.WEAR_HISTORY);
}
