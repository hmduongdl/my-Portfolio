import React from 'react';

export const WelcomeApp: React.FC = () => {
  return (
    <div className="px-11 py-9 max-w-[560px] mx-auto select-text leading-relaxed">
      <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
        Today · May 19, 2026
      </div>
      
      <h1 className="text-[28px] font-bold tracking-tight mb-3.5 text-ink">
        こんにちは — welcome.
      </h1>
      
      <p className="text-[14px] text-ink-2 mb-3.5">
        This is a desktop set out the way I think — a workspace, not a brochure. Open <b>About This Me</b> to see what I work with, browse <b>Song Phương</b> products in Finder, flip through <b>Projects</b>, or send me a note via <b>Mail</b>.
      </p>
      
      <p className="text-[14px] text-ink-2 mb-[18px]">
        Drag windows around. Resize from any edge. The yellow light minimizes; the green one zooms. Hit <span className="bg-paper-2 px-1.5 py-0.5 rounded text-[12px] font-mono border border-rule">⌘ T</span> in the tweaks panel to customize window styles.
      </p>
      
      <div className="mt-5 p-3.5 bg-paper-2 rounded-lg border border-rule text-[13px] text-ink-2">
        <div className="font-semibold mb-1 text-ink">Tip</div>
        Hover the dock — the icons magnify like the real thing.
      </div>
    </div>
  );
};
