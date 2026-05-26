import { AboutApp } from './About';
import { FinderApp } from './Finder';
import { ProjectsApp } from './Projects';
import { MailApp } from './Mail';
import { WelcomeApp } from './Welcome';
import { ZaloApp } from './Zalo';
import { AppDefinition, SocialAppDefinition } from '../types';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';
import { Phone, MessageCircle } from 'lucide-react';
import finderIcon from '../icons/Finder.png';
import aboutIcon from '../icons/About.png';
import notesIcon from '../icons/Notes.png';
import projectsIcon from '../icons/Project-folder.png';

export const SOCIAL_APPS: SocialAppDefinition[] = [
  {
    id: 'github', name: 'GitHub',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-gradient-to-b from-[#2c2c2c] to-[#111] flex items-center justify-center border border-white/10 shadow-inner overflow-hidden">
        <svg viewBox="0 0 24 24" className="w-[75%] h-[75%] fill-white">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      </div>
    ),
    url: 'https://github.com/hmduongdl',
  },
  {
    id: 'facebook', name: 'Facebook',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-[#1877F2] flex items-end justify-end overflow-hidden border border-white/10 shadow-inner">
        <svg viewBox="0 0 32 32" className="w-[90%] h-[90%] fill-white translate-y-[5%] translate-x-[15%]">
          <path d="M21.95 5.005l-3.306-.004c-3.206 0-5.277 2.124-5.277 5.415v2.815H9.69v4.515h3.677v11.666h4.68V17.747h3.513l.551-4.515h-4.064v-2.505c0-1.306.362-2.193 2.235-2.193h2.378V5.005z"/>
        </svg>
      </div>
    ),
    url: 'https://facebook.com/hmd.Stewiclez',
  },
  {
    id: 'phone', name: 'Phone',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-gradient-to-b from-[#60e052] to-[#25b712] flex items-center justify-center border border-white/10 shadow-inner">
        <Phone className="w-[70%] h-[70%] text-white fill-white" strokeWidth={0} />
      </div>
    ),
    url: 'tel:0911818016',
  },
  {
    id: 'zalo', name: 'Zalo',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-gradient-to-b from-[#2083FF] to-[#0052FF] flex items-center justify-center border border-white/10 shadow-inner relative">
        <MessageCircle className="w-[85%] h-[85%] text-white" strokeWidth={1.5} fill="currentColor" />
        <span className="absolute text-[#0052FF] font-black text-[10px] mt-[-2px] tracking-tighter">Zalo</span>
      </div>
    ),
    url: 'https://zalo.me/0911818016',
  },
];

export const APP_DEFS: AppDefinition[] = [
  {
    id: 'finder',
    name: 'Finder',
    title: 'Song Phương — All Products',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={finderIcon}
          alt="Finder icon"
          fallbackText="S"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    ),
    initial: { w: 760, h: 480, x: 140, y: 80 },
    Component: FinderApp,
  },
  {
    id: 'about',
    name: 'About Me',
    title: 'About This Mac',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={aboutIcon}
          alt="About icon"
          fallbackText="日"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    ),
    initial: { w: 480, h: 580, x: 80, y: 60 },
    Component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects — Mission Control',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={projectsIcon}
          alt="Projects icon"
          fallbackText="▦"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    ),
    initial: { w: 820, h: 540, x: 200, y: 70 },
    Component: ProjectsApp,
  },
  {
    id: 'mail',
    name: 'Mail',
    title: 'New Message',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-neutral-50 flex items-center justify-center border border-black/5 shadow-inner overflow-hidden">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%]">
          <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13z" fill="#fff"/>
          <path d="M3 6l9 6 9-6" stroke="#EA4335" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18V6l9 6" stroke="#4285F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 18V6l-9 6" stroke="#34A853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 18h18" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    initial: { w: 600, h: 480, x: 320, y: 90 },
    mailto: 'mailto:hoanglong.workdl@gmail.com',
    Component: MailApp,
  },
  {
    id: 'welcome',
    name: 'Notes',
    title: 'Welcome',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={notesIcon}
          alt="Notes icon"
          fallbackText="≡"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    ),
    initial: { w: 540, h: 480, x: 600, y: 110 },
    Component: WelcomeApp,
  },
  {
    id: 'zalo',
    name: 'Zalo',
    title: 'Zalo Contact',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] bg-gradient-to-b from-[#2083FF] to-[#0052FF] flex items-center justify-center border border-white/10 shadow-inner relative">
        <MessageCircle className="w-[85%] h-[85%] text-white" strokeWidth={1.5} fill="currentColor" />
        <span className="absolute text-[#0052FF] font-black text-[10px] mt-[-2px] tracking-tighter">Zalo</span>
      </div>
    ),
    initial: { w: 540, h: 340, x: 250, y: 120 },
    isResizable: false,
    Component: ZaloApp,
  },
];

export { AboutApp, FinderApp, ProjectsApp, MailApp, WelcomeApp, ZaloApp };
