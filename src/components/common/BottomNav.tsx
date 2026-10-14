import React from 'react';
import { Home, Shirt, CalendarDays, Sparkles, Eye } from 'lucide-react';
import { ThemeTokens } from '../../types';

export type NavTab = 'home' | 'wardrobe' | 'today' | 'outfitAi' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  theme: ThemeTokens;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, theme }) => {
  const navItems = [
    {
      id: 'home' as NavTab,
      label: 'Trang chủ',
      icon: Home,
      ariaLabel: 'Về trang chủ',
    },
    {
      id: 'wardrobe' as NavTab,
      label: 'Tủ đồ',
      icon: Shirt,
      ariaLabel: 'Mở tủ đồ cá nhân',
    },
    {
      id: 'today' as NavTab,
      label: 'Hôm nay',
      icon: CalendarDays,
      ariaLabel: 'Lịch phối đồ trong tuần',
    },
    {
      id: 'outfitAi' as NavTab,
      label: 'Outfit AI',
      icon: Sparkles,
      ariaLabel: 'Phòng phối đồ AI',
    },
    {
      id: 'profile' as NavTab,
      label: 'Cá nhân',
      icon: Eye,
      ariaLabel: 'Hồ sơ và thông tin cá nhân',
    },
  ];

  return (
    <nav 
      aria-label="Thanh điều hướng chính GUSTYLE"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg shadow-stone-900/5 transition-all"
    >
      <div className="max-w-md sm:max-w-xl mx-auto px-2 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              aria-label={item.ariaLabel}
              aria-selected={isActive}
              role="tab"
              className="flex-1 py-1.5 flex flex-col items-center justify-center gap-1 focus:outline-none transition-all group"
            >
              <div 
                className={`relative p-1 rounded-full transition-all duration-200 ${
                  isActive ? 'scale-105' : 'group-hover:scale-105'
                }`}
                style={{
                  backgroundColor: isActive ? theme.primaryLight : 'transparent',
                }}
              >
                <Icon 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? '' : 'text-stone-400 group-hover:text-stone-600'
                  }`}
                  style={{
                    color: isActive ? theme.primary : undefined,
                    strokeWidth: isActive ? 2.3 : 1.8,
                  }}
                />
              </div>
              <span
                className={`text-[11px] font-medium leading-none tracking-tight transition-colors duration-200 ${
                  isActive ? 'font-bold' : 'text-stone-500 group-hover:text-stone-700'
                }`}
                style={{
                  color: isActive ? theme.primary : undefined,
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
