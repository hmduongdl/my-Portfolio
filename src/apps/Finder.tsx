import React, { useEffect, useMemo, useState } from 'react';
import { productService } from '../services/productService';
import type { Product, ProductCategory } from '../types/product';
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_META } from '../constants/productCategories';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FinderAppProps {
  compact?: boolean;
  lang?: 'en' | 'vn';
}

type TagType = 'Hot' | 'New' | 'Sale';

// ─── Constants ────────────────────────────────────────────────────────────────

type ProductCategoryFilter = 'all' | ProductCategory;

const SIDEBAR_ITEMS: { id: ProductCategoryFilter; label: string; icon: string; category: ProductCategory | null }[] = [
  { id: 'all', label: 'All Products', icon: '◯', category: null },
  ...PRODUCT_CATEGORIES.map((category) => ({
    id: category,
    label: category,
    icon: PRODUCT_CATEGORY_META[category].icon,
    category,
  })),
];

const TAG_ITEMS: { id: TagType; label: string; dot: string }[] = [
  { id: 'Hot', label: 'Hot Product', dot: 'bg-red-500' },
  { id: 'New', label: 'New Arrival', dot: 'bg-green-500' },
  { id: 'Sale', label: 'On Sale', dot: 'bg-yellow-500' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatVND = (price: number) => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price);
  return `${formatted} đ`;
};

const getCategoryTranslation = (cat: string) => {
  const translations: Record<string, string> = {
    'all': 'Tất cả sản phẩm',
    'All Products': 'Tất cả sản phẩm',
    ...Object.fromEntries(PRODUCT_CATEGORIES.map((category) => [category, PRODUCT_CATEGORY_META[category].labelVn])),
  };
  return translations[cat] || cat;
};

const calcDiscount = (price: number, oldPrice: number) =>
  Math.round(((oldPrice - price) / oldPrice) * 100);

