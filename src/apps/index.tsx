import { AboutApp } from './About';
import { FinderApp } from './Finder';
import { ProjectsApp } from './Projects';
import { MailApp } from './Mail';
import { WelcomeApp } from './Welcome';
import { ZaloApp } from './Zalo';
import { AppDefinition, SocialAppDefinition } from '../types';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';
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
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback src={githubIcon} alt="GitHub icon" fallbackText="G" className="w-full h-full object-cover scale-[1.05]" />
      </div>
    ),
    url: 'https://github.com/hmduongdl',
  },
  {
    id: 'facebook', name: 'Facebook',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback src={facebookIcon} alt="Facebook icon" fallbackText="F" className="w-full h-full object-cover scale-[1.05]" />
      </div>
    ),
    url: 'https://facebook.com/hmd.Stewiclez',
  },
  {
    id: 'phone', name: 'Phone',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback src={phoneIcon} alt="Phone icon" fallbackText="P" className="w-full h-full object-cover scale-[1.05]" />
      </div>
    ),
    url: 'tel:0911818016',
  },
  {
    id: 'zalo', name: 'Zalo',
    bg: '#ffffff',
    icon: (
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback src={zaloIcon} alt="Zalo icon" fallbackText="Z" className="w-full h-full object-cover scale-[1.05]" />
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
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={gmailIcon}
          alt="Mail icon"
          fallbackText="M"
          className="w-full h-full object-cover scale-[1.05]"
        />
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
      <div className="w-full h-full rounded-[22%] overflow-hidden shadow-inner border border-white/10">
        <ImageWithFallback
          src={zaloIcon}
          alt="Zalo icon"
          fallbackText="Z"
          className="w-full h-full object-cover scale-[1.05]"
        />
      </div>
    ),
    initial: { w: 540, h: 340, x: 250, y: 120 },
    isResizable: false,
    Component: ZaloApp,
  },
];

export { AboutApp, FinderApp, ProjectsApp, MailApp, WelcomeApp, ZaloApp };
