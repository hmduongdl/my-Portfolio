import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';

// ============================================================================
// 1. DỮ LIỆU DỰ PHÒNG (STATIC FALLBACK DATA)
// Tự động trả về khi có lỗi kết nối Neon SQL hoặc khi bảng không tồn tại (Lỗi 500)
// ============================================================================
const FALLBACK_PROFILE = {
  id: 1,
  name: 'Hoàng Minh Dương',
  title: 'Nhà phát triển Web · Sinh viên CNTT',
  titleEn: 'Web Developer · IT Student',
  titleVn: 'Nhà phát triển Web · Sinh viên CNTT',
  bio: '',
  bioEn: '',
  bioVn: '',
  avatarUrl: '/my-avatar.jpg',
  email: 'duonghm.work@gmail.com',
  phone: '',
  githubUrl: 'https://github.com/hmduongdl',
  facebookUrl: 'https://facebook.com/',
  zaloUrl: '',
  songphuongUrl: 'https://songphuong.vn'
};

const FALLBACK_TIMELINE = [
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
    companyUrl: null,
    period: 'Trước đây',
    desc: [
      'Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.',
      'Làm việc với Photoshop, Illustrator và Figma.'
    ],
    type: 'freelance'
  }
];

const FALLBACK_PROJECTS = [
  {
    id: 'portfolio-macos',
    name: 'Song Phương macOS Portfolio',
    category: 'web',
    color: '#2563EB',
    tags: ['React', 'TypeScript', 'Zustand', 'Tailwind'],
    desc: 'Portfolio tương tác phong cách macOS, tích hợp hệ thống cửa sổ kéo-thả, Dock và thanh menu. Cá nhân xây dựng toàn bộ UI/UX & logic state cho Song Phương Technology.',
    demoUrl: 'https://songphuong.vn',
    githubUrl: 'https://github.com/hmduongdl'
  },
  {
    id: 'ecommerce-integration',
    name: 'E-Commerce System Integration',
    category: 'web',
    color: '#10B981',
    tags: ['Node.js', 'Express', 'SQL Server', 'RESTful API'],
    desc: 'Hệ thống tích hợp thương mại điện tử với RESTful API, quản lý sản phẩm & đơn hàng, backend SQL Server. Cá nhân thiết kế kiến trúc API và tối ưu hóa query cho Song Phương Technology.',
    demoUrl: null,
    githubUrl: 'https://github.com/hmduongdl'
  },
  {
    id: 'brand-identity',
    name: 'Song Phương Brand Identity & Visual Assets',
    category: 'design',
    color: '#F59E0B',
    tags: ['Photoshop', 'Illustrator', 'Figma', '2D Design'],
    desc: 'Bộ nhận diện thương hiệu đầy đủ: thiết kế logo, hệ màu, typography và tài sản kỹ thuật số/in ấn. Cá nhân thực hiện toàn bộ từ concept đến xuất file sản xuất cho Song Phương Technology.',
    demoUrl: null,
    githubUrl: null
  },
  {
    id: 'auto-backup-tool',
    name: 'Auto Backup Tool & Database Syncer',
    category: 'tools',
    color: '#EF4444',
    tags: ['Python', 'CronJob', 'SQL Shell'],
    desc: 'Công cụ sao lưu tự động và đồng bộ cơ sở dữ liệu, chạy theo lịch với CronJob. Cá nhân viết script và thiết lập pipeline đồng bộ dev–production.',
    demoUrl: null,
    githubUrl: 'https://github.com/hmduongdl'
  }
];

const FALLBACK_PRODUCTS: any[] = [];

const FALLBACK_SEO = {
  title: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology',
  description: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.',
  keywords: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio',
  ogImage: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/songphuong-logo.png',
  twitterCard: 'summary_large_image'
};


// ============================================================================
// 2. KẾT NỐI NEON SQL BẰNG PG POOL (Singleton Pattern)
// ============================================================================
const connectionString = process.env.DATABASE_URL;
let pool: Pool;

try {
  if (connectionString) {
    if (process.env.NODE_ENV === 'production') {
      pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
      });
    } else {
      if (!(global as any).pool) {
        (global as any).pool = new Pool({
          connectionString,
          ssl: { rejectUnauthorized: false }
        });
      }
      pool = (global as any).pool;
    }
  }
} catch (err) {
  console.error("[Database Connection] Initialization failed:", err);
}

// Hàm thực thi DB query có wrapper try-catch
async function runQuery(query: string, params: any[] = []) {
  if (!pool) throw new Error("Database pool is not initialized. Check DATABASE_URL.");
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } finally {
    client.release();
  }
}

// Helper xác thực (JWT admin đơn giản)
async function verifyAdminJWT(req: VercelRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    return !!token;
  } catch {
    return false;
  }
}