const openProduct = (product: Product) => {
  const url = product.link
    ? product.link
    : `https://songphuong.vn/?s=${encodeURIComponent(product.name)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = 'https://placehold.co/300x300/f3f4f6/9ca3af?text=SongPhuong+Product';
};

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

const SkeletonCard: React.FC<{ compact?: boolean; viewMode?: 'grid' | 'list' }> = ({ compact, viewMode = 'grid' }) => {
  if (compact) {
    return (
      <div className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-paper-2 border border-rule animate-pulse">
        <div className="w-[60px] h-[60px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="w-14 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-10 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }
  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 border-b border-rule last:border-0 animate-pulse">
        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-1/3 h-3.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="w-1/4 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="w-24 h-3.5 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 p-2 rounded-lg animate-pulse">
      <div className="w-[92px] h-[92px] rounded-2xl bg-gray-200 dark:bg-gray-700" />
      <div className="w-20 h-3 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="w-16 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="w-12 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

// ─── ProductCard ──────────────────────────────────────────────────────────────

const ProductCard: React.FC<{ product: Product; compact?: boolean; viewMode?: 'grid' | 'list' }> = ({ product, compact, viewMode = 'grid' }) => {
  const isStringPrice = typeof product.price === 'string' || isNaN(Number(product.price)) || (typeof product.price === 'number' && product.price === 0);
  const priceText = isStringPrice 
    ? (typeof product.price === 'string' && product.price.trim() !== '' && product.price.trim() !== '0' ? product.price : 'Liên hệ')
    : formatVND(Number(product.price));
  const priceColor = isStringPrice ? 'text-emerald-500 dark:text-emerald-400 font-semibold' : 'text-blue-600 dark:text-blue-400';
  const hasDiscount = !isStringPrice && product.oldPrice != null && product.oldPrice > Number(product.price);
  const discountPct = hasDiscount ? calcDiscount(Number(product.price), product.oldPrice!) : 0;

  if (compact) {
    return (
      <div
        onClick={() => openProduct(product)}
        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-paper-2 border border-rule cursor-pointer hover:border-blue-400 hover:shadow-sm transition-all"
      >
        <div className="relative w-[60px] h-[60px] flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full rounded-xl object-contain p-1 bg-white"
              onError={handleImgError}
            />
          ) : (
            <div
              className="w-full h-full rounded-xl flex items-center justify-center text-white text-2xl"
              style={{ background: `linear-gradient(135deg, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}cc)` }}
            >
              {product.glyph ?? '📦'}
            </div>
          )}
          {hasDiscount && (
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full leading-none shadow-sm">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="text-xs font-medium text-center leading-tight line-clamp-2 text-ink">{product.name}</div>
        <div className="flex flex-col items-center gap-0.5">
          {hasDiscount && (
            <div className="text-[9px] text-ink-3 line-through leading-none">{formatVND(product.oldPrice!)}</div>
          )}
          <div className={`text-[10px] font-semibold leading-none ${priceColor}`}>{priceText}</div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => openProduct(product)}
        className="flex items-center gap-4 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-blue-500/10 group border-b border-rule last:border-0"
      >
        <div className="relative w-16 h-16 flex-shrink-0">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full rounded-xl object-contain p-1 bg-white shadow-sm"
              onError={handleImgError}
            />
          ) : (
            <div
              className="w-full h-full rounded-xl flex items-center justify-center text-white text-[24px] font-light shadow-sm"
              style={{ background: `linear-gradient(135deg, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}cc)` }}
            >
              {product.glyph ?? '📦'}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-ink leading-tight truncate">{product.name}</div>
          <div className="text-[11px] text-ink-3 mt-1 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-md bg-paper-2 border border-rule">{product.category}</span>
            {hasDiscount && <span className="text-orange-500 font-medium">-{discountPct}% OFF</span>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 min-w-[120px]">
          {hasDiscount && (
            <div className="text-[11px] text-ink-3 line-through">{formatVND(product.oldPrice!)}</div>
          )}
          <div className={`text-[14px] font-bold ${priceColor}`}>{priceText}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => openProduct(product)}
      className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-blue-500/10 group"
    >
      <div className="relative w-[92px] h-[92px] flex-shrink-0">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full rounded-2xl object-contain p-2 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
            onError={handleImgError}
          />
        ) : (
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center text-white text-[36px] font-light shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
            style={{ background: `linear-gradient(135deg, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}, ${PRODUCT_CATEGORY_META[product.category]?.color ?? PRODUCT_CATEGORY_META.Other.color}cc)` }}
          >
            {product.glyph ?? '📦'}
          </div>
        )}
        {hasDiscount && (
          <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm">
            -{discountPct}%
          </span>
        )}
      </div>
      <div className="text-[13px] font-medium text-center text-ink leading-tight line-clamp-2">{product.name}</div>
      <div className="flex flex-col items-center gap-0.5">
        {hasDiscount && (
          <div className="text-[11px] text-ink-3 line-through">{formatVND(product.oldPrice!)}</div>
        )}
        <div className={`text-[12px] font-semibold ${priceColor}`}>{priceText}</div>
      </div>
    </div>
  );
};

// ─── FinderApp ────────────────────────────────────────────────────────────────

export const FinderApp: React.FC<FinderAppProps> = ({ compact = false, lang = 'vn' }) => {
  const [products, setProducts] = useState<Product[]>(() => productService.getCachedProducts(lang) || []);
  const [isLoading, setIsLoading] = useState<boolean>(() => !productService.getCachedProducts(lang));
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategoryFilter>('all');
  const [activeTag, setActiveTag] = useState<TagType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const loadProducts = () => {
    const cachedProducts = productService.getCachedProducts(lang);
    if (cachedProducts) setProducts(cachedProducts);
    setIsLoading(!cachedProducts);
    setError(null);
    productService
      .getProducts(lang)
      .then((items) => {
        setProducts(items || []);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Lỗi tải dữ liệu'))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadProducts();

    const handleProductsUpdated = () => {
      loadProducts();
    };

    window.addEventListener('products-updated', handleProductsUpdated);
    return () => {
      window.removeEventListener('products-updated', handleProductsUpdated);
    };
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filtering pipeline (useMemo) ──────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeTag) {
      result = result.filter((p) => p.status === activeTag);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  }, [products, activeCategory, activeTag, searchQuery]);

  // ── Sidebar handlers ──────────────────────────────────────────────────────

  const handleGroupClick = (groupId: ProductCategoryFilter) => {
    setActiveCategory(groupId);
    setActiveTag(null);
  };

  const handleTagClick = (tag: TagType) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setActiveCategory('all');
  };

  // Build breadcrumb path for current view
  const getBreadcrumb = useMemo(() => {
    const prefix = 'Song Phương Products';
    const itemLabel = SIDEBAR_ITEMS.find((item) => item.id === activeCategory)?.label ?? activeCategory;
    const translatedCat = getCategoryTranslation(activeCategory === 'all' ? 'all' : itemLabel);
    
    if (activeTag) {
      const tagLabel = TAG_ITEMS.find((t) => t.id === activeTag)?.label || activeTag;
      return `${prefix}  >  ${translatedCat}  >  Tag: ${tagLabel}`;
    }
    
    return `${prefix}  >  ${translatedCat}`;
  }, [activeCategory, activeTag]);

  const latestUpdateStr = useMemo(() => {
    if (!products || products.length === 0) return '';
    let latest = 0;
    for (const p of products) {
      if (p.updatedAt) {
        const time = new Date(p.updatedAt).getTime();
        if (time > latest) latest = time;
      }
    }
    if (latest > 0) {
      const d = new Date(latest);
      return `Ngày cập nhật giá: ${d.toLocaleDateString('vi-VN')}`;
    }
    return '';
  }, [products]);


  const disclaimerMarquee = (
    <div className="bg-orange-500/10 border-b border-orange-500/30 overflow-hidden flex items-center py-1 flex-shrink-0">
      <div
        className="whitespace-nowrap inline-block text-orange-600 dark:text-orange-400 text-[11px] font-semibold tracking-wide"
        style={{ animation: 'marqueeScroll 22s linear infinite' }}
      >
        Giá hiển thị trên trang này chỉ mang tính chất tham khảo, để xem giá chính xác hãy nhấp vào từng sản phẩm để xem giá thực tế tại thời điểm xem sản phẩm.{latestUpdateStr && `  —  ${latestUpdateStr}`}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        Giá hiển thị trên trang này chỉ mang tính chất tham khảo, để xem giá chính xác hãy nhấp vào từng sản phẩm để xem giá thực tế tại thời điểm xem sản phẩm.{latestUpdateStr && `  —  ${latestUpdateStr}`}
      </div>
    </div>
  );

  // ── Error state ───────────────────────────────────────────────────────────

  const ErrorPane: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-ink-3">
      <div className="text-3xl">⚠️</div>
      <div className="text-sm text-red-500">{error}</div>
      <button
        onClick={loadProducts}
        className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-[12px] font-medium hover:bg-blue-600 active:scale-95 transition-all cursor-pointer"
      >
        Thử lại
      </button>
    </div>
  );

  const EmptyPane: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-ink-3 py-12 select-none text-center max-w-md mx-auto">
      <span className="text-[72px] opacity-70 animate-bounce select-none">🎁</span>
      <h3 className="text-[16px] font-semibold text-ink">
        {lang === 'vn' ? 'Chưa có sản phẩm nào' : 'No products'}
      </h3>
      <p className="text-[12px] text-ink-3 px-4 leading-normal">
        {lang === 'vn'
          ? 'Bạn có thể thêm sản phẩm từ System Settings'
          : 'You can add products from System Settings'}
      </p>
      <button
        onClick={loadProducts}
        className="mt-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[12px] font-semibold rounded-lg shadow-sm active:scale-95 transition-all cursor-pointer border-none"
      >
        {lang === 'vn' ? 'Tải lại trang' : 'Reload Page'}
      </button>
    </div>
  );

  // ── Compact layout ────────────────────────────────────────────────────────

  if (compact) {
    const compactTabs = SIDEBAR_ITEMS.map((item) => ({ id: item.id, label: item.id === 'all' ? 'All' : item.label }));

    return (
      <div className="flex flex-col h-full select-text">
        {/* Tab bar */}
        <div className="flex gap-1.5 p-2.5 border-b border-rule bg-paper-2 overflow-x-auto flex-shrink-0">
          {compactTabs.map((it) => (
            <button
              key={it.id}
              onClick={() => { setActiveCategory(it.id); setActiveTag(null); }}
              className={`px-3 py-1 rounded-full text-xs font-medium border-none whitespace-nowrap cursor-pointer transition-all ${activeCategory === it.id && !activeTag
                ? 'bg-primary text-white'
                : 'bg-white text-ink-2 shadow-[0_1px_0_rgba(0,0,0,0.04)] hover:bg-paper-2'
                }`}
            >
              {it.label}
            </button>
          ))}
        </div>

        {disclaimerMarquee}

        {/* Grid */}
        <div className="flex-1 overflow-auto p-3.5">
          {error ? (
            <ErrorPane />
          ) : isLoading ? (
            <div className="grid grid-cols-2 gap-3.5">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} compact />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyPane />
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} compact />)}
            </div>
          )}
        </div>

        <div className="px-3.5 py-1.5 border-t border-rule bg-paper-2 text-[11px] text-ink-3 flex-shrink-0">
          {isLoading ? 'Đang tải...' : `${filtered.length} items`}
        </div>
      </div>
    );
  }

  // ── Full layout ───────────────────────────────────────────────────────────

  return (
    <div className="flex h-full select-text">
      {/* Sidebar */}
      <div className="w-[200px] bg-paper-2 border-r border-rule py-4 px-2 overflow-y-auto flex-shrink-0 select-none">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1">
          Favorites
        </div>
        {SIDEBAR_ITEMS.map((g) => {
          const isActive = activeCategory === g.id && !activeTag;
          return (
            <div
              key={g.id}
              onClick={() => handleGroupClick(g.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${isActive
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-ink hover:bg-[rgba(0,0,0,0.05)]'
                }`}
            >
              <span className={`w-4 text-center ${isActive ? 'text-blue-500' : 'text-ink-3'}`}>
                {g.icon}
              </span>
              {g.label}
            </div>
          );
        })}

        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1 mt-3">
          Tags
        </div>
        {TAG_ITEMS.map((t) => {
          const isActive = activeTag === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleTagClick(t.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${isActive
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium'
                : 'text-ink hover:bg-[rgba(0,0,0,0.05)]'
                }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${t.dot}`} />
              {t.label}
            </div>
          );
        })}
      </div>

      {/* Main pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-rule bg-paper-2 flex-shrink-0 select-none">
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">‹</button>
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">›</button>
          </div>
          <div className="text-[13px] font-semibold text-ink-2">{getBreadcrumb}</div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="ml-4 px-2.5 py-1 rounded-md border border-rule-strong bg-white text-[12px] text-ink placeholder:text-ink-3 outline-none focus:border-blue-400 w-40 transition-colors"
          />
          <div className="ml-auto flex gap-1.5">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1 border rounded-md font-medium text-[13px] shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-rule-strong hover:bg-paper-2 text-ink-2'}`}
              title="Grid View"
            >
              ⊞
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 border rounded-md font-medium text-[13px] shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-rule-strong hover:bg-paper-2 text-ink-2'}`}
              title="List View"
            >
              ≡
            </button>
          </div>
        </div>

        {disclaimerMarquee}

        {/* Items grid */}
        <div className="flex-1 overflow-auto p-5 bg-paper">
          {error ? (
            <ErrorPane />
          ) : isLoading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6" : "flex flex-col"}>
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} viewMode={viewMode} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyPane />
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6" : "flex flex-col bg-white dark:bg-black/20 rounded-xl border border-rule overflow-hidden"}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} viewMode={viewMode} />)}
            </div>
          )}
        </div>

        {/* Statusbar */}
        <div className="px-3.5 py-1.5 border-t border-rule bg-paper-2 text-[11px] text-ink-3 flex-shrink-0">
          {isLoading ? 'Đang tải...' : `${filtered.length} items`}
        </div>
      </div>
    </div>
  );
};
