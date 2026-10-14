// Fallback visual representations for wardrobe items
import { WardrobeCategory } from '../types';

export function getCategoryPlaceholder(category: WardrobeCategory, colorName: string = 'Trắng'): string {
  // Generates an inline SVG data URI with a clean minimalist silhouette on a pastel canvas
  const bgColors: Record<string, string> = {
    'Áo': '#FDF2F8',
    'Quần': '#F0F9FF',
    'Váy': '#FAF5FF',
    'Đầm': '#FFF1F2',
    'Áo khoác': '#F5F5F4',
    'Giày': '#FEF3C7',
    'Túi': '#F3E8FF',
    'Mũ': '#ECFDF5',
    'Phụ kiện': '#FFFBEB',
  };

  const bg = bgColors[category] || '#F5F5F4';
  const label = encodeURIComponent(category);
  const sub = encodeURIComponent(colorName);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="100%" height="100%" fill="${bg}"/>
    <g fill="none" stroke="#78716C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.6">
      <circle cx="200" cy="180" r="48" stroke-dasharray="4 4"/>
      <path d="M176 180h48M200 156v48"/>
    </g>
    <text x="200" y="270" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#44403C" text-anchor="middle">${label}</text>
    <text x="200" y="295" font-family="system-ui, sans-serif" font-size="13" font-weight="400" fill="#78716C" text-anchor="middle">${sub}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${svg}`;
}
