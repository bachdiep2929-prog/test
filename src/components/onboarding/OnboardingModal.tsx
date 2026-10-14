import React, { useState } from 'react';
import { UserProfile, Gender, FashionStyle, ThemeTokens } from '../../types';
import { getThemeTokens } from '../../utils/theme';
import { CITIES_WEATHER } from '../../data/mockData';
import { ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

const ALL_STYLES: { id: FashionStyle; label: string; desc: string }[] = [
  { id: 'Minimal', label: 'Minimal', desc: 'Tối giản, tinh tế, ít họa tiết' },
  { id: 'Smart Casual', label: 'Smart Casual', desc: 'Chỉn chu, lịch thiệp nhưng thoải mái' },
  { id: 'Casual', label: 'Casual', desc: 'Năng động, thường ngày, tự nhiên' },
  { id: 'Feminine', label: 'Feminine', desc: 'Dịu dàng, thướt tha, gam pastel' },
  { id: 'Elegant', label: 'Elegant', desc: 'Quý phái, sang trọng, đẳng cấp' },
  { id: 'Office', label: 'Office', desc: 'Chuyên nghiệp công sở, blazer, sơ mi' },
  { id: 'Streetwear', label: 'Streetwear', desc: 'Cá tính, phóng khoáng, thời thượng' },
  { id: 'Vintage', label: 'Vintage', desc: 'Cổ điển, hoài niệm, màu ấm' },
  { id: 'Sporty', label: 'Sporty', desc: 'Khỏe khoắn, thể thao, năng động' },
  { id: 'Y2K', label: 'Y2K', desc: 'Đậm nét retro những năm 2000' },
  { id: 'Date', label: 'Date', desc: 'Cuốn hút, ngọt ngào cho buổi hẹn' },
  { id: 'Party', label: 'Party', desc: 'Nổi bật, rạng rỡ cho các bữa tiệc' },
  { id: 'Formal', label: 'Formal', desc: 'Trang trọng, dự sự kiện chuẩn mực' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ initialProfile, onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<Gender>(initialProfile.gender);
  const [age, setAge] = useState<number>(initialProfile.age || 24);
  const [height, setHeight] = useState<number>(initialProfile.height || 165);
  const [weight, setWeight] = useState<number>(initialProfile.weight || 52);
  const [city, setCity] = useState<string>(initialProfile.city || 'TP. Hồ Chí Minh');
  const [selectedStyles, setSelectedStyles] = useState<FashionStyle[]>(
    initialProfile.favoriteStyles.length > 0 ? initialProfile.favoriteStyles : ['Minimal', 'Smart Casual']
  );
  const [name, setName] = useState<string>(initialProfile.name || '');

  // Live theme preview based on selected gender & age
  const previewTheme: ThemeTokens = getThemeTokens(gender, age);

  const toggleStyle = (style: FashionStyle) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleFinish = () => {
    const updatedProfile: UserProfile = {
      ...initialProfile,
      name: name.trim() || (gender === 'male' ? 'Minh Trí' : 'Thanh Khôi'),
      gender,
      age,
      height,
      weight,
      city,
      country: CITIES_WEATHER[city]?.country || 'Việt Nam',
      favoriteStyles: selectedStyles,
      isOnboarded: true,
    };
    onComplete(updatedProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 transition-all duration-300"
        style={{ borderColor: previewTheme.primaryBorder }}
      >
        {/* Top Header Banner with GUSTYLE Logo in Aptos Black */}
        <div 
          className="p-6 text-center border-b border-stone-100 transition-colors duration-300"
          style={{ backgroundColor: previewTheme.primaryBg }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span 
              className="font-logo text-2xl tracking-widest text-[#be185d]"
              style={{ fontFamily: "'Aptos Black', 'Aptos', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 900 }}
            >
              GUSTYLE
            </span>
          </div>
          <p className="text-xs text-stone-500 italic">
            Thiết lập gu thẩm mỹ cá nhân của bạn
          </p>

          {/* Progress Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: step === s ? '24px' : '8px',
                  backgroundColor: step === s ? previewTheme.primary : '#e2e8f0',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 min-h-[360px] flex flex-col justify-between">
          
          {/* STEP 1: GENDER */}
          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 1 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Bạn muốn GUSTYLE định hướng phong cách theo giới tính nào?
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Lựa chọn này giúp GUSTYLE điều chỉnh bảng màu giao diện pastel phù hợp và đề xuất form dáng chuẩn xác nhất.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'female' as Gender, label: 'Nữ', sub: 'Tone hồng pastel, đào & lavender' },
                  { id: 'male' as Gender, label: 'Nam', sub: 'Tone xanh mint & cyan nhẹ' },
                  { id: 'other' as Gender, label: 'Khác', sub: 'Palette cân bằng trung tính' },
                  { id: 'undisclosed' as Gender, label: 'Không muốn cung cấp', sub: 'Tối giản thanh lịch' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGender(item.id)}
                    className="p-4 rounded-xl border text-left transition-all duration-200 relative group flex flex-col justify-between h-28 focus:outline-none"
                    style={{
                      borderColor: gender === item.id ? previewTheme.primary : '#e5e7eb',
                      backgroundColor: gender === item.id ? previewTheme.primaryLight : '#ffffff',
                    }}
                  >
                    <div>
                      <div className="font-bold text-base text-stone-900">{item.label}</div>
                      <div className="text-xs text-stone-500 mt-1">{item.sub}</div>
                    </div>
                    {gender === item.id && (
                      <div 
                        className="w-5 h-5 rounded-full flex items-center justify-center self-end text-white text-xs"
                        style={{ backgroundColor: previewTheme.primary }}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: AGE */}
          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 2 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Độ tuổi của bạn
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                GUSTYLE sẽ tự động tinh chỉnh sắc độ màu sắc giao diện và mức độ chín chắn của các gợi ý thời trang.
              </p>

              <div className="p-6 rounded-2xl border border-stone-200 text-center bg-stone-50/50">
                <div 
                  className="text-5xl font-black mb-2"
                  style={{ color: previewTheme.primary }}
                >
                  {age} <span className="text-xl font-normal text-stone-500">tuổi</span>
                </div>
                <div className="text-xs text-stone-500 mb-6">
                  {age < 25 ? 'Nhóm trẻ tuổi: Tươi sáng, năng động, nhiều điểm nhấn pastel' : age <= 45 ? 'Nhóm trưởng thành: Dịu dàng, thanh lịch, trang nhã' : 'Nhóm lớn tuổi: Nhẹ nhàng, tương phản tốt, chữ rõ ràng'}
                </div>

                <input
                  type="range"
                  min="16"
                  max="75"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: previewTheme.primary }}
                />

                <div className="flex justify-between text-xs text-stone-400 mt-3">
                  <span>16 tuổi</span>
                  <span>30 tuổi</span>
                  <span>45 tuổi</span>
                  <span>75 tuổi</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HEIGHT */}
          {step === 3 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 3 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Chiều cao của bạn
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Giúp AI gợi ý tỷ lệ trang phục (chiều dài váy, quần ống suông, cạp cao) để tôn vóc dáng tối ưu.
              </p>

              <div className="p-6 rounded-2xl border border-stone-200 text-center bg-stone-50/50">
                <div 
                  className="text-5xl font-black mb-4"
                  style={{ color: previewTheme.primary }}
                >
                  {height} <span className="text-xl font-normal text-stone-500">cm</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setHeight(Math.max(140, height - 1))}
                    className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-lg hover:bg-stone-100 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="140"
                    max="205"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                    className="w-48 sm:w-64 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: previewTheme.primary }}
                  />
                  <button
                    onClick={() => setHeight(Math.min(205, height + 1))}
                    className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-lg hover:bg-stone-100 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: WEIGHT */}
          {step === 4 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 4 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Cân nặng của bạn
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Dữ liệu được bảo mật hoàn toàn trong hồ sơ của bạn để tư vấn độ vừa vặn và phom dáng thoải mái nhất.
              </p>

              <div className="p-6 rounded-2xl border border-stone-200 text-center bg-stone-50/50">
                <div 
                  className="text-5xl font-black mb-4"
                  style={{ color: previewTheme.primary }}
                >
                  {weight} <span className="text-xl font-normal text-stone-500">kg</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setWeight(Math.max(35, weight - 1))}
                    className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-lg hover:bg-stone-100 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="35"
                    max="120"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                    className="w-48 sm:w-64 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                    style={{ accentColor: previewTheme.primary }}
                  />
                  <button
                    onClick={() => setWeight(Math.min(120, weight + 1))}
                    className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-lg hover:bg-stone-100 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: REGION / CITY & WEATHER */}
          {step === 5 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 5 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Chọn thành phố / khu vực
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Để GUSTYLE đồng bộ thời tiết theo thời gian thực và chọn chất liệu vải phù hợp với khí hậu.
              </p>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {Object.keys(CITIES_WEATHER).map((cityName) => {
                  const item = CITIES_WEATHER[cityName];
                  const isSelected = cityName === city;
                  return (
                    <button
                      key={cityName}
                      onClick={() => setCity(cityName)}
                      className="w-full p-3.5 rounded-xl border flex items-center justify-between transition-all focus:outline-none text-left"
                      style={{
                        borderColor: isSelected ? previewTheme.primary : '#e5e7eb',
                        backgroundColor: isSelected ? previewTheme.primaryLight : '#ffffff',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="font-bold text-sm text-stone-900">{item.city}</div>
                          <div className="text-xs text-stone-500">{item.country} • {item.condition}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-stone-800">{item.temp}°C</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: FAVORITE STYLES */}
          {step === 6 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 6 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Phong cách thời trang yêu thích
              </h2>
              <p className="text-sm text-stone-600 mb-4">
                Chọn một hoặc nhiều phong cách bạn hướng tới để AI Stylist ưu tiên gợi ý.
              </p>

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
                {ALL_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className="px-3.5 py-2 rounded-full border text-xs font-medium transition-all focus:outline-none flex items-center gap-1.5"
                      style={{
                        borderColor: isSelected ? previewTheme.primary : '#e5e7eb',
                        backgroundColor: isSelected ? previewTheme.primary : '#ffffff',
                        color: isSelected ? '#ffffff' : '#374151',
                      }}
                    >
                      <span>{style.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: ACCOUNT & NAME */}
          {step === 7 && (
            <div className="animate-in fade-in duration-200">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">Bước 7 / 7</span>
              <h2 className="text-2xl font-bold text-stone-900 mt-1 mb-2">
                Chào mừng bạn đến với GUSTYLE
              </h2>
              <p className="text-sm text-stone-600 mb-6">
                Hãy cho GUSTYLE biết tên bạn để cá nhân hóa lời chào và bản phối trang phục mỗi ngày.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Tên của bạn
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Thanh Khôi"
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:outline-none text-base"
                    style={{ borderColor: name ? previewTheme.primary : undefined }}
                  />
                </div>

                <div 
                  className="p-4 rounded-xl border flex items-start gap-3"
                  style={{ backgroundColor: previewTheme.primaryLight, borderColor: previewTheme.primaryBorder }}
                >
                  <Sparkles className="w-5 h-5 shrink-0 mt-0.5" style={{ color: previewTheme.primary }} />
                  <div className="text-xs leading-relaxed text-stone-700">
                    <p className="font-semibold text-stone-900 mb-0.5">Sẵn sàng trải nghiệm AI Stylist</p>
                    GUSTYLE đã sẵn sàng tủ đồ ban đầu với các món đồ kinh điển để bạn có thể bắt đầu phối đồ ngay lập tức!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Actions: Previous & Next / Finish */}
          <div className="flex items-center justify-between pt-6 border-t border-stone-100 mt-6">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 rounded-lg border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 flex items-center gap-1.5 focus:outline-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
            ) : (
              <div />
            )}

            {step < 7 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all focus:outline-none hover:opacity-90"
                style={{ backgroundColor: previewTheme.primary }}
              >
                <span>Tiếp tục</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold flex items-center gap-2 shadow-md transition-all focus:outline-none hover:opacity-95"
                style={{ backgroundColor: previewTheme.primary }}
              >
                <span>Bắt đầu khám phá</span>
                <Sparkles className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
