import React, { useState } from 'react';
import { Eye, LogIn, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { UserProfile, WeatherInfo, ThemeTokens } from '../../types';
import { CITIES_WEATHER } from '../../data/mockData';

interface HeaderProps {
  profile: UserProfile;
  weather: WeatherInfo;
  theme: ThemeTokens;
  onSelectCity: (city: string) => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  onToggleLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  weather,
  theme,
  onSelectCity,
  onOpenProfile,
  isLoggedIn,
  onToggleLogin,
}) => {
  const [showCityMenu, setShowCityMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: GUSTYLE Logo in Aptos Black, ALL CAPS, Dark Pink (#be185d) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group focus:outline-none"
            title="GUSTYLE - Trợ lý Thời trang Cá nhân AI"
          >
            <span 
              className="font-logo text-2xl tracking-widest text-[#be185d] select-none hover:opacity-95 transition-opacity"
              style={{ fontFamily: "'Aptos Black', 'Aptos', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 900 }}
            >
              GUSTYLE
            </span>
          </button>
        </div>

        {/* Right Section: Weather Widget + Auth Icon + User Avatar / Eye Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Weather Widget */}
          <div className="relative">
            <button
              onClick={() => setShowCityMenu(!showCityMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-stone-100 transition-colors border border-stone-200/60 text-stone-800 text-sm focus:outline-none"
              title="Nhấn để đổi thành phố & xem dự báo thời tiết"
              aria-label={`Thời tiết: ${weather.temp} độ C tại ${weather.city}`}
            >
              <span className="text-base leading-none">{weather.icon}</span>
              <div className="flex flex-col text-left leading-tight">
                <span className="font-semibold text-xs sm:text-sm">{weather.temp}°C</span>
                <span className="text-[10px] sm:text-xs text-stone-500 flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {weather.city}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {/* City Selector Dropdown */}
            {showCityMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowCityMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Chọn khu vực
                  </div>
                  {Object.keys(CITIES_WEATHER).map((cityName) => {
                    const c = CITIES_WEATHER[cityName];
                    const isSelected = cityName === weather.city;
                    return (
                      <button
                        key={cityName}
                        onClick={() => {
                          onSelectCity(cityName);
                          setShowCityMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-stone-50 transition-colors ${
                          isSelected ? 'font-bold text-stone-900 bg-stone-50' : 'text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.icon}</span>
                          <span>{c.city}</span>
                        </div>
                        <span className="text-stone-500 font-medium">{c.temp}°C</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Login / Logout Icon (Minimal, no large text, clear tooltip/aria-label) */}
          <button
            onClick={onToggleLogin}
            aria-label={isLoggedIn ? 'Đăng xuất tài khoản' : 'Đăng nhập tài khoản'}
            title={isLoggedIn ? 'Đăng xuất (Đang đăng nhập)' : 'Đăng nhập GUSTYLE'}
            className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none relative group"
          >
            {isLoggedIn ? (
              <LogOut className="w-4 h-4 text-stone-600 group-hover:text-red-600 transition-colors" />
            ) : (
              <LogIn className="w-4 h-4 text-stone-600" />
            )}
          </button>

          {/* Personal Profile Avatar / Eye Icon Button */}
          <button
            onClick={onOpenProfile}
            aria-label="Hồ sơ cá nhân và cài đặt gu thẩm mỹ"
            title={`Hồ sơ cá nhân: ${profile.name || 'GUSTYLE'}`}
            className="flex items-center gap-1.5 p-1 rounded-full transition-all focus:outline-none hover:ring-2 hover:ring-offset-1 group"
          >
            <div className="relative">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover border border-stone-200 group-hover:scale-105 transition-transform"
              />
              <span 
                className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full text-white shadow-xs"
                style={{ backgroundColor: theme.primary }}
              >
                <Eye className="w-2.5 h-2.5" />
              </span>
            </div>
            <span className="sr-only">Hồ sơ cá nhân</span>
          </button>

        </div>
      </div>
    </header>
  );
};
