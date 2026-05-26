import React, { useEffect, useState } from 'react';
import { MapPin, MessageCircle, Mail, Globe } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { APP_DEFS } from '../../apps';
import { profileService, ProfileData } from '../../services/profileService';

interface BentoAboutWidgetProps {
  onClick: () => void;
  scale?: number;
}

export const BentoAboutWidget: React.FC<BentoAboutWidgetProps> = ({ onClick, scale = 1 }) => {
  const isMobile = useOSStore((state) => state.isMobile);
  const setIosOpenAppId = useOSStore((state) => state.setIosOpenAppId);
  const openApp = useOSStore((state) => state.openApp);
  const language = useOSStore((state) => state.language);

  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    profileService.getProfile(language)
      .then(setProfile)
      .catch((err) => console.error('Failed to load profile in widget:', err));
  }, [language]);

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(profile?.githubUrl || 'https://github.com/hmduongdl', '_blank', 'noopener,noreferrer');
  };

  const handleZaloClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setIosOpenAppId('zalo');
    } else {
      openApp('zalo', APP_DEFS);
    }
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setIosOpenAppId('mail');
    } else {
      openApp('mail', APP_DEFS);
    }
  };

  const handlePortfolioClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(profile?.songphuongUrl || 'https://songphuong.vn', '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={onClick}
      className="col-span-4 cursor-pointer select-none hover:scale-[0.98] active:scale-[0.97] transition-all duration-300 max-w-md w-full mx-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl p-5 shadow-2xl border border-white/20 flex flex-col space-y-4"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* 2. Widget Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <img
            src={profile?.avatarUrl || '/my-avatar.jpg'}
            className="w-12 h-12 rounded-full border border-white/50 object-cover shadow-sm bg-neutral-100"
            alt="Avatar"
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider">ABOUT ME</span>
            <span className="text-base font-bold text-gray-800 dark:text-white mt-0.5 leading-none">
              {profile?.name || 'Song Phương'}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              {profile?.title || 'Product Designer & Dev'}
            </span>
          </div>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
      </div>

      {/* 3. Sub-cards Grid - Row 1 */}
      <div className="grid grid-cols-3 gap-2.5 w-full">
        {/* CARD 1 (Focus) */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-indigo-400 dark:text-indigo-300 tracking-wider">FOCUS</span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-200 mt-1 leading-none">UI/UX</span>
            <span className="text-[9px] text-indigo-500/80 dark:text-indigo-400/80 mt-0.5">Design</span>
          </div>
        </div>

        {/* CARD 2 (Stack) */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-blue-400 dark:text-blue-300 tracking-wider">STACK</span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-blue-700 dark:text-blue-200 mt-1 leading-none">React</span>
            <span className="text-[9px] text-blue-500/80 dark:text-blue-400/80 mt-0.5">Node · TS</span>
          </div>
        </div>

        {/* CARD 3 (Status) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-emerald-400 dark:text-emerald-300 tracking-wider">STATUS</span>
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-200 mt-1 leading-none">Open</span>
            <span className="text-[9px] text-emerald-500/80 dark:text-emerald-400/80 mt-0.5">to work</span>
          </div>
        </div>
      </div>

      {/* 4. Lưới 2 cột vừa (Medium-cards Grid - Row 2) */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {/* CARD LOCATION */}
        <div className="bg-neutral-50/60 dark:bg-zinc-800/40 p-3 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider">LOCATION</span>
            <span className="text-xs font-bold text-gray-800 dark:text-white mt-1 leading-none">Hanoi, VN</span>
            <span className="text-[9px] text-gray-500 mt-0.5">GMT+7</span>
          </div>
          <MapPin className="w-4 h-4 text-gray-400 dark:text-zinc-500" strokeWidth={2.5} />
        </div>

        {/* CARD TOOLS */}
        <div className="bg-neutral-50/60 dark:bg-zinc-800/40 p-3 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex flex-col justify-between">
          <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider">TOOLS</span>
          <div className="flex items-center flex-wrap gap-1 mt-1">
            <span className="bg-purple-100/80 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[8px] font-bold px-1.5 py-0.5 rounded-md inline-block">
              Figma
            </span>
            <span className="bg-blue-100/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[8px] font-bold px-1.5 py-0.5 rounded-md inline-block">
              VS Code
            </span>
            <span className="bg-green-100/80 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-[8px] font-bold px-1.5 py-0.5 rounded-md inline-block">
              Git
            </span>
          </div>
        </div>
      </div>

      {/* 5. Quick Links Grid - Row 3 */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {/* GitHub */}
        <div
          onClick={handleGithubClick}
          className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700 dark:text-zinc-300"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
          <span className="text-[9px] font-bold text-gray-500 dark:text-zinc-400">GitHub</span>
        </div>

        {/* Zalo */}
        <div
          onClick={handleZaloClick}
          className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <MessageCircle className="w-[18px] h-[18px] text-[#0068FF] fill-[#0068FF]/10" strokeWidth={2.5} />
          <span className="text-[9px] font-bold text-gray-500 dark:text-zinc-400">Zalo</span>
        </div>

        {/* Email */}
        <div
          onClick={handleEmailClick}
          className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <Mail className="w-[18px] h-[18px] text-red-500 dark:text-red-400" strokeWidth={2.5} />
          <span className="text-[9px] font-bold text-gray-500 dark:text-zinc-400">Email</span>
        </div>

        {/* Portfolio */}
        <div
          onClick={handlePortfolioClick}
          className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1 hover:scale-105 active:scale-95 transition-transform duration-150 cursor-pointer"
        >
          <Globe className="w-[18px] h-[18px] text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
          <span className="text-[9px] font-bold text-gray-500 dark:text-zinc-400">Portfolio</span>
        </div>
      </div>
    </div>
  );
};
