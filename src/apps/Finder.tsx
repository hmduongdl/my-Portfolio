import React, { useState } from 'react';

interface FinderAppProps {
  compact?: boolean;
}

export const FinderApp: React.FC<FinderAppProps> = ({ compact = false }) => {
  const [active, setActive] = useState<string>('all');
  
  const products = [
    { name: 'SP Laptop Pro 14', kind: 'Laptop', tag: 'Featured', date: 'Apr 12, 2026', size: '1.4 kg', color: '#3B82C4', glyph: '🖥' },
    { name: 'SP Laptop Air 16', kind: 'Laptop', tag: 'New', date: 'Mar 30, 2026', size: '1.8 kg', color: '#2966A3', glyph: '🖥' },
    { name: 'SP Mini Desktop', kind: 'Desktop', tag: 'Compact', date: 'Feb 18, 2026', size: '1.2 L', color: '#7A8C5C', glyph: '◼' },
    { name: 'SP Studio Tower', kind: 'Desktop', tag: 'Workstation', date: 'Jan 22, 2026', size: '8.4 kg', color: '#4F7C8A', glyph: '◼' },
    { name: 'SP All-in-One 27"', kind: 'Desktop', tag: '27"', date: 'Dec 04, 2025', size: '7.8 kg', color: '#B85450', glyph: '▭' },
    { name: 'SP Edge Node', kind: 'Server', tag: 'Edge', date: 'Nov 11, 2025', size: '3.9 kg', color: '#C99A2E', glyph: '▣' },
  ];

  const sidebarItems = [
    { id: 'all', label: 'All Products', icon: '◯' },
    { id: 'laptops', label: 'Laptops', icon: '▭' },
    { id: 'desktops', label: 'Desktops', icon: '▢' },
    { id: 'servers', label: 'Servers', icon: '▣' },
  ];

  const filtered = active === 'all' ? products
    : active === 'laptops' ? products.filter(p => p.kind === 'Laptop')
    : active === 'desktops' ? products.filter(p => p.kind === 'Desktop')
    : products.filter(p => p.kind === 'Server');

  if (compact) {
    return (
      <div className="flex flex-col h-full select-text">
        <div className="flex gap-1.5 p-2.5 border-b border-rule bg-paper-2 overflow-x-auto flex-shrink-0">
          {sidebarItems.map((it) => (
            <button
              key={it.id}
              onClick={() => setActive(it.id)}
              className={`px-3 py-1.2 rounded-full text-xs font-medium border-none white-space-nowrap cursor-pointer transition-all ${
                active === it.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-ink-2 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
              }`}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-3.5">
          <div className="grid grid-cols-2 gap-3.5">
            {filtered.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg bg-paper-2 border border-rule"
              >
                <div
                  className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-white text-2xl"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}
                >
                  {p.glyph}
                </div>
                <div className="text-xs font-medium text-center leading-tight">{p.name}</div>
                <div className="text-[10px] text-ink-3">{p.tag}</div>
              </div>
            ))}
          </div>
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
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1 mt-3 first:mt-0">
          Song Phương
        </div>
        {sidebarItems.map((it) => (
          <div
            key={it.id}
            onClick={() => setActive(it.id)}
            className={`flex items-center gap-2 px-2 py-1 rounded-md text-[13px] cursor-pointer mb-0.5 transition-colors ${
              active === it.id
                ? 'bg-[rgba(59,130,196,0.15)] text-primary font-medium'
                : 'text-ink hover:bg-[rgba(0,0,0,0.05)]'
            }`}
          >
            <span
              className={`w-4 text-center ${
                active === it.id ? 'text-primary' : 'text-ink-3'
              }`}
            >
              {it.icon}
            </span>
            {it.label}
          </div>
        ))}
        
        <div className="text-[11px] uppercase tracking-wider font-semibold text-ink-3 px-2 py-1 mt-3">
          Tags
        </div>
        {[
          { label: 'Featured', color: '#3B82C4' },
          { label: 'New', color: '#7A8C5C' },
          { label: 'Workstation', color: '#C99A2E' }
        ].map((t) => (
          <div
            key={t.label}
            className="flex items-center gap-2 px-2 py-1 rounded-md text-[13px] text-ink hover:bg-[rgba(0,0,0,0.05)] cursor-pointer"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: t.color }}
            />
            {t.label}
          </div>
        ))}
      </div>

      {/* Main content pane */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-rule bg-paper-2 flex-shrink-0 select-none">
          <div className="flex gap-1">
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer select-none">
              ‹
            </button>
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer select-none">
              ›
            </button>
          </div>
          <div className="text-[13px] font-semibold">
            {sidebarItems.find((i) => i.id === active)?.label}
          </div>
          <div className="ml-auto flex gap-1.5">
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer select-none">
              ⊞
            </button>
            <button className="px-2 py-1 border border-rule-strong bg-white hover:bg-paper-2 text-[13px] rounded-md font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer select-none">
              ≡
            </button>
          </div>
        </div>

        {/* Folder items grid */}
        <div className="flex-1 overflow-auto p-5 bg-paper">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-6">
            {filtered.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors duration-200 hover:bg-[rgba(59,130,196,0.08)]"
              >
                <div
                  className="w-[92px] h-[92px] rounded-2xl flex items-center justify-center text-white text-[36px] font-light shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}
                >
                  {p.glyph}
                </div>
                <div className="text-[13px] font-medium text-center text-ink">{p.name}</div>
                <div className="text-[11px] text-ink-3">{p.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Statusbar */}
        <div className="px-3.5 py-1.5 border-t border-rule bg-paper-2 text-[11px] text-ink-3 flex-shrink-0">
          {filtered.length} items
        </div>
      </div>
    </div>
  );
};
