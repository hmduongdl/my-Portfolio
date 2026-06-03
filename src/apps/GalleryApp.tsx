import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Images, X, ChevronLeft, ChevronRight, ZoomIn, Heart, Download, Grid3X3, LayoutGrid } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  src: string;
  thumb: string;
  title: string;
  caption: string;
  category: string;
  width: number;
  height: number;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  count: number;
}

// ─── Demo Photo Data (Unsplash) ──────────────────────────────────────────────

const DEMO_PHOTOS: Photo[] = [
  // Phong cảnh
  {
    id: 'p1', category: 'landscape',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70',
    title: 'Đỉnh núi trong sương',
    caption: 'Phong cảnh thiên nhiên hùng vĩ',
    width: 4, height: 3,
  },
  {
    id: 'p2', category: 'landscape',
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=70',
    title: 'Rừng xanh mát',
    caption: 'Cánh rừng nhiệt đới xanh ngát',
    width: 4, height: 3,
  },
  {
    id: 'p3', category: 'landscape',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70',
    title: 'Ánh nắng xuyên cây',
    caption: 'Tia nắng sớm chiếu qua tán lá',
    width: 4, height: 5,
  },
  {
    id: 'p4', category: 'landscape',
    src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=70',
    title: 'Đồng cỏ hoàng hôn',
    caption: 'Bầu trời vàng rực lúc chiều tà',
    width: 4, height: 3,
  },
  {
    id: 'p5', category: 'landscape',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=70',
    title: 'Hồ nước tĩnh lặng',
    caption: 'Mặt hồ phản chiếu bầu trời',
    width: 4, height: 3,
  },

  // Kiến trúc
  {
    id: 'a1', category: 'architecture',
    src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70',
    title: 'Tòa nhà hiện đại',
    caption: 'Kiến trúc đương đại ấn tượng',
    width: 3, height: 4,
  },
  {
    id: 'a2', category: 'architecture',
    src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=70',
    title: 'Mặt tiền kính',
    caption: 'Kính phản chiếu bầu trời xanh',
    width: 3, height: 4,
  },
  {
    id: 'a3', category: 'architecture',
    src: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=400&q=70',
    title: 'Cầu thang xoắn',
    caption: 'Đường nét hình học tinh tế',
    width: 4, height: 3,
  },
  {
    id: 'a4', category: 'architecture',
    src: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=400&q=70',
    title: 'Đền cổ điển',
    caption: 'Kiến trúc cổ kính châu Âu',
    width: 4, height: 3,
  },

  // Chân dung
  {
    id: 'pt1', category: 'portrait',
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=70',
    title: 'Ánh mắt',
    caption: 'Chân dung nghệ thuật ánh sáng tự nhiên',
    width: 3, height: 4,
  },
  {
    id: 'pt2', category: 'portrait',
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=70',
    title: 'Nụ cười tươi',
    caption: 'Chân dung ngoài trời nắng đẹp',
    width: 3, height: 4,
  },
  {
    id: 'pt3', category: 'portrait',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70',
    title: 'Phong cách đường phố',
    caption: 'Street style chụp tự nhiên',
    width: 3, height: 4,
  },

  // Công nghệ
  {
    id: 't1', category: 'technology',
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70',
    title: 'Mạch điện tử',
    caption: 'Vi mạch bo mạch chủ macro',
    width: 4, height: 3,
  },
  {
    id: 't2', category: 'technology',
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=70',
    title: 'Bảo mật mạng',
    caption: 'Hệ thống an ninh mạng hiện đại',
    width: 4, height: 3,
  },
  {
    id: 't3', category: 'technology',
    src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=70',
    title: 'Lập trình viên',
    caption: 'Dòng code chạy trên màn hình',
    width: 4, height: 3,
  },
  {
    id: 't4', category: 'technology',
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=70',
    title: 'Không gian làm việc',
    caption: 'Setup bàn làm việc công nghệ',
    width: 4, height: 3,
  },

  // Du lịch
  {
    id: 'tr1', category: 'travel',
    src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&q=70',
    title: 'Thuyền trên hồ',
    caption: 'Du thuyền giữa hồ nước xanh biếc',
    width: 4, height: 3,
  },
  {
    id: 'tr2', category: 'travel',
    src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&q=70',
    title: 'Bản đồ hành trình',
    caption: 'Lên kế hoạch khám phá thế giới',
    width: 4, height: 3,
  },
  {
    id: 'tr3', category: 'travel',
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=70',
    title: 'Con đường phiêu lưu',
    caption: 'Road trip trên xa lộ tuyệt đẹp',
    width: 4, height: 3,
  },
  {
    id: 'tr4', category: 'travel',
    src: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=400&q=70',
    title: 'Bãi biển hoàng hôn',
    caption: 'Ngắm hoàng hôn trên bãi biển',
    width: 4, height: 3,
  },

  // Ẩm thực
  {
    id: 'f1', category: 'food',
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70',
    title: 'Bàn tiệc',
    caption: 'Ẩm thực tinh hoa trình bày đẹp mắt',
    width: 4, height: 3,
  },
  {
    id: 'f2', category: 'food',
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=70',
    title: 'Salad tươi mát',
    caption: 'Món ăn healthy đầy màu sắc',
    width: 4, height: 3,
  },
  {
    id: 'f3', category: 'food',
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=70',
    title: 'Pizza nóng hổi',
    caption: 'Bánh pizza phô mai hấp dẫn',
    width: 4, height: 3,
  },
];

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  { id: 'all',          label: 'Tất cả ảnh',     icon: '🖼️', count: DEMO_PHOTOS.length },
  { id: 'landscape',    label: 'Phong cảnh',      icon: '🏔️', count: DEMO_PHOTOS.filter(p => p.category === 'landscape').length },
  { id: 'architecture', label: 'Kiến trúc',       icon: '🏛️', count: DEMO_PHOTOS.filter(p => p.category === 'architecture').length },
  { id: 'portrait',     label: 'Chân dung',       icon: '👤', count: DEMO_PHOTOS.filter(p => p.category === 'portrait').length },
  { id: 'technology',   label: 'Công nghệ',       icon: '💻', count: DEMO_PHOTOS.filter(p => p.category === 'technology').length },
  { id: 'travel',       label: 'Du lịch',         icon: '✈️', count: DEMO_PHOTOS.filter(p => p.category === 'travel').length },
  { id: 'food',         label: 'Ẩm thực',         icon: '🍜', count: DEMO_PHOTOS.filter(p => p.category === 'food').length },
  { id: 'favorites',    label: 'Yêu thích',       icon: '❤️', count: 0 },
];

