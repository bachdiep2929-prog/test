import React, { useState } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  Heart, 
  RefreshCw, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  Layers, 
  PlusCircle,
  HelpCircle,
  ThermometerSun
} from 'lucide-react';
import { UserProfile, WardrobeItem, Outfit, Occasion, WeatherInfo, ThemeTokens } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';
import { OutfitPreview } from '../common/OutfitPreview';

interface HomeViewProps {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  currentOutfit: Outfit | null;
  weather: WeatherInfo;
  theme: ThemeTokens;
  isLoading: boolean;
  onAskWhatToWear: (occasion: Occasion, customPrompt?: string) => void;
  onToggleSaveOutfit: (outfit: Outfit) => void;
  onToggleFavoriteOutfit: (outfit: Outfit) => void;
  onWearToday: (outfit: Outfit) => void;
  onOpenWardrobe: () => void;
}

const OCCASIONS: Occasion[] = [
  'Đi làm',
  'Đi chơi',
  'Hẹn hò',
  'Đi học',
  'Tiệc',
  'Du lịch',
  'Tập thể thao',
  'Họp',
  'Bình thường',
];

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  wardrobe,
  currentOutfit,
  weather,
  theme,
  isLoading,
  onAskWhatToWear,
  onToggleSaveOutfit,
  onToggleFavoriteOutfit,
  onWearToday,
  onOpenWardrobe,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('Đi làm');
  const [customNote, setCustomNote] = useState<string>('');
  const [hasWornToday, setHasWornToday] = useState<boolean>(false);

  const handleTriggerStyling = (occ?: Occasion) => {
    const targetOccasion = occ || selectedOccasion;
    if (occ) setSelectedOccasion(occ);
    onAskWhatToWear(targetOccasion, customNote.trim() || undefined);
    setHasWornToday(false);
  };

  const handleWearTodayClick = () => {
    if (!currentOutfit) return;
    onWearToday(currentOutfit);
    setHasWornToday(true);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* 1. HERO AI ENTRY: "Hôm nay mặc gì?" */}
      <section 
        className="rounded-2xl border p-5 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden"
        style={{
          backgroundColor: theme.primaryBg,
          borderColor: theme.primaryBorder,
        }}
      >
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: theme.primary }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                  Hôm nay mặc gì?
                </h1>
                <p className="text-xs text-stone-500">
                  Chào {profile.name || 'bạn'}, thời tiết {weather.city} hôm nay {weather.temp}°C, {weather.condition.toLowerCase()}.
                </p>
              </div>
            </div>

            {/* Quick weather advice pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-stone-200/80 text-stone-600 text-xs self-start sm:self-auto">
              <ThermometerSun className="w-3.5 h-3.5" style={{ color: theme.primary }} />
              <span>{weather.advice}</span>
            </div>
          </div>

          {/* Occasion Selection Pills */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-stone-600 mb-2">
              Bạn chuẩn bị cho dịp nào hôm nay?
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedOccasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => {
                      setSelectedOccasion(occ);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all focus:outline-none border"
                    style={{
                      borderColor: isSelected ? theme.primary : '#e2e8f0',
                      backgroundColor: isSelected ? theme.primary : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instant Stylist Action Button */}
          <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Thêm ghi chú (ví dụ: 'thích màu kem', 'cần áo khoác mỏng')..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
              style={{ borderColor: customNote ? theme.primary : undefined }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTriggerStyling();
              }}
            />
            <button
              onClick={() => handleTriggerStyling()}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl font-bold text-white text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 transition-all hover:opacity-95 focus:outline-none disabled:opacity-60"
              style={{ backgroundColor: theme.primary }}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang phối đồ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Phối đồ ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. LOADING STATE: "GUSTYLE đang phối đồ cho bạn..." */}
      {isLoading && (
        <div className="p-12 rounded-2xl border border-stone-200 bg-white text-center shadow-sm animate-pulse space-y-4">
          <div 
            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center animate-spin"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-800">
              GUSTYLE đang phối đồ cho bạn...
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Đang phân tích thời tiết {weather.city} ({weather.temp}°C), {wardrobe.length} món đồ trong tủ và phong cách {profile.favoriteStyles.join(', ')} của bạn.
            </p>
          </div>
        </div>
      )}

      {/* 3. CENTRAL RECOMMENDED OUTFIT CARD */}
      {!isLoading && currentOutfit && (
        <article className="rounded-2xl border border-stone-200/90 bg-white shadow-sm overflow-hidden transition-all">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left: Outfit Photo & Visual Look */}
            <div className="md:col-span-5 relative bg-stone-100 min-h-[300px] md:min-h-[460px] overflow-hidden group">
              <OutfitPreview
                items={currentOutfit.items}
                title={currentOutfit.title}
                className="w-full h-full min-h-[300px] md:min-h-[460px]"
              />
              
              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span 
                  className="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm"
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                >
                  {currentOutfit.style}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-stone-800 shadow-sm backdrop-blur-sm">
                  {currentOutfit.occasion}
                </span>
              </div>

              {/* Weather fit tag on bottom */}
              <div className="absolute bottom-3 left-3 right-3 bg-stone-900/80 backdrop-blur-md rounded-lg px-3 py-1.5 text-white text-xs flex items-center gap-1.5">
                <ThermometerSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{currentOutfit.weatherSuitability}</span>
              </div>
            </div>

            {/* Right: Outfit Info, Reason & Items breakdown */}
            <div className="md:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
              
              <div>
                {/* Header with Title and Favorite/Save buttons */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                    {currentOutfit.title}
                  </h2>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onToggleSaveOutfit(currentOutfit)}
                      aria-label="Lưu outfit"
                      title={currentOutfit.isSaved ? 'Đã lưu outfit' : 'Lưu vào danh sách'}
                      className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors focus:outline-none"
                    >
                      <Bookmark 
                        className="w-5 h-5" 
                        style={{ 
                          fill: currentOutfit.isSaved ? theme.primary : 'none',
                          color: currentOutfit.isSaved ? theme.primary : undefined 
                        }} 
                      />
                    </button>
                    <button
                      onClick={() => onToggleFavoriteOutfit(currentOutfit)}
                      aria-label="Yêu thích outfit"
                      title={currentOutfit.isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                      className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors focus:outline-none"
                    >
                      <Heart 
                        className="w-5 h-5" 
                        style={{ 
                          fill: currentOutfit.isFavorite ? '#e11d48' : 'none',
                          color: currentOutfit.isFavorite ? '#e11d48' : undefined 
                        }} 
                      />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                  {currentOutfit.description}
                </p>

                {/* Stylist Rationale (Tại sao outfit này phù hợp) */}
                <div 
                  className="p-3.5 rounded-xl border mb-5 flex items-start gap-2.5 text-xs text-stone-700"
                  style={{ backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }}
                >
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.primary }} />
                  <div>
                    <span className="font-bold text-stone-900 block mb-0.5">Lời nhắn từ Stylist:</span>
                    <span>{currentOutfit.reason}</span>
                  </div>
                </div>

                {/* Items in Outfit (Tủ đồ vs Món đề xuất bổ sung) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                      Các món trong bản phối ({currentOutfit.items.length})
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {currentOutfit.items.filter(i => i.isFromWardrobe).length} từ tủ đồ • {currentOutfit.items.filter(i => !i.isFromWardrobe).length} gợi ý thêm
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {currentOutfit.items.map((item, idx) => (
                      <div 
                        key={idx}
                        className="p-2 rounded-xl border border-stone-200 bg-stone-50/50 flex items-center gap-2 relative group hover:border-stone-300 transition-colors"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category as any, item.color);
                          }}
                          className="w-10 h-10 rounded-lg object-cover bg-white shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="font-mono text-[9px] font-bold px-1 py-0.2 bg-stone-200 text-stone-700 rounded">
                              {item.id}
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-stone-800 truncate" title={item.name}>
                            {item.name}
                          </p>
                          <span className={`text-[10px] inline-block font-medium ${
                            item.isFromWardrobe ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {item.isFromWardrobe ? '• Trong tủ đồ' : '• Đề xuất thêm'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Interactive Actions */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleTriggerStyling()}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 focus:outline-none transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tạo outfit khác</span>
                </button>

                <button
                  onClick={handleWearTodayClick}
                  className="px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all focus:outline-none hover:opacity-95"
                  style={{ backgroundColor: hasWornToday ? '#10b981' : theme.primary }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hasWornToday ? 'Đã lưu vào lịch hôm nay' : 'Mặc hôm nay'}</span>
                </button>
              </div>

            </div>

          </div>

        </article>
      )}

      {/* 4. WARDROBE QUICK ACCESS WIDGET */}
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Tủ đồ của bạn ({wardrobe.length} món)
            </h3>
            <p className="text-xs text-stone-500">
              AI sẽ ưu tiên dùng những trang phục sẵn có để phối đồ hàng ngày.
            </p>
          </div>
          <button
            onClick={onOpenWardrobe}
            className="text-xs font-bold hover:underline flex items-center gap-1 focus:outline-none"
            style={{ color: theme.primary }}
          >
            <span>Xem tất cả</span>
            <span>→</span>
          </button>
        </div>

        {wardrobe.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-stone-300 rounded-xl bg-stone-50">
            <p className="text-xs text-stone-500 mb-3">
              Tủ đồ của bạn đang trống. Hãy thêm món đồ đầu tiên để GUSTYLE bắt đầu phối đồ nhé.
            </p>
            <button
              onClick={onOpenWardrobe}
              className="px-4 py-2 rounded-lg text-white text-xs font-semibold focus:outline-none"
              style={{ backgroundColor: theme.primary }}
            >
              Thêm đồ vào tủ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {wardrobe.slice(0, 6).map((item) => (
              <div 
                key={item.id}
                onClick={onOpenWardrobe}
                className="group cursor-pointer rounded-xl border border-stone-200 overflow-hidden bg-stone-50 transition-all hover:border-stone-300 hover:shadow-xs"
              >
                <div className="aspect-square relative overflow-hidden bg-white">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category as any, item.color);
                    }}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px]">
                    {item.category}
                  </span>
                </div>
                <div className="p-1.5 text-center">
                  <p className="text-[11px] font-semibold text-stone-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
