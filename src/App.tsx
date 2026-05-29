import React, { useEffect, useRef, useState } from 'react';
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
  const [, setBaseSeoTitle] = useState('Song Phương');
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

  const didOpenInitialWindows = useRef(false);

  // Initialize About + Notes (Welcome) side-by-side on first desktop load
  useEffect(() => {
    if (!didOpenInitialWindows.current && !isMobile) {
      didOpenInitialWindows.current = true;
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

  // Update browser document.title to a fixed string
  useEffect(() => {
    document.title = 'Hoàng Minh Dương';
  }, []);

  // Warm shared data caches in the background without blocking first paint.
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
      }
    };

    bootSystem();
  }, [fetchSocials]);

  useEffect(() => {
    const refreshContactLinks = () => {
      void fetchSocials();
    };
    window.addEventListener('profile-updated', refreshContactLinks);
    window.addEventListener('social-links-updated', refreshContactLinks);
    return () => {
      window.removeEventListener('profile-updated', refreshContactLinks);
      window.removeEventListener('social-links-updated', refreshContactLinks);
    };
  }, [fetchSocials]);

  // Open Social apps or normal apps inside simulated iOS smartphone screens
  // Zalo always opens as an in-app card (same experience as desktop)
  // Other social platforms open their URL in a new tab using the dynamic DB value
  const handleIOSAppOpen = (id: string) => {
    // Zalo: open the ZaloApp card inside iOS view (NOT external link)
    if (id === 'zalo') {
      setIosOpenAppId('zalo');
      return;
    }

    // Other social apps: open dynamic URL from DB only.
    const social = SOCIAL_APPS.find((s) => s.id === id);
    if (social) {
      const matched = socials.find(s => s.platform === id);
      const url = matched?.url;
      if (!url) {
        console.warn(`Missing database social URL for ${id}`);
        return;
      }
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Normal apps (About, Finder, etc.)
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
            <div className="w-full h-full bg-[#1853a1] rounded-[22%] flex items-center justify-center p-[1.5px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.25)] border border-[#124285]">
              <img
                src="/songphuong-logo.png"
                alt="Song Phương"
                className="w-[95%] h-[95%] object-contain pointer-events-none drop-shadow-md"
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
