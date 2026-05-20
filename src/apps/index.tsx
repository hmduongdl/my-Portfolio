import { AboutApp } from './About';
import { FinderApp } from './Finder';
import { ProjectsApp } from './Projects';
import { MailApp } from './Mail';
import { WelcomeApp } from './Welcome';
import { AppDefinition, SocialAppDefinition } from '../types';

export const SOCIAL_APPS: SocialAppDefinition[] = [
  {
    id: 'github', name: 'GitHub',
    bg: '#1a1d2e',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 016 0c2.2-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
      </svg>
    ),
    url: 'https://github.com/',
  },
  {
    id: 'facebook', name: 'Facebook',
    bg: 'linear-gradient(135deg, #1877F2 0%, #0a5dc1 100%)',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07"/>
      </svg>
    ),
    url: 'https://facebook.com/',
  },
  {
    id: 'gmail', name: 'Gmail',
    bg: 'white',
    icon: (
      <svg viewBox="0 0 24 24" width="30" height="24">
        <path fill="#4285F4" d="M2 6.5L12 13l10-6.5V18a2 2 0 01-2 2H4a2 2 0 01-2-2V6.5z"/>
        <polygon fill="#EA4335" points="2,6 12,13 22,6 22,7.5 12,14.5 2,7.5"/>
      </svg>
    ),
    mailto: 'mailto:hello@yourname.dev',
  },
  {
    id: 'phone', name: 'Phone',
    bg: 'linear-gradient(180deg, #4cd964 0%, #2eb84e 100%)',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
        <path d="M20.49 17.18l-3.05-.35a1.32 1.32 0 00-1.18.38l-2.21 2.21a16.7 16.7 0 01-7.31-7.31l2.22-2.22c.31-.31.46-.74.38-1.18L8.99 5.7c-.13-.93-.92-1.62-1.86-1.62H4.04c-1.07 0-1.96.89-1.9 1.96.45 8.09 6.92 14.55 15 15 1.07.06 1.96-.83 1.96-1.9V18.2c.01-.93-.68-1.71-1.61-1.84z"/>
      </svg>
    ),
    url: 'tel:+84',
  },
  {
    id: 'zalo', name: 'Zalo',
    bg: 'linear-gradient(135deg, #0068FF 0%, #0050cc 100%)',
    icon: <div className="text-white text-[20px] font-extrabold italic tracking-tighter select-none">Zalo</div>,
    url: 'https://zalo.me/',
  },
];

export const APP_DEFS: AppDefinition[] = [
  {
    id: 'finder',
    name: 'Finder',
    title: 'Song Phương — All Products',
    bg: 'linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%)',
    icon: <div className="text-white text-[28px] select-none">☺</div>,
    initial: { w: 760, h: 480, x: 140, y: 80 },
    Component: FinderApp,
  },
  {
    id: 'about',
    name: 'About Me',
    title: 'About This Mac',
    bg: 'linear-gradient(135deg, #DCE8F4 0%, #B5CCE6 100%)',
    icon: <div className="text-[#1F4E80] text-[28px] font-bold select-none" style={{ fontFamily: "'Noto Serif JP', serif" }}>日</div>,
    initial: { w: 480, h: 580, x: 80, y: 60 },
    Component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects — Mission Control',
    bg: 'linear-gradient(135deg, #C99A2E 0%, #8B6818 100%)',
    icon: <div className="text-white text-[22px] select-none">▦</div>,
    initial: { w: 820, h: 540, x: 200, y: 70 },
    Component: ProjectsApp,
  },
  {
    id: 'mail',
    name: 'Mail',
    title: 'New Message',
    bg: 'linear-gradient(135deg, #5DA9FF 0%, #1E63D8 100%)',
    icon: (
      <svg viewBox="0 0 32 32" width="30" height="30" fill="none">
        <rect x="3" y="7" width="26" height="18" rx="3" fill="white"/>
        <path d="M5 9l11 8 11-8" stroke="#1976D2" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    initial: { w: 600, h: 480, x: 320, y: 90 },
    mailto: 'mailto:hello@yourname.dev',
    Component: MailApp,
  },
  {
    id: 'welcome',
    name: 'Notes',
    title: 'Welcome',
    bg: 'linear-gradient(180deg, #FFE89A 0%, #F5C242 100%)',
    icon: <div className="text-[#7A5800] text-[22px] font-bold select-none">≡</div>,
    initial: { w: 540, h: 480, x: 600, y: 110 },
    Component: WelcomeApp,
  },
];

export { AboutApp, FinderApp, ProjectsApp, MailApp, WelcomeApp };
