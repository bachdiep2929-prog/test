import React, { useState } from 'react';
import { 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Clock, 
  ThermometerSun, 
  Check 
} from 'lucide-react';
import { CalendarDayPlan, Occasion, Outfit, ThemeTokens, UserProfile, WardrobeItem, WeatherInfo } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';
import { OutfitPreview } from '../common/OutfitPreview';

interface CalendarViewProps {
  days: CalendarDayPlan[];
  outfits: Outfit[];
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  weather: WeatherInfo;
  theme: ThemeTokens;
  onUpdateDay: (day: CalendarDayPlan) => void;
  onGenerateOutfitForDay: (dayId: string, occasion: Occasion) => void;
  onViewOutfitDetails: (outfit: Outfit) => void;
}

const OCCASIONS: Occasion[] = [
  'Đi làm',
  'Đi học',
  'Đi chơi',
  'Hẹn hò',
  'Tiệc',
  'Du lịch',
  'Tập thể thao',
  'Bình thường',
  'Trang trọng',
  'Họp',
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  days,
  outfits,
  profile,
  weather,
  theme,
  onUpdateDay,
  onGenerateOutfitForDay,
  onViewOutfitDetails,
}) => {
  const [selectedDayId, setSelectedDayId] = useState<string>(days[0]?.id || 'cal_mon');

  const selectedDay = days.find((d) => d.id === selectedDayId) || days[0];
  const assignedOutfit = outfits.find((o) => o.id === selectedDay?.assignedOutfitId) || outfits[0];

  const handleOccasionChange = (newOccasion: Occasion) => {
    if (!selectedDay) return;
    const updated: CalendarDayPlan = {
      ...selectedDay,
      occasion: newOccasion,
    };
    onUpdateDay(updated);
  };

  const handleToggleWorn = () => {
    if (!selectedDay) return;
    const updated: CalendarDayPlan = {
      ...selectedDay,
      isWorn: !selectedDay.isWorn,
    };
    onUpdateDay(updated);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">
          Kế Hoạch Trang Phục Tuần Này
        </h1>
        <p className="text-xs text-stone-500">
          Chọn từng ngày để thiết lập dịp hoạt động và nhận gợi ý outfit phù hợp nhất từ AI
        </p>
      </div>

      {/* 7 Days of the Week Navigation Bar */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3 bg-white p-3 rounded-2xl border border-stone-200">
        {days.map((d) => {
          const isSelected = d.id === selectedDayId;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDayId(d.id)}
              className="py-3 px-1 rounded-xl flex flex-col items-center justify-between min-h-[90px] border transition-all focus:outline-none relative group"
              style={{
                borderColor: isSelected ? theme.primary : '#f1f5f9',
                backgroundColor: isSelected ? theme.primaryLight : '#fafafa',
              }}
            >
              <span className={`text-[11px] font-bold ${isSelected ? 'text-stone-900' : 'text-stone-600'}`}>
                {d.dayOfWeek.replace('Thứ ', 'T')}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                {d.dateFormatted}
              </span>
              <span className="text-base my-0.5">{d.weather.icon}</span>

              {/* Status indicator */}
              <div className="flex items-center gap-1">
                {d.isWorn ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Đã mặc" />
                ) : d.assignedOutfitId ? (
                  <span 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ backgroundColor: theme.primary }}
                    title="Đã có outfit" 
                  />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Details Panel */}
      {selectedDay && (
        <section className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-sm">
          
          {/* Day & Weather banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900">
                  {selectedDay.dayOfWeek} ({selectedDay.dateFormatted})
                </h2>
                {selectedDay.isWorn && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã mặc
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Dự báo {weather.city}: {selectedDay.weather.temp}°C • {selectedDay.weather.condition}
              </p>
            </div>

            {/* Mark as worn toggle */}
            <button
              onClick={handleToggleWorn}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all focus:outline-none ${
                selectedDay.isWorn 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{selectedDay.isWorn ? 'Bỏ đánh dấu đã mặc' : 'Đánh dấu đã mặc'}</span>
            </button>
          </div>

          {/* Occasion Selector for this day */}
          <div className="my-5">
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Dịp hoạt động trong ngày:
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {OCCASIONS.map((occ) => {
                const isSelected = selectedDay.occasion === occ;
                return (
                  <button
                    key={occ}
                    onClick={() => handleOccasionChange(occ)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all border focus:outline-none"
                    style={{
                      borderColor: isSelected ? theme.primary : '#e2e8f0',
                      backgroundColor: isSelected ? theme.primary : '#ffffff',
                      color: isSelected ? '#ffffff' : '#374151',
                    }}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Outfit Card */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-500">
                Outfit Gợi Ý Cho Ngày Này
              </span>
              <button
                onClick={() => onGenerateOutfitForDay(selectedDay.id, selectedDay.occasion)}
                className="text-xs font-bold flex items-center gap-1.5 hover:underline focus:outline-none"
                style={{ color: theme.primary }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI phối lại cho dịp {selectedDay.occasion}</span>
              </button>
            </div>

            {assignedOutfit ? (
              <div className="rounded-xl border border-stone-200 p-4 sm:p-5 bg-stone-50/50 flex flex-col md:flex-row gap-5">
                <div className="w-full md:w-44 h-44 rounded-xl overflow-hidden border border-stone-200 shrink-0">
                  <OutfitPreview
                    items={assignedOutfit.items}
                    title={assignedOutfit.title}
                    className="w-full h-full"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span 
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                      >
                        {assignedOutfit.style}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white text-stone-700 text-[10px] font-semibold border border-stone-200">
                        {assignedOutfit.occasion}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mb-1">
                      {assignedOutfit.title}
                    </h3>
                    <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                      {assignedOutfit.reason}
                    </p>

                    {/* Pieces included */}
                    <div className="flex flex-wrap gap-2">
                      {assignedOutfit.items.map((item, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 rounded-lg bg-white border border-stone-200 text-[11px] text-stone-700 flex items-center gap-1.5"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color || 'Trắng');
                            }}
                            className="w-4 h-4 rounded object-cover bg-stone-100 shrink-0 border border-stone-200"
                          />
                          <span className="font-mono text-[9px] font-bold px-1 py-0.2 bg-stone-200 text-stone-700 rounded">
                            {item.id}
                          </span>
                          <span className="truncate max-w-[120px]">{item.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500">
                      Thích hợp: {assignedOutfit.weatherSuitability}
                    </span>
                    <button
                      onClick={() => onViewOutfitDetails(assignedOutfit)}
                      className="text-xs font-bold hover:underline flex items-center gap-1 focus:outline-none"
                      style={{ color: theme.primary }}
                    >
                      <span>Xem chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-8 rounded-xl border border-dashed border-stone-300 bg-stone-50">
                <p className="text-xs text-stone-500 mb-2">Chưa có outfit nào được phân công cho ngày này.</p>
                <button
                  onClick={() => onGenerateOutfitForDay(selectedDay.id, selectedDay.occasion)}
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                  style={{ backgroundColor: theme.primary }}
                >
                  Tạo outfit bằng AI
                </button>
              </div>
            )}

          </div>

        </section>
      )}

    </div>
  );
};
