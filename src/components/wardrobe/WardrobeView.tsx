import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Upload, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { WardrobeItem, WardrobeCategory, FashionStyle, ThemeTokens } from '../../types';
import { getCategoryPlaceholder } from '../../utils/imageFallbacks';

interface WardrobeViewProps {
  wardrobe: WardrobeItem[];
  theme: ThemeTokens;
  onAddItem: (item: WardrobeItem) => void;
  onUpdateItem: (item: WardrobeItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const CATEGORIES: ('Tất cả' | WardrobeCategory)[] = [
  'Tất cả',
  'Áo',
  'Quần',
  'Váy',
  'Đầm',
  'Áo khoác',
  'Giày',
  'Túi',
  'Mũ',
  'Phụ kiện',
];

const PRESET_STYLES: FashionStyle[] = [
  'Minimal',
  'Smart Casual',
  'Casual',
  'Office',
  'Feminine',
  'Elegant',
  'Streetwear',
  'Vintage',
  'Sporty',
];

const PRESET_COLORS = [
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Đen', hex: '#18181B' },
  { name: 'Be', hex: '#E5D3B3' },
  { name: 'Kem', hex: '#FBF5EE' },
  { name: 'Xám', hex: '#94A3B8' },
  { name: 'Hồng pastel', hex: '#FCE7F3' },
  { name: 'Xanh pastel', hex: '#BAE6FD' },
  { name: 'Nâu', hex: '#854D0E' },
  { name: 'Xanh navy', hex: '#1E3A8A' },
  { name: 'Đỏ rượu', hex: '#881337' },
];

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80',
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  wardrobe,
  theme,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleFavorite,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'Tất cả' | WardrobeCategory>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

  // Form fields
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<WardrobeCategory>('Áo');
  const [color, setColor] = useState<string>('Trắng');
  const [material, setMaterial] = useState<string>('Cotton');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [style, setStyle] = useState<FashionStyle>('Minimal');
  const [season, setSeason] = useState<'Xuân - Hè' | 'Thu - Đông' | '4 Mùa'>('4 Mùa');
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_PHOTO_PRESETS[0]);
  const [notes, setNotes] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setCategory('Áo');
    setColor('Trắng');
    setMaterial('Cotton');
    setImageDescription('');
    setStyle('Minimal');
    setSeason('4 Mùa');
    setImageUrl(SAMPLE_PHOTO_PRESETS[Math.floor(Math.random() * SAMPLE_PHOTO_PRESETS.length)]);
    setNotes('');
    setIsFavorite(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: WardrobeItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setColor(item.color);
    setMaterial(item.material || '');
    setImageDescription(item.imageDescription || '');
    setStyle(item.style);
    setSeason(item.season);
    setImageUrl(item.imageUrl);
    setNotes(item.notes || '');
    setIsFavorite(item.isFavorite);
    setIsModalOpen(true);
  };

