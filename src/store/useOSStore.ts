import { create } from 'zustand';
import { WindowInstance, AppID, AppDefinition, Tweaks } from '../types';

const MENU_BAR_H = 28;

const TWEAK_DEFAULTS: Tweaks = {
  windowStyle: 'bigsur',
  dockSize: 52,
  dockMagnify: 1.4,
  dockAutoHide: false,
  showMobilePreview: false,
};

function loadTweaks(): Tweaks {
  return { ...TWEAK_DEFAULTS };
}

function persistTweaks(_t: Tweaks): void {
  // Persisting disabled to keep tweaks permanent
}

function topZ(windows: WindowInstance[]): number {
  return windows.reduce((m, w) => Math.max(m, w.z), 10);
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
        const w = init?.w ?? 600;
        const h = init?.h ?? 480;
        const newWindow: WindowInstance = {
          id,
          title: appTitle,
          w,
          h,
          x: init?.x ?? Math.round(Math.max(0, (window.innerWidth - w) / 2)),
          y: init?.y ?? Math.round(Math.max(MENU_BAR_H, (window.innerHeight - h) / 2)),
          z: nextZ,
          minimized: false,
          minW: 320,
          minH: 200,
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
        if (!win) return state;

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
  };
});