// ─── Photo Card ──────────────────────────────────────────────────────────────

const PhotoCard: React.FC<{
  photo: Photo;
  onClick: () => void;
  onToggleFav: (id: string) => void;
  isFav: boolean;
  index: number;
}> = React.memo(({ photo, onClick, onToggleFav, isFav, index }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid mb-4"
      style={{
        animationDelay: `${index * 40}ms`,
        animation: 'galleryFadeIn 0.5s ease-out backwards',
      }}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <div
          className="w-full rounded-xl"
          style={{
            aspectRatio: `${photo.width}/${photo.height}`,
            background: 'linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.8s ease-in-out infinite',
          }}
        />
      )}

      {/* Image */}
      <img
        src={photo.thumb}
        alt={photo.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full object-cover rounded-xl transition-all duration-500 ease-out ${
          loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
        } group-hover:scale-110 group-hover:brightness-110`}
        style={{ aspectRatio: `${photo.width}/${photo.height}` }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Zoom icon */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
          <ZoomIn className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Favorite button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(photo.id); }}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 border-none cursor-pointer bg-transparent p-0"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors ${
          isFav ? 'bg-red-500/80 border-red-400/50' : 'bg-white/20 border-white/30 hover:bg-red-500/40'
        }`}>
          <Heart className={`w-4 h-4 ${isFav ? 'text-white fill-white' : 'text-white'}`} />
        </div>
      </button>

      {/* Caption overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <div className="text-sm font-bold text-white leading-tight drop-shadow-lg">
          {photo.title}
        </div>
        <div className="text-xs text-zinc-400 mt-1 drop-shadow-md">
          {photo.caption}
        </div>
      </div>
    </div>
  );
});
PhotoCard.displayName = 'PhotoCard';

// ─── Lightbox ────────────────────────────────────────────────────────────────

const Lightbox: React.FC<{
  photo: Photo;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  isFav: boolean;
  onToggleFav: (id: string) => void;
}> = ({ photo, photos, currentIndex, onClose, onPrev, onNext, isFav, onToggleFav }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  // Reset load state when photo changes
  useEffect(() => {
    setImgLoaded(false);
  }, [photo.id]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbStripRef.current) {
      const activeThumb = thumbStripRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  const navigateTo = useCallback((targetIndex: number) => {
    const diff = targetIndex - currentIndex;
    if (diff < 0) {
      for (let j = 0; j < -diff; j++) onPrev();
    } else if (diff > 0) {
      for (let j = 0; j < diff; j++) onNext();
    }
  }, [currentIndex, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ animation: 'lightboxFadeIn 0.3s ease-out' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="text-white/90 text-sm font-semibold">{photo.title}</div>
          <div className="text-white/40 text-xs">{currentIndex + 1} / {photos.length}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFav(photo.id); }}
            className={`w-9 h-9 rounded-full flex items-center justify-center border cursor-pointer transition-all ${
              isFav
                ? 'bg-red-500/30 border-red-400/40 hover:bg-red-500/50'
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-red-400 fill-red-400' : 'text-white/70'}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(photo.src, '_blank'); }}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all"
          >
            <Download className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all ml-2"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {currentIndex < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/25 transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative z-[1] max-w-[85vw] max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'lightboxScaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Loading spinner */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center min-w-[200px] min-h-[200px]">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        <img
          src={photo.src}
          alt={photo.title}
          onLoad={() => setImgLoaded(true)}
          className={`max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ filter: 'drop-shadow(0 25px 80px rgba(0,0,0,0.6))' }}
        />
      </div>

      {/* Bottom caption + thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 pb-4 pt-2 flex flex-col items-center z-10">
        <div className="text-white/70 text-xs font-medium mb-3">{photo.caption}</div>

        {/* Thumbnail strip */}
        <div
          ref={thumbStripRef}
          className="flex items-center gap-1.5 px-4 max-w-[80vw] overflow-x-auto pb-1"
          onClick={(e) => e.stopPropagation()}
          style={{ scrollbarWidth: 'none' }}
        >
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => navigateTo(i)}
              className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer p-0 ${
                i === currentIndex
                  ? 'border-white/90 scale-110 shadow-lg shadow-white/10'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <img src={p.thumb} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Main Gallery App ────────────────────────────────────────────────────────

export const GalleryApp: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const contentRef = useRef<HTMLDivElement>(null);

  // Compute filtered photos
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'all') return DEMO_PHOTOS;
    if (activeCategory === 'favorites') return DEMO_PHOTOS.filter(p => favorites.has(p.id));
    return DEMO_PHOTOS.filter(p => p.category === activeCategory);
  }, [activeCategory, favorites]);

  // Update category counts for favorites
  const categoriesWithCounts = useMemo(() =>
    CATEGORIES.map(c =>
      c.id === 'favorites' ? { ...c, count: favorites.size } : c
    ), [favorites]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goLightboxPrev = useCallback(() => {
    setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const goLightboxNext = useCallback(() => {
    setLightboxIndex(prev =>
      prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev
    );
  }, [filteredPhotos.length]);

  // Scroll to top when category changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  // ── Compact mode (mobile-like) ──────────────────────────────────────────
  if (compact) {
    return (
      <div className="flex flex-col h-full w-full select-text" style={{ background: '#0c1021' }}>
        {/* Tab bar */}
        <div className="flex gap-1.5 p-2.5 border-b border-white/10 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
          {categoriesWithCounts.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border-none whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={contentRef} className="flex-1 overflow-auto p-3">
          <div className="columns-2 gap-3">
            {filteredPhotos.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onClick={() => openLightbox(i)}
                onToggleFav={toggleFavorite}
                isFav={favorites.has(photo.id)}
              />
            ))}
          </div>
          {filteredPhotos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-white/40">
              <Images className="w-12 h-12 mb-3 opacity-40" />
              <div className="text-sm font-medium">Chưa có ảnh nào</div>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
          <Lightbox
            photo={filteredPhotos[lightboxIndex]}
            photos={filteredPhotos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goLightboxPrev}
            onNext={goLightboxNext}
            isFav={favorites.has(filteredPhotos[lightboxIndex].id)}
            onToggleFav={toggleFavorite}
          />
        )}

        {/* Inline styles */}
        <style>{galleryStyles}</style>
      </div>
    );
  }

  // ── Full layout ─────────────────────────────────────────────────────────
  return (
    <div className="flex h-full w-full select-text" style={{ background: '#0c1021' }}>

      {/* ── Sidebar (25%) ─────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex flex-col border-r border-white/[0.08] overflow-y-auto select-none"
        style={{
          width: '25%',
          minWidth: 180,
          maxWidth: 260,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(10,16,33,0.99) 100%)',
          backdropFilter: 'blur(20px)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {/* Sidebar header */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Images className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[13px] font-bold text-white/90 leading-tight">Album Trưng Bày</div>
              <div className="text-[10px] text-white/40 font-medium">{DEMO_PHOTOS.length} ảnh</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-2 border-t border-white/[0.06]" />

        {/* Section label */}
        <div className="px-4 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/30">
            Danh mục
          </span>
        </div>

        {/* Category list */}
        <div className="px-2 pb-4 flex-1">
          {categoriesWithCounts.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-left transition-all duration-200 cursor-pointer border-none mb-0.5 ${
                  isActive
                    ? 'bg-sky-500/15 text-sky-400'
                    : 'bg-transparent text-white/60 hover:bg-white/[0.05] hover:text-white/80'
                }`}
              >
                <span className="text-[15px] w-5 text-center flex-shrink-0">{cat.icon}</span>
                <span className={`text-[13px] flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {cat.label}
                </span>
                <span className={`text-[11px] min-w-[24px] h-[20px] rounded-full flex items-center justify-center font-semibold ${
                  isActive
                    ? 'bg-sky-500/25 text-sky-300'
                    : 'bg-white/[0.06] text-white/30'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="text-[10px] text-white/25 text-center font-medium">
            Song Phương Gallery
          </div>
        </div>
      </div>

      {/* ── Main Content (75%) ────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Toolbar */}
        <div
          className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.08] flex-shrink-0"
          style={{ background: 'rgba(12,16,33,0.95)' }}
        >
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold text-white/90 leading-tight truncate m-0">
              {categoriesWithCounts.find(c => c.id === activeCategory)?.label ?? 'Tất cả ảnh'}
            </h2>
            <div className="text-[11px] text-white/35 mt-0.5 font-medium">
              {filteredPhotos.length} ảnh trong danh mục
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-1 bg-white/[0.06] rounded-lg p-1">
            <button
              onClick={() => setViewMode('masonry')}
              className={`w-8 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-all ${
                viewMode === 'masonry'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-transparent text-white/40 hover:text-white/70'
              }`}
              title="Masonry"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`w-8 h-7 rounded-md flex items-center justify-center cursor-pointer border-none transition-all ${
                viewMode === 'grid'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'bg-transparent text-white/40 hover:text-white/70'
              }`}
              title="Grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Photo grid */}
        <div
          ref={contentRef}
          className="flex-1 overflow-auto p-5"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          }}
        >
          {filteredPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20">
              <div
                className="w-20 h-20 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-5"
                style={{ animation: 'galleryFadeIn 0.6s ease-out' }}
              >
                {activeCategory === 'favorites' ? (
                  <Heart className="w-8 h-8 text-white/20" />
                ) : (
                  <Images className="w-8 h-8 text-white/20" />
                )}
              </div>
              <div className="text-[14px] font-semibold text-white/40 mb-1">
                {activeCategory === 'favorites'
                  ? 'Chưa có ảnh yêu thích'
                  : 'Chưa có ảnh nào'}
              </div>
              <div className="text-[12px] text-white/20">
                {activeCategory === 'favorites'
                  ? 'Nhấn ❤️ trên ảnh để thêm vào yêu thích'
                  : 'Hãy thêm ảnh vào danh mục này'}
              </div>
            </div>
          ) : viewMode === 'masonry' ? (
            /* Masonry layout */
            <div className="columns-2 md:columns-3 gap-4">
              {filteredPhotos.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  onClick={() => openLightbox(i)}
                  onToggleFav={toggleFavorite}
                  isFav={favorites.has(photo.id)}
                />
              ))}
            </div>
          ) : (
            /* Uniform grid layout */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPhotos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
                  style={{
                    animationDelay: `${i * 40}ms`,
                    animation: 'galleryFadeIn 0.5s ease-out backwards',
                  }}
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={photo.thumb}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Favorite button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id); }}
                    className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 border-none cursor-pointer bg-transparent p-0"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-md transition-colors ${
                      favorites.has(photo.id) ? 'bg-red-500/80 border-red-400/50' : 'bg-white/20 border-white/30 hover:bg-red-500/40'
                    }`}>
                      <Heart className={`w-4 h-4 ${favorites.has(photo.id) ? 'text-white fill-white' : 'text-white'}`} />
                    </div>
                  </button>

                  {/* Zoom icon */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                      <ZoomIn className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <div className="text-sm font-bold text-white leading-tight drop-shadow-lg">
                      {photo.title}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 drop-shadow-md">
                      {photo.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="px-5 py-2 border-t border-white/[0.08] flex-shrink-0 flex items-center justify-between" style={{ background: 'rgba(12,16,33,0.95)' }}>
          <span className="text-[11px] text-white/30 font-medium">
            {filteredPhotos.length} ảnh
          </span>
          <span className="text-[11px] text-white/20 font-medium">
            {favorites.size > 0 ? `❤️ ${favorites.size} yêu thích` : ''}
          </span>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && filteredPhotos[lightboxIndex] && (
        <Lightbox
          photo={filteredPhotos[lightboxIndex]}
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goLightboxPrev}
          onNext={goLightboxNext}
          isFav={favorites.has(filteredPhotos[lightboxIndex].id)}
          onToggleFav={toggleFavorite}
        />
      )}

      {/* Inline styles for animations */}
      <style>{galleryStyles}</style>
    </div>
  );
};

// ─── Shared CSS keyframes ────────────────────────────────────────────────────

const galleryStyles = `
  @keyframes galleryFadeIn {
    0% { opacity: 0; transform: translateY(16px) scale(0.96); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes lightboxFadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes lightboxScaleIn {
    0% { opacity: 0; transform: scale(0.85); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
