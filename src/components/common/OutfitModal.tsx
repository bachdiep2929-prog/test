import React from 'react';
import { X, Bookmark, Heart, CheckCircle2, ThermometerSun } from 'lucide-react';
import { Outfit, ThemeTokens } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';
import { OutfitPreview } from './OutfitPreview';

interface OutfitModalProps {
  outfit: Outfit | null;
  theme: ThemeTokens;
  onClose: () => void;
  onToggleSave: (outfit: Outfit) => void;
  onToggleFavorite: (outfit: Outfit) => void;
  onWearToday: (outfit: Outfit) => void;
}

export const OutfitModal: React.FC<OutfitModalProps> = ({
  outfit,
  theme,
  onClose,
  onToggleSave,
  onToggleFavorite,
  onWearToday,
}) => {
  if (!outfit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Image & Header */}
        <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
          <OutfitPreview
            items={outfit.items}
            title={outfit.title}
            className="w-full h-full"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span 
              className="px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs"
              style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
            >
              {outfit.style}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/90 text-stone-800 text-[10px] font-semibold">
              {outfit.occasion}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-bold text-stone-900 leading-tight">
              {outfit.title}
            </h2>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onToggleSave(outfit)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <Bookmark 
                  className="w-4 h-4" 
                  style={{ fill: outfit.isSaved ? theme.primary : 'none', color: outfit.isSaved ? theme.primary : undefined }} 
                />
              </button>
              <button
                onClick={() => onToggleFavorite(outfit)}
                className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <Heart 
                  className="w-4 h-4" 
                  style={{ fill: outfit.isFavorite ? '#e11d48' : 'none', color: outfit.isFavorite ? '#e11d48' : undefined }} 
                />
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            {outfit.description}
          </p>

          <div 
            className="p-3 rounded-xl border text-xs text-stone-700"
            style={{ backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }}
          >
            <strong className="block mb-0.5 text-stone-900">Stylist Note:</strong>
            {outfit.reason}
          </div>

          <div>
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Các món trong outfit ({outfit.items.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {outfit.items.map((it, idx) => (
                <div key={idx} className="p-2 rounded-lg border border-stone-200 bg-stone-50 flex items-center gap-2">
                  <img
                    src={it.imageUrl}
                    alt={it.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(it.category, it.color || 'Trắng');
                    }}
                    className="w-8 h-8 rounded object-cover bg-white shrink-0 border border-stone-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[9px] font-bold px-1 py-0.2 bg-stone-200 text-stone-700 rounded">
                        {it.id}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-stone-800 truncate">{it.name}</p>
                    <span className="text-[9px] text-stone-400">{it.isFromWardrobe ? 'Trong tủ đồ' : 'Gợi ý thêm'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-400 flex items-center gap-1">
              <ThermometerSun className="w-3.5 h-3.5" />
              {outfit.weatherSuitability}
            </span>
            <button
              onClick={() => {
                onWearToday(outfit);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mặc hôm nay</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
