import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { applyCors } from './_lib/cors';

type Lang = 'vn' | 'en';

interface SeedRow {
  id: string;
  lang: Lang;
  name: string;
  category: string;
  color: string;
  tags: string[];
  description: string;
  detail_desc: string[];
  demo_url: string | null;
  github_url: string | null;
  order_index: number;
}

const SEED: SeedRow[] = [
  {
    id: 'portfolio-macos', lang: 'vn', order_index: 1,
    name: 'Song Phương macOS Portfolio',
    category: 'web', color: '#2563EB',
    tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    description: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
    detail_desc: [
      'Thiết kế giao diện macOS Big Sur với cửa sổ kéo-thả, phóng to, thu nhỏ',
      'Tích hợp Zustand để quản lý state toàn cục (cửa sổ, ngôn ngữ, theme)',
      'Responsive: hỗ trợ giao diện iOS-style trên thiết bị mobile',
      'Triển khai liên tục trên Vercel với domain tùy chỉnh',
    ],
    demo_url: 'https://songphuong.vn', github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'portfolio-macos', lang: 'en', order_index: 1,
    name: 'Song Phương macOS Portfolio',
    category: 'web', color: '#2563EB',
    tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    description: 'Interactive macOS-style portfolio with draggable windows, Dock, and menu bar. Personally designed the full UI/UX & state architecture for Song Phương Technology.',
    detail_desc: [
      'Designed macOS Big Sur interface with drag-resize, maximize, minimize windows',
      'Zustand for global state management (windows, language, theme)',
      'Responsive: supports iOS-style view on mobile',
      'Continuous deployment on Vercel with custom domain',
    ],
    demo_url: 'https://songphuong.vn', github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'ecommerce-integration', lang: 'vn', order_index: 2,
    name: 'E-Commerce System Integration',
    category: 'web', color: '#10B981',
    tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
    description: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
    detail_desc: [
      'Xây dựng RESTful API với Node.js và Express Framework',
      'Thiết kế và quản lý cơ sở dữ liệu SQL Server: sản phẩm, đơn hàng, người dùng',
      'Tích hợp xác thực JWT và phân quyền admin/user',
      'Tối ưu hóa query và xử lý lỗi nhất quán toàn hệ thống',
    ],
    demo_url: null, github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'ecommerce-integration', lang: 'en', order_index: 2,
    name: 'E-Commerce System Integration',
    category: 'web', color: '#10B981',
    tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
    description: 'Full-stack e-commerce integration with RESTful API, product & order management, and SQL Server backend. Personally designed API architecture and optimized queries for Song Phương Technology.',
    detail_desc: [
      'Built RESTful API with Node.js and Express Framework',
      'SQL Server database design: products, orders, users',
      'JWT authentication and admin/user role-based access control',
      'Optimized queries and consistent error handling system-wide',
    ],
    demo_url: null, github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'brand-identity', lang: 'vn', order_index: 3,
    name: 'Song Phương Brand Identity & Visual Assets',
    category: 'design', color: '#F59E0B',
    tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
    description: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
    detail_desc: [
      'Thiết kế logo đa biến thể (ngang, dọc, icon) bằng Illustrator',
      'Xây dựng hệ màu và typography nhất quán trên Figma',
      'Thiết kế tài liệu in ấn: banner, namecard, phong bì',
      'Xuất file đa định dạng cho web, mạng xã hội và in ấn',
    ],
    demo_url: null, github_url: null,
  },
  {
    id: 'brand-identity', lang: 'en', order_index: 3,
    name: 'Song Phương Brand Identity & Visual Assets',
    category: 'design', color: '#F59E0B',
    tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
    description: 'Comprehensive brand identity package: logo, color system, typography, and digital/print assets. Personally handled the full workflow from concept to production-ready files for Song Phương Technology.',
    detail_desc: [
      'Multi-variant logo design (landscape, portrait, icon) with Illustrator',
      'Consistent color system and typography built on Figma',
      'Print material design: banners, business cards, envelopes',
      'Multi-format export for web, social media, and print',
    ],
    demo_url: null, github_url: null,
  },
  {
    id: 'auto-backup-tool', lang: 'vn', order_index: 4,
    name: 'Auto Backup Tool & Database Syncer',
    category: 'tools', color: '#EF4444',
    tags: ['Python', 'CronJob', 'SQL Shell'],
    description: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev–production.',
    detail_desc: [
      'Script Python tự động backup database theo lịch CronJob',
      'Đồng bộ dữ liệu giữa môi trường dev và production',
      'Ghi log chi tiết và thông báo lỗi qua email',
      'Hỗ trợ SQL Server và MySQL thông qua SQL Shell',
    ],
    demo_url: null, github_url: 'https://github.com/hmduongdl',
  },
  {
    id: 'auto-backup-tool', lang: 'en', order_index: 4,
    name: 'Auto Backup Tool & Database Syncer',
    category: 'tools', color: '#EF4444',
    tags: ['Python', 'CronJob', 'SQL Shell'],
    description: 'Automated database backup and sync tool with scheduled CronJob execution and SQL Shell scripting. Personally wrote the scripts and set up the dev–production sync pipeline.',
    detail_desc: [
      'Python script for scheduled database backups via CronJob',
      'Data synchronization between dev and production environments',
      'Detailed logging and email error notifications',
      'Supports SQL Server and MySQL via SQL Shell',
    ],
    demo_url: null, github_url: 'https://github.com/hmduongdl',
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const lang = (req.query.lang as string) === 'en' ? 'en' : 'vn';

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id          TEXT     NOT NULL,
        lang        TEXT     NOT NULL DEFAULT 'vn',
        name        TEXT     NOT NULL,
        category    TEXT     NOT NULL,
        color       TEXT     NOT NULL DEFAULT '#2563EB',
        tags        TEXT[]   NOT NULL DEFAULT '{}',
        description TEXT     NOT NULL DEFAULT '',
        detail_desc TEXT[]   DEFAULT '{}',
        demo_url    TEXT,
        github_url  TEXT,
        order_index INTEGER  DEFAULT 0,
        visible     BOOLEAN  DEFAULT TRUE,
        PRIMARY KEY (id, lang)
      )
    `;

    const [{ c }] = await sql`SELECT COUNT(*)::int AS c FROM projects` as { c: number }[];
    if (c === 0) {
      for (const r of SEED) {
        await sql`
          INSERT INTO projects
            (id, lang, name, category, color, tags, description, detail_desc, demo_url, github_url, order_index)
          VALUES
            (${r.id}, ${r.lang}, ${r.name}, ${r.category}, ${r.color},
             ${r.tags}, ${r.description}, ${r.detail_desc},
             ${r.demo_url}, ${r.github_url}, ${r.order_index})
          ON CONFLICT (id, lang) DO NOTHING
        `;
      }
    }

    const rows = await sql`
      SELECT id, name, category, color, tags, description, demo_url, github_url
      FROM   projects
      WHERE  lang = ${lang} AND visible = true
      ORDER  BY order_index ASC
    `;

    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
