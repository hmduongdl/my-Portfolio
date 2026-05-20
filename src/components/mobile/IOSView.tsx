import React, { useState, useEffect } from 'react';
import { useOSStore } from '../../store/useOSStore';
import { Wallpaper } from '../desktop/Wallpaper';
import { AppDefinition, SocialAppDefinition } from '../../types';

interface AboutWidgetProps {
  onClick: () => void;
}

const AboutWidget: React.FC<AboutWidgetProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="col-span-4 row-span-2 bg-white/92 backdrop-blur-md rounded-[22px] p-4 shadow-[0_4px_14px_rgba(0,0,0,0.18)] cursor-pointer flex gap-3.5 items-center border border-black/[0.06] select-none"
    >
      <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-primary-soft to-[#B5CCE6] flex items-center justify-center text-[32px] font-bold text-[#1F4E80] flex-shrink-0">
        SP
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-semibold text-ink-3 uppercase tracking-wider mb-0.5">About me</div>
        <div className="text-[17px] font-bold text-ink tracking-tight mb-1 truncate">Song Phương</div>
        <div className="text-[12px] text-ink-2 leading-tight truncate">Product Designer · Developer</div>
        <div className="text-[11px] text-ink-3 mt-1 truncate">Song Phương Tech · HN</div>
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
                  className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.18)] overflow-hidden"
                  style={{ background: app.bg }}
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
                className="w-[54px] h-[54px] rounded-[13px] flex items-center justify-center cursor-pointer overflow-hidden shadow-sm hover:scale-95 transition-transform"
                style={{ background: app.bg }}
              >
                {app.icon}
              </div>
            ))}
          </div>
        </>
      )}

      {/* App Opening Overlay Frame */}
      {openApp && (
        <div className="absolute top-11 left-2 right-2 bottom-2 bg-paper rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col z-[15] animate-slide-up">
          {/* Internal Navbar */}
          <div className="px-4 py-3.5 border-b border-rule flex items-center bg-paper-2 relative flex-shrink-0">
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
          <div className="flex-1 overflow-auto bg-paper">
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
