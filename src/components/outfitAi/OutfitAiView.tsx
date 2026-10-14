import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Bookmark, 
  Heart, 
  Layers, 
  Send, 
  ArrowRight, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { Outfit, FashionStyle, Occasion, WardrobeItem, ThemeTokens, UserProfile, WeatherInfo } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';
import { OutfitPreview } from '../common/OutfitPreview';

interface OutfitAiViewProps {
  outfits: Outfit[];
  wardrobe: WardrobeItem[];
  profile: UserProfile;
  weather: WeatherInfo;
  theme: ThemeTokens;
  isLoading: boolean;
  onGenerateOutfit: (style?: FashionStyle, occasion?: Occasion, seedPiece?: WardrobeItem, customPrompt?: string) => void;
  onToggleSave: (outfit: Outfit) => void;
  onToggleFavorite: (outfit: Outfit) => void;
  onWearOutfit: (outfit: Outfit) => void;
}

const STYLES_LIST: FashionStyle[] = [
  'Minimal',
  'Smart Casual',
  'Feminine',
  'Casual',
  'Elegant',
  'Office',
  'Streetwear',
  'Vintage',
  'Y2K',
  'Sporty',
];

export const OutfitAiView: React.FC<OutfitAiViewProps> = ({
  outfits,
  wardrobe,
  profile,
  weather,
  theme,
  isLoading,
  onGenerateOutfit,
  onToggleSave,
  onToggleFavorite,
  onWearOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<'curated' | 'mixmatch' | 'consultant'>('curated');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<FashionStyle | 'All'>('All');
  
  // Mix & Match state
  const [selectedSeedPieceId, setSelectedSeedPieceId] = useState<string>(wardrobe[0]?.id || '');
  const [mixMatchPrompt, setMixMatchPrompt] = useState<string>('');
  const [studioPrompt, setStudioPrompt] = useState<string>('');
  
  // AI Stylist Chat/Consultant state
  const [consultantQuery, setConsultantQuery] = useState<string>('');
  const [consultantHistory, setConsultantHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Xin chào ${profile.name}! Tôi là GUSTYLE AI Stylist của bạn. Bạn muốn tôi tư vấn mẹo phối đồ cho một món đồ cụ thể, hay lên set trang phục cho sự kiện sắp tới?`,
    },
  ]);
  const [isConsulting, setIsConsulting] = useState<boolean>(false);

  const filteredOutfits = outfits.filter((o) => {
    if (selectedStyleFilter === 'All') return true;
    return o.style === selectedStyleFilter;
  });

  const handleMixMatchGenerate = () => {
    const seed = wardrobe.find((w) => w.id === selectedSeedPieceId);
    onGenerateOutfit(undefined, 'Đi làm', seed, mixMatchPrompt.trim() || undefined);
  };

  const handleSendConsultation = () => {
    if (!consultantQuery.trim()) return;
    const q = consultantQuery.trim();
    setConsultantHistory((prev) => [...prev, { sender: 'user', text: q }]);
    setConsultantQuery('');
    setIsConsulting(true);

    setTimeout(() => {
      // Smart stylist response tailored to profile, weather and wardrobe
      const responses = [
        `Với thời tiết ${weather.temp}°C tại ${weather.city} và phong cách ${profile.favoriteStyles[0] || 'Minimal'}, bạn có thể kết hợp áo sơ mi sáng màu cùng quần ống suông be. Thêm một đôi giày mule và phụ kiện kim loại nhỏ sẽ giúp tổng thể thanh lịch mà không gò bó.`,
        `Để set đồ tôn dáng nhất theo chiều cao ${profile.height}cm của bạn, hãy thử công thức "1/3 - 2/3": áo sơ vin cạp cao kết hợp chân váy midi hoặc quần tây đứng phom. Điểm xuyết túi xách da màu caramel từ tủ đồ của bạn sẽ rất thu hút.`,
        `Gam màu trung tính như kem, trắng ngà và be luôn là "vũ khí" thời trang vượt thời gian. Bạn có thể phối thêm một chiếc blazer oversized nhẹ khi đi vào không gian máy lạnh hoặc dự sự kiện quan trọng.`,
      ];
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setConsultantHistory((prev) => [...prev, { sender: 'ai', text: reply }]);
      setIsConsulting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Outfit AI Studio
          </h1>
          <p className="text-xs text-stone-500">
            Phòng thí nghiệm thời trang thông minh: Đề xuất outfit, phối theo từng món đồ và tư vấn phong cách
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
              activeTab === 'curated' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Outfit Đề Xuất
          </button>
          <button
            onClick={() => setActiveTab('mixmatch')}
            className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
              activeTab === 'mixmatch' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Phối Tủ Đồ
          </button>
          <button
            onClick={() => setActiveTab('consultant')}
            className={`px-3 py-1.5 rounded-lg transition-all focus:outline-none ${
              activeTab === 'consultant' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Hỏi AI Stylist
          </button>
        </div>
      </div>

      {/* TAB 1: CURATED OUTFITS BY STYLES */}
      {activeTab === 'curated' && (
        <div className="space-y-6">
          
          {/* Style Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedStyleFilter('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 border transition-all ${
                selectedStyleFilter === 'All' ? 'text-white border-transparent' : 'bg-white text-stone-700 border-stone-200'
              }`}
              style={{ backgroundColor: selectedStyleFilter === 'All' ? theme.primary : undefined }}
            >
              Tất cả styles
            </button>
            {STYLES_LIST.map((st) => {
              const isSelected = selectedStyleFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStyleFilter(st)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
                    isSelected ? 'text-white border-transparent' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                  style={{ backgroundColor: isSelected ? theme.primary : undefined }}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Quick AI Trigger button */}
          <div 
            className="p-4 rounded-2xl border flex flex-col gap-3 shadow-xs"
            style={{ backgroundColor: theme.primaryBg, borderColor: theme.primaryBorder }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-left">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Tạo bản phối mới với AI
                  </h3>
                  <p className="text-xs text-stone-500">
                    Sử dụng tủ đồ cá nhân + dữ liệu thời tiết {weather.city} ({weather.temp}°C)
                  </p>
                </div>
              </div>

              <button
                onClick={() => onGenerateOutfit(selectedStyleFilter === 'All' ? undefined : selectedStyleFilter, undefined, undefined, studioPrompt.trim() || undefined)}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 focus:outline-none"
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
                    <span>Phối với AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Custom Prompt Input */}
            <div className="flex items-center gap-2 pt-2 border-t border-stone-200/50">
              <input
                type="text"
                value={studioPrompt}
                onChange={(e) => setStudioPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onGenerateOutfit(selectedStyleFilter === 'All' ? undefined : selectedStyleFilter, undefined, undefined, studioPrompt.trim() || undefined);
                  }
                }}
                placeholder="Thêm ghi chú yêu cầu phối đồ (ví dụ: 'thích màu đen', 'không mặc sơ mi', 'thoải mái')..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Outfits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredOutfits.map((outfit) => (
              <article 
                key={outfit.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Badges */}
                  <div className="aspect-16/10 relative overflow-hidden bg-stone-100">
                    <OutfitPreview
                      items={outfit.items}
                      title={outfit.title}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span 
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-xs"
                        style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                      >
                        {outfit.style}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/90 text-stone-800 text-[10px] font-semibold backdrop-blur-xs">
                        {outfit.occasion}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1">
                      <button
                        onClick={() => onToggleSave(outfit)}
                        aria-label="Lưu outfit"
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 transition-colors shadow-xs"
                      >
                        <Bookmark 
                          className="w-3.5 h-3.5" 
                          style={{ fill: outfit.isSaved ? theme.primary : 'none', color: outfit.isSaved ? theme.primary : undefined }}
                        />
                      </button>
                      <button
                        onClick={() => onToggleFavorite(outfit)}
                        aria-label="Yêu thích outfit"
                        className="p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-600 transition-colors shadow-xs"
                      >
                        <Heart 
                          className="w-3.5 h-3.5" 
                          style={{ fill: outfit.isFavorite ? '#e11d48' : 'none', color: outfit.isFavorite ? '#e11d48' : undefined }}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-stone-900 mb-1 leading-snug">
                      {outfit.title}
                    </h3>

                    {/* Short concise explanation */}
                    <p className="text-xs text-stone-600 mb-3 bg-stone-50 p-2 rounded-xl border border-stone-100 italic">
                      "{outfit.reason}"
                    </p>

                    {/* Items chips */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {outfit.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="px-2 py-1 rounded-lg text-[10px] bg-stone-50 border border-stone-200 text-stone-700 flex items-center gap-1.5"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color || 'Trắng');
                            }}
                            className="w-4 h-4 rounded object-cover bg-white shrink-0 border border-stone-200"
                          />
                          <span className="font-mono text-[9px] font-bold px-1 py-0.2 bg-stone-200 text-stone-700 rounded">
                            {item.id}
                          </span>
                          <span className="truncate max-w-[130px] font-medium" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="p-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {outfit.weatherSuitability}
                  </span>
                  <button
                    onClick={() => onWearOutfit(outfit)}
                    className="px-3.5 py-1.5 rounded-lg text-white text-xs font-semibold focus:outline-none hover:opacity-90"
                    style={{ backgroundColor: theme.primary }}
                  >
                    Mặc outfit này
                  </button>
                </div>

              </article>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: MIX & MATCH STUDIO */}
      {activeTab === 'mixmatch' && (
        <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Phối Đồ Bắt Đầu Từ Một Món Bạn Muốn Mặc
            </h2>
            <p className="text-xs text-stone-500">
              Chọn 1 món đồ từ tủ quần áo của bạn, AI sẽ tìm các trang phục và phụ kiện phối cùng hợp gu nhất.
            </p>
          </div>

          {/* Wardrobe item selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {wardrobe.map((item) => {
              const isSelected = item.id === selectedSeedPieceId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedSeedPieceId(item.id)}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all focus:outline-none ${
                    isSelected ? 'ring-2 ring-offset-1' : 'border-stone-200 hover:border-stone-300'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.primary : undefined,
                    backgroundColor: isSelected ? theme.primaryLight : '#ffffff',
                  }}
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-stone-100">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color);
                      }}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-1 left-1 px-1 py-0.2 bg-stone-900/80 text-white rounded text-[8px] font-mono font-bold">
                      {item.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-stone-400 block">
                      {item.category}
                    </span>
                    <p className="text-xs font-bold text-stone-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="text-xs text-stone-600 shrink-0">
                Món đã chọn: <strong className="text-stone-900">{wardrobe.find(w => w.id === selectedSeedPieceId)?.name || 'Chưa chọn'}</strong>
              </div>
              <input
                type="text"
                value={mixMatchPrompt}
                onChange={(e) => setMixMatchPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMixMatchGenerate();
                }}
                placeholder="Ghi chú thêm khi phối (ví dụ: 'đi cùng giày bệt', 'không mặc skinny')..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none"
              />
            </div>
            <button
              onClick={handleMixMatchGenerate}
              disabled={isLoading || !selectedSeedPieceId}
              className="px-6 py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 focus:outline-none disabled:opacity-50 shrink-0"
              style={{ backgroundColor: theme.primary }}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Phối Món Này Ngay</span>
            </button>
          </div>
        </section>
      )}

      {/* TAB 3: AI STYLIST CONSULTANT */}
      {activeTab === 'consultant' && (
        <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col h-[500px]">
          {/* Top consultant banner */}
          <div 
            className="p-4 border-b border-stone-200 flex items-center gap-3"
            style={{ backgroundColor: theme.primaryBg }}
          >
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: theme.primary }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                GUSTYLE Fashion Stylist AI
              </h3>
              <p className="text-[11px] text-stone-500">
                Cố vấn gu thời trang cá nhân • Nắm rõ tủ đồ và sở thích của bạn
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/50">
            {consultantHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'text-white rounded-br-xs'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-2xs'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? theme.primary : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isConsulting && (
              <div className="flex justify-start">
                <div className="p-3 bg-white border border-stone-200 rounded-2xl rounded-bl-xs text-xs text-stone-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: theme.primary }} />
                  <span>GUSTYLE đang suy nghĩ bản phối...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
            <input
              type="text"
              value={consultantQuery}
              onChange={(e) => setConsultantQuery(e.target.value)}
              placeholder="Hỏi bất kỳ điều gì: 'Trời mưa mặc gì?', 'Đi phỏng vấn nên phối thế nào?'..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none text-stone-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendConsultation();
              }}
            />
            <button
              onClick={handleSendConsultation}
              disabled={isConsulting || !consultantQuery.trim()}
              className="p-2.5 rounded-xl text-white focus:outline-none transition-all hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: theme.primary }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
};
