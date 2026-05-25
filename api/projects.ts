import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { withErrorHandler } from './_lib/error';

interface SeedProject {
  id: string;
  name: string;
  category: string;
  color: string;
  tags: string[];
  desc_vn: string;
  desc_en: string;
  demo_url: string | null;
  github_url: string | null;
  order_index: number;
}

const SEED: SeedProject[] = [
  {
    id: 'portfolio-macos',
    name: 'Song Phương macOS Portfolio',
    category: 'web',
    color: '#2563EB',
    tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    desc_vn: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
    desc_en: 'Interactive macOS-style portfolio with draggable windows, Dock, and menu bar. Personally designed the full UI/UX & state architecture for Song Phương Technology.',
    demo_url: 'https://songphuong.vn',
    github_url: 'https://github.com/hmduongdl',
    order_index: 1,
  },
  {
    id: 'ecommerce-integration',
    name: 'E-Commerce System Integration',
    category: 'web',
    color: '#10B981',
    tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
    desc_vn: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
    desc_en: 'Full-stack e-commerce integration with RESTful API, product & order management, and SQL Server backend. Personally designed API architecture and optimized queries for Song Phương Technology.',
    demo_url: null,
    github_url: 'https://github.com/hmduongdl',
    order_index: 2,
  },
  {
    id: 'brand-identity',
    name: 'Song Phương Brand Identity & Visual Assets',
    category: 'design',
    color: '#F59E0B',
    tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
    desc_vn: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
    desc_en: 'Comprehensive brand identity package: logo, color system, typography, and digital/print assets. Personally handled the full workflow from concept to production-ready files for Song Phương Technology.',
    demo_url: null,
    github_url: null,
    order_index: 3,
  },
  {
    id: 'auto-backup-tool',
    name: 'Auto Backup Tool & Database Syncer',
    category: 'tools',
    color: '#EF4444',
    tags: ['Python', 'CronJob', 'SQL Shell'],
    desc_vn: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev–production.',
    desc_en: 'Automated database backup and sync tool with scheduled CronJob execution and SQL Shell scripting. Personally wrote the scripts and set up the dev–production sync pipeline.',
    demo_url: null,
    github_url: 'https://github.com/hmduongdl',
    order_index: 4,
  },
];

function parseTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    if (tags.startsWith('{') && tags.endsWith('}')) {
      return tags.slice(1, -1).split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
    }
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    return tags.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [];
}

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const lang = (req.query.lang as string) === 'en' ? 'en' : 'vn';

  // Ensure table exists
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_projects (
      id          TEXT     PRIMARY KEY,
      name        TEXT     NOT NULL,
      category    TEXT     NOT NULL,
      color       TEXT     NOT NULL DEFAULT '#2563EB',
      tags        TEXT[]   NOT NULL DEFAULT '{}',
      desc_vn     TEXT     NOT NULL DEFAULT '',
      desc_en     TEXT     NOT NULL DEFAULT '',
      demo_url    TEXT,
      github_url  TEXT,
      order_index INTEGER  DEFAULT 0,
      visible     BOOLEAN  DEFAULT TRUE
    )
  `;

  // Seed if empty
  const countRes = await sql`SELECT COUNT(*)::int AS c FROM tbl_projects`;
  const count = Number(countRes[0]?.c ?? 0);
  if (count === 0) {
    for (const r of SEED) {
      await sql`
        INSERT INTO tbl_projects
          (id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index)
        VALUES
          (${r.id}, ${r.name}, ${r.category}, ${r.color},
           ${r.tags}, ${r.desc_vn}, ${r.desc_en},
           ${r.demo_url}, ${r.github_url}, ${r.order_index})
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  // Query all projects
  const rows = await sql`
    SELECT * FROM tbl_projects
    WHERE visible = true
    ORDER BY order_index ASC, id ASC
  `;

  // Map to Frontend DTO
  const projects = rows.map((row: any) => {
    return {
      id: String(row.id),
      name: String(row.name || ''),
      category: String(row.category || ''),
      color: String(row.color || '#2563EB'),
      tags: parseTags(row.tags),
      description: lang === 'en' ? String(row.desc_en || row.desc_vn || '') : String(row.desc_vn || row.desc_en || ''),
      demo_url: row.demo_url ? String(row.demo_url) : null,
      github_url: row.github_url ? String(row.github_url) : null,
    };
  });

  return res.status(200).json(projects);
}

export default withErrorHandler(handler);
