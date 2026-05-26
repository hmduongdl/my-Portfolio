import { create } from 'zustand';
import { WindowInstance, AppID, AppDefinition, Tweaks } from '../types';

const MENU_BAR_H = 28;

const TWEAK_DEFAULTS: Tweaks = {
  windowStyle: 'bigsur',
  dockSize: 52,
  dockMagnify: 1.4,
  dockAutoHide: false,
  showMobilePreview: false,
  wallpaperType: 'video',
  wallpaperUrl: '/bkgr.mp4',
  aboutWidgetStats: {
    focusTitle: 'UI/UX',
    focusSub: 'Design',
    statusTitle: 'Open',
    statusSub: 'to work',
    locationTitle: 'DaLat, VN',
    locationSub: 'GMT+7',
  }
};


function loadTweaks(): Tweaks {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('os_tweaks');
      if (saved) {
        return { ...TWEAK_DEFAULTS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load tweaks from local storage', e);
    }
  }
  return { ...TWEAK_DEFAULTS };
}

function persistTweaks(t: Tweaks): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('os_tweaks', JSON.stringify(t));
    } catch (e) {
      console.warn('Failed to save tweaks to local storage', e);
    }
  }
}

function topZ(windows: WindowInstance[]): number {
  return windows.reduce((m, w) => Math.max(m, w.z), 10);
}

export interface SocialLink {
  id?: number;
  platform: string;
  label: string;
  url: string;
  visible?: boolean;
  order_index?: number;
}

interface OSState {
  windows: WindowInstance[];
  tweaks: Tweaks;
  isMobile: boolean;
  openMenu: string | null;
  focusedId: AppID | null;
  activeAppName: string;
  iosOpenAppId: string | null;
  language: 'en' | 'vn';
  socials: SocialLink[];

  openApp: (id: AppID, defs: AppDefinition[]) => void;
  closeWindow: (id: AppID) => void;
  minWindow: (id: AppID) => void;
  maxWindow: (id: AppID) => void;
  focusWindow: (id: AppID) => void;
  updateWindow: (id: AppID, patch: Partial<WindowInstance>) => void;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  setOpenMenu: (menu: string | null) => void;
  setIsMobile: (val: boolean) => void;
  setIosOpenAppId: (id: string | null) => void;
  setLanguage: (lang: 'en' | 'vn') => void;
  isSystemReady: boolean;
  setSystemReady: (ready: boolean) => void;
  fetchSocials: () => Promise<void>;
}

