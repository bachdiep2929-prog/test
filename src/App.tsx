/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  WardrobeItem, 
  Outfit, 
  CalendarDayPlan, 
  WearHistoryItem, 
  WeatherInfo, 
  Occasion, 
  FashionStyle,
  ThemeTokens 
} from './types';
import { 
  loadUserProfile, 
  saveUserProfile, 
  loadWardrobeItems, 
  saveWardrobeItems, 
  loadOutfits, 
  saveOutfits, 
  loadCalendarDays, 
  saveCalendarDays, 
  loadWearHistory, 
  recordWearHistory, 
  resetAppToDefaults 
} from './utils/storage';
import { getThemeTokens } from './utils/theme';
import { CITIES_WEATHER } from './data/mockData';
import { generateOutfitWithAI } from './services/aiStylist';

// Components
import { Header } from './components/common/Header';
import { BottomNav, NavTab } from './components/common/BottomNav';
import { Toast, ToastMessage } from './components/common/Toast';
import { OutfitModal } from './components/common/OutfitModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { HomeView } from './components/home/HomeView';
import { WardrobeView } from './components/wardrobe/WardrobeView';
import { CalendarView } from './components/calendar/CalendarView';
import { OutfitAiView } from './components/outfitAi/OutfitAiView';
import { ProfileView } from './components/profile/ProfileView';

