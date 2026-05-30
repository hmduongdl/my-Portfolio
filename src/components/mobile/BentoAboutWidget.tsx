import React, { useEffect, useState } from 'react';
import { MapPin, Cpu, Palette, Code, Handshake } from 'lucide-react';
import { useOSStore } from '../../store/useOSStore';
import { profileService, ProfileData } from '../../services/profileService';

interface BentoAboutWidgetProps {
  onClick: () => void;
  scale?: number;
}

export const BentoAboutWidget: React.FC<BentoAboutWidgetProps> = ({ onClick, scale = 1 }) => {
  const language = useOSStore((state) => state.language);
  const { tweaks } = useOSStore();
  const stats = tweaks.aboutWidgetStats || {
    focusTitle: 'UI/UX', focusSub: 'Design',
    statusTitle: 'Open', statusSub: 'to work',
    locationTitle: 'DaLat, VN', locationSub: 'GMT+7'
  };

  const [profile, setProfile] = useState<ProfileData | null>(() => profileService.getCachedProfile(language));
  const [profileLoadFailed, setProfileLoadFailed] = useState(false);

  useEffect(() => {
    const cachedProfile = profileService.getCachedProfile(language);
    if (cachedProfile) {
      setProfile(cachedProfile);
      setProfileLoadFailed(false);
    }

    profileService.getProfile(language)
      .then((data) => {
        setProfile(data);
        setProfileLoadFailed(false);
      })
      .catch((err) => {
        console.error('Failed to load profile in widget:', err);
        setProfile(null);
        setProfileLoadFailed(true);
      });
  }, [language]);

  const experienceYears = Math.max(1, new Date().getFullYear() - 2025);

  return (
    <div
      onClick={onClick}
      className="col-span-4 cursor-pointer select-none hover:scale-[0.98] active:scale-[0.97] transition-all duration-300 max-w-md w-full mx-auto bg-white/75 dark:bg-zinc-900/75 backdrop-blur-lg rounded-3xl p-4 pb-3 shadow-2xl border border-white/20 flex flex-col space-y-3.5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* 1. Widget Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <img
            src={profile?.avatarUrl || '/images/brand/songphuong-logo.png'}
            className="w-12 h-12 rounded-full border border-white/50 object-cover shadow-sm bg-neutral-100"
            alt="Avatar"
            loading="eager"
            decoding="async"
          />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider">ABOUT ME</span>
            <span className="text-base font-bold text-gray-800 dark:text-white mt-0.5 leading-none">
              {profile?.name || (profileLoadFailed ? 'DB unavailable' : 'Đang tải...')}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
              {profile?.title || (profileLoadFailed ? 'Không tải được profile' : 'Đang tải profile')}
            </span>
          </div>
        </div>
        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse" />
      </div>

      {/* 2. Sub-cards Grid - Row 1 */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {/* CARD 1 (Focus) */}
        <div className="bg-indigo-50/70 dark:bg-indigo-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-indigo-400 dark:text-indigo-300 tracking-wider">FOCUS</span>
          <div className="flex flex-col mt-2">
            <span className="text-sm font-extrabold text-indigo-700 dark:text-indigo-200 leading-none">{stats.focusTitle}</span>
            <span className="text-[9px] text-indigo-500/80 dark:text-indigo-400/80 mt-0.5">{stats.focusSub}</span>
          </div>
        </div>

        {/* CARD 2 (Experience) */}
        <div className="bg-blue-50/70 dark:bg-blue-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-blue-400 dark:text-blue-300 tracking-wider">EXPERIENCE</span>
          <div className="flex flex-col mt-2">
            <span className="text-sm font-extrabold text-blue-700 dark:text-blue-200 leading-none">{experienceYears}+</span>
            <span className="text-[9px] text-blue-500/80 dark:text-blue-400/80 mt-0.5">Years coding</span>
          </div>
        </div>

        {/* CARD 3 (Status) */}
        <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 rounded-2xl flex flex-col justify-between">
          <span className="text-[8px] font-bold text-emerald-400 dark:text-emerald-300 tracking-wider">STATUS</span>
          <div className="flex flex-col mt-2">
            <span className="text-sm font-extrabold text-emerald-700 dark:text-emerald-200 leading-none">{stats.statusTitle}</span>
            <span className="text-[9px] text-emerald-500/80 dark:text-emerald-400/80 mt-0.5">{stats.statusSub}</span>
          </div>
        </div>
      </div>

      {/* 3. Lưới 2 cột vừa (Medium-cards Grid - Row 2) */}
      <div className="grid grid-cols-2 gap-2 w-full">
        {/* CARD LOCATION */}
        <div className="bg-neutral-50/60 dark:bg-zinc-800/40 p-3 rounded-2xl border border-gray-100/50 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 dark:text-zinc-500 tracking-wider">LOCATION</span>
            <span className="text-xs font-bold text-gray-800 dark:text-white mt-1 leading-none">{stats.locationTitle}</span>
            <span className="text-[9px] text-gray-500 mt-0.5">{stats.locationSub}</span>
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

      {/* 4. Services Grid - Row 3 */}
      <div className="flex flex-col space-y-1.5 pt-1 border-t border-gray-100 dark:border-zinc-800/50">
        <div className="text-center text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest w-full">Dịch vụ</div>
        <div className="grid grid-cols-4 gap-2 w-full">
          {/* Build PC */}
          <div className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1">
            <Cpu className="w-[16px] h-[16px] text-gray-600 dark:text-zinc-400" strokeWidth={2.5} />
            <span className="text-[8.5px] font-bold text-gray-500 dark:text-zinc-400">Build PC</span>
          </div>

          {/* Design */}
          <div className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1">
            <Palette className="w-[16px] h-[16px] text-gray-600 dark:text-zinc-400" strokeWidth={2.5} />
            <span className="text-[8.5px] font-bold text-gray-500 dark:text-zinc-400">Design</span>
          </div>

          {/* Fullstack */}
          <div className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1">
            <Code className="w-[16px] h-[16px] text-gray-600 dark:text-zinc-400" strokeWidth={2.5} />
            <span className="text-[8.5px] font-bold text-gray-500 dark:text-zinc-400">Fullstack</span>
          </div>

          {/* Hợp tác */}
          <div className="bg-white/95 dark:bg-zinc-800/90 shadow-[0_2px_4px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-700 rounded-xl p-2 flex flex-col items-center justify-center space-y-1">
            <Handshake className="w-[16px] h-[16px] text-gray-600 dark:text-zinc-400" strokeWidth={2.5} />
            <span className="text-[8.5px] font-bold text-gray-500 dark:text-zinc-400">Hợp tác</span>
          </div>
        </div>
      </div>

      {/* 5. CTA Button */}
      <div className="w-full bg-[#007AFF] text-white rounded-[14px] py-2.5 flex justify-center items-center font-semibold text-[13px] shadow-[0_4px_12px_rgba(0,122,255,0.3)] select-none">
        Liên hệ ngay
      </div>

    </div>
  );
};