export const useOSStore = create<OSState>((set, get) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(
      'resize',
      () => {
        const next = window.innerWidth < 768;
        if (get().isMobile !== next) set({ isMobile: next });
      },
      { passive: true },
    );
  }

  return {
    windows: [],
    tweaks: loadTweaks(),
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    openMenu: null,
    focusedId: null,
    activeAppName: 'Finder',
    iosOpenAppId: null,
    language: 'vn',
    isSystemReady: false,
    setSystemReady: (ready) => set({ isSystemReady: ready }),

    openApp: (id, defs) =>
      set((state) => {
        const nextZ = topZ(state.windows) + 1;
        const appDef = defs.find((a) => a.id === id);
        const appTitle = appDef?.title ?? id;
        const existing = state.windows.find((w) => w.id === id);

        if (existing) {
          if (!existing.minimized) {
            return {
              windows: state.windows.map((w) => w.id === id ? { ...w, z: nextZ } : w),
              focusedId: id,
              activeAppName: appTitle,
            };
          }
          return {
            windows: state.windows.map((w) => w.id === id ? { ...w, minimized: false, z: nextZ } : w),
            focusedId: id,
            activeAppName: appTitle,
          };
        }

        const init = appDef?.initial;
        const baseW = init?.w ?? 600;
        const baseH = init?.h ?? 480;
        
        // Tự động scale kích thước cửa sổ trên màn hình lớn (ví dụ 2K, 4K)
        const scale = typeof window !== 'undefined' ? Math.min(2, Math.max(1, window.innerWidth / 1440)) : 1;
        const w = Math.round(baseW * scale);
        const h = Math.round(baseH * scale);

        // Thuật toán Cascading Offset (Chống chồng đè)
        const defaultX = init?.x ?? Math.round(Math.max(0, (window.innerWidth - w) / 2));
        const defaultY = init?.y ?? Math.round(Math.max(MENU_BAR_H, (window.innerHeight - h) / 2));
        const offset = 26; // pixels lệch
        
        // Đếm số lượng cửa sổ đang hiển thị (không bị ẩn/thu nhỏ)
        const openWindows = state.windows.filter(w => !w.minimized);
        const windowCount = openWindows.length;
        
        let newX = defaultX + (windowCount * offset);
        let newY = defaultY + (windowCount * offset);

        // Wrap-around boundary check: 
        // Nếu cửa sổ bị trôi quá nửa màn hình, reset lại chu kỳ thác nước
        if (typeof window !== 'undefined') {
          if (newX > window.innerWidth * 0.45 || newY > window.innerHeight * 0.5) {
            // Tính toán số chu kỳ cascade để reset nhưng vẫn giữ một chút lệch
            const cycleCount = Math.floor(Math.max(
              (newX - defaultX) / (window.innerWidth * 0.45),
              (newY - defaultY) / (window.innerHeight * 0.5)
            ));
            const resetMultiplier = windowCount - (cycleCount * Math.floor((window.innerHeight * 0.5) / offset));
            
            newX = defaultX + (Math.max(0, resetMultiplier) * offset);
            newY = defaultY + (Math.max(0, resetMultiplier) * offset);
          }
        }

        const newWindow: WindowInstance = {
          id,
          title: appTitle,
          w,
          h,
          x: newX,
          y: newY,
          z: nextZ,
          minimized: false,
          minW: 320,
          minH: 200,
          isResizable: appDef?.isResizable !== false,
          _restore: null,
        };
        return {
          windows: [...state.windows, newWindow],
          focusedId: id,
          activeAppName: appTitle,
        };
      }),

    closeWindow: (id) =>
      set((state) => ({
        windows: state.windows.filter((w) => w.id !== id),
        focusedId: state.focusedId === id ? null : state.focusedId,
        activeAppName: state.focusedId === id ? 'Finder' : state.activeAppName,
      })),

    minWindow: (id) =>
      set((state) => ({
        windows: state.windows.map((w) => w.id === id ? { ...w, minimized: true } : w),
        focusedId: state.focusedId === id ? null : state.focusedId,
        activeAppName: state.focusedId === id ? 'Finder' : state.activeAppName,
      })),

    maxWindow: (id) =>
      set((state) => {
        const win = state.windows.find((w) => w.id === id);
        if (!win || win.isResizable === false) return state;

        if (win._restore) {
          return {
            windows: state.windows.map((w) =>
              w.id === id ? { ...w, ...win._restore!, _restore: null } : w
            ),
          };
        }
        return {
          windows: state.windows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  _restore: { w: w.w, h: w.h, x: w.x, y: w.y },
                  x: 0,
                  y: MENU_BAR_H,
                  w: window.innerWidth,
                  h: window.innerHeight - MENU_BAR_H,
                }
              : w
          ),
        };
      }),

    focusWindow: (id) =>
      set((state) => {
        const nextZ = topZ(state.windows) + 1;
        const win = state.windows.find((w) => w.id === id);
        return {
          windows: state.windows.map((w) => w.id === id ? { ...w, z: nextZ } : w),
          focusedId: id,
          activeAppName: win?.title ?? state.activeAppName,
        };
      }),

    updateWindow: (id, patch) =>
      set((state) => ({
        windows: state.windows.map((w) => w.id === id ? { ...w, ...patch } : w),
      })),

    setTweak: (key, value) =>
      set((state) => {
        const tweaks = { ...state.tweaks, [key]: value };
        persistTweaks(tweaks);
        return { tweaks };
      }),

    setOpenMenu: (menu) => set({ openMenu: menu }),
    setIsMobile: (val) => set({ isMobile: val }),
    setIosOpenAppId: (id) => set({ iosOpenAppId: id }),
    setLanguage: (lang) => set({ language: lang }),
    socials: [],
    fetchSocials: async () => {
      try {
        const res = await fetch('/api/socials');
        if (res.ok) {
          const data = await res.json();
          set({ socials: data });
        }
      } catch (err) {
        console.error('Failed to fetch socials:', err);
      }
    },
  };
});