export default function App() {
  // 1. Core State
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(loadWardrobeItems);
  const [outfits, setOutfits] = useState<Outfit[]>(loadOutfits);
  const [calendarDays, setCalendarDays] = useState<CalendarDayPlan[]>(loadCalendarDays);
  const [wearHistory, setWearHistory] = useState<WearHistoryItem[]>(loadWearHistory);

  // 2. Navigation & UI State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedCity, setSelectedCity] = useState<string>(profile.city || 'TP. Hồ Chí Minh');
  const [weather, setWeather] = useState<WeatherInfo>(
    CITIES_WEATHER[profile.city] || CITIES_WEATHER['TP. Hồ Chí Minh']
  );
  const [isLoadingStylist, setIsLoadingStylist] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [inspectingOutfit, setInspectingOutfit] = useState<Outfit | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [forceShowOnboarding, setForceShowOnboarding] = useState<boolean>(!profile.isOnboarded);

  // 3. Current Featured Outfit for Home
  const [currentOutfit, setCurrentOutfit] = useState<Outfit>(() => {
    return outfits[0] || null;
  });

  // 4. Dynamic Theme Calculation
  const theme: ThemeTokens = getThemeTokens(profile.gender, profile.age);

  // Sync state to LocalStorage
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveWardrobeItems(wardrobe);
  }, [wardrobe]);

  useEffect(() => {
    saveOutfits(outfits);
  }, [outfits]);

  useEffect(() => {
    saveCalendarDays(calendarDays);
  }, [calendarDays]);

  // When city changes, update weather info
  useEffect(() => {
    if (CITIES_WEATHER[selectedCity]) {
      setWeather(CITIES_WEATHER[selectedCity]);
    }
  }, [selectedCity]);

  // Notification helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: 'toast_' + Date.now(), message, type });
  };

  // --- AI STYLIST ACTION ---
  const handleAskWhatToWear = async (
    occasion: Occasion = 'Đi làm', 
    customPrompt?: string, 
    seedPiece?: WardrobeItem,
    targetStyle?: FashionStyle
  ) => {
    setIsLoadingStylist(true);
    try {
      const response = await generateOutfitWithAI({
        profile: {
          ...profile,
          favoriteStyles: targetStyle ? [targetStyle, ...profile.favoriteStyles] : profile.favoriteStyles,
        },
        wardrobe,
        weather,
        occasion,
        customPrompt,
        seedPiece,
      });

      if (response && response.outfit) {
        setCurrentOutfit(response.outfit);
        // Add to saved list if not already there
        setOutfits((prev) => [response.outfit, ...prev.filter(o => o.id !== response.outfit.id)]);
        showToast(`GUSTYLE đã phối xong set đồ cho dịp ${occasion}!`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Đã xảy ra lỗi khi tạo outfit. Hãy thử lại.', 'error');
    } finally {
      setIsLoadingStylist(false);
    }
  };

  // --- OUTFIT ACTIONS ---
  const handleToggleSaveOutfit = (target: Outfit) => {
    const updated = outfits.map((o) => {
      if (o.id === target.id) {
        const nextState = !o.isSaved;
        showToast(nextState ? 'Đã lưu outfit vào bộ sưu tập cá nhân' : 'Đã bỏ lưu outfit', 'info');
        return { ...o, isSaved: nextState };
      }
      return o;
    });
    setOutfits(updated);
    if (currentOutfit?.id === target.id) {
      setCurrentOutfit({ ...currentOutfit, isSaved: !currentOutfit.isSaved });
    }
  };

  const handleToggleFavoriteOutfit = (target: Outfit) => {
    const updated = outfits.map((o) => {
      if (o.id === target.id) {
        const nextState = !o.isFavorite;
        showToast(nextState ? 'Đã thêm outfit vào danh sách yêu thích' : 'Đã bỏ yêu thích', 'info');
        return { ...o, isFavorite: nextState };
      }
      return o;
    });
    setOutfits(updated);
    if (currentOutfit?.id === target.id) {
      setCurrentOutfit({ ...currentOutfit, isFavorite: !currentOutfit.isFavorite });
    }
  };

  const handleWearToday = (target: Outfit) => {
    // 1. Record wear history
    const newRecord: WearHistoryItem = {
      id: 'hist_' + Date.now(),
      outfitId: target.id,
      outfitTitle: target.title,
      date: new Date().toLocaleDateString('vi-VN'),
      occasion: target.occasion,
      notes: `Đã chọn mặc với thời tiết ${weather.temp}°C tại ${weather.city}`,
    };
    const updatedHistory = recordWearHistory(newRecord);
    setWearHistory(updatedHistory);

    // 2. Increment wear count for each piece from wardrobe
    const wardrobeIds = target.items.filter((i) => i.isFromWardrobe).map((i) => i.id);
    setWardrobe((prev) =>
      prev.map((item) => {
        if (wardrobeIds.includes(item.id)) {
          return { ...item, wearCount: item.wearCount + 1 };
        }
        return item;
      })
    );

    // 3. Mark in calendar for today
    setCalendarDays((prev) =>
      prev.map((day, idx) => {
        if (idx === 0) { // Monday or first active day
          return { ...day, assignedOutfitId: target.id, isWorn: true };
        }
        return day;
      })
    );

    showToast(`Đã ghi nhận outfit cho ngày hôm nay!`, 'success');
  };

  // --- WARDROBE ACTIONS ---
  const handleAddWardrobeItem = (item: WardrobeItem) => {
    setWardrobe((prev) => [item, ...prev]);
    showToast(`Đã thêm "${item.name}" vào tủ đồ!`, 'success');
  };

  const handleUpdateWardrobeItem = (item: WardrobeItem) => {
    setWardrobe((prev) => prev.map((w) => (w.id === item.id ? item : w)));
    showToast(`Đã cập nhật món đồ "${item.name}"`, 'success');
  };

  const handleDeleteWardrobeItem = (id: string) => {
    const itemToDelete = wardrobe.find(w => w.id === id);
    setWardrobe((prev) => prev.filter((w) => w.id !== id));
    showToast(`Đã xóa món đồ "${itemToDelete?.name || ''}" khỏi tủ`, 'info');
  };

  const handleToggleFavoriteWardrobe = (id: string) => {
    setWardrobe((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          return { ...w, isFavorite: !w.isFavorite };
        }
        return w;
      })
    );
  };

  // --- CALENDAR ACTIONS ---
  const handleUpdateCalendarDay = (day: CalendarDayPlan) => {
    setCalendarDays((prev) => prev.map((d) => (d.id === day.id ? day : d)));
    showToast(`Đã cập nhật kế hoạch cho ${day.dayOfWeek}`, 'info');
  };

  const handleGenerateOutfitForDay = (dayId: string, occasion: Occasion) => {
    handleAskWhatToWear(occasion);
    setCalendarDays((prev) =>
      prev.map((d) => {
        if (d.id === dayId) {
          return { ...d, occasion, isWorn: false };
        }
        return d;
      })
    );
  };

  // --- RESET & ONBOARDING ---
  const handleCompleteOnboarding = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setSelectedCity(updatedProfile.city);
    setForceShowOnboarding(false);
    showToast(`Chào mừng ${updatedProfile.name}! GUSTYLE đã sẵn sàng.`, 'success');
  };

  const handleResetAllData = () => {
    resetAppToDefaults();
    const defaultProfile = loadUserProfile();
    setProfile(defaultProfile);
    setWardrobe(loadWardrobeItems());
    setOutfits(loadOutfits());
    setCalendarDays(loadCalendarDays());
    setWearHistory(loadWearHistory());
    setForceShowOnboarding(true);
    showToast('Đã khôi phục dữ liệu ban đầu', 'info');
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-stone-900 flex flex-col selection:bg-pink-100 selection:text-pink-900">
      
      {/* Universal Top Header */}
      <Header
        profile={profile}
        weather={weather}
        theme={theme}
        onSelectCity={(c) => {
          setSelectedCity(c);
          showToast(`Đã cập nhật thời tiết tại ${c}`, 'info');
        }}
        onOpenProfile={() => setActiveTab('profile')}
        isLoggedIn={isLoggedIn}
        onToggleLogin={() => {
          setIsLoggedIn(!isLoggedIn);
          showToast(!isLoggedIn ? 'Đã đăng nhập tài khoản GUSTYLE' : 'Đã đăng xuất tài khoản', 'info');
        }}
        onOpenAuth={() => setActiveTab('profile')}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5">
        
        {/* TAB 1: TRANG CHỦ */}
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            wardrobe={wardrobe}
            currentOutfit={currentOutfit}
            weather={weather}
            theme={theme}
            isLoading={isLoadingStylist}
            onAskWhatToWear={handleAskWhatToWear}
            onToggleSaveOutfit={handleToggleSaveOutfit}
            onToggleFavoriteOutfit={handleToggleFavoriteOutfit}
            onWearToday={handleWearToday}
            onOpenWardrobe={() => setActiveTab('wardrobe')}
          />
        )}

        {/* TAB 2: TỦ ĐỒ */}
        {activeTab === 'wardrobe' && (
          <WardrobeView
            wardrobe={wardrobe}
            theme={theme}
            onAddItem={handleAddWardrobeItem}
            onUpdateItem={handleUpdateWardrobeItem}
            onDeleteItem={handleDeleteWardrobeItem}
            onToggleFavorite={handleToggleFavoriteWardrobe}
          />
        )}

        {/* TAB 3: HÔM NAY (CALENDAR) */}
        {activeTab === 'today' && (
          <CalendarView
            days={calendarDays}
            outfits={outfits}
            profile={profile}
            wardrobe={wardrobe}
            weather={weather}
            theme={theme}
            onUpdateDay={handleUpdateCalendarDay}
            onGenerateOutfitForDay={handleGenerateOutfitForDay}
            onViewOutfitDetails={(o) => setInspectingOutfit(o)}
          />
        )}

        {/* TAB 4: OUTFIT AI */}
        {activeTab === 'outfitAi' && (
          <OutfitAiView
            outfits={outfits}
            wardrobe={wardrobe}
            profile={profile}
            weather={weather}
            theme={theme}
            isLoading={isLoadingStylist}
            onGenerateOutfit={(style, occ, seed, prompt) => handleAskWhatToWear(occ || 'Đi làm', prompt, seed, style)}
            onToggleSave={handleToggleSaveOutfit}
            onToggleFavorite={handleToggleFavoriteOutfit}
            onWearOutfit={handleWearToday}
          />
        )}

        {/* TAB 5: CÁ NHÂN */}
        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            savedOutfits={outfits.filter((o) => o.isSaved)}
            favoriteOutfits={outfits.filter((o) => o.isFavorite)}
            wearHistory={wearHistory}
            theme={theme}
            onUpdateProfile={(p) => {
              setProfile(p);
              showToast('Đã lưu hồ sơ và cập nhật màu sắc theme!', 'success');
            }}
            onRestartOnboarding={() => setForceShowOnboarding(true)}
            onResetAllData={handleResetAllData}
            onSelectOutfit={(o) => setInspectingOutfit(o)}
          />
        )}

      </main>

      {/* Fixed 5-Item Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        theme={theme}
      />

      {/* Onboarding Flow (Shows on first open or manual trigger) */}
      {forceShowOnboarding && (
        <OnboardingModal
          initialProfile={profile}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Outfit Modal Detail Inspector */}
      {inspectingOutfit && (
        <OutfitModal
          outfit={inspectingOutfit}
          theme={theme}
          onClose={() => setInspectingOutfit(null)}
          onToggleSave={handleToggleSaveOutfit}
          onToggleFavorite={handleToggleFavoriteOutfit}
          onWearToday={handleWearToday}
        />
      )}

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

    </div>
  );
}
