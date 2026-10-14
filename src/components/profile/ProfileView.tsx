import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bookmark, 
  Heart, 
  Clock, 
  Edit3, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  Check, 
  Trash2,
  Calendar,
  Layers,
  Pencil,
  Camera
} from 'lucide-react';
import { UserProfile, Outfit, WearHistoryItem, ThemeTokens, Gender, FashionStyle } from '../../types';
import { AvatarModal } from './AvatarModal';

interface ProfileViewProps {
  profile: UserProfile;
  savedOutfits: Outfit[];
  favoriteOutfits: Outfit[];
  wearHistory: WearHistoryItem[];
  theme: ThemeTokens;
  onUpdateProfile: (updated: UserProfile) => void;
  onRestartOnboarding: () => void;
  onResetAllData: () => void;
  onSelectOutfit: (outfit: Outfit) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  savedOutfits,
  favoriteOutfits,
  wearHistory,
  theme,
  onUpdateProfile,
  onRestartOnboarding,
  onResetAllData,
  onSelectOutfit,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'favorites' | 'history'>('saved');
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Edit fields
  const [editName, setEditName] = useState<string>(profile.name);
  const [editGender, setEditGender] = useState<Gender>(profile.gender);
  const [editAge, setEditAge] = useState<number>(profile.age);
  const [editHeight, setEditHeight] = useState<number>(profile.height);
  const [editWeight, setEditWeight] = useState<number>(profile.weight);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: editName.trim() || profile.name,
      gender: editGender,
      age: editAge,
      height: editHeight,
      weight: editWeight,
    });
    setIsEditModalOpen(false);
  };

  const handleSaveAvatar = (newAvatarUrl: string) => {
    onUpdateProfile({
      ...profile,
      avatarUrl: newAvatarUrl,
    });
  };

  const genderLabels: Record<Gender, string> = {
    female: 'Nữ',
    male: 'Nam',
    other: 'Khác',
    undisclosed: 'Không tiết lộ',
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* 1. Profile Summary Card */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          
          {/* Avatar with compact pencil edit button */}
          <div className="relative shrink-0 group">
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform active:scale-95"
              title="Nhấn để đổi ảnh đại diện"
              aria-label="Đổi ảnh đại diện"
            >
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-2 shadow-sm transition-opacity group-hover:opacity-95"
                style={{ borderColor: theme.primary }}
              />
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5 drop-shadow-md" />
              </div>
            </button>

            {/* Compact Pencil Edit Button at bottom-right corner */}
            <button
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shadow-md border-2 border-white hover:scale-110 active:scale-95 transition-all focus:outline-none"
              style={{ backgroundColor: theme.primary }}
              title="Đổi ảnh đại diện"
              aria-label="Chỉnh sửa avatar"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">
                  {profile.name || 'Người dùng GUSTYLE'}
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Thành viên GUSTYLE • {profile.city}, {profile.country}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-end gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 focus:outline-none transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Đổi avatar</span>
                </button>
                <button
                  onClick={() => {
                    setEditName(profile.name);
                    setEditGender(profile.gender);
                    setEditAge(profile.age);
                    setEditHeight(profile.height);
                    setEditWeight(profile.weight);
                    setIsEditModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 focus:outline-none transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa hồ sơ</span>
                </button>
              </div>
            </div>

            {/* Body Info Chips (Respectful, practical styling indicators) */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-4">
              <span className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                Giới tính: <strong>{genderLabels[profile.gender]}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                Tuổi: <strong>{profile.age}</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                Chiều cao: <strong>{profile.height} cm</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-700">
                Cân nặng: <strong>{profile.weight} kg</strong>
              </span>
            </div>

            {/* Favorite Styles */}
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              <span className="text-[11px] font-semibold text-stone-400 mr-1">Phong cách yêu thích:</span>
              {profile.favoriteStyles.map((style) => (
                <span
                  key={style}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                  style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                >
                  {style}
                </span>
              ))}
            </div>

          </div>

        </div>

        {/* Dynamic theme banner indicator */}
        <div 
          className="mt-5 p-3 rounded-xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
            <span className="text-stone-700">
              Theme đang áp dụng: <strong>{theme.name}</strong> (Tự động thích ứng theo giới tính và độ tuổi)
            </span>
          </div>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-[11px] font-bold hover:underline"
            style={{ color: theme.primary }}
          >
            Đổi màu sắc theme →
          </button>
        </div>

      </section>

      {/* 2. Stats Summary Grid */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
          <div className="text-2xl font-black text-stone-900">{savedOutfits.length}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5">Outfit đã lưu</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
          <div className="text-2xl font-black text-rose-600">{favoriteOutfits.length}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5">Outfit yêu thích</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 text-center">
          <div className="text-2xl font-black text-emerald-600">{wearHistory.length}</div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5">Lần đã mặc</div>
        </div>
      </section>

      {/* 3. Outfits & History Tabs */}
      <section className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        
        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200">
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'saved' ? 'border-pink-600 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
            style={{ borderColor: activeTab === 'saved' ? theme.primary : 'transparent' }}
          >
            <Bookmark className="w-4 h-4" />
            <span>Đã lưu ({savedOutfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'favorites' ? 'border-pink-600 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
            style={{ borderColor: activeTab === 'favorites' ? theme.primary : 'transparent' }}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Yêu thích ({favoriteOutfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'history' ? 'border-pink-600 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
            style={{ borderColor: activeTab === 'history' ? theme.primary : 'transparent' }}
          >
            <Clock className="w-4 h-4" />
            <span>Lịch sử mặc ({wearHistory.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          
          {/* TAB 1: SAVED OUTFITS */}
          {activeTab === 'saved' && (
            <div>
              {savedOutfits.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Chưa có outfit nào được lưu. Hãy nhấn biểu tượng bookmark ở Trang chủ hoặc Outfit AI để lưu lại nhé.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      onClick={() => onSelectOutfit(outfit)}
                      className="p-3 rounded-xl border border-stone-200 hover:border-stone-300 flex items-center gap-3 cursor-pointer group transition-all bg-stone-50/40"
                    >
                      <img
                        src={outfit.imageUrl}
                        alt={outfit.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200"
                      />
                      <div className="min-w-0 flex-1">
                        <span 
                          className="px-2 py-0.5 rounded text-[9px] font-bold inline-block mb-1"
                          style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                        >
                          {outfit.style} • {outfit.occasion}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate group-hover:text-stone-900">
                          {outfit.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {outfit.weatherSuitability}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FAVORITES */}
          {activeTab === 'favorites' && (
            <div>
              {favoriteOutfits.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Chưa có outfit yêu thích nào. Hãy nhấn biểu tượng trái tim để đưa vào mục yêu thích.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteOutfits.map((outfit) => (
                    <div
                      key={outfit.id}
                      onClick={() => onSelectOutfit(outfit)}
                      className="p-3 rounded-xl border border-stone-200 hover:border-stone-300 flex items-center gap-3 cursor-pointer group transition-all bg-stone-50/40"
                    >
                      <img
                        src={outfit.imageUrl}
                        alt={outfit.title}
                        className="w-16 h-16 rounded-lg object-cover shrink-0 border border-stone-200"
                      />
                      <div className="min-w-0 flex-1">
                        <span 
                          className="px-2 py-0.5 rounded text-[9px] font-bold inline-block mb-1"
                          style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                        >
                          {outfit.style}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-stone-800 truncate group-hover:text-stone-900">
                          {outfit.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {outfit.reason}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEAR HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {wearHistory.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Chưa có nhật ký mặc đồ. Khi bạn chọn "Mặc hôm nay", lịch sử sẽ tự động được ghi nhận.
                </div>
              ) : (
                wearHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-stone-800">{item.outfitTitle}</h4>
                      <p className="text-stone-500 mt-0.5">Dịp: {item.occasion} {item.notes && `• "${item.notes}"`}</p>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium shrink-0">
                      {item.date}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </section>

      {/* 4. App Reset & Settings Actions */}
      <section className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-stone-800">Cài đặt ứng dụng</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRestartOnboarding}
            className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5 focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mở lại màn hình thiết lập (Onboarding)</span>
          </button>

          <button
            onClick={onResetAllData}
            className="px-4 py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5 focus:outline-none"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Đặt lại toàn bộ dữ liệu mẫu</span>
          </button>
        </div>
      </section>

      {/* Edit Profile Modal with Live Theme Color Adjustment */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            
            <div 
              className="p-5 border-b border-stone-100 flex items-center justify-between"
              style={{ backgroundColor: theme.primaryBg }}
            >
              <h3 className="text-base font-bold text-stone-900">
                Chỉnh sửa thông tin & Theme cá nhân
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none text-stone-800"
                />
              </div>

              {/* Gender selector - immediately affects palette */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Giới tính (Điều chỉnh theme màu sắc)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'female' as Gender, label: 'Nữ (Hồng pastel)' },
                    { id: 'male' as Gender, label: 'Nam (Xanh mint)' },
                    { id: 'other' as Gender, label: 'Khác (Cân bằng)' },
                    { id: 'undisclosed' as Gender, label: 'Không tiết lộ' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setEditGender(g.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        editGender === g.id ? 'ring-2 ring-pink-500 font-bold' : 'border-stone-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age slider - adjusts saturation & readability */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Tuổi: {editAge}</span>
                  <span className="text-stone-400 font-normal">
                    {editAge < 25 ? 'Tươi hơn, nhiều pastel' : editAge <= 45 ? 'Dịu, thanh lịch' : 'Tương phản tốt, dễ đọc'}
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="75"
                  value={editAge}
                  onChange={(e) => setEditAge(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    value={editHeight}
                    onChange={(e) => setEditHeight(parseInt(e.target.value, 10) || 160)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(parseInt(e.target.value, 10) || 50)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: theme.primary }}
                >
                  Lưu & Áp dụng Theme
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Avatar Modal */}
      {isAvatarModalOpen && (
        <AvatarModal
          currentAvatarUrl={profile.avatarUrl}
          theme={theme}
          onSave={handleSaveAvatar}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      )}

    </div>
  );
};
