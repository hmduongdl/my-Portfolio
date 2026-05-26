import React, { useState, useEffect } from 'react';
import { Wallpaper } from '../desktop/Wallpaper';
import { AppDefinition, SocialAppDefinition } from '../../types';
import { useOSStore } from '../../store/useOSStore';
import { BentoAboutWidget } from './BentoAboutWidget';

type IosApp = Pick<AppDefinition, 'id' | 'name' | 'bg' | 'icon'>;

interface MobileScreenProps {
  apps: IosApp[];
  socialApps: SocialAppDefinition[];
  openApp: AppDefinition | null | undefined;
  setOpenId: (id: string | null) => void;
}

const MobileScreen: React.FC<MobileScreenProps> = ({ apps, socialApps = [], openApp, setOpenId }) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const clock = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });

  return (
    <div className="absolute inset-0 font-sans select-none overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0">
        <Wallpaper />
      </div>

      {/* iPhone Bezel Status bar */}
      <div className="absolute top-0 left-0 right-0 h-[38px] flex items-center justify-between px-[22px] pt-2 text-white text-[13px] font-semibold z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        <div>{clock}</div>
        <div className="flex gap-1 items-center">
          <svg width="14" height="9" viewBox="0 0 16 11" fill="currentColor">
            <path d="M1 7h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-2h2v9h-2z" />
          </svg>
          <svg width="14" height="9" viewBox="0 0 16 11" fill="currentColor">
            <path d="M8 3.5C5.6 3.5 3.4 4.4 1.7 6L0 4.3C2.1 2.2 4.9 1 8 1s5.9 1.2 8 3.3L14.3 6c-1.7-1.6-3.9-2.5-6.3-2.5zM8 7c-1 0-2 .4-2.7 1.1L4 6.8C5.1 5.7 6.5 5 8 5s2.9.7 4 1.8l-1.3 1.3C10 7.4 9 7 8 7z" />
          </svg>
          <svg width="20" height="9" viewBox="0 0 24 11">
            <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.6" />
            <rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor" />
            <rect x="21" y="3" width="2" height="5" rx="0.6" fill="currentColor" />
          </svg>
        </div>
      </div>

      {!openApp && (
        <>
          <div className="absolute inset-x-0 top-[46px] bottom-[70px] px-3 py-0.5 grid grid-cols-4 gap-y-3 gap-x-1.5 align-content-start overflow-y-auto [&::-webkit-scrollbar]:w-0">
            {/* About Widget */}
            <div className="col-span-4 flex justify-center pb-2">
              <BentoAboutWidget onClick={() => setOpenId('about')} scale={0.7} />
            </div>

            {/* Social Icons */}
            {socialApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setOpenId(app.id)}
                className="flex flex-col items-center gap-0.5 cursor-pointer"
              >
                <div
                  className="w-11 h-11 flex items-center justify-center scale-[0.85] origin-center hover:scale-95 transition-transform p-0 bg-transparent border-none shadow-none"
                >
                  {app.icon}
                </div>
                <div className="text-white text-[8px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] mt-[-4px] truncate max-w-full text-center">
                  {app.name}
                </div>
              </div>
            ))}
          </div>

          {/* iOS Bottom Dock */}
          <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-max mx-auto bg-white/22 dark:bg-black/30 backdrop-blur-xl rounded-[18px] px-[8px] py-[6px] flex items-center justify-center space-x-1.5 border border-white/30 z-[5]">
            {apps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                onClick={() => setOpenId(app.id)}
                className={`${app.id === 'finder' ? 'w-[28px] h-[28px]' : 'w-[38px] h-[38px]'} flex items-center justify-center cursor-pointer scale-[0.85] origin-center hover:scale-[0.8] transition-transform p-0 bg-transparent border-none shadow-none [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>img]:pointer-events-none`}
              >
                {app.icon}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Opened Application frame inside mobile */}
      {openApp && (
        <div className="absolute top-[38px] left-0 right-0 bottom-0 bg-paper flex flex-col z-[15] animate-slide-up">
          <div className="px-3 py-2 border-b border-rule flex items-center bg-paper-2 relative flex-shrink-0">
            <button
              onClick={() => setOpenId(null)}
              className="border-none bg-transparent text-primary text-[13px] font-medium cursor-pointer p-0 select-none"
            >
              ‹ Home
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-[12px] font-semibold text-ink">
              {openApp.name}
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-paper text-[11px]">
            {React.createElement(openApp.Component, { compact: true })}
          </div>
        </div>
      )}

      {/* iOS gesture home bar */}
      <div
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-[100px] h-1 rounded-[3px] bg-white opacity-85 z-20 cursor-pointer"
        onClick={() => setOpenId(null)}
      />
    </div>
  );
};

