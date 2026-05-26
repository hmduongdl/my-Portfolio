import React, { useEffect, useState } from 'react';
import { useOSStore } from './store/useOSStore';
import { Wallpaper } from './components/desktop/Wallpaper';
import { MenuBar } from './components/desktop/MenuBar';
import { Dock } from './components/desktop/Dock';
import { Window } from './components/desktop/Window';
import { IOSView } from './components/mobile/IOSView';
import { MobilePreview } from './components/mobile/MobilePreview';
import { APP_DEFS, SOCIAL_APPS } from './apps';
import finderIcon from './icons/Finder.png';
import notesIcon from './icons/Notes.png';

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

  // Fetch dynamic socials from database on mount
  useEffect(() => {
    fetchSocials();
  }, [fetchSocials]);

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

  // Load and apply SEO Metadata dynamically from Neon DB settings
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await fetch('/api/seo');
        if (!res.ok) return;
        const seo = await res.json();

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
      } catch (e) {
        console.error('Failed to load SEO metadata:', e);
      }
    };
    fetchSEO();
  }, []);

  // Update browser document.title dynamically based on focused app
  useEffect(() => {
    const activeApp = APP_DEFS.find((a) => a.id === focusedId);
    if (activeApp) {
      document.title = `${activeApp.name} | ${baseSeoTitle}`;
    } else {
      document.title = baseSeoTitle;
    }
  }, [focusedId, baseSeoTitle]);

  // Vibe check diagnostics for SQL-backed endpoints on application mount
  useEffect(() => {
    const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
    const endpoints = ['/products', '/projects', '/profile'].map((path) => `${API_BASE_URL}${path}`);

    const pingEndpoint = async (url: string) => {
      const response = await fetch(url, { cache: 'no-store' });
      return { url, ok: response.ok, status: response.status };
    };

    const runDiagnostics = async () => {
      const results = await Promise.allSettled(endpoints.map(pingEndpoint));
      results.forEach((result, index) => {
        const endpoint = endpoints[index];
        if (result.status === 'fulfilled') {
          const { ok, status } = result.value;
          if (ok) {
            console.log(`🟢 [SQL Engine] Connected to ${endpoint} (${status} OK)`);
          } else {
            console.log(`🔴 [SQL Engine] Connection failed - ${endpoint} returned ${status}`);
          }
        } else {
          console.log(`🔴 [SQL Engine] Connection failed - ${endpoint} offline (${result.reason})`);
        }
      });
    };

    runDiagnostics();
  }, []);

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
      <div className="desktop-icons absolute top-12 right-4 md:right-5 grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-4 z-10 select-none max-w-[calc(100vw-2rem)] md:max-w-none">
        {/* Finder (Song Phương) */}
        <div
          onDoubleClick={() => openApp('finder', APP_DEFS)}
          className="desktop-icon flex flex-col items-center gap-1 w-[76px] cursor-pointer p-1 rounded-md hover:bg-white/15 transition-colors"
        >
          <div className="desktop-icon-art w-12 h-12 rounded-md bg-transparent flex items-center justify-center overflow-hidden">
            <img src={finderIcon} alt="Finder icon" className="w-full h-full object-contain" />
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
          <div className="desktop-icon-art w-12 h-12 rounded-md bg-transparent flex items-center justify-center overflow-hidden">
            <img src={notesIcon} alt="Notes icon" className="w-full h-full object-contain" />
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
        onOpen={(id) => openApp(id, APP_DEFS)}
      />

      {/* Live iPhone bezel on desktop */}
      {tweaks.showMobilePreview && (
        <MobilePreview apps={APP_DEFS} socialApps={SOCIAL_APPS} />
      )}


    </div>
  );
};

export default App;
