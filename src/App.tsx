import React, { useEffect } from 'react';
import { useOSStore } from './store/useOSStore';
import { Wallpaper } from './components/desktop/Wallpaper';
import { MenuBar } from './components/desktop/MenuBar';
import { Dock } from './components/desktop/Dock';
import { Window } from './components/desktop/Window';
import { TweaksPanel, TweakSection, TweakRadio, TweakSlider, TweakToggle } from './components/desktop/TweaksPanel';
import { IOSView } from './components/mobile/IOSView';
import { MobilePreview } from './components/mobile/MobilePreview';
import { APP_DEFS, SOCIAL_APPS } from './apps';

export const App: React.FC = () => {
  const tweaks = useOSStore((state) => state.tweaks);
  const setTweak = useOSStore((state) => state.setTweak);
  const windows = useOSStore((state) => state.windows);
  const openMenu = useOSStore((state) => state.openMenu);
  const setOpenMenu = useOSStore((state) => state.setOpenMenu);
  const openApp = useOSStore((state) => state.openApp);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const minWindow = useOSStore((state) => state.minWindow);
  const maxWindow = useOSStore((state) => state.maxWindow);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const updateWindow = useOSStore((state) => state.updateWindow);
  const focusedId = useOSStore((state) => state.focusedId);

  const iosOpenAppId = useOSStore((state) => state.iosOpenAppId);
  const setIosOpenAppId = useOSStore((state) => state.setIosOpenAppId);
  const isMobile = useOSStore((state) => state.isMobile);

  // Initialize About + Notes (Welcome) side-by-side on first desktop load
  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => openApp('about', APP_DEFS), 100);
      setTimeout(() => openApp('welcome', APP_DEFS), 250);
    }
  }, [isMobile, openApp]);

  // Handle outside click to close active Menu Bar dropdown
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenu(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [setOpenMenu]);

  // Open Social apps or normal apps inside simulated iOS smartphone screens
  const handleIOSAppOpen = (id: string) => {
    const social = SOCIAL_APPS.find((s) => s.id === id);
    if (social) {
      window.open(social.mailto || social.url, '_blank');
      return;
    }
    setIosOpenAppId(id);
  };

  if (isMobile) {
    return (
      <IOSView
        apps={APP_DEFS}
        socialApps={SOCIAL_APPS}
        openAppId={iosOpenAppId}
        onOpenApp={handleIOSAppOpen}
        onClose={() => setIosOpenAppId(null)}
      />
    );
  }

  const runningIds = windows.map((w) => w.id);

  return (
    <div className="desktop relative w-screen h-screen overflow-hidden isolation-auto">
      {/* Dynamic desktop wallpapers */}
      <Wallpaper />
      
      {/* Fixed top Menu bar */}
      <MenuBar />

      {/* Desktop shortcuts icons */}
      <div className="desktop-icons absolute top-10 right-5 flex flex-col gap-4 z-10 select-none">
        {/* Finder (Song Phuong) */}
        <div
          onDoubleClick={() => openApp('finder', APP_DEFS)}
          className="desktop-icon flex flex-col items-center gap-1 w-[76px] cursor-pointer p-1 rounded-md hover:bg-white/15 transition-colors"
        >
          <div className="desktop-icon-art w-12 h-12 rounded-md bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="white" opacity="0.9">
              <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
            </svg>
          </div>
          <div className="desktop-icon-label text-white text-[12px] font-medium text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            Song Phương
          </div>
        </div>
        
        {/* Notes (Welcome.md) */}
        <div
          onDoubleClick={() => openApp('welcome', APP_DEFS)}
          className="desktop-icon flex flex-col items-center gap-1 w-[76px] cursor-pointer p-1 rounded-md hover:bg-white/15 transition-colors"
        >
          <div className="desktop-icon-art w-12 h-12 rounded-md bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <path d="M14 2v6h6" />
            </svg>
          </div>
          <div className="desktop-icon-label text-white text-[12px] font-medium text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            README.md
          </div>
        </div>
      </div>

      {/* Layer containing open Windows */}
      <div className="windows-layer absolute inset-0 z-20 pointer-events-none">
        {windows.map((w) => (
          <div key={w.id} className="pointer-events-auto">
            <Window
              win={w}
              focused={focusedId === w.id}
              onClose={() => closeWindow(w.id)}
              onMin={() => minWindow(w.id)}
              onMax={() => maxWindow(w.id)}
              onFocus={() => focusWindow(w.id)}
              onChange={(next) => updateWindow(w.id, next)}
              windowStyle={tweaks.windowStyle}
            />
          </div>
        ))}
      </div>

      {/* Bottom sliding application Dock */}
      <Dock
        apps={APP_DEFS}
        runningIds={runningIds}
        onOpen={(id) => openApp(id, APP_DEFS)}
        dockSize={tweaks.dockSize}
        magnify={tweaks.dockMagnify}
        autoHide={tweaks.dockAutoHide}
      />

      {/* Live iPhone bezel on desktop */}
      {tweaks.showMobilePreview && (
        <MobilePreview apps={APP_DEFS} socialApps={SOCIAL_APPS} />
      )}

      {/* Configuration Customizer panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Window style">
          <TweakRadio
            label="Style Theme"
            value={tweaks.windowStyle}
            onChange={(v) => setTweak('windowStyle', v)}
            options={[
              { value: 'sonoma', label: 'Sonoma' },
              { value: 'bigsur', label: 'Big Sur' },
              { value: 'monterey', label: 'Monterey' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Dock Preferences">
          <TweakSlider
            label="Size"
            value={tweaks.dockSize}
            onChange={(v) => setTweak('dockSize', v)}
            min={36}
            max={72}
            step={2}
            unit="px"
          />
          <TweakSlider
            label="Magnification"
            value={tweaks.dockMagnify}
            onChange={(v) => setTweak('dockMagnify', v)}
            min={0.5}
            max={2}
            step={0.05}
            unit="x"
          />
          <TweakToggle
            label="Auto-hide Dock"
            value={tweaks.dockAutoHide}
            onChange={(v) => setTweak('dockAutoHide', v)}
          />
        </TweakSection>
        <TweakSection title="Mobile Emulation">
          <TweakToggle
            label="Show iPhone mockup"
            value={tweaks.showMobilePreview}
            onChange={(v) => setTweak('showMobilePreview', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
};

export default App;