interface MobilePreviewProps {
  apps: AppDefinition[];
  socialApps: SocialAppDefinition[];
}

export const MobilePreview: React.FC<MobilePreviewProps> = ({ apps, socialApps = [] }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 24, y: 60 });
  const [drag, setDrag] = useState<{ startX: number; startY: number; x: number; y: number } | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const socials = useOSStore((state) => state.socials);

  useEffect(() => {
    if (!drag) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 320, drag.x + dx)),
        y: Math.max(30, Math.min(window.innerHeight - 200, drag.y + dy)),
      });
    };
    const handleMouseUp = () => setDrag(null);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [drag]);

  const W = 280;
  const iosApps = apps.map((a) => ({ id: a.id, name: a.name, bg: a.bg, icon: a.icon }));
  const openApp = openId ? apps.find((a) => a.id === openId) : null;

  const handleOpenId = (id: string | null) => {
    if (!id) {
      setOpenId(null);
      return;
    }
    const social = socialApps.find((s) => s.id === id);
    if (social) {
      const matched = socials.find(s => s.platform === id);
      const url = matched?.url || social.mailto || social.url;
      window.open(url, '_blank');
      return;
    }
    setOpenId(id);
  };

  if (collapsed) {
    return (
      <div
        onClick={() => setCollapsed(false)}
        className="fixed z-[800] bg-paper-2/92 backdrop-blur-md border border-black/18 rounded-lg px-3 py-2 text-xs font-semibold text-ink-2 shadow-[0_8px_24px_rgba(0,0,0,0.15)] cursor-pointer flex items-center gap-2 select-none hover:bg-paper transition-colors"
        style={{ left: pos.x, top: pos.y }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink-3">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Show iPhone preview
      </div>
    );
  }

  return (
    <div
      className="fixed z-[800] select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: W + 18,
        filter: 'drop-shadow(0 22px 40px rgba(0,0,0,0.35))',
      }}
    >
      {/* drag handle bar */}
      <div
        onMouseDown={(e) => setDrag({ startX: e.clientX, startY: e.clientY, x: pos.x, y: pos.y })}
        className={`bg-paper-2/92 backdrop-blur-md border border-black/18 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-ink-2 uppercase tracking-wider mb-2 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${
          drag ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <span>Mobile preview · iPhone</span>
        <span
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(true);
          }}
          className="cursor-pointer text-ink-3 hover:text-ink text-[14px] leading-none px-1"
        >
          ×
        </span>
      </div>

      {/* Physical phone bezel */}
      <div className="w-[280px] h-[580px] bg-[#1A1D2E] rounded-[38px] p-[7px] relative shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.08),0_0_0_0.5px_rgba(0,0,0,0.4)]">
        {/* screen */}
        <div className="w-[266px] h-[566px] rounded-[32px] overflow-hidden relative bg-black">
          <MobileScreen
            apps={iosApps}
            socialApps={socialApps}
            openApp={openApp}
            setOpenId={handleOpenId}
          />
        </div>
        
        {/* Dynamic Island */}
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[88px] h-[26px] rounded-2xl bg-black z-50 pointer-events-none" />
        
        {/* side hardware buttons */}
        <div className="absolute left-[-1.5px] top-[100px] w-[2.5px] h-7 rounded-sm bg-[#0d0f1a]" />
        <div className="absolute left-[-1.5px] top-[150px] w-[2.5px] h-[50px] rounded-sm bg-[#0d0f1a]" />
        <div className="absolute left-[-1.5px] top-[210px] w-[2.5px] h-[50px] rounded-sm bg-[#0d0f1a]" />
        <div className="absolute right-[-1.5px] top-[160px] w-[2.5px] h-[70px] rounded-sm bg-[#0d0f1a]" />
      </div>
    </div>
  );
};
