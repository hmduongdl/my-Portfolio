import React from 'react';

export const AboutApp: React.FC = () => {
  const specs = [
    { k: 'Name', v: 'Song Phương Dev' },
    { k: 'Role', v: 'Product Designer · Developer' },
    { k: 'Location', v: 'Hà Nội, Việt Nam' },
    { k: 'Working at', v: 'Song Phương Technology' },
  ];

  const tech = [
    { k: 'Frontend', v: 'React · TypeScript · Tailwind' },
    { k: 'Backend', v: 'Node.js · PostgreSQL' },
    { k: 'Design', v: 'Figma · Sketch · Principle' },
    { k: 'Tools', v: 'Vite · Git · Vercel' },
  ];

  return (
    <div className="flex flex-col items-center gap-7 px-12 py-9 select-text">
      <div className="w-[140px] h-[140px] rounded-full bg-gradient-to-br from-primary-soft to-[#B5CCE6] flex items-center justify-center text-[56px] font-semibold text-primary border-2 border-white shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
        SP
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-semibold tracking-tight">MacBook Pro · Personal</div>
        <div className="text-[13px] text-ink-3 mt-1">Portfolio Edition (May 2026)</div>
      </div>
      
      <div className="w-full max-w-[460px]">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Overview</div>
        <div className="bg-paper-2 rounded-lg border border-rule px-4 py-1">
          {specs.map((s, i) => (
            <div
              key={s.k}
              className={`flex justify-between py-2.5 text-[13px] ${
                i < specs.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <span className="text-ink-3">{s.k}</span>
              <span className="text-ink font-medium">{s.v}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-[460px]">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">Tech stack</div>
        <div className="bg-paper-2 rounded-lg border border-rule px-4 py-1">
          {tech.map((s, i) => (
            <div
              key={s.k}
              className={`flex justify-between py-2.5 text-[13px] ${
                i < tech.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <span className="text-ink-3">{s.k}</span>
              <span className="text-ink font-medium">{s.v}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="px-3.5 py-1.5 rounded-md border border-rule-strong bg-white hover:bg-paper-2 text-[13px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors duration-120">
          More info…
        </button>
        <button className="px-3.5 py-1.5 rounded-md border border-primary bg-primary hover:bg-primary-hover text-white text-[13px] font-medium shadow-[0_1px_0_rgba(0,0,0,0.04)] cursor-pointer transition-colors duration-120">
          System Report
        </button>
      </div>
    </div>
  );
};
