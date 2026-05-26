import { AboutApp } from './About';
import { FinderApp } from './Finder';
import { ProjectsApp } from './Projects';
import { MailApp } from './Mail';
import { WelcomeApp } from './Welcome';
import { ZaloApp } from './Zalo';
import { AppDefinition, SocialAppDefinition } from '../types';
import finderIcon from '../icons/Finder.png';
import aboutIcon from '../icons/About.png';
import notesIcon from '../icons/Notes.png';
import projectsIcon from '../icons/Project-folder.png';
import githubIcon from '../icons/github.png';
import facebookIcon from '../icons/facebook.png';
import phoneIcon from '../icons/phone.png';
import zaloIcon from '../icons/zalo.png';
import gmailIcon from '../icons/gmail.png';

export const SOCIAL_APPS: SocialAppDefinition[] = [
  {
    id: 'github', name: 'GitHub',
    bg: '#ffffff',
    icon: (
      <img src={githubIcon} alt="GitHub" className="w-full h-full object-contain pointer-events-none" />
    ),
    url: 'https://github.com/hmduongdl',
  },
  {
    id: 'facebook', name: 'Facebook',
    bg: '#ffffff',
    icon: (
      <img src={facebookIcon} alt="Facebook" className="w-full h-full object-contain pointer-events-none" />
    ),
    url: 'https://www.facebook.com/hmd.stewiclez',
  },
  {
    id: 'phone', name: 'Phone',
    bg: '#ffffff',
    icon: (
      <img src={phoneIcon} alt="Phone" className="w-full h-full object-contain pointer-events-none" />
    ),
    url: 'tel:0911818016',
  },
  {
    // Zalo opens an in-app card (ZaloApp) — static url used only as deep-link fallback
    id: 'zalo', name: 'Zalo',
    bg: '#ffffff',
    icon: (
      <img src={zaloIcon} alt="Zalo" className="w-full h-full object-contain pointer-events-none" />
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
      <img src={finderIcon} alt="Finder" className="w-full h-full object-contain pointer-events-none" />
    ),
    initial: { w: 760, h: 480, x: 140, y: 80 },
    Component: FinderApp,
  },
  {
    id: 'about',
    name: 'About Me',
    title: 'About Me',
    bg: '#ffffff',
    icon: (
      <img src={aboutIcon} alt="About" className="w-full h-full object-contain pointer-events-none" />
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
      <img src={projectsIcon} alt="Projects" className="w-full h-full object-contain pointer-events-none" />
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
      <img src={gmailIcon} alt="Mail" className="w-full h-full object-contain pointer-events-none" />
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
      <img src={notesIcon} alt="Notes" className="w-full h-full object-contain pointer-events-none" />
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
      <img src={zaloIcon} alt="Zalo" className="w-full h-full object-contain pointer-events-none" />
    ),
    initial: { w: 540, h: 340, x: 250, y: 120 },
    isResizable: false,
    Component: ZaloApp,
  },
];

export { AboutApp, FinderApp, ProjectsApp, MailApp, WelcomeApp, ZaloApp };
