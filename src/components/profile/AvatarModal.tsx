import React, { useState } from 'react';
import { X, Upload, Check, RotateCcw, Trash2, Camera, Sparkles } from 'lucide-react';
import { AVATAR_PRESETS, DEFAULT_AVATAR_URL } from '../../data/mockData';
import { ThemeTokens } from '../../types';

interface AvatarModalProps {
  currentAvatarUrl?: string;
  theme: ThemeTokens;
  onSave: (newUrl: string) => void;
  onClose: () => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  currentAvatarUrl,
  theme,
  onSave,
  onClose,
}) => {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatarUrl || DEFAULT_AVATAR_URL);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetDefault = () => {
    setSelectedUrl(DEFAULT_AVATAR_URL);
  };

  const handleRemoveAvatar = () => {
    // Generate a clean minimalist monogram avatar
    setSelectedUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');
  };

  const handleConfirm = () => {
    onSave(selectedUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div 
          className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between"
          style={{ backgroundColor: theme.primaryBg }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: theme.primary }}
            >
              <Camera className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-base font-bold text-stone-900">
              Đổi Ảnh Đại Diện
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Live Preview Area */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative group">
              <img
                src={selectedUrl}
                alt="Avatar preview"
                className="w-28 h-28 rounded-full object-cover shadow-md border-4 transition-all"
                style={{ borderColor: theme.primary }}
              />
              <span className="absolute -bottom-1.5 right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-900 text-white shadow-xs">
                Xem trước
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-3 text-center">
              Ảnh đại diện sẽ hiển thị ở trang cá nhân và thanh tiêu đề ứng dụng
            </p>
          </div>

          {/* Action 1: Upload from device */}
          <div>
            <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl border border-dashed border-stone-300 hover:border-stone-400 bg-stone-50/70 hover:bg-stone-50 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700 transition-colors">
              <Upload className="w-4 h-4 text-stone-500" />
              <span>Tải ảnh mới từ thiết bị</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Action 2: Choose from curated presets */}
          <div>
            <span className="block text-xs font-bold text-stone-700 mb-2">
              Hoặc chọn ảnh đại diện có sẵn:
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1 border border-stone-100 rounded-xl bg-stone-50/50">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setSelectedUrl(preset.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group focus:outline-none ${
                      isSelected ? 'scale-105 shadow-xs' : 'opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                    style={{
                      borderColor: isSelected ? theme.primary : 'transparent',
                    }}
                    title={preset.label}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div 
                        className="absolute inset-0 bg-black/25 flex items-center justify-center text-white"
                      >
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick utility buttons: Default or Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Dùng avatar mặc định</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveAvatar}
              className="text-stone-400 hover:text-rose-600 flex items-center gap-1 focus:outline-none"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa avatar</span>
            </button>
          </div>

          {/* Confirm & Cancel Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2 rounded-xl text-white text-xs font-bold shadow-sm flex items-center gap-1.5 hover:opacity-95"
              style={{ backgroundColor: theme.primary }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Xác nhận thay đổi</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
