import React from 'react';

export type AppID = 'finder' | 'about' | 'projects' | 'mail' | 'welcome';

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
}