  const CATEGORY_PREFIX_MAP: Record<WardrobeCategory, string> = {
    'Áo': 'AO',
    'Quần': 'QUAN',
    'Váy': 'VAY',
    'Đầm': 'DAM',
    'Áo khoác': 'AK',
    'Giày': 'GIAY',
    'Túi': 'TUI',
    'Mũ': 'MU',
    'Phụ kiện': 'PK',
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      const updated: WardrobeItem = {
        ...editingItem,
        name: name.trim(),
        category,
        color,
        material: material.trim() || undefined,
        imageDescription: imageDescription.trim() || undefined,
        style,
        season,
        imageUrl,
        notes: notes.trim() || undefined,
        isFavorite,
      };
      onUpdateItem(updated);
    } else {
      const prefix = CATEGORY_PREFIX_MAP[category] || 'ITEM';
      const count = wardrobe.filter(w => w.id.startsWith(prefix)).length + 1;
      const newId = `${prefix}-${String(count).padStart(3, '0')}`;

      const newItem: WardrobeItem = {
        id: newId,
        name: name.trim(),
        category,
        color,
        material: material.trim() || undefined,
        imageDescription: imageDescription.trim() || undefined,
        style,
        season,
        wearCount: 0,
        isFavorite,
        imageUrl: imageUrl.trim() || SAMPLE_PHOTO_PRESETS[0],
        notes: notes.trim() || undefined,
        dateAdded: new Date().toISOString().split('T')[0],
      };
      onAddItem(newItem);
    }
    setIsModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImageUrl(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered items
  const filteredItems = wardrobe.filter((item) => {
    const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchFavorite = !onlyFavorites || item.isFavorite;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = 
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.id.toLowerCase().includes(query) ||
      item.color.toLowerCase().includes(query) ||
      item.style.toLowerCase().includes(query) ||
      (item.material && item.material.toLowerCase().includes(query)) ||
      (item.imageDescription && item.imageDescription.toLowerCase().includes(query));
    return matchCategory && matchFavorite && matchSearch;
  });

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Tủ Đồ Cá Nhân
          </h1>
          <p className="text-xs text-stone-500">
            Tổng cộng {wardrobe.length} món đồ sẵn sàng để phối đồ
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all focus:outline-none hover:opacity-95 self-start sm:self-auto"
          style={{ backgroundColor: theme.primary }}
        >
          <Plus className="w-4 h-4" />
          <span>Thêm món đồ</span>
        </button>
      </div>

      {/* Filter and Search controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
        
        {/* Search input + Favorites toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên, màu sắc, phong cách..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 focus:outline-none text-stone-800"
              style={{ borderColor: searchQuery ? theme.primary : undefined }}
            />
          </div>

          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all focus:outline-none ${
              onlyFavorites ? 'text-white border-transparent' : 'text-stone-600 border-stone-200 bg-stone-50'
            }`}
            style={{
              backgroundColor: onlyFavorites ? theme.primary : undefined,
            }}
          >
            <Heart 
              className="w-3.5 h-3.5" 
              style={{ fill: onlyFavorites ? '#ffffff' : 'none' }} 
            />
            <span>Đã thích ({wardrobe.filter(w => w.isFavorite).length})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'Tất cả' 
              ? wardrobe.length 
              : wardrobe.filter(w => w.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all focus:outline-none border flex items-center gap-1.5"
                style={{
                  borderColor: isSelected ? theme.primary : '#e5e7eb',
                  backgroundColor: isSelected ? theme.primary : '#ffffff',
                  color: isSelected ? '#ffffff' : '#374151',
                }}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/30 text-white' : 'bg-stone-100 text-stone-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200">
          <div 
            className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3"
            style={{ backgroundColor: theme.primaryLight, color: theme.primary }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-1">
            Không tìm thấy món đồ phù hợp
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">
            {wardrobe.length === 0 
              ? 'Tủ đồ của bạn đang trống. Hãy thêm món đồ đầu tiên để GUSTYLE bắt đầu phối đồ nhé.' 
              : 'Hãy thử thay đổi danh mục hoặc từ khóa tìm kiếm.'}
          </p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm focus:outline-none"
            style={{ backgroundColor: theme.primary }}
          >
            Thêm đồ vào tủ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <article 
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="aspect-square relative overflow-hidden bg-stone-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(item.category, item.color);
                    }}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* ID & Category Tag */}
                  <div className="absolute top-2 left-2 flex items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-white font-mono text-[9px] font-bold tracking-tight">
                      {item.id}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm text-stone-800 text-[9px] font-semibold">
                      {item.category}
                    </span>
                  </div>

                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    aria-label="Yêu thích món đồ"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 transition-colors shadow-sm focus:outline-none"
                  >
                    <Heart 
                      className="w-3.5 h-3.5" 
                      style={{
                        fill: item.isFavorite ? '#e11d48' : 'none',
                        color: item.isFavorite ? '#e11d48' : undefined
                      }} 
                    />
                  </button>
                  
                  {/* Wear count badge */}
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-white/90 text-stone-700 text-[10px] font-semibold backdrop-blur-xs">
                    Đã mặc: {item.wearCount} lần
                  </span>
                </div>

                {/* Details */}
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug line-clamp-1 mb-1" title={item.name}>
                    {item.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-stone-500 mb-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full border border-stone-300" style={{ backgroundColor: item.colorHex || '#ccc' }} />
                      {item.color}
                    </span>
                    <span>•</span>
                    <span>{item.style}</span>
                    <span>•</span>
                    <span>{item.season}</span>
                  </div>

                  {item.material && (
                    <div className="text-[10px] text-stone-600 mb-1.5 flex items-center gap-1">
                      <span className="font-semibold text-stone-500">Chất liệu:</span>
                      <span className="px-1.5 py-0.2 bg-stone-100 rounded text-stone-700 font-medium">{item.material}</span>
                    </div>
                  )}

                  {item.imageDescription && (
                    <details className="text-[10px] text-stone-500 mb-1.5 group/desc">
                      <summary className="cursor-pointer text-stone-400 hover:text-stone-700 font-medium select-none list-none flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        <span>Mô tả ảnh chuẩn</span>
                      </summary>
                      <p className="mt-1 p-1.5 rounded bg-stone-50 border border-stone-200/60 text-[10px] text-stone-600 leading-relaxed italic">
                        {item.imageDescription}
                      </p>
                    </details>
                  )}

                  {item.notes && (
                    <p className="text-[10px] text-stone-500 italic line-clamp-2 bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-2.5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg text-xs flex items-center gap-1 focus:outline-none transition-colors"
                  title="Chỉnh sửa món đồ"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs flex items-center gap-1 focus:outline-none transition-colors"
                  title="Xóa khỏi tủ đồ"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>

            </article>
          ))}
        </div>
      )}

      {/* Modal: Thêm / Sửa Món Đồ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            
            <div 
              className="p-5 border-b border-stone-100 flex items-center justify-between"
              style={{ backgroundColor: theme.primaryBg }}
            >
              <h2 className="text-lg font-bold text-stone-900">
                {editingItem ? 'Chỉnh sửa món đồ' : 'Thêm món đồ vào tủ'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Photo selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Ảnh món đồ
                </label>
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = getCategoryPlaceholder(category, color);
                    }}
                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 bg-stone-50 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Tải ảnh từ máy</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-stone-400">
                      Hoặc chọn ảnh mẫu nhanh bên dưới:
                    </p>
                  </div>
                </div>

                {/* Preset image selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {SAMPLE_PHOTO_PRESETS.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(src)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-transform ${
                        imageUrl === src ? 'scale-105 border-pink-600' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={src} alt="sample" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên món đồ *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Áo len cổ lọ màu be"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none text-stone-800"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WardrobeCategory)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none bg-white text-stone-800"
                  >
                    {CATEGORIES.filter(c => c !== 'Tất cả').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mùa thích hợp
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none bg-white text-stone-800"
                  >
                    <option value="4 Mùa">4 Mùa</option>
                    <option value="Xuân - Hè">Xuân - Hè</option>
                    <option value="Thu - Đông">Thu - Đông</option>
                  </select>
                </div>
              </div>

              {/* Style & Color */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phong cách
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as FashionStyle)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none bg-white text-stone-800"
                  >
                    {PRESET_STYLES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Màu sắc
                  </label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none bg-white text-stone-800"
                  >
                    {PRESET_COLORS.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Chất liệu vải / Da
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ví dụ: Linen mộc, Cotton poplin, Dạ tweed, Lụa satin, Da PU..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none text-stone-800"
                />
              </div>

              {/* Image Description (Quy chuẩn hình ảnh) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mô tả hình ảnh sản phẩm (Studio spec)
                </label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  rows={2}
                  placeholder="Mô tả chi tiết form dáng, màu sắc, chi tiết sản phẩm studio chuẩn xác..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none text-stone-800"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ghi chú riêng
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ví dụ: Vải lanh thoáng khí, cạp cao tôn dáng..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none text-stone-800"
                />
              </div>

              {/* Favorite toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="modal-fav"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded border-stone-300 text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="modal-fav" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  Đánh dấu là món đồ yêu thích
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-white text-xs font-bold shadow-sm hover:opacity-95"
                  style={{ backgroundColor: theme.primary }}
                >
                  {editingItem ? 'Lưu thay đổi' : 'Thêm vào tủ'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
