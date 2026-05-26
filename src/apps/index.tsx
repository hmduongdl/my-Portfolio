import { AboutApp } from './About';
import { FinderApp } from './Finder';
import { ProjectsApp } from './Projects';
import { MailApp } from './Mail';
import { WelcomeApp } from './Welcome';
import { AppDefinition, SocialAppDefinition } from '../types';
import { ImageWithFallback } from '../components/desktop/ImageWithFallback';
import githubIcon from '../icons/github.png';
import facebookIcon from '../icons/facebook.png';
import gmailIcon from '../icons/gmail.png';
import phoneIcon from '../icons/phone.png';
import zaloIcon from '../icons/zalo.png';
import finderIcon from '../icons/Finder.png';
import aboutIcon from '../icons/About.png';
import notesIcon from '../icons/Notes.png';
import projectsIcon from '../icons/Project-folder.png';

export const SOCIAL_APPS: SocialAppDefinition[] = [
  {
    id: 'github', name: 'GitHub',
    bg: '#1a1d2e',
    icon: (
      <ImageWithFallback src={githubIcon} alt="GitHub icon" fallbackText="GH" className="w-[28px] h-[28px] object-contain" />
    ),
    url: 'https://github.com/hmduongdl',
  },
  {
    id: 'facebook', name: 'Facebook',
    bg: 'linear-gradient(135deg, #1877F2 0%, #0a5dc1 100%)',
    icon: (
      <ImageWithFallback src={facebookIcon} alt="Facebook icon" fallbackText="F" className="w-[28px] h-[28px] object-contain" />
    ),
    url: 'https://facebook.com/hmd.Stewiclez',
  },
  {
    id: 'gmail', name: 'Gmail',
    bg: 'white',
    icon: (
      <ImageWithFallback src={gmailIcon} alt="Gmail icon" fallbackText="G" className="w-[28px] h-[28px] object-contain" />
    ),
    mailto: 'mailto:hoanglong.workdl@gmail.com',
  },
  {
    id: 'phone', name: 'Phone',
    bg: 'linear-gradient(180deg, #4cd964 0%, #2eb84e 100%)',
    icon: (
      <ImageWithFallback src={phoneIcon} alt="Phone icon" fallbackText="P" className="w-[28px] h-[28px] object-contain" />
    ),
    url: 'tel:0911818016',
  },
  {
    id: 'zalo', name: 'Zalo',
    bg: 'linear-gradient(135deg, #0068FF 0%, #0050cc 100%)',
    icon: (
      <ImageWithFallback src={zaloIcon} alt="Zalo icon" fallbackText="Z" className="w-[28px] h-[28px] object-contain" />
    ),
    url: 'https://zalo.me/0911818016',
  },
];

export const APP_DEFS: AppDefinition[] = [
  {
    id: 'finder',
    name: 'Finder',
    title: 'Song Phương — All Products',
    bg: 'linear-gradient(135deg, #4FC3F7 0%, #1976D2 100%)',
    icon: (
      <ImageWithFallback
        src={finderIcon}
        alt="Finder icon"
        fallbackText="S"
        className="w-[28px] h-[28px] object-contain"
      />
    ),
    initial: { w: 760, h: 480, x: 140, y: 80 },
    Component: FinderApp,
  },
  {
    id: 'about',
    name: 'About Me',
    title: 'About This Mac',
    bg: 'linear-gradient(135deg, #DCE8F4 0%, #B5CCE6 100%)',
    icon: (
      <ImageWithFallback
        src={aboutIcon}
        alt="About icon"
        fallbackText="日"
        className="w-[28px] h-[28px] object-contain"
      />
    ),
    initial: { w: 480, h: 580, x: 80, y: 60 },
    Component: AboutApp,
  },
  {
    id: 'projects',
    name: 'Projects',
    title: 'Projects — Mission Control',
    bg: 'linear-gradient(135deg, #C99A2E 0%, #8B6818 100%)',
    icon: (
      <ImageWithFallback
        src={projectsIcon}
        alt="Projects icon"
        fallbackText="▦"
        className="w-[28px] h-[28px] object-contain"
      />
    ),
    initial: { w: 820, h: 540, x: 200, y: 70 },
    Component: ProjectsApp,
  },
  {
    id: 'mail',
    name: 'Mail',
    title: 'New Message',
    bg: 'linear-gradient(135deg, #5DA9FF 0%, #1E63D8 100%)',
    icon: (
      <ImageWithFallback
        src={gmailIcon}
        alt="Mail icon"
        fallbackText="M"
        className="w-[28px] h-[28px] object-contain"
      />
    ),
    initial: { w: 600, h: 480, x: 320, y: 90 },
    mailto: 'mailto:hoanglong.workdl@gmail.com',
    Component: MailApp,
  },
  {
    id: 'welcome',
    name: 'Notes',
    title: 'Welcome',
    bg: 'linear-gradient(180deg, #FFE89A 0%, #F5C242 100%)',
    icon: (
      <ImageWithFallback
        src={notesIcon}
        alt="Notes icon"
        fallbackText="≡"
        className="w-[28px] h-[28px] object-contain"
      />
    ),
    initial: { w: 540, h: 480, x: 600, y: 110 },
    Component: WelcomeApp,
  },
];

export { AboutApp, FinderApp, ProjectsApp, MailApp, WelcomeApp };
