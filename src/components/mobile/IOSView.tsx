import React from 'react';
import { Wallpaper } from '../desktop/Wallpaper';
import { AppDefinition, SocialAppDefinition } from '../../types';

import { BentoAboutWidget } from './BentoAboutWidget';

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
  const openApp = apps.find((a) => a.id === openAppId);

  return (
    <div className="fixed inset-0 z-[9999] bg-black select-none font-sans overflow-hidden">
      {/* Background wallpaper */}
      <div className="absolute inset-0">
        <Wallpaper />
      </div>

      {/* iOS Top Bar placeholder (cleared per request) */}
      <div className="absolute top-0 left-0 right-0 h-11 z-10 pointer-events-none"></div>

      {/* Home Screen Grid Layout */}
      {!openApp && (
        <>
          <div className="absolute inset-x-0 top-[60px] bottom-[100px] px-[22px] py-1 grid grid-cols-4 gap-y-5 gap-x-3.5 align-content-start overflow-y-auto">
            {/* Main Spec Widget */}
            <BentoAboutWidget onClick={() => onOpenApp('about')} />
            
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
          <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-max mx-auto bg-white/22 dark:bg-black/30 backdrop-blur-xl rounded-[26px] px-4 py-2 flex items-center justify-center space-x-2.5 border border-white/30 z-[5]">
            {apps.slice(0, 4).map((app) => (
              <div
                key={app.id}
                onClick={() => onOpenApp(app.id)}
                className={`${app.id === 'finder' ? 'w-[38px] h-[38px]' : 'w-[48px] h-[48px]'} flex items-center justify-center cursor-pointer hover:scale-95 transition-transform p-0 bg-transparent border-none shadow-none [&>img]:w-full [&>img]:h-full [&>img]:object-contain [&>img]:pointer-events-none`}
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
