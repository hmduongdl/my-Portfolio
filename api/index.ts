import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { sql } from './_lib/db';
import { requireAuth, signToken } from './_lib/auth';
import { withErrorHandler } from './_lib/error';

// Helper: parse JSON array from PG text fields
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

// Helper: convert JS array to PG array literal string (e.g. {"React","TS"})
const toPgArray = (arr: any): string => {
  if (!Array.isArray(arr)) return '{}';
  const escaped = arr.map(item => {
    const clean = String(item).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${clean}"`;
  });
  return `{${escaped.join(',')}}`;
};

// Helper: parse tags for projects
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

// Helper: seed data declarations
const TIMELINE_SEED = [
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

const PROJECTS_SEED = [
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

async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || '', 'http://localhost');
  const pathname = url.pathname.replace(/\/$/, ''); // Remove trailing slash
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'vn';

  // 1. JWT Authentication Guard for Admin Routes
  const isTargetingAdmin = pathname.startsWith('/api/admin');
  if (isTargetingAdmin) {
    const authOK = await requireAuth(req.headers.authorization).catch(() => false);
    if (!authOK) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // 2. Routing logic
  // ========================== PUBLIC ENDPOINTS ==========================
  
  // GET /api/health
  if (pathname === '/api/health') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const dbRes = await sql`SELECT NOW()`;
      return res.status(200).json({ status: 'ok', timestamp: dbRes[0]?.now });
    } catch (e: any) {
      return res.status(500).json({ status: 'error', message: e.message });
    }
  }

  // GET /api/profile
  if (pathname === '/api/profile') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_profile (
        id             INT PRIMARY KEY DEFAULT 1,
        name           VARCHAR(100)  NOT NULL DEFAULT 'Hoàng Minh Dương',
        title_en       VARCHAR(200)  DEFAULT 'Web Developer · IT Student',
        title_vn       VARCHAR(200)  DEFAULT 'Nhà phát triển Web · Sinh viên IT',
        bio_en         TEXT          DEFAULT '',
        bio_vn         TEXT          DEFAULT '',
        avatar_url     TEXT          DEFAULT '/my-avatar.jpg',
        email          VARCHAR(200)  DEFAULT '',
        phone          VARCHAR(50)   DEFAULT '',
        github_url     TEXT          DEFAULT '',
        facebook_url   TEXT          DEFAULT '',
        zalo_url       TEXT          DEFAULT '',
        songphuong_url TEXT          DEFAULT 'https://songphuong.vn',
        updated_at     TIMESTAMPTZ   DEFAULT NOW(),
        CONSTRAINT tbl_profile_singleton CHECK (id = 1)
      )
    `;

    // Seed default if empty
    const countRes = await sql`SELECT COUNT(*)::int AS c FROM tbl_profile`;
    if (Number(countRes[0]?.c ?? 0) === 0) {
      await sql`
        INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, github_url, facebook_url, songphuong_url)
        VALUES (1, 'Hoàng Minh Dương', 'Web Developer · IT Student', 'Nhà phát triển Web · Sinh viên CNTT', '', '', '/my-avatar.jpg', 'duonghm.work@gmail.com', 'https://github.com/hmduongdl', 'https://facebook.com/', 'https://songphuong.vn')
        ON CONFLICT (id) DO NOTHING
      `;
    }

    const rows = await sql`SELECT * FROM tbl_profile WHERE id = 1 LIMIT 1`;
    const row = rows[0];
    if (!row) return res.status(404).json({ error: 'Profile not found' });

    return res.status(200).json({
      name: String(row.name || ''),
      title: lang === 'en' ? String(row.title_en || row.title_vn || '') : String(row.title_vn || row.title_en || ''),
      bio: lang === 'en' ? String(row.bio_en || row.bio_vn || '') : String(row.bio_vn || row.bio_en || ''),
      email: String(row.email || ''),
      phone: String(row.phone || ''),
      github: String(row.github_url || ''),
      facebook: String(row.facebook_url || ''),
      zalo: String(row.zalo_url || ''),
      songPhuongUrl: String(row.songphuong_url || ''),
      avatarUrl: String(row.avatar_url || ''),
      titleEn: String(row.title_en || ''),
      titleVn: String(row.title_vn || ''),
      bioEn: String(row.bio_en || ''),
      bioVn: String(row.bio_vn || ''),
      songphuong_url: String(row.songphuong_url || ''),
      avatar_url: String(row.avatar_url || ''),
      github_url: String(row.github_url || ''),
      facebook_url: String(row.facebook_url || ''),
      zalo_url: String(row.zalo_url || ''),
      title_en: String(row.title_en || ''),
      title_vn: String(row.title_vn || ''),
      bio_en: String(row.bio_en || ''),
      bio_vn: String(row.bio_vn || ''),
      avatar: String(row.avatar_url || '')
    });
  }

  // GET /api/timeline
  if (pathname === '/api/timeline') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
      for (const r of TIMELINE_SEED) {
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

    const rows = await sql`SELECT * FROM tbl_timeline ORDER BY id DESC`;
    const timeline = rows.map((row: any) => {
      const descVn = parseJsonArray(row.desc_vn);
      const descEn = parseJsonArray(row.desc_en);
      return {
        id: Number(row.id),
        role: lang === 'en' ? String(row.role_en || row.role_vn || '') : String(row.role_vn || row.role_en || ''),
        company: String(row.company || ''),
        companyUrl: row.company_url ? String(row.company_url) : undefined,
        company_url: row.company_url ? String(row.company_url) : undefined,
        period: lang === 'en' ? String(row.period_en || row.period_vn || '') : String(row.period_vn || row.period_en || ''),
        desc: lang === 'en' ? descEn : descVn,
        type: String(row.type || 'work') as 'work' | 'education' | 'freelance',
        visible: row.visible !== false,
        orderIndex: Number(row.order_index ?? 0),
        order_index: Number(row.order_index ?? 0),
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

  // GET /api/products
  if (pathname === '/api/products') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    
    const rows = await sql`
      SELECT 
        id,
        COALESCE(override_name, name) AS name,
        category,
        COALESCE(override_tag, tag) AS tag,
        COALESCE(override_price, price) AS price,
        old_price,
        discount,
        COALESCE(override_image_url, image_url) AS image_url,
        link,
        color,
        glyph,
        COALESCE(override_status, status) AS status,
        visible,
        order_index
      FROM tbl_products 
      WHERE visible = true
      ORDER BY order_index ASC, id DESC
    `;

    const mapped = rows.map((r: any) => ({
      id: Number(r.id),
      name: String(r.name || ''),
      category: String(r.category || ''),
      tag: r.tag ? String(r.tag) : null,
      price: r.price ? String(r.price) : null,
      oldPrice: r.old_price ? String(r.old_price) : null,
      discount: r.discount !== null && r.discount !== undefined ? Number(r.discount) : null,
      imageUrl: r.image_url ? String(r.image_url) : null,
      link: r.link ? String(r.link) : null,
      color: String(r.color || '#3B82F6'),
      glyph: String(r.glyph || '📦'),
      status: r.status ? String(r.status) : null,
      visible: r.visible !== false,
      orderIndex: Number(r.order_index ?? 0),
      old_price: r.old_price ? String(r.old_price) : null,
      image_url: r.image_url ? String(r.image_url) : null,
      order_index: Number(r.order_index ?? 0)
    }));

    return res.status(200).json(mapped);
  }

  // GET /api/projects
  if (pathname === '/api/projects') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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
    if (Number(countRes[0]?.c ?? 0) === 0) {
      for (const r of PROJECTS_SEED) {
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

    const rows = await sql`
      SELECT * FROM tbl_projects
      WHERE visible = true
      ORDER BY order_index ASC
    `;

    const projects = rows.map((row: any) => ({
      id: String(row.id),
      name: String(row.name || ''),
      category: String(row.category || ''),
      color: String(row.color || '#2563EB'),
      tags: parseTags(row.tags),
      description: lang === 'en' ? String(row.desc_en || row.desc_vn || '') : String(row.desc_vn || row.desc_en || ''),
      demoUrl: row.demo_url ? String(row.demo_url) : null,
      githubUrl: row.github_url ? String(row.github_url) : null,
      demo_url: row.demo_url ? String(row.demo_url) : null,
      github_url: row.github_url ? String(row.github_url) : null,
      order_index: Number(row.order_index ?? 0),
      orderIndex: Number(row.order_index ?? 0),
      visible: row.visible !== false
    }));

    return res.status(200).json(projects);
  }

  // GET /api/seo
  if (pathname === '/api/seo') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    // Ensure table exists
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_settings (
        key         VARCHAR(100) PRIMARY KEY,
        value       TEXT         NOT NULL,
        updated_at  TIMESTAMPTZ  DEFAULT NOW()
      )
    `;

    const rows = await sql`SELECT * FROM tbl_settings`;
    const settingsObj: Record<string, string> = {};

    if (rows.length === 0) {
      const defaults = [
        { key: 'seo_title', value: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology' },
        { key: 'seo_description', value: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.' },
        { key: 'seo_keywords', value: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio' },
        { key: 'og_image', value: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/songphuong-logo.png' },
        { key: 'twitter_card', value: 'summary_large_image' }
      ];
      for (const d of defaults) {
        await sql`
          INSERT INTO tbl_settings (key, value) VALUES (${d.key}, ${d.value})
          ON CONFLICT (key) DO NOTHING
        `;
        settingsObj[d.key] = d.value;
      }
    } else {
      for (const r of rows) {
        settingsObj[r.key] = r.value;
      }
    }
    return res.status(200).json(settingsObj);
  }

  // GET /api/social
  if (pathname === '/api/social') {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const rows = await sql`SELECT * FROM social_links ORDER BY order_index ASC, id ASC`;
    return res.status(200).json(rows);
  }

  // ========================== AUTH ENDPOINTS ==========================
  
  // POST /api/auth/login
  if (pathname === '/api/auth/login') {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { username, password } = (req.body ?? {}) as Record<string, string>;
    if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

    const rows = await sql`
      SELECT id, username, password_hash FROM admin_users WHERE username = ${username} LIMIT 1
    `;
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, String(rows[0].password_hash));
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await signToken({ id: rows[0].id, username: rows[0].username });
    return res.status(200).json({ token });
  }

  // ========================== ADMIN ENDPOINTS ==========================
  
  // PUT /api/admin/profile
  if (pathname === '/api/admin/profile') {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

    const b = (req.body ?? {}) as Record<string, string>;
    const name = b.name ?? '';
    const title_en = b.title_en ?? b.titleEn ?? '';
    const title_vn = b.title_vn ?? b.titleVn ?? '';
    const bio_en = b.bio_en ?? b.bioEn ?? '';
    const bio_vn = b.bio_vn ?? b.bioVn ?? '';
    const avatar_url = b.avatar_url ?? b.avatarUrl ?? b.avatar ?? '';
    const email = b.email ?? '';
    const phone = b.phone ?? '';
    const github_url = b.github_url ?? b.githubUrl ?? b.github ?? '';
    const facebook_url = b.facebook_url ?? b.facebookUrl ?? b.facebook ?? '';
    const zalo_url = b.zalo_url ?? b.zaloUrl ?? b.zalo ?? '';
    const songphuong_url = b.songphuong_url ?? b.songPhuongUrl ?? '';

    const rows = await sql`
      INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url,
        email, phone, github_url, facebook_url, zalo_url, songphuong_url)
      VALUES (1, ${name}, ${title_en}, ${title_vn},
        ${bio_en}, ${bio_vn}, ${avatar_url},
        ${email}, ${phone}, ${github_url},
        ${facebook_url}, ${zalo_url}, ${songphuong_url})
      ON CONFLICT (id) DO UPDATE SET
        name           = EXCLUDED.name,
        title_en       = EXCLUDED.title_en,
        title_vn       = EXCLUDED.title_vn,
        bio_en         = EXCLUDED.bio_en,
        bio_vn         = EXCLUDED.bio_vn,
        avatar_url     = EXCLUDED.avatar_url,
        email          = EXCLUDED.email,
        phone          = EXCLUDED.phone,
        github_url     = EXCLUDED.github_url,
        facebook_url   = EXCLUDED.facebook_url,
        zalo_url       = EXCLUDED.zalo_url,
        songphuong_url = EXCLUDED.songphuong_url,
        updated_at     = NOW()
      RETURNING *
    `;
    return res.status(200).json(rows[0]);
  }

  // POST/PUT/DELETE /api/admin/timeline
  if (pathname === '/api/admin/timeline') {
    const b = req.body ?? {};
    if (req.method === 'POST') {
      const { role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index } = b;
      const safeDescVn = Array.isArray(desc_vn) ? JSON.stringify(desc_vn) : desc_vn;
      const safeDescEn = Array.isArray(desc_en) ? JSON.stringify(desc_en) : desc_en;

      const rows = await sql`
        INSERT INTO tbl_timeline
          (role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index)
        VALUES
          (${role_vn || ''}, ${role_en || ''}, ${company || ''}, ${company_url || null},
           ${period_vn || ''}, ${period_en || ''}, ${safeDescVn || '[]'}, ${safeDescEn || '[]'},
           ${type || 'work'}, ${order_index || 0})
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { id, role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index } = b;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const safeDescVn = Array.isArray(desc_vn) ? JSON.stringify(desc_vn) : desc_vn;
      const safeDescEn = Array.isArray(desc_en) ? JSON.stringify(desc_en) : desc_en;

      const rows = await sql`
        UPDATE tbl_timeline SET
          role_vn = ${role_vn || ''},
          role_en = ${role_en || ''},
          company = ${company || ''},
          company_url = ${company_url || null},
          period_vn = ${period_vn || ''},
          period_en = ${period_en || ''},
          desc_vn = ${safeDescVn || '[]'},
          desc_en = ${safeDescEn || '[]'},
          type = ${type || 'work'},
          order_index = ${order_index || 0}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    }

    if (req.method === 'DELETE') {
      const { id } = b;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await sql`DELETE FROM tbl_timeline WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // GET/POST/PUT/DELETE /api/admin/products
  if (pathname === '/api/admin/products') {
    const b = req.body ?? {};
    
    // GET: Fetch all products with raw base and override fields
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM tbl_products
        ORDER BY order_index ASC, id DESC
      `;

      const mapped = rows.map((r: any) => ({
        id: Number(r.id),
        name: String(r.name || ''),
        category: String(r.category || ''),
        tag: r.tag ? String(r.tag) : null,
        price: r.price ? String(r.price) : null,
        oldPrice: r.old_price ? String(r.old_price) : null,
        discount: r.discount !== null && r.discount !== undefined ? Number(r.discount) : null,
        imageUrl: r.image_url ? String(r.image_url) : null,
        link: r.link ? String(r.link) : null,
        color: String(r.color || '#3B82F6'),
        glyph: String(r.glyph || '📦'),
        status: r.status ? String(r.status) : null,
        visible: r.visible !== false,
        orderIndex: Number(r.order_index ?? 0),
        overrideName: r.override_name ? String(r.override_name) : null,
        overridePrice: r.override_price ? String(r.override_price) : null,
        overrideImageUrl: r.override_image_url ? String(r.override_image_url) : null,
        overrideStatus: r.override_status ? String(r.override_status) : null,
        overrideTag: r.override_tag ? String(r.override_tag) : null,
        old_price: r.old_price ? String(r.old_price) : null,
        image_url: r.image_url ? String(r.image_url) : null,
        order_index: Number(r.order_index ?? 0),
        override_name: r.override_name ? String(r.override_name) : null,
        override_price: r.override_price ? String(r.override_price) : null,
        override_image_url: r.override_image_url ? String(r.override_image_url) : null,
        override_status: r.override_status ? String(r.override_status) : null,
        override_tag: r.override_tag ? String(r.override_tag) : null
      }));
      return res.status(200).json(mapped);
    }

    // POST: Create a new product
    if (req.method === 'POST') {
      const name = b.name ?? '';
      const category = b.category ?? '';
      if (!name || !category) return res.status(400).json({ error: 'Name and Category are required' });

      const tag = b.tag ?? null;
      const price = b.price ?? null;
      const old_price = b.old_price ?? b.oldPrice ?? null;
      const discount = (b.discount !== undefined && b.discount !== null) ? Number(b.discount) : null;
      const image_url = b.image_url ?? b.imageUrl ?? null;
      const link = b.link ?? null;
      const color = b.color ?? '#3B82F6';
      const glyph = b.glyph ?? '📦';
      const status = b.status ?? null;
      const override_name = b.override_name ?? b.overrideName ?? null;
      const override_price = b.override_price ?? b.overridePrice ?? null;
      const override_image_url = b.override_image_url ?? b.overrideImageUrl ?? null;
      const override_status = b.override_status ?? b.overrideStatus ?? null;
      const override_tag = b.override_tag ?? b.overrideTag ?? null;
      const visible = b.visible !== false;
      const order_index = b.order_index !== undefined ? Number(b.order_index) : 0;

      const rows = await sql`
        INSERT INTO tbl_products (
          name, category, tag, price, old_price, discount, image_url, link, color, glyph, status,
          override_name, override_price, override_image_url, override_status, override_tag,
          visible, order_index
        ) VALUES (
          ${name}, ${category}, ${tag}, ${price}, ${old_price}, ${discount}, ${image_url}, ${link}, ${color}, ${glyph}, ${status},
          ${override_name}, ${override_price}, ${override_image_url}, ${override_status}, ${override_tag},
          ${visible}, ${order_index}
        ) RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    // PUT: Update an existing product
    if (req.method === 'PUT') {
      const id = b.id;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      const name = b.name ?? '';
      const category = b.category ?? '';
      if (!name || !category) return res.status(400).json({ error: 'Name and Category are required' });

      const tag = b.tag ?? null;
      const price = b.price ?? null;
      const old_price = b.old_price ?? b.oldPrice ?? null;
      const discount = (b.discount !== undefined && b.discount !== null) ? Number(b.discount) : null;
      const image_url = b.image_url ?? b.imageUrl ?? null;
      const link = b.link ?? null;
      const color = b.color ?? '#3B82F6';
      const glyph = b.glyph ?? '📦';
      const status = b.status ?? null;
      const override_name = b.override_name ?? b.overrideName ?? null;
      const override_price = b.override_price ?? b.overridePrice ?? null;
      const override_image_url = b.override_image_url ?? b.overrideImageUrl ?? null;
      const override_status = b.override_status ?? b.overrideStatus ?? null;
      const override_tag = b.override_tag ?? b.overrideTag ?? null;
      const visible = b.visible !== false;
      const order_index = b.order_index !== undefined ? Number(b.order_index) : 0;

      const rows = await sql`
        UPDATE tbl_products SET
          name = ${name},
          category = ${category},
          tag = ${tag},
          price = ${price},
          old_price = ${old_price},
          discount = ${discount},
          image_url = ${image_url},
          link = ${link},
          color = ${color},
          glyph = ${glyph},
          status = ${status},
          override_name = ${override_name},
          override_price = ${override_price},
          override_image_url = ${override_image_url},
          override_status = ${override_status},
          override_tag = ${override_tag},
          visible = ${visible},
          order_index = ${order_index},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(rows[0]);
    }

    // DELETE: Delete a product
    if (req.method === 'DELETE') {
      const id = b.id;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await sql`DELETE FROM tbl_products WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // GET/POST/PUT/DELETE /api/admin/projects
  if (pathname === '/api/admin/projects') {
    const b = req.body ?? {};
    
    // GET: Fetch all projects
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT * FROM tbl_projects
        ORDER BY order_index ASC, id DESC
      `;
      return res.status(200).json(rows);
    }

    // POST: Create a new project
    if (req.method === 'POST') {
      const { id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible } = b;
      if (!id || !name || !category) return res.status(400).json({ error: 'ID, Name, and Category are required' });
      const pgTags = toPgArray(tags);

      const rows = await sql`
        INSERT INTO tbl_projects (
          id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible
        ) VALUES (
          ${id}, ${name}, ${category}, ${color || '#2563EB'}, ${pgTags}, ${desc_vn || ''}, ${desc_en || ''},
          ${demo_url || null}, ${github_url || null}, ${Number(order_index) || 0}, ${visible !== false}
        ) RETURNING *
      `;
      return res.status(201).json(rows[0]);
    }

    // PUT: Update an existing project
    if (req.method === 'PUT') {
      const { id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible } = b;
      if (!id) return res.status(400).json({ error: 'Missing Project ID' });
      const pgTags = toPgArray(tags);

      const rows = await sql`
        UPDATE tbl_projects SET
          name = ${name ?? ''},
          category = ${category ?? ''},
          color = ${color ?? '#2563EB'},
          tags = ${pgTags},
          desc_vn = ${desc_vn ?? ''},
          desc_en = ${desc_en ?? ''},
          demo_url = ${demo_url || null},
          github_url = ${github_url || null},
          order_index = ${Number(order_index) || 0},
          visible = ${visible !== false}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Project not found' });
      return res.status(200).json(rows[0]);
    }

    // DELETE: Delete a project
    if (req.method === 'DELETE') {
      const { id } = b;
      if (!id) return res.status(400).json({ error: 'Missing ID' });
      await sql`DELETE FROM tbl_projects WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // GET/PUT /api/admin/settings
  if (pathname === '/api/admin/settings') {
    // Ensure tbl_settings exists
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_settings (
        key         VARCHAR(100) PRIMARY KEY,
        value       TEXT         NOT NULL,
        updated_at  TIMESTAMPTZ  DEFAULT NOW()
      )
    `;

    // GET
    if (req.method === 'GET') {
      const socialLinks = await sql`
        SELECT * FROM social_links
        ORDER BY order_index ASC, id ASC
      `;
      const seoRows = await sql`SELECT * FROM tbl_settings`;
      const seoSettings: Record<string, string> = {};

      if (seoRows.length === 0) {
        const defaults = [
          { key: 'seo_title', value: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology' },
          { key: 'seo_description', value: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.' },
          { key: 'seo_keywords', value: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio' },
          { key: 'og_image', value: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/songphuong-logo.png' },
          { key: 'twitter_card', value: 'summary_large_image' }
        ];
        for (const d of defaults) {
          await sql`
            INSERT INTO tbl_settings (key, value) VALUES (${d.key}, ${d.value})
            ON CONFLICT (key) DO NOTHING
          `;
          seoSettings[d.key] = d.value;
        }
      } else {
        for (const r of seoRows) {
          seoSettings[r.key] = r.value;
        }
      }

      return res.status(200).json({ socialLinks, seoSettings });
    }

    // PUT
    if (req.method === 'PUT') {
      const b = req.body ?? {};
      const { socialLinks, seoSettings } = b;

      if (socialLinks && Array.isArray(socialLinks)) {
        for (const link of socialLinks) {
          if (link.platform) {
            await sql`
              UPDATE social_links
              SET url = ${link.url ?? ''},
                  visible = ${link.visible !== false},
                  updated_at = NOW()
              WHERE platform = ${link.platform}
            `;
          }
        }
      }

      if (seoSettings && typeof seoSettings === 'object') {
        const keys = Object.keys(seoSettings);
        for (const key of keys) {
          const val = String(seoSettings[key] ?? '');
          await sql`
            INSERT INTO tbl_settings (key, value)
            VALUES (${key}, ${val})
            ON CONFLICT (key) DO UPDATE SET
              value = EXCLUDED.value,
              updated_at = NOW()
          `;
        }
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 3. Fallback: Not found
  return res.status(404).json({ error: 'Not found' });
}

export default withErrorHandler(handler);
