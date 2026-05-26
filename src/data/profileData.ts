import type { ProfileData, TimelineItem } from '../services/profileService';

export interface TechItem {
  category: string;
  name: string;
}

export const techStack: TechItem[] = [
  { category: 'Frontend', name: 'React · TypeScript · Tailwind · Vite' },
  { category: 'Backend', name: 'Node.js · PHP · MySQL' },
  { category: 'Design', name: 'Figma · Photoshop · Illustrator' },
  { category: 'Tools', name: 'Git · Vercel · VS Code' },
];

export const profileVN: ProfileData = {
  id: 1,
  name: 'Hoàng Minh Dương',
  title: 'Web Developer · IT Student',
  bio: 'Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology.',
  email: 'duonghm.work@gmail.com',
  githubUrl: 'https://github.com/hmduongdl',
  facebookUrl: 'https://facebook.com/',
  songphuongUrl: 'https://songphuong.vn',
  avatarUrl: '/my-avatar.jpg'
};

export const timelineVN: TimelineItem[] = [
  {
    id: 1,
    role: 'Web Developer',
    company: 'Song Phương Technology',
    companyUrl: 'https://songphuong.vn',
    period: 'Tháng 3, 2025 - Hiện tại',
    desc: [
      'Thiết kế và phát triển giao diện người dùng sáng tạo cho các trang web và ứng dụng của công ty.',
      'Quản lý hệ thống cơ sở dữ liệu và tích hợp các API dịch vụ.',
      'Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng.'
    ],
    type: 'work'
  },
  {
    id: 2,
    role: 'Sinh viên CNTT',
    company: 'Trường Đại học Đà Lạt',
    companyUrl: 'https://dlu.edu.vn',
    period: 'Tháng 8, 2025 - 2029',
    desc: [
      'Theo học ngành Công nghệ Thông tin.',
      'Nghiên cứu các thuật toán cơ bản, cấu trúc dữ liệu và phát triển phần mềm.'
    ],
    type: 'education'
  },
  {
    id: 3,
    role: 'Nhà thiết kế đồ họa 2D',
    company: 'Freelance',
    period: 'Trước đây',
    desc: [
      'Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.',
      'Làm việc với Photoshop, Illustrator và Figma.'
    ],
    type: 'freelance'
  }
];
