import type { Profile, TechItem, ExperienceItem } from '../types/profile';

export const profileEN: Profile = {
  name: 'Hoàng Minh Dương',
  title: 'Web Developer · IT Student',
  avatar: '/img/my-avatar.jpg',
  bio: 'IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience.',
  email: 'hoanglong.workdl@gmail.com',
  phone: '+84',
  github: 'https://github.com/hmduongdl',
  facebook: 'https://facebook.com/',
  zalo: 'https://zalo.me/',
  songphuongUrl: 'https://songphuong.vn',
};

export const profileVN: Profile = {
  name: 'Hoàng Minh Dương',
  title: 'Nhà phát triển Web · Sinh viên CNTT',
  avatar: '/img/my-avatar.jpg',
  bio: 'IT Student tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng.',
  email: 'hoanglong.workdl@gmail.com',
  phone: '+84',
  github: 'https://github.com/hmduongdl',
  facebook: 'https://facebook.com/',
  zalo: 'https://zalo.me/',
  songphuongUrl: 'https://songphuong.vn',
};

export const techStack: TechItem[] = [
  { category: 'Frontend', name: 'React · TypeScript · Tailwind · Vite' },
  { category: 'Backend', name: 'Node.js · PHP · MySQL' },
  { category: 'Design', name: 'Figma · Photoshop · Illustrator' },
  { category: 'Tools', name: 'Git · Vercel · VS Code' },
];

export const experience: ExperienceItem[] = [
  {
    role: 'Web Developer',
    company: 'Song Phương Technology',
    companyUrl: 'https://songphuong.vn',
    period: 'Mar 2025 – Present',
    desc: [
      'Develop and maintain the company e-commerce website',
      'Build UI components with React and Tailwind CSS',
      'Manage product catalog and content updates',
    ],
    type: 'work',
  },
  {
    role: 'IT Student',
    company: 'Da Lat University',
    period: 'Aug 2025 – 2029',
    desc: [
      'Bachelor of Information Technology',
      'Focus on software engineering and web development',
    ],
    type: 'education',
  },
  {
    role: '2D Graphic Designer',
    company: 'Freelance',
    period: 'Oct 2023 – Present',
    desc: [
      'Design logos, banners, and promotional materials',
      'Social media graphics and brand identity for small businesses',
    ],
    type: 'freelance',
  },
];
