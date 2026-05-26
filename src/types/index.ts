import React from 'react';

export type AppID = 'finder' | 'about' | 'projects' | 'mail' | 'welcome' | 'zalo';

export interface AppDefinition {
  id: AppID;
  name: string;
  title: string;
  bg: string;
  icon: React.ReactNode;
  initial: {
    w: number;
    h: number;
    x: number;
    y: number;
  };
  mailto?: string;
  isResizable?: boolean;
  Component: React.ComponentType<{ compact?: boolean }>;
}

export interface SocialAppDefinition {
  id: string;
  name: string;
  bg: string;
  icon: React.ReactNode;
  url?: string;
  mailto?: string;
}

export interface WindowInstance {
  id: AppID;
  title: string;
  w: number;
  h: number;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
  minW: number;
  minH: number;
  isResizable?: boolean;
  _restore?: {
    w: number;
    h: number;
    x: number;
    y: number;
  } | null;
}

export interface Tweaks {
  windowStyle: 'sonoma' | 'bigsur' | 'monterey';
  dockSize: number;
  dockMagnify: number;
  dockAutoHide: boolean;
  showMobilePreview: boolean;
  wallpaperType?: 'image' | 'video' | 'time-shifting';
  wallpaperUrl?: string;
}
