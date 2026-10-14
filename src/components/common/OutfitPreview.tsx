import React from 'react';
import { OutfitItemRef } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';

interface OutfitPreviewProps {
  items: OutfitItemRef[];
  title?: string;
  className?: string;
}

export const OutfitPreview: React.FC<OutfitPreviewProps> = ({
  items,
  title,
  className = '',
}) => {
  // If no items, fallback
  if (!items || items.length === 0) {
    return (
      <div className={`w-full h-full min-h-[220px] bg-stone-100 flex items-center justify-center p-4 text-stone-400 text-xs ${className}`}>
        Chưa có sản phẩm trong outfit
      </div>
    );
  }

  // Deduplicate items just in case
  const displayItems = items.slice(0, 5);
  const count = displayItems.length;

  return (
    <div className={`w-full h-full relative overflow-hidden bg-stone-100 select-none ${className}`}>
      {count === 1 && (
        <div className="w-full h-full relative group">
          <img
            src={displayItems[0].imageUrl}
            alt={displayItems[0].name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(
                displayItems[0].category,
                displayItems[0].color
              );
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-2 left-2 right-2 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] flex items-center justify-between">
            <span className="font-mono font-bold text-[10px] text-amber-300">{displayItems[0].id}</span>
            <span className="truncate max-w-[150px]">{displayItems[0].name}</span>
          </div>
        </div>
      )}

      {count === 2 && (
        <div className="w-full h-full grid grid-cols-2 gap-1 p-1 bg-stone-200">
          {displayItems.map((item, idx) => (
            <div key={idx} className="relative h-full overflow-hidden rounded-lg bg-white group">
              <img
                src={item.imageUrl}
                alt={item.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color);
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                {item.id}
              </span>
              <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-semibold truncate block">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="w-full h-full grid grid-cols-12 gap-1 p-1 bg-stone-200">
          {/* Main Hero piece (Top/Dress) */}
          <div className="col-span-7 h-full relative overflow-hidden rounded-lg bg-white group">
            <img
              src={displayItems[0].imageUrl}
              alt={displayItems[0].name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(
                  displayItems[0].category,
                  displayItems[0].color
                );
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
              {displayItems[0].id}
            </span>
            <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-semibold truncate block">
              {displayItems[0].name}
            </span>
          </div>

          {/* Right 2 items (Bottom & Shoes) */}
          <div className="col-span-5 h-full grid grid-rows-2 gap-1">
            {displayItems.slice(1, 3).map((item, idx) => (
              <div key={idx} className="relative h-full overflow-hidden rounded-lg bg-white group">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color);
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[8px] font-mono font-bold">
                  {item.id}
                </span>
                <span className="absolute bottom-1 left-1 right-1 px-1 py-0.2 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] font-medium truncate block">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {count >= 4 && (
        <div className="w-full h-full grid grid-cols-12 gap-1 p-1 bg-stone-200">
          {/* Main Top / Dress */}
          <div className="col-span-7 h-full relative overflow-hidden rounded-lg bg-white group">
            <img
              src={displayItems[0].imageUrl}
              alt={displayItems[0].name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(
                  displayItems[0].category,
                  displayItems[0].color
                );
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
              {displayItems[0].id}
            </span>
            <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-semibold truncate block">
              {displayItems[0].name}
            </span>
          </div>

          {/* Right column: Bottom on top row, Shoes & Bag/Acc on bottom row */}
          <div className="col-span-5 h-full grid grid-rows-2 gap-1">
            {/* Second piece (e.g. Bottom/Skirt) */}
            <div className="relative h-full overflow-hidden rounded-lg bg-white group">
              <img
                src={displayItems[1].imageUrl}
                alt={displayItems[1].name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(
                    displayItems[1].category,
                    displayItems[1].color
                  );
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-1 left-1 px-1 py-0.2 rounded bg-stone-900/80 backdrop-blur-xs text-white text-[8px] font-mono font-bold">
                {displayItems[1].id}
              </span>
              <span className="absolute bottom-1 left-1 right-1 px-1 py-0.2 rounded bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] font-medium truncate block">
                {displayItems[1].name}
              </span>
            </div>

            {/* Bottom row: split 2 accessories/shoes */}
            <div className={`grid ${count >= 5 ? 'grid-cols-3' : 'grid-cols-2'} gap-1 h-full`}>
              {displayItems.slice(2, 5).map((item, idx) => (
                <div key={idx} className="relative h-full overflow-hidden rounded-lg bg-white group">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color);
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-0.5 left-0.5 px-1 py-0.2 rounded bg-stone-900/80 text-white text-[7px] font-mono font-bold">
                    {item.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
