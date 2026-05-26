import React, { useState, useEffect } from 'react';
import { Wallpaper } from '../desktop/Wallpaper';
import { AppDefinition, SocialAppDefinition } from '../../types';

interface AboutWidgetProps {
  onClick: () => void;
}

const AboutWidget: React.FC<AboutWidgetProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="col-span-4 row-span-2 bg-white/80 backdrop-blur-xl rounded-[26px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.6)] cursor-pointer flex gap-4 items-center border border-white/40 select-none hover:scale-[0.98] transition-transform duration-300"
    >
      <div className="relative w-[76px] h-[76px] rounded-full bg-gradient-to-br from-[#E2F1FF] via-[#B5CCE6] to-[#7DA2CA] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(31,78,128,0.25)] flex items-center justify-center text-[34px] font-black text-[#1F4E80] flex-shrink-0 border border-white/60">
        SP
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-[10px] font-bold text-primary/80 uppercase tracking-widest mb-0.5">About me</div>
        <div className="text-[19px] font-bold text-ink tracking-tight mb-0.5 truncate">Song Phương</div>
        <div className="text-[13px] font-medium text-ink-2 leading-tight truncate">Product Designer & Dev</div>
        <div className="text-[11px] font-medium text-ink-3 mt-1.5 flex items-center gap-1.5 truncate">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="opacity-70"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Hanoi, Vietnam
        </div>
      </div>
    </div>
  );
};

interface IOSViewProps {
  apps: AppDefinition[];
  socialApps: SocialAppDefinition[];
  openAppId: string | null;
  onOpenApp: (id: string) => void;
  onClose: () => void;
}

export const IOSView: React.FC<IOSViewProps> = ({
  apps,
  socialApps = [],
  openAppId,
  onOpenApp,
  onClose,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const clock = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
  const openApp = apps.find((a) => a.id === openAppId);

  return (
    <div className="fixed inset-0 z-[9999] bg-black select-none font-sans overflow-hidden">
      {/* Background wallpaper */}
      <div className="absolute inset-0">
        <Wallpaper />
      </div>

      {/* iOS Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 text-white text-[15px] font-semibold z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
        <div>{clock}</div>
        <div className="flex gap-1.5 items-center">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <path d="M1 7h2v3H1zm4-2h2v5H5zm4-2h2v7H9zm4-2h2v9h-2z" />
          </svg>
          <svg width="24" height="11" viewBox="0 0 24 11">
            <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.6" />
            <rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor" />
            <rect x="21" y="3" width="2" height="5" rx="0.6" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Home Screen Grid Layout */}
      {!openApp && (
        <>
          <div className="absolute inset-x-0 top-[60px] bottom-[100px] px-[22px] py-1 grid grid-cols-4 gap-y-5 gap-x-3.5 align-content-start overflow-y-auto">
            {/* Main Spec Widget */}
            <AboutWidget onClick={() => onOpenApp('about')} />
            
            {/* Social Apps */}
            {socialApps.map((app) => (
              <div
                key={app.id}
                onClick={() => onOpenApp(app.id)}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div
                  className="w-[60px] h-[60px] flex items-center justify-center p-0 bg-transparent border-none shadow-none"
                >
                  {app.icon}
                </div>
                <div className="text-white text-[12px] font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] truncate max-w-full text-center">
                  {app.name}
                </div>
              </div>
            ))}
          </div>

          {/* iOS Bottom Dock */}
          <div className="absolute bottom-[30px] left-3.5 right-3.5 bg-white/22 backdrop-blur-md rounded-[26px] p-2.5 flex justify-around border border-white/30 z-[5]">
            {apps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                onClick={() => onOpenApp(app.id)}
                className="w-[54px] h-[54px] flex items-center justify-center cursor-pointer hover:scale-95 transition-transform p-0 bg-transparent border-none shadow-none"
              >
                {app.icon}
              </div>
            ))}
          </div>
        </>
      )}

      {/* App Opening Overlay Frame */}
      {openApp && (
        <div className="absolute top-11 left-2 right-2 bottom-2 bg-paper/90 mac-vibrancy rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col z-[15] animate-slide-up">
          {/* Internal Navbar */}
          <div className="px-4 py-3.5 border-b border-rule flex items-center bg-transparent relative flex-shrink-0">
            <button
              onClick={onClose}
              className="border-none bg-transparent text-primary text-[15px] font-medium cursor-pointer p-0 select-none"
            >
              ‹ Home
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-ink">
              {openApp.name}
            </div>
          </div>
          
          {/* Scrollable Compact Mode Sub-app Body */}
          <div className="flex-1 overflow-auto bg-transparent">
            {React.createElement(openApp.Component, { compact: true })}
          </div>
        </div>
      )}

      {/* iOS Gesture Home pill */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[134px] h-[5px] rounded-[3px] bg-white opacity-85 z-20 cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
};
