import React from 'react';

export const Wallpaper: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
      <svg className="w-full h-full block" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD8B5" />
            <stop offset="22%" stopColor="#F4B89A" />
            <stop offset="48%" stopColor="#D58F89" />
            <stop offset="75%" stopColor="#7A5B8A" />
            <stop offset="100%" stopColor="#3E3E6E" />
          </linearGradient>
          <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9B6B7C" />
            <stop offset="100%" stopColor="#3E3958" />
          </linearGradient>
          <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7E5876" />
            <stop offset="100%" stopColor="#2D2C4E" />
          </linearGradient>
          <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C4670" />
            <stop offset="100%" stopColor="#1F2042" />
          </linearGradient>
          <linearGradient id="m4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E3358" />
            <stop offset="100%" stopColor="#141533" />
          </linearGradient>
          <radialGradient id="sun" cx="0.7" cy="0.32" r="0.18">
            <stop offset="0%" stopColor="#FFE7C4" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFD8B5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFD8B5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#sky)" />
        <rect width="1920" height="1080" fill="url(#sun)" />
        {/* far mountain */}
        <path d="M0,720 L160,640 L320,680 L520,580 L720,650 L920,560 L1180,640 L1400,580 L1620,640 L1920,600 L1920,1080 L0,1080 Z" fill="url(#m1)" opacity="0.85" />
        {/* mid mountain */}
        <path d="M0,800 L240,700 L460,760 L680,650 L900,740 L1140,680 L1380,760 L1620,700 L1920,760 L1920,1080 L0,1080 Z" fill="url(#m2)" />
        {/* near mountain */}
        <path d="M0,880 L180,820 L380,860 L580,780 L820,840 L1060,790 L1300,860 L1540,810 L1780,860 L1920,830 L1920,1080 L0,1080 Z" fill="url(#m3)" />
        {/* foreground */}
        <path d="M0,960 L220,920 L440,960 L660,910 L900,950 L1140,920 L1380,960 L1620,920 L1920,950 L1920,1080 L0,1080 Z" fill="url(#m4)" />
        {/* atmospheric haze */}
        <rect y="640" width="1920" height="220" fill="#FFD8B5" opacity="0.08" />
      </svg>
    </div>
  );
};
