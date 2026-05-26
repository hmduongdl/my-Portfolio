import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

// SEO defaults are used only when optional SEO keys are missing in tbl_settings.
// Public app data endpoints now fail visibly instead of serving static mock data.
const DEFAULT_SEO = {
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

function sendDatabaseError(res: VercelResponse, endpoint: string, error: unknown) {
  console.error(`[API Error] ${endpoint}:`, error);
  res.setHeader('x-database-status', 'error');
  return res.status(503).json({
    error: 'DATABASE_UNAVAILABLE',
    message: `Unable to load ${endpoint} from database`
  });
}

function stripPrefix(value: string, prefix: RegExp) {
  return value.replace(prefix, '').trim();
}

function toMailto(email: string) {
  const clean = stripPrefix(email, /^mailto:/i);
  return clean ? `mailto:${clean}` : '';
}

function toTel(phone: string) {
  const clean = stripPrefix(phone, /^tel:/i);
  return clean ? `tel:${clean}` : '';
}

function toZaloUrl(zaloUrl: string, phone: string) {
  if (zaloUrl.trim()) return zaloUrl.trim();
  const cleanPhone = stripPrefix(phone, /^tel:/i).replace(/[^\d+]/g, '');
  return cleanPhone ? `https://zalo.me/${cleanPhone}` : '';
}

function profileContactLinks(profile: Record<string, any>) {
  return [
    { platform: 'github', label: 'GitHub', url: profile.github_url || profile.githubUrl || '', visible: true, order_index: 0 },
    { platform: 'facebook', label: 'Facebook', url: profile.facebook_url || profile.facebookUrl || '', visible: true, order_index: 1 },
    { platform: 'gmail', label: 'Gmail', url: toMailto(profile.email || ''), visible: true, order_index: 2 },
    { platform: 'phone', label: 'Phone', url: toTel(profile.phone || ''), visible: true, order_index: 3 },
    { platform: 'zalo', label: 'Zalo', url: toZaloUrl(profile.zalo_url || profile.zaloUrl || '', profile.phone || ''), visible: true, order_index: 4 },
    { platform: 'songphuong', label: 'Song Phương Website', url: profile.songphuong_url || profile.songphuongUrl || '', visible: true, order_index: 5 }
  ];
}

async function syncSocialLinksFromProfile(profile: Record<string, any>) {
  for (const link of profileContactLinks(profile)) {
    await runQuery(
      `INSERT INTO tbl_social_links (platform, label, url, visible, order_index, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (platform) DO UPDATE SET
         url = EXCLUDED.url,
         label = EXCLUDED.label,
         order_index = EXCLUDED.order_index,
         updated_at = NOW()`,
      [link.platform, link.label, link.url, link.visible, link.order_index]
    );
  }
}

async function syncProfileFromSocialLinks(links: Array<{ platform: string; url?: string }>) {
  const patch: Record<string, string> = {};
  for (const link of links) {
    const platform = link.platform;
    const url = String(link.url ?? '').trim();
    if (platform === 'github') patch.github_url = url;
    if (platform === 'facebook') patch.facebook_url = url;
    if (platform === 'gmail') patch.email = stripPrefix(url, /^mailto:/i);
    if (platform === 'phone') patch.phone = url;
    if (platform === 'zalo') patch.zalo_url = url;
    if (platform === 'songphuong') patch.songphuong_url = url;
  }

  const keys = Object.keys(patch);
  if (keys.length === 0) return;

  const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
  await runQuery(
    `UPDATE tbl_profile SET ${assignments}, updated_at = NOW() WHERE id = 1`,
    keys.map((key) => patch[key])
  );
}

// Helper xác thực (JWT admin bảo mật)
async function verifyAdminJWT(req: VercelRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-123456');
    const { payload } = await jwtVerify(token, secret);
    return !!payload;
  } catch (err) {
    console.error('[JWT Verification Failed]:', err);
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
  // ENDPOINT: LOGIN
  // -------------------------------------------------------------
  if (req.method === 'POST' && path === '/auth/login') {
    const { username, password } = (req.body ?? {}) as Record<string, string>;
    if (!username || !password) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'Username and password are required.' });
    }

    try {
      let rows = await runQuery('SELECT * FROM tbl_users WHERE username = $1 LIMIT 1', [username]);
      
      if (rows.length === 0) {
        try {
          rows = await runQuery('SELECT * FROM admin_users WHERE username = $1 LIMIT 1', [username]);
        } catch (dbErr) {
          // Ignore
        }
      }

      if (rows.length === 0) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Tài khoản hoặc mật khẩu không chính xác.' });
      }

      const user = rows[0];
      let isMatch = false;

      if (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, user.password_hash);
      } else {
        const hash = crypto.createHash('sha256').update(password).digest('hex');
        isMatch = (hash === user.password_hash);
      }

      if (!isMatch) {
        return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Tài khoản hoặc mật khẩu không chính xác.' });
      }

      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-123456');
      const token = await new SignJWT({ id: user.id, username: user.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);

      return res.status(200).json({ token });
    } catch (e: any) {
      console.error('[API Login Error]:', e);
      return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
    }
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
        return sendDatabaseError(res, '/profile', e);
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
        return sendDatabaseError(res, '/timeline', e);
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
        return sendDatabaseError(res, '/products', e);
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
        return sendDatabaseError(res, '/projects', e);
      }
    }

    // /SOCIALS
    if (path === '/socials') {
      try {
        const [profile] = await runQuery('SELECT * FROM tbl_profile LIMIT 1');
        const rows = await runQuery('SELECT * FROM tbl_social_links ORDER BY order_index ASC, id ASC');
        const byPlatform = new Map<string, any>();
        for (const row of rows) {
          byPlatform.set(row.platform, row);
        }
        if (profile) {
          for (const link of profileContactLinks(profile)) {
            const existing = byPlatform.get(link.platform);
            byPlatform.set(link.platform, {
              ...existing,
              ...link,
              visible: existing?.visible !== false,
              order_index: existing?.order_index ?? link.order_index
            });
          }
        }
        const visibleRows = Array.from(byPlatform.values())
          .filter((row) => row.visible !== false)
          .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
        res.setHeader('x-database-status', 'online');
        return res.status(200).json(visibleRows);
      } catch (e) {
        return sendDatabaseError(res, '/socials', e);
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
          title: settingsObj['seo_title'] || DEFAULT_SEO.title,
          description: settingsObj['seo_description'] || DEFAULT_SEO.description,
          keywords: settingsObj['seo_keywords'] || DEFAULT_SEO.keywords,
          ogImage: settingsObj['og_image'] || DEFAULT_SEO.ogImage,
          twitterCard: settingsObj['twitter_card'] || DEFAULT_SEO.twitterCard
        });
      } catch (e) {
        return sendDatabaseError(res, '/seo', e);
      }
    }

    // /CHATBOT
    if (path === '/chatbot') {
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS tbl_chatbot_qa (
            id          SERIAL PRIMARY KEY,
            question    TEXT NOT NULL,
            answer      TEXT NOT NULL,
            order_index INT DEFAULT 0,
            created_at  TIMESTAMPTZ DEFAULT NOW(),
            updated_at  TIMESTAMPTZ DEFAULT NOW()
          )
        `);

        const rows = await runQuery('SELECT * FROM tbl_chatbot_qa ORDER BY order_index ASC, id ASC');
        res.setHeader('x-database-status', 'online');
        return res.status(200).json(rows);
      } catch (e) {
        return sendDatabaseError(res, '/chatbot', e);
      }
    }
  }

  // -------------------------------------------------------------
  // ADMIN ROUTES (CẦN JWT)
  // -------------------------------------------------------------
  if (path.startsWith('/admin')) {
    const isAuthorized = await verifyAdminJWT(req);
    if (!isAuthorized) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token JWT không hợp lệ hoặc hết hạn.' });
    }

    // --- 1. PROFILE ---
    if (req.method === 'PUT' && path === '/admin/profile') {
      const b = req.body ?? {};
      try {
        const nextProfile = {
          name: b.name ?? '',
          title_en: b.title_en ?? b.titleEn ?? '',
          title_vn: b.title_vn ?? b.titleVn ?? '',
          bio_en: b.bio_en ?? b.bioEn ?? '',
          bio_vn: b.bio_vn ?? b.bioVn ?? '',
          avatar_url: b.avatar_url ?? b.avatarUrl ?? b.avatar ?? '',
          email: stripPrefix(b.email ?? '', /^mailto:/i),
          phone: b.phone ?? '',
          github_url: b.github_url ?? b.githubUrl ?? b.github ?? '',
          facebook_url: b.facebook_url ?? b.facebookUrl ?? b.facebook ?? '',
          zalo_url: b.zalo_url ?? b.zaloUrl ?? b.zalo ?? '',
          songphuong_url: b.songphuong_url ?? b.songPhuongUrl ?? ''
        };

        await runQuery(
          `UPDATE tbl_profile SET 
            name = $1,
            title_en = $2,
            title_vn = $3,
            bio_en = $4,
            bio_vn = $5,
            avatar_url = $6,
            email = $7,
            phone = $8,
            github_url = $9,
            facebook_url = $10,
            zalo_url = $11,
            songphuong_url = $12,
            updated_at = NOW() 
           WHERE id = 1`,
          [
            nextProfile.name,
            nextProfile.title_en,
            nextProfile.title_vn,
            nextProfile.bio_en,
            nextProfile.bio_vn,
            nextProfile.avatar_url,
            nextProfile.email,
            nextProfile.phone,
            nextProfile.github_url,
            nextProfile.facebook_url,
            nextProfile.zalo_url,
            nextProfile.songphuong_url
          ]
        );
        await syncSocialLinksFromProfile(nextProfile);
        return res.status(200).json({ success: true, message: 'Cập nhật Profile và đồng bộ liên hệ thành công.' });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }
    // --- 2. PRODUCTS ---
    if (req.method === 'GET' && path === '/admin/products') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_products ORDER BY order_index ASC, id DESC');
        return res.status(200).json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/products') {
      const b = req.body ?? {};
      try {
        const rows = await runQuery(
          `INSERT INTO tbl_products (
            name, category, tag, price, old_price, discount, image_url, link, color, glyph, status,
            override_name, override_price, override_image_url, override_status, override_tag,
            visible, order_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *`,
          [
            b.name || '',
            b.category || '',
            b.tag ?? null,
            b.price ?? null,
            b.old_price ?? b.oldPrice ?? null,
            b.discount !== undefined && b.discount !== null ? Number(b.discount) : null,
            b.image_url ?? b.imageUrl ?? null,
            b.link ?? null,
            b.color ?? '#3B82F6',
            b.glyph ?? '📦',
            b.status ?? null,
            b.override_name ?? b.overrideName ?? null,
            b.override_price ?? b.overridePrice ?? null,
            b.override_image_url ?? b.overrideImageUrl ?? null,
            b.override_status ?? b.overrideStatus ?? null,
            b.override_tag ?? b.overrideTag ?? null,
            b.visible !== false,
            b.order_index !== undefined ? Number(b.order_index) : 0
          ]
        );
        return res.status(201).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/products') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing product ID' });
      }
      try {
        const rows = await runQuery(
          `UPDATE tbl_products SET
            name = $1,
            category = $2,
            tag = $3,
            price = $4,
            old_price = $5,
            discount = $6,
            image_url = $7,
            link = $8,
            color = $9,
            glyph = $10,
            status = $11,
            override_name = $12,
            override_price = $13,
            override_image_url = $14,
            override_status = $15,
            override_tag = $16,
            visible = $17,
            order_index = $18
          WHERE id = $19 RETURNING *`,
          [
            b.name || '',
            b.category || '',
            b.tag ?? null,
            b.price ?? null,
            b.old_price ?? b.oldPrice ?? null,
            b.discount !== undefined && b.discount !== null ? Number(b.discount) : null,
            b.image_url ?? b.imageUrl ?? null,
            b.link ?? null,
            b.color ?? '#3B82F6',
            b.glyph ?? '📦',
            b.status ?? null,
            b.override_name ?? b.overrideName ?? null,
            b.override_price ?? b.overridePrice ?? null,
            b.override_image_url ?? b.overrideImageUrl ?? null,
            b.override_status ?? b.overrideStatus ?? null,
            b.override_tag ?? b.overrideTag ?? null,
            b.visible !== false,
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.id
          ]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Product not found' });
        }
        return res.status(200).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'DELETE' && path === '/admin/products') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing product ID' });
      }
      try {
        await runQuery('DELETE FROM tbl_products WHERE id = $1', [b.id]);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 3. PROJECTS ---
    if (req.method === 'GET' && path === '/admin/projects') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_projects ORDER BY order_index ASC, id DESC');
        return res.status(200).json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/projects') {
      const b = req.body ?? {};
      if (!b.id || !b.name || !b.category) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'ID, Name, and Category are required' });
      }
      const parseTags = (tags: any): string[] => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') return tags.split(',').map((s: string) => s.trim()).filter(Boolean);
        return [];
      };

      try {
        const rows = await runQuery(
          `INSERT INTO tbl_projects (
            id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
          [
            b.id,
            b.name,
            b.category,
            b.color || '#2563EB',
            parseTags(b.tags),
            b.desc_vn || '',
            b.desc_en || '',
            b.demo_url || null,
            b.github_url || null,
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.visible !== false
          ]
        );
        return res.status(201).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/projects') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing project ID' });
      }

      const parseTags = (tags: any): string[] => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === 'string') return tags.split(',').map((s: string) => s.trim()).filter(Boolean);
        return [];
      };

      try {
        const rows = await runQuery(
          `UPDATE tbl_projects SET
            name = $1,
            category = $2,
            color = $3,
            tags = $4,
            desc_vn = $5,
            desc_en = $6,
            demo_url = $7,
            github_url = $8,
            order_index = $9,
            visible = $10
          WHERE id = $11 RETURNING *`,
          [
            b.name || '',
            b.category || '',
            b.color || '#2563EB',
            parseTags(b.tags),
            b.desc_vn || '',
            b.desc_en || '',
            b.demo_url || null,
            b.github_url || null,
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.visible !== false,
            b.id
          ]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Project not found' });
        }
        return res.status(200).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'DELETE' && path === '/admin/projects') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing project ID' });
      }
      try {
        await runQuery('DELETE FROM tbl_projects WHERE id = $1', [b.id]);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 4. TIMELINE ---
    if (req.method === 'GET' && path === '/admin/timeline') {
      try {
        const rows = await runQuery('SELECT * FROM tbl_timeline ORDER BY order_index ASC, id DESC');
        const parsed = rows.map((t: any) => {
          let desc_vn: string[] = [];
          let desc_en: string[] = [];
          try {
            if (typeof t.desc_vn === 'string') desc_vn = JSON.parse(t.desc_vn);
            else if (Array.isArray(t.desc_vn)) desc_vn = t.desc_vn;
          } catch {
            desc_vn = t.desc_vn ? [String(t.desc_vn)] : [];
          }
          try {
            if (typeof t.desc_en === 'string') desc_en = JSON.parse(t.desc_en);
            else if (Array.isArray(t.desc_en)) desc_en = t.desc_en;
          } catch {
            desc_en = t.desc_en ? [String(t.desc_en)] : [];
          }
          return {
            ...t,
            desc_vn,
            desc_en
          };
        });
        return res.status(200).json(parsed);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/timeline') {
      const b = req.body ?? {};
      const safeDescVn = Array.isArray(b.desc_vn) ? JSON.stringify(b.desc_vn) : b.desc_vn;
      const safeDescEn = Array.isArray(b.desc_en) ? JSON.stringify(b.desc_en) : b.desc_en;
      try {
        const rows = await runQuery(
          `INSERT INTO tbl_timeline (
            role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [
            b.role_vn || '',
            b.role_en || '',
            b.company || '',
            b.company_url || null,
            b.period_vn || '',
            b.period_en || '',
            safeDescVn || '[]',
            safeDescEn || '[]',
            b.type || 'work',
            b.order_index !== undefined ? Number(b.order_index) : 0
          ]
        );
        return res.status(201).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/timeline') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing timeline item ID' });
      }
      const safeDescVn = Array.isArray(b.desc_vn) ? JSON.stringify(b.desc_vn) : b.desc_vn;
      const safeDescEn = Array.isArray(b.desc_en) ? JSON.stringify(b.desc_en) : b.desc_en;
      try {
        const rows = await runQuery(
          `UPDATE tbl_timeline SET
            role_vn = $1,
            role_en = $2,
            company = $3,
            company_url = $4,
            period_vn = $5,
            period_en = $6,
            desc_vn = $7,
            desc_en = $8,
            type = $9,
            order_index = $10
          WHERE id = $11 RETURNING *`,
          [
            b.role_vn || '',
            b.role_en || '',
            b.company || '',
            b.company_url || null,
            b.period_vn || '',
            b.period_en || '',
            safeDescVn || '[]',
            safeDescEn || '[]',
            b.type || 'work',
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.id
          ]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Timeline item not found' });
        }
        return res.status(200).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'DELETE' && path === '/admin/timeline') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing timeline item ID' });
      }
      try {
        await runQuery('DELETE FROM tbl_timeline WHERE id = $1', [b.id]);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 5. CONTACT AUDIT ---
    if (req.method === 'GET' && path === '/admin/contact-audit') {
      try {
        const [profile] = await runQuery('SELECT * FROM tbl_profile LIMIT 1');
        const socialLinks = await runQuery('SELECT * FROM tbl_social_links ORDER BY order_index ASC, id ASC');
        const legacyTables = await runQuery(
          `SELECT table_name
           FROM information_schema.tables
           WHERE table_schema = 'public'
             AND table_name IN ('profile', 'social_links', 'tb_social_links')`
        );

        const legacy: Record<string, any[]> = {};
        for (const table of legacyTables) {
          if (table.table_name === 'profile') {
            legacy.profile = await runQuery('SELECT * FROM profile LIMIT 5');
          }
          if (table.table_name === 'social_links') {
            legacy.social_links = await runQuery('SELECT * FROM social_links ORDER BY order_index ASC, id ASC');
          }
          if (table.table_name === 'tb_social_links') {
            legacy.tb_social_links = await runQuery('SELECT * FROM tb_social_links ORDER BY order_index ASC, id ASC');
          }
        }

        const expected = profile ? profileContactLinks(profile) : [];
        const socialMap = new Map(socialLinks.map((link: any) => [link.platform, link.url]));
        const mismatches = expected
          .filter((link) => (socialMap.get(link.platform) ?? '') !== link.url)
          .map((link) => ({
            platform: link.platform,
            profileDerivedUrl: link.url,
            tblSocialLinksUrl: socialMap.get(link.platform) ?? ''
          }));

        return res.status(200).json({
          sourceOfTruth: 'tbl_profile',
          profile,
          expectedSocialLinks: expected,
          tblSocialLinks: socialLinks,
          legacyTables: legacy,
          mismatches
        });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 5. SYSTEM & SEO SETTINGS ---
    if (req.method === 'GET' && path === '/admin/settings') {
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS tbl_settings (
            key         VARCHAR(100) PRIMARY KEY,
            value       TEXT         NOT NULL,
            updated_at  TIMESTAMPTZ  DEFAULT NOW()
          )
        `);

        const socialLinks = await runQuery('SELECT * FROM tbl_social_links ORDER BY order_index ASC, id ASC');
        const seoRows = await runQuery('SELECT * FROM tbl_settings');

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
            await runQuery(
              'INSERT INTO tbl_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING',
              [d.key, d.value]
            );
            seoSettings[d.key] = d.value;
          }
        } else {
          for (const r of seoRows) {
            seoSettings[r.key] = r.value;
          }
        }

        return res.status(200).json({
          socialLinks,
          seoSettings
        });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/settings') {
      const b = req.body ?? {};
      const { socialLinks, seoSettings } = b;
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS tbl_settings (
            key         VARCHAR(100) PRIMARY KEY,
            value       TEXT         NOT NULL,
            updated_at  TIMESTAMPTZ  DEFAULT NOW()
          )
        `);

        if (Array.isArray(socialLinks)) {
          for (const link of socialLinks) {
            if (link.platform) {
              await runQuery(
                `UPDATE tbl_social_links
                 SET url = $1,
                     visible = $2,
                     updated_at = NOW()
                 WHERE platform = $3`,
                [link.url ?? '', link.visible !== false, link.platform]
              );
            }
          }
          await syncProfileFromSocialLinks(socialLinks);
        }

        if (seoSettings && typeof seoSettings === 'object') {
          const keys = Object.keys(seoSettings);
          for (const key of keys) {
            const val = String(seoSettings[key] ?? '');
            await runQuery(
              `INSERT INTO tbl_settings (key, value)
               VALUES ($1, $2)
               ON CONFLICT (key) DO UPDATE SET
                 value = EXCLUDED.value,
                 updated_at = NOW()`,
              [key, val]
            );
          }
        }

        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 6. SOCIALS (Dedicated endpoint) ---
    if (req.method === 'PUT' && path === '/admin/socials') {
      const b = req.body ?? {};
      const links: Array<{ platform: string; url: string; visible?: boolean; label?: string; order_index?: number }> =
        Array.isArray(b.socialLinks) ? b.socialLinks : Array.isArray(b) ? b : [];
      if (links.length === 0) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'socialLinks array is required.' });
      }
      try {
        for (const link of links) {
          if (!link.platform) continue;
          // Upsert: update if exists, insert if not
          await runQuery(
            `INSERT INTO tbl_social_links (platform, label, url, visible, order_index, updated_at)
             VALUES ($1, $2, $3, $4, $5, NOW())
             ON CONFLICT (platform) DO UPDATE SET
               url        = EXCLUDED.url,
               visible    = EXCLUDED.visible,
               label      = COALESCE(EXCLUDED.label, tbl_social_links.label),
               order_index = COALESCE(EXCLUDED.order_index, tbl_social_links.order_index),
               updated_at = NOW()`,
            [
              link.platform,
              link.label || link.platform,
              link.url ?? '',
              link.visible !== false,
              link.order_index ?? 0
            ]
          );
        }
        await syncProfileFromSocialLinks(links);
        return res.status(200).json({ success: true, updated: links.length });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 7. CHATBOT MANAGER ---
    if (req.method === 'GET' && path === '/admin/chatbot') {
      try {
        await runQuery(`
          CREATE TABLE IF NOT EXISTS tbl_chatbot_qa (
            id          SERIAL PRIMARY KEY,
            question    TEXT NOT NULL,
            answer      TEXT NOT NULL,
            order_index INT DEFAULT 0,
            created_at  TIMESTAMPTZ DEFAULT NOW(),
            updated_at  TIMESTAMPTZ DEFAULT NOW()
          )
        `);
        const rows = await runQuery('SELECT * FROM tbl_chatbot_qa ORDER BY order_index ASC, id ASC');
        return res.status(200).json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/chatbot') {
      const b = req.body ?? {};
      if (!b.question || !b.answer) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Question and answer are required.' });
      }
      try {
        const rows = await runQuery(
          `INSERT INTO tbl_chatbot_qa (question, answer, order_index, updated_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING *`,
          [b.question, b.answer, b.order_index ?? 0]
        );
        return res.status(201).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/chatbot') {
      const b = req.body ?? {};
      if (!b.id || !b.question || !b.answer) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'ID, question, and answer are required.' });
      }
      try {
        const rows = await runQuery(
          `UPDATE tbl_chatbot_qa
           SET question = $1,
               answer = $2,
               order_index = $3,
               updated_at = NOW()
           WHERE id = $4
           RETURNING *`,
          [b.question, b.answer, b.order_index ?? 0, b.id]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Q&A not found.' });
        }
        return res.status(200).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'DELETE' && path === '/admin/chatbot') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing Q&A ID' });
      }
      try {
        await runQuery('DELETE FROM tbl_chatbot_qa WHERE id = $1', [b.id]);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    return res.status(404).json({ error: 'ADMIN_ENDPOINT_NOT_IMPLEMENTED', message: 'Endpoint admin không được hỗ trợ.' });
  }

  return res.status(404).json({ error: 'ENDPOINT_NOT_FOUND', requestedPath: path });
}
