import { Gender, ThemeTokens } from '../types';

export function getThemeTokens(gender: Gender = 'female', age: number = 24): ThemeTokens {
  // Age groups: young (<25), adult (25-45), mature (>45)
  const isYoung = age < 25;
  const isMature = age > 45;

  if (gender === 'female') {
    if (isYoung) {
      // Brighter, playful fresh pastel pink & peach
      return {
        name: 'Pastel Rosé Fresh (Nữ Trẻ)',
        primary: '#db2777', // pink-600
        primaryHover: '#be185d',
        primaryLight: '#fdf2f8', // pink-50
        primaryBg: '#fff1f2',
        primaryBorder: '#fbcfe8', // pink-200
        badgeBg: '#fce7f3',
        badgeText: '#9d174d',
        softGradient: 'from-pink-50/80 via-rose-50/40 to-white',
        ringColor: '#f472b6',
      };
    } else if (isMature) {
      // Gentle, higher readability contrast, calm rose taupe
      return {
        name: 'Muted Rosewood (Nữ Trưởng Thành)',
        primary: '#9f1239', // rose-800 for high readability
        primaryHover: '#881337',
        primaryLight: '#fff1f2',
        primaryBg: '#faf5f5',
        primaryBorder: '#fecdd3',
        badgeBg: '#ffe4e6',
        badgeText: '#881337',
        softGradient: 'from-stone-50 via-rose-50/20 to-white',
        ringColor: '#fb7185',
      };
    } else {
      // Adult (25-45): Elegant, soft pastel blush & peach
      return {
        name: 'Elegance Blush (Nữ Tiêu Chuẩn)',
        primary: '#be185d', // pink-700
        primaryHover: '#9d174d',
        primaryLight: '#fdf2f8',
        primaryBg: '#fff5f7',
        primaryBorder: '#f9a8d4',
        badgeBg: '#fce7f3',
        badgeText: '#831843',
        softGradient: 'from-pink-50/60 via-purple-50/20 to-white',
        ringColor: '#ec4899',
      };
    }
  }

  if (gender === 'male') {
    if (isYoung) {
      // Fresh, dynamic pastel cyan & mint
      return {
        name: 'Mint Cyan Fresh (Nam Trẻ)',
        primary: '#0284c7', // sky-600
        primaryHover: '#0369a1',
        primaryLight: '#f0f9ff',
        primaryBg: '#f0fdf4', // soft mint touch
        primaryBorder: '#bae6fd',
        badgeBg: '#e0f2fe',
        badgeText: '#075985',
        softGradient: 'from-sky-50/80 via-emerald-50/40 to-white',
        ringColor: '#38bdf8',
      };
    } else if (isMature) {
      // Calm, high readability navy/sage
      return {
        name: 'Slate Sage (Nam Trưởng Thành)',
        primary: '#0f766e', // teal-700 for high contrast
        primaryHover: '#115e59',
        primaryLight: '#f0fdfa',
        primaryBg: '#f8fafc',
        primaryBorder: '#ccfbf1',
        badgeBg: '#ccfbf1',
        badgeText: '#134e4a',
        softGradient: 'from-slate-50 via-teal-50/20 to-white',
        ringColor: '#14b8a6',
      };
    } else {
      // Adult (25-45): Refined mint blue & slate
      return {
        name: 'Nordic Mint (Nam Tiêu Chuẩn)',
        primary: '#0d9488', // teal-600
        primaryHover: '#0f766e',
        primaryLight: '#f0fdfa',
        primaryBg: '#f4fbf7',
        primaryBorder: '#99f6e4',
        badgeBg: '#ccfbf1',
        badgeText: '#115e59',
        softGradient: 'from-teal-50/60 via-sky-50/30 to-white',
        ringColor: '#2dd4bf',
      };
    }
  }

  // Other or Undisclosed: Harmonious blend of Mint, Lavender & Soft Pastel
  if (isYoung) {
    return {
      name: 'Pastel Harmony (Tươi Sáng Đa Sắc)',
      primary: '#7c3aed', // violet-600
      primaryHover: '#6d28d9',
      primaryLight: '#f5f3ff',
      primaryBg: '#f0fdf4',
      primaryBorder: '#ddd6fe',
      badgeBg: '#ede9fe',
      badgeText: '#5b21b6',
      softGradient: 'from-violet-50/60 via-emerald-50/40 to-white',
      ringColor: '#a78bfa',
    };
  } else if (isMature) {
    return {
      name: 'Neutral Lavender (Trang Nhã Tối Giản)',
      primary: '#6b21a8',
      primaryHover: '#581c87',
      primaryLight: '#faf5ff',
      primaryBg: '#fafafa',
      primaryBorder: '#e9d5ff',
      badgeBg: '#f3e8ff',
      badgeText: '#581c87',
      softGradient: 'from-stone-50 via-purple-50/20 to-white',
      ringColor: '#c084fc',
    };
  } else {
    return {
      name: 'Lilac Mint Balance (Cân Bằng Tinh Tế)',
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      primaryLight: '#f5f3ff',
      primaryBg: '#f8fafc',
      primaryBorder: '#c4b5fd',
      badgeBg: '#ede9fe',
      badgeText: '#4c1d95',
      softGradient: 'from-purple-50/50 via-teal-50/30 to-white',
      ringColor: '#a78bfa',
    };
  }
}
