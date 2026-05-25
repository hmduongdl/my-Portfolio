import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { withErrorHandler } from './_lib/error';

interface SeedTimeline {
  role_vn: string;
  role_en: string;
  company: string;
  company_url: string | null;
  period_vn: string;
  period_en: string;
  desc_vn: string;
  desc_en: string;
  type: 'work' | 'education' | 'freelance';
  order_index: number;
}

const SEED: SeedTimeline[] = [
  {
    role_vn: 'Web Developer',
    role_en: 'Web Developer',
    company: 'Song Phương Technology',
    company_url: 'https://songphuong.vn',
    period_vn: 'Tháng 3, 2025 - Hiện tại',
    period_en: 'Mar 2025 - Present',
    desc_vn: JSON.stringify([
      'Thiết kế và phát triển giao diện người dùng sáng tạo cho các trang web và ứng dụng của công ty.',
      'Quản lý hệ thống cơ sở dữ liệu và tích hợp các API dịch vụ.',
      'Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng.'
    ]),
    desc_en: JSON.stringify([
      'Designed and developed creative user interfaces for company websites and web applications.',
      'Managed database systems and integrated service APIs.',
      'Optimized application performance and overall user experience.'
    ]),
    type: 'work',
    order_index: 1,
  },
  {
    role_vn: 'Sinh viên CNTT',
    role_en: 'IT Student',
    company: 'Trường Đại học Đà Lạt',
    company_url: 'https://dlu.edu.vn',
    period_vn: 'Tháng 8, 2025 - 2029',
    period_en: 'Aug 2025 - 2029',
    desc_vn: JSON.stringify([
      'Theo học ngành Công nghệ Thông tin.',
      'Nghiên cứu các thuật toán cơ bản, cấu trúc dữ liệu và phát triển phần mềm.'
    ]),
    desc_en: JSON.stringify([
      'Majoring in Information Technology.',
      'Studying fundamental algorithms, data structures, and software engineering.'
    ]),
    type: 'education',
    order_index: 2,
  },
  {
    role_vn: 'Nhà thiết kế đồ họa 2D',
    role_en: '2D Graphic Designer',
    company: 'Freelance',
    company_url: null,
    period_vn: 'Trước đây',
    period_en: 'Freelance',
    desc_vn: JSON.stringify([
      'Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.',
      'Làm việc với Photoshop, Illustrator và Figma.'
    ]),
    desc_en: JSON.stringify([
      'Designed logos, brand identities, and social media banners for various clients.',
      'Worked extensively with Photoshop, Illustrator, and Figma.'
    ]),
    type: 'freelance',
    order_index: 3,
  },
];

function parseJsonArray(field: any): string[] {
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [field];
    } catch {
      return [field];
    }
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
    CREATE TABLE IF NOT EXISTS tbl_timeline (
      id          SERIAL      PRIMARY KEY,
      role_vn     TEXT        NOT NULL DEFAULT '',
      role_en     TEXT        NOT NULL DEFAULT '',
      company     TEXT        NOT NULL DEFAULT '',
      company_url TEXT,
      period_vn   TEXT        NOT NULL DEFAULT '',
      period_en   TEXT        NOT NULL DEFAULT '',
      desc_vn     TEXT        NOT NULL DEFAULT '[]',
      desc_en     TEXT        NOT NULL DEFAULT '[]',
      type        TEXT        NOT NULL DEFAULT 'work',
      order_index INTEGER     DEFAULT 0,
      visible     BOOLEAN     DEFAULT TRUE
    )
  `;

  // Seed if empty
  const countRes = await sql`SELECT COUNT(*)::int AS c FROM tbl_timeline`;
  if (Number(countRes[0]?.c ?? 0) === 0) {
    for (const r of SEED) {
      await sql`
        INSERT INTO tbl_timeline
          (role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index)
        VALUES
          (${r.role_vn}, ${r.role_en}, ${r.company}, ${r.company_url},
           ${r.period_vn}, ${r.period_en}, ${r.desc_vn}, ${r.desc_en},
           ${r.type}, ${r.order_index})
      `;
    }
  }

  const rows = await sql`
    SELECT * FROM tbl_timeline
    ORDER BY id DESC
  `;

  const timeline = rows.map((row: any) => {
    const descVn = parseJsonArray(row.desc_vn);
    const descEn = parseJsonArray(row.desc_en);
    return {
      id: Number(row.id),
      role: lang === 'en' ? String(row.role_en || row.role_vn || '') : String(row.role_vn || row.role_en || ''),
      company: String(row.company || ''),
      companyUrl: row.company_url ? String(row.company_url) : undefined,
      company_url: row.company_url ? String(row.company_url) : undefined, // compatibility
      period: lang === 'en' ? String(row.period_en || row.period_vn || '') : String(row.period_vn || row.period_en || ''),
      desc: lang === 'en' ? descEn : descVn,
      type: String(row.type || 'work') as 'work' | 'education' | 'freelance',
      visible: row.visible !== false,
      orderIndex: Number(row.order_index ?? 0),
      order_index: Number(row.order_index ?? 0), // compatibility
      
      // Parsed fields
      desc_vn: descVn,
      desc_en: descEn,
      role_vn: String(row.role_vn || ''),
      role_en: String(row.role_en || ''),
      period_vn: String(row.period_vn || ''),
      period_en: String(row.period_en || '')
    };
  });

  return res.status(200).json(timeline);
}

export default withErrorHandler(handler);