// ============================================================================
// 3. API SUPER-ROUTER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Phân tích URL định tuyến an toàn không crash
  const url = req.url || '';
  let path = url.split('?')[0].replace(/^\/api/, '');
  if (!path.startsWith('/')) path = '/' + path;

  // Lấy parameter lang an toàn
  const langMatch = url.match(/[?&]lang=([^&]+)/);
  const lang = langMatch ? langMatch[1] : 'vn';

  console.log(`[API Router] Request received: method=${req.method} url=${req.url} parsedPath=${path}`);

  console.log(`[API Router] Request received: method=${req.method} url=${req.url} parsedPath=${path}`);

  if (path === '/index.ts' || path === '/index' || path === '/') {
    const forwardedPath = req.headers['x-vercel-forwarded-path'] as string;
    const matchedPath = req.headers['x-matched-path'] as string;
    if (forwardedPath) path = forwardedPath.replace(/^\/api/, '');
    else if (matchedPath) path = matchedPath.replace(/^\/api/, '');
    if (!path.startsWith('/')) path = '/' + path;
  }



  // -------------------------------------------------------------
  // ENDPOINT: HEALTH CHECK
  // -------------------------------------------------------------
  if (path === '/health' || path === '/') {
    if (!pool) {
      return res.status(200).json({
        status: 'error',
        database: 'disconnected',
        environment: process.env.NODE_ENV,
        message: 'DATABASE_URL_MISSING',
        diagnostics: { databaseConfigured: false, host: req.headers.host }
      });
    }
    try {
      const rows = await runQuery('SELECT NOW()');
      return res.status(200).json({
        status: 'healthy',
        database: 'connected',
        timestamp: rows[0].now,
        environment: process.env.NODE_ENV,
        diagnostics: { databaseConfigured: true, host: req.headers.host }
      });
    } catch (e: any) {
      return res.status(200).json({
        status: 'error',
        database: 'error',
        message: e.message,
        environment: process.env.NODE_ENV
      });
    }
  }

  // -------------------------------------------------------------
  // PUBLIC ENDPOINTS WITH STATIC FALLBACK
  // -------------------------------------------------------------
  if (req.method === 'GET') {
    
    // /PROFILE
    if (path === '/profile') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_profile LIMIT 1');
        if (rows.length === 0) throw new Error('EMPTY_TABLE');
        const p = rows[0];
        
        res.setHeader('x-database-status', 'online');
        return res.status(200).json({
          id: p.id,
          name: p.name,
          title: lang === 'en' ? (p.title_en || p.title_vn) : (p.title_vn || p.title_en),
          bio: lang === 'en' ? (p.bio_en || p.bio_vn) : (p.bio_vn || p.bio_en),
          avatarUrl: p.avatar_url || '/my-avatar.jpg',
          email: p.email,
          phone: p.phone,
          githubUrl: p.github_url,
          facebookUrl: p.facebook_url,
          zaloUrl: p.zalo_url,
          songphuongUrl: p.songphuong_url,
          titleEn: p.title_en,
          titleVn: p.title_vn,
          bioEn: p.bio_en,
          bioVn: p.bio_vn
        });
      } catch (e) {
        console.error('[API Fallback] /profile error:', e);
        res.setHeader('x-database-status', 'fallback_error');
        const fb = FALLBACK_PROFILE;
        return res.status(200).json({
          ...fb,
          title: lang === 'en' ? fb.titleEn : fb.titleVn,
          bio: lang === 'en' ? fb.bioEn : fb.bioVn
        });
      }
    }

    // /TIMELINE
    if (path === '/timeline') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_timeline ORDER BY id DESC');
        res.setHeader('x-database-status', 'online');
        
        const mappedTimeline = rows.map((t: any) => {
          const rawDesc = lang === 'en' ? t.desc_en : t.desc_vn;
          let parsedDesc: string[] = [];
          try {
            if (typeof rawDesc === 'string') parsedDesc = JSON.parse(rawDesc);
            else if (Array.isArray(rawDesc)) parsedDesc = rawDesc;
            else if (rawDesc) parsedDesc = [String(rawDesc)];
          } catch {
            parsedDesc = typeof rawDesc === 'string' ? [rawDesc] : [];
          }
          return {
            id: t.id,
            role: lang === 'en' ? t.role_en : t.role_vn,
            company: t.company,
            companyUrl: t.company_url,
            period: lang === 'en' ? t.period_en : t.period_vn,
            desc: parsedDesc,
            type: t.type
          };
        });
        return res.status(200).json(mappedTimeline);
      } catch (e) {
        console.error('[API Fallback] /timeline error:', e);
        res.setHeader('x-database-status', 'fallback_error');
        const fb = FALLBACK_TIMELINE.map(t => ({
          ...t,
          role: lang === 'en' && t.role === 'Sinh viên CNTT' ? 'IT Student' : t.role,
          period: lang === 'en' && t.period.includes('Hiện tại') ? 'Mar 2025 - Present' : t.period
        }));
        return res.status(200).json(fb);
      }
    }

    // /PRODUCTS
    if (path === '/products') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_products WHERE visible = true ORDER BY order_index ASC');
        res.setHeader('x-database-status', 'online');
        
        const mappedProducts = rows.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          tag: p.tag,
          price: p.price,
          oldPrice: p.old_price,
          discount: p.discount,
          imageUrl: p.image_url,
          link: p.link,
          color: p.color,
          glyph: p.glyph,
          status: p.status,
          visible: p.visible
        }));
        return res.status(200).json(mappedProducts);
      } catch (e) {
        console.error('[API Fallback] /products error:', e);
        res.setHeader('x-database-status', 'fallback_error');
        return res.status(200).json(FALLBACK_PRODUCTS);
      }
    }

    // /PROJECTS
    if (path === '/projects') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_projects WHERE visible = true ORDER BY order_index ASC');
        res.setHeader('x-database-status', 'online');

        const mappedProjects = rows.map((proj: any) => {
          let tagsArray: string[] = [];
          if (Array.isArray(proj.tags)) {
            tagsArray = proj.tags;
          } else if (typeof proj.tags === 'string') {
            tagsArray = proj.tags.replace(/[{}]/g, '').split(',').map((s: string) => s.replace(/^"|"$/g, ''));
          }

          return {
            id: proj.id,
            name: proj.name,
            category: proj.category,
            color: proj.color,
            tags: tagsArray,
            desc: lang === 'en' ? proj.desc_en : proj.desc_vn,
            demoUrl: proj.demo_url,
            githubUrl: proj.github_url
          };
        });
        return res.status(200).json(mappedProjects);
      } catch (e) {
        console.error('[API Fallback] /projects error:', e);
        res.setHeader('x-database-status', 'fallback_error');
        const fb = FALLBACK_PROJECTS.map(p => ({
          ...p,
          desc: lang === 'en' ? p.desc.replace('Cá nhân', 'Personally') : p.desc
        }));
        return res.status(200).json(fb);
      }
    }

    // /SEO
    if (path === '/seo') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_settings');
        res.setHeader('x-database-status', 'online');
        if (rows.length === 0) throw new Error('EMPTY_TABLE');
        
        const settingsObj: Record<string, string> = {};
        for (const r of rows) {
          settingsObj[r.key] = r.value;
        }

        return res.status(200).json({
          title: settingsObj['seo_title'] || FALLBACK_SEO.title,
          description: settingsObj['seo_description'] || FALLBACK_SEO.description,
          keywords: settingsObj['seo_keywords'] || FALLBACK_SEO.keywords,
          ogImage: settingsObj['og_image'] || FALLBACK_SEO.ogImage,
          twitterCard: settingsObj['twitter_card'] || FALLBACK_SEO.twitterCard
        });
      } catch (e) {
        console.error('[API Fallback] /seo error:', e);
        res.setHeader('x-database-status', 'fallback_error');
        return res.status(200).json(FALLBACK_SEO);
      }
    }
  }

  // -------------------------------------------------------------
  // ADMIN ROUTES (MOCK - CẦN JWT)
  // -------------------------------------------------------------
  if (path.startsWith('/admin')) {
    const isAuthorized = await verifyAdminJWT(req);
    if (!isAuthorized) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token JWT không hợp lệ hoặc hết hạn.' });
    }

    if (req.method === 'PUT' && path === '/admin/profile') {
      const body = req.body;
      try {
        await runQuery(
          `UPDATE tbl_profile SET 
            name = $1, title_vn = $2, title_en = $3, bio_vn = $4, bio_en = $5, 
            email = $6, phone = $7, github_url = $8, facebook_url = $9, 
            zalo_url = $10, songphuong_url = $11, updated_at = NOW() 
           WHERE id = 1`,
          [
            body.name, body.titleVn, body.titleEn, body.bioVn, body.bioEn,
            body.email, body.phone, body.githubUrl, body.facebookUrl,
            body.zaloUrl, body.songphuongUrl
          ]
        );
        return res.status(200).json({ success: true, message: 'Cập nhật Profile thành công.' });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }
    
    return res.status(404).json({ error: 'ADMIN_ENDPOINT_NOT_IMPLEMENTED', message: 'Endpoint admin cũ đã bị xóa trong quá trình cập nhật cấu trúc.' });
  }

  return res.status(404).json({ error: 'ENDPOINT_NOT_FOUND', requestedPath: path });
}
