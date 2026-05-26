import React, { useEffect, useState } from 'react';
import { useOSStore } from './store/useOSStore';
import { Wallpaper } from './components/desktop/Wallpaper';
import { MenuBar } from './components/desktop/MenuBar';
import { Dock } from './components/desktop/Dock';
import { Window } from './components/desktop/Window';
import { IOSView } from './components/mobile/IOSView';
import { MobilePreview } from './components/mobile/MobilePreview';
import { APP_DEFS, SOCIAL_APPS } from './apps';
import notesIcon from './icons/Notes.png';
import { MascotChat } from './components/desktop/MascotChat';
import { profileService } from './services/profileService';
import { productService } from './services/productService';
import { projectService } from './services/projectService';
import { chatbotService } from './services/chatbotService';

export const App: React.FC = () => {
  const [baseSeoTitle, setBaseSeoTitle] = useState('Song Phương');
  const tweaks = useOSStore((state) => state.tweaks);
  const windows = useOSStore((state) => state.windows);
  const setOpenMenu = useOSStore((state) => state.setOpenMenu);
  const openApp = useOSStore((state) => state.openApp);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const minWindow = useOSStore((state) => state.minWindow);
  const maxWindow = useOSStore((state) => state.maxWindow);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const updateWindow = useOSStore((state) => state.updateWindow);
  const focusedId = useOSStore((state) => state.focusedId);
  const fetchSocials = useOSStore((state) => state.fetchSocials);
  const socials = useOSStore((state) => state.socials);

  const iosOpenAppId = useOSStore((state) => state.iosOpenAppId);
  const setIosOpenAppId = useOSStore((state) => state.setIosOpenAppId);
  const isMobile = useOSStore((state) => state.isMobile);

  const setSystemReady = useOSStore((state) => state.setSystemReady);
  const isSystemReady = useOSStore((state) => state.isSystemReady);

  // Initialize About + Notes (Welcome) side-by-side on first desktop load
  useEffect(() => {
    if (isSystemReady && !isMobile) {
      setTimeout(() => openApp('about', APP_DEFS), 100);
      setTimeout(() => openApp('welcome', APP_DEFS), 250);
    }
  }, [isSystemReady, isMobile, openApp]);

  // Handle outside click to close active Menu Bar dropdown
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenu(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [setOpenMenu]);

  // Update browser document.title dynamically based on focused app
  useEffect(() => {
    const activeApp = APP_DEFS.find((a) => a.id === focusedId);
    if (activeApp) {
      document.title = `${activeApp.name} | ${baseSeoTitle}`;
    } else {
      document.title = baseSeoTitle;
    }
  }, [focusedId, baseSeoTitle]);

  // Master Boot Sequence
  useEffect(() => {
    const bootSystem = async () => {
      try {
        // Run all API fetches concurrently in parallel to maximize loading speed.
        // Using services here ensures responses are stored in the memory caches instantly.
        const [
          _socialsRes,
          seoRes,
          _profileRes,
          _timelineRes,
          _projectsRes,
          _productsRes,
          _chatbotRes
        ] = await Promise.allSettled([
          fetchSocials(),
          fetch('/api/seo').then((r) => (r.ok ? r.json() : null)),
          profileService.getProfile('vn'),
          profileService.getTimeline('vn'),
          projectService.getProjects('vn'),
          productService.getProducts('vn'),
          chatbotService.getQAList()
        ]);

        // Process SEO data
        if (seoRes.status === 'fulfilled' && seoRes.value) {
          const seo = seoRes.value;
          if (seo.seo_title) {
            setBaseSeoTitle(seo.seo_title);
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', seo.seo_title);
            document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', seo.seo_title);
          }
          if (seo.seo_description) {
            document.querySelector('meta[name="description"]')?.setAttribute('content', seo.seo_description);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', seo.seo_description);
            document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', seo.seo_description);
          }
          if (seo.seo_keywords) {
            document.querySelector('meta[name="keywords"]')?.setAttribute('content', seo.seo_keywords);
          }
          if (seo.og_image) {
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', seo.og_image);
            document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', seo.og_image);
          }
          if (seo.twitter_card) {
            document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', seo.twitter_card);
          }
        }
        
      } catch (e) {
        console.error('Boot sequence error:', e);
      } finally {
        // Remove the static 1.2s delay for instant ready once data has been loaded.
        setSystemReady(true);
      }
    };

    bootSystem();
  }, [fetchSocials, setSystemReady]);

  // Open Social apps or normal apps inside simulated iOS smartphone screens
  // Zalo always opens as an in-app card (same experience as desktop)
  // Other social platforms open their URL in a new tab using the dynamic DB value
  const handleIOSAppOpen = (id: string) => {
    // Zalo: open the ZaloApp card inside iOS view (NOT external link)
    if (id === 'zalo') {
      setIosOpenAppId('zalo');
      return;
    }

    // Other social apps: open dynamic URL from DB, fall back to static
    const social = SOCIAL_APPS.find((s) => s.id === id);
    if (social) {
      const matched = socials.find(s => s.platform === id);
      const url = matched?.url || social.mailto || social.url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Normal apps (About, Finder, etc.)
    setIosOpenAppId(id);
  };

  if (!isSystemReady) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center z-[9999]">
        <div className="w-16 h-16 mb-12">
          <svg viewBox="0 0 170 170" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69.04-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.75.21-9.84-2.2-15.27-7.23-3.03-2.92-6.41-7.16-10.14-12.72-6.85-10.22-11.83-21.57-14.92-34.07-3.08-12.49-3.23-23.77-.45-33.84 2.1-7.51 5.92-13.88 11.45-19.12 5.53-5.24 11.82-8 18.88-8.29 4.88-.13 10.15 1.48 15.82 4.82 5.67 3.35 9.22 5.06 10.66 5.12 1.9-.13 5.91-2.07 12.04-5.83 6.13-3.76 11.41-5.46 15.84-5.07 7.03.38 12.82 2.64 17.38 6.78 2.05 1.83 4.11 4.19 6.2 7.07-8.6 5.04-12.86 11.75-12.78 20.14.07 8.01 3.51 14.88 10.3 20.62 3.19 2.7 6.94 4.54 11.23 5.53-1.6 5.2-3.8 10.32-6.58 15.35Z"/>
            <path d="M117.84 32.22c-3.79 4.31-8.52 7.07-14.22 8.27-1.12-6.26.25-11.84 4.1-16.72 2.5-3.21 5.66-5.59 9.47-7.14 3.82-1.55 7.64-2.12 11.46-1.7-1 6.55-2.6 12.1-4.8 16.65-2.21 4.55-4.22 7.55-6.01 8.99Z"/>
          </svg>
        </div>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-pulse" style={{ width: '40%', animationDuration: '1s' }} />
        </div>
      </div>
    );
  }



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

  return (
    <div className="desktop relative w-screen h-screen overflow-hidden isolation-auto">
      {/* Dynamic desktop wallpapers */}
      <Wallpaper />

      {/* Fixed top Menu bar */}
      <MenuBar />



      {/* Desktop shortcuts icons */}
      <div className="desktop-icons absolute top-12 left-0 right-0 md:left-auto md:right-5 grid grid-cols-2 gap-y-6 gap-x-4 px-4 py-6 justify-items-center md:flex md:flex-col md:gap-4 md:px-0 md:py-0 z-10 select-none max-w-full md:max-w-none">
        {/* Finder (Song Phương) */}
        <div
          onDoubleClick={() => openApp('finder', APP_DEFS)}
          className="desktop-icon flex flex-col items-center gap-1 w-[80px] md:w-[76px] cursor-pointer p-1 rounded-md hover:bg-white/15 transition-colors"
        >
          <div className="desktop-icon-art w-[48px] h-[48px] md:w-12 md:h-12 rounded-md bg-transparent flex items-center justify-center overflow-visible">
            <div className="w-full h-full bg-[#1853a1] rounded-[22%] flex items-center justify-center p-[3px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.25)] border border-[#124285]">
              <img
                src="/songphuong-logo.png"
                alt="Song Phương"
                className="w-[78%] h-[78%] object-contain pointer-events-none drop-shadow-md"
              />
            </div>
          </div>
          <div className="desktop-icon-label text-[10px] md:text-[12px] font-medium text-white drop-shadow-md md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-center max-w-[80px] md:max-w-none truncate md:whitespace-normal md:break-words leading-tight">
            Song Phương
          </div>
        </div>

        {/* Notes (Welcome.md) */}
        <div
          onDoubleClick={() => openApp('welcome', APP_DEFS)}
          className="desktop-icon flex flex-col items-center gap-1 w-[80px] md:w-[76px] cursor-pointer p-1 rounded-md hover:bg-white/15 transition-colors"
        >
          <div className="desktop-icon-art w-[48px] h-[48px] md:w-12 md:h-12 rounded-md bg-transparent flex items-center justify-center overflow-hidden">
            <img src={notesIcon} alt="Notes icon" className="w-full h-full object-contain" />
          </div>
          <div className="desktop-icon-label text-[10px] md:text-[12px] font-medium text-white drop-shadow-md md:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] text-center max-w-[80px] md:max-w-none truncate md:whitespace-normal md:break-words leading-tight">
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
        onOpen={(id) => openApp(id, APP_DEFS)}
      />

      {/* Mascot Chat Assistant (SP-Bot) Widget */}
      <MascotChat />

      {/* Live iPhone bezel on desktop */}
      {tweaks.showMobilePreview && (
        <MobilePreview apps={APP_DEFS} socialApps={SOCIAL_APPS} />
      )}


    </div>
  );
};

export default App;
