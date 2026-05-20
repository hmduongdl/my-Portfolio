import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products';
import type { Product, ProductCategory } from '../types/product';

interface FinderAppProps {
  compact?: boolean;
}

type TagType = 'Hot' | 'New' | 'Sale';

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  'PC Gaming': '#3B82F6',
  'Office PC': '#6B7280',
  'Laptop': '#8B5CF6',
  'VGA': '#10B981',
  'Gaming Gear': '#F59E0B',
  'Keyboard': '#EC4899',
  'Audio': '#06B6D4',
};

const SIDEBAR_GROUPS = [
  { id: 'all', label: 'All Products', icon: '◯', categories: null as null | ProductCategory[] },
  { id: 'pc-laptop', label: 'PC & Laptop', icon: '💻', categories: ['PC Gaming', 'Office PC', 'Laptop'] as ProductCategory[] },
  { id: 'gaming-gear', label: 'Gaming Gear', icon: '🕹', categories: ['VGA', 'Gaming Gear', 'Keyboard'] as ProductCategory[] },
  { id: 'audio', label: 'Audio & More', icon: '🎧', categories: ['Audio'] as ProductCategory[] },
];

const TAG_ITEMS: { id: TagType; label: string; dot: string }[] = [
  { id: 'Hot', label: 'Hot Product', dot: 'bg-red-500' },
  { id: 'New', label: 'New Arrival', dot: 'bg-green-500' },
  { id: 'Sale', label: 'On Sale', dot: 'bg-yellow-500' },
];

export const FinderApp: React.FC<FinderAppProps> = ({ compact = false }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTag, setActiveTag] = useState<TagType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err?.message ?? 'Lỗi tải dữ liệu'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = (() => {
    let result = products;

    if (activeCategory !== 'all') {
      const group = SIDEBAR_GROUPS.find((g) => g.id === activeCategory);
      if (group?.categories) {
        result = result.filter((p) => (group.categories as ProductCategory[]).includes(p.category));
      }
    }

    if (activeTag) {
      result = result.filter((p) => p.status === activeTag);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    return result;
  })();

  const handleGroupClick = (groupId: string) => {
    setActiveCategory(groupId);
    setActiveTag(null);
  };

  const handleTagClick = (tag: TagType) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setActiveCategory('all');
  };

  const activeGroupLabel = activeTag
    ? TAG_ITEMS.find((t) => t.id === activeTag)?.label
    : SIDEBAR_GROUPS.find((g) => g.id === activeCategory)?.label ?? activeCategory;

  if (compact) {
    const compactCategories = SIDEBAR_GROUPS.flatMap((g) =>
      g.id === 'all' ? [{ id: 'all', label: 'All' }] : (g.categories ?? []).map((c) => ({ id: c, label: c }))
    );

    return (
      <div className="flex flex-col h-full select-text">
        <div className="flex gap-1.5 p-2.5 border-b border-rule bg-paper-2 overflow-x-auto flex-shrink-0">
          {compactCategories.map((it) => (
            <button
              key={it.id}
              onClick={() => { setActiveCategory(it.id === 'all' ? 'all' : it.id); setActiveTag(null); }}
              className={`px-3 py-1.2 rounded-full text-xs font-medium border-none whitespace-nowrap cursor-pointer transition-all ${
                activeCategory === it.id && !activeTag
                  ? 'bg-primary text-white'
                  : 'bg-white text-ink-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-3.5">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-ink-3 text-sm">Đang tải...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500 text-sm">{error}</div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {filtered.map((p) => (
                <a
                  key={p.id}
                  href={p.product_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-paper-2 border border-rule no-underline"
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-[60px] h-[60px] rounded-xl object-cover" />
                  ) : (
                    <div
                      className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-white text-2xl"
                      style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[p.category]}, ${CATEGORY_COLORS[p.category]}cc)` }}
                    >
                      {p.glyph ?? '📦'}
                    </div>
                  )}
                  <div className="text-xs font-medium text-center leading-tight">{p.name}</div>
                  {p.status && <div className="text-[10px] text-ink-3">{p.status}</div>}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="px-3.5 py-1.5 border-t border-rule bg-paper-2 text-[11px] text-ink-3 flex-shrink-0">
          {filtered.length} items
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full select-text">
      {/* Sidebar */}
      <div className="w-[200px] bg-paper-2 border-r border-rule py-4 px-2 overflow-y-auto flex-shrink-0 select-none">
        {/* Favorites group */}
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1">
          Favorites
        </div>
        {SIDEBAR_GROUPS.map((g) => {
          const isActive = activeCategory === g.id && !activeTag;
          return (
            <div
              key={g.id}
              onClick={() => handleGroupClick(g.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${
                isActive
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

        {/* Tags group */}
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1 mt-3">
          Tags
        </div>
        {TAG_ITEMS.map((t) => {
          const isActive = activeTag === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleTagClick(t.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[13px] cursor-pointer mb-0.5 transition-colors ${
                isActive
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

      {/* Main content pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-rule bg-paper-2 flex-shrink-0 select-none">
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">
              ‹
            </button>
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">
              ›
            </button>
          </div>
          <div className="text-[13px] font-semibold">{activeGroupLabel}</div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="ml-4 px-2.5 py-1 rounded-md border border-rule-strong bg-white text-[12px] text-ink placeholder:text-ink-3 outline-none focus:border-blue-400 w-40"
          />
          <div className="ml-auto flex gap-1.5">
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">
              ⊞
            </button>
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer">
              ≡
            </button>
          </div>
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-auto p-5 bg-paper">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-ink-3 text-sm">Đang tải...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full text-ink-3 text-sm">Không có sản phẩm</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
              {filtered.map((p) => (
                <a
                  key={p.id}
                  href={p.product_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-blue-500/10 no-underline"
                >
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="w-[92px] h-[92px] rounded-2xl object-cover shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                    />
                  ) : (
                    <div
                      className="w-[92px] h-[92px] rounded-2xl flex items-center justify-center text-white text-[36px] font-light shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                      style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[p.category]}, ${CATEGORY_COLORS[p.category]}cc)` }}
                    >
                      {p.glyph ?? '📦'}
                    </div>
                  )}
                  <div className="text-[13px] font-medium text-center text-ink">{p.name}</div>
                  {p.status && <div className="text-[11px] text-ink-3">{p.status}</div>}
                </a>
              ))}
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
