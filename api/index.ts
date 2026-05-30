import { VercelRequest, VercelResponse } from '@vercel/node';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'SongPhuongOS_Super_Secret_Key_2026';


// SEO defaults are used only when optional SEO keys are missing in tbl_settings.
// Public app data endpoints now fail visibly instead of serving static mock data.
const DEFAULT_SEO = {
  title: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology',
  description: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.',
  keywords: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio',
  ogImage: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/images/brand/songphuong-logo.png',
  twitterCard: 'summary_large_image'
};

const DEFAULT_PROFILE = {
  id: 1,
  name: 'Hoàng Minh Dương',
  title_en: 'Web Developer · IT Student',
  title_vn: 'Nhà phát triển Web · Sinh viên IT',
  bio_en: 'IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience.',
  bio_vn: 'Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng.',
  avatar_url: '/images/profile/my-avatar.png',
  email: 'duonghm.work@gmail.com',
  phone: '',
  github_url: 'https://github.com/hmduongdl',
  facebook_url: 'https://facebook.com/',
  zalo_url: 'https://zalo.me/',
  songphuong_url: 'https://songphuong.vn'
};

function normalizeAvatarUrl(url?: string | null): string {
  if (!url || url === '/images/profile/my-avatar.jpg' || url === '/my-avatar.jpg' || url === '/img/my-avatar.jpg') {
    return '/images/profile/my-avatar.png';
  }
  return url;
}

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

function readBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return undefined;
}

function socialVisible(profile: Record<string, any>, platform: string): boolean | undefined {
  const columnMap: Record<string, string[]> = {
    github: ['github_visible', 'githubVisible'],
    facebook: ['facebook_visible', 'facebookVisible'],
    gmail: ['email_visible', 'emailVisible', 'gmail_visible', 'gmailVisible'],
    phone: ['phone_visible', 'phoneVisible'],
    zalo: ['zalo_visible', 'zaloVisible'],
    songphuong: ['songphuong_visible', 'songphuongVisible', 'song_phuong_visible', 'songPhuongVisible'],
  };

  for (const key of columnMap[platform] || []) {
    const visible = readBoolean(profile[key]);
    if (visible !== undefined) return visible;
  }
  return undefined;
}

function profileContactLinks(profile: Record<string, any>, visibility: Record<string, boolean> = {}) {
  return [
    { platform: 'github', label: 'GitHub', url: profile.github_url || profile.githubUrl || '', visible: visibility.github ?? socialVisible(profile, 'github') ?? true, order_index: 0 },
    { platform: 'facebook', label: 'Facebook', url: profile.facebook_url || profile.facebookUrl || '', visible: visibility.facebook ?? socialVisible(profile, 'facebook') ?? true, order_index: 1 },
    { platform: 'gmail', label: 'Gmail', url: toMailto(profile.email || ''), visible: visibility.gmail ?? socialVisible(profile, 'gmail') ?? true, order_index: 2 },
    { platform: 'phone', label: 'Phone', url: toTel(profile.phone || ''), visible: visibility.phone ?? socialVisible(profile, 'phone') ?? true, order_index: 3 },
    { platform: 'zalo', label: 'Zalo', url: toZaloUrl(profile.zalo_url || profile.zaloUrl || '', profile.phone || ''), visible: visibility.zalo ?? socialVisible(profile, 'zalo') ?? true, order_index: 4 },
    { platform: 'songphuong', label: 'Song Phương Website', url: profile.songphuong_url || profile.songphuongUrl || '', visible: visibility.songphuong ?? socialVisible(profile, 'songphuong') ?? true, order_index: 5 }
  ];
}

async function syncSocialLinksFromProfile(
  profile: Record<string, any>,
  visibility: Record<string, boolean> = {},
  updateVisibility = false
) {
  for (const link of profileContactLinks(profile, visibility)) {
    await runQuery(
      `INSERT INTO tbl_social_links (platform, label, url, visible, order_index, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (platform) DO UPDATE SET
         url = EXCLUDED.url,
         label = EXCLUDED.label,
         order_index = EXCLUDED.order_index,
         visible = CASE WHEN $6 THEN EXCLUDED.visible ELSE tbl_social_links.visible END,
         updated_at = NOW()`,
      [link.platform, link.label, link.url, link.visible, link.order_index, updateVisibility]
    );
  }
}

function normalizeSocialVisibility(body: Record<string, any>): Record<string, boolean> {
  const source = body.social_visibility || body.socialVisibility || {};
  const pairs: Array<[string, unknown]> = [
    ['github', source.github ?? body.github_visible ?? body.githubVisible],
    ['facebook', source.facebook ?? body.facebook_visible ?? body.facebookVisible],
    ['gmail', source.gmail ?? source.email ?? body.email_visible ?? body.emailVisible ?? body.gmail_visible ?? body.gmailVisible],
    ['phone', source.phone ?? body.phone_visible ?? body.phoneVisible],
    ['zalo', source.zalo ?? body.zalo_visible ?? body.zaloVisible],
    ['songphuong', source.songphuong ?? source.songPhuong ?? body.songphuong_visible ?? body.songphuongVisible ?? body.song_phuong_visible ?? body.songPhuongVisible],
  ];

  return pairs.reduce<Record<string, boolean>>((acc, [platform, value]) => {
    const visible = readBoolean(value);
    if (visible !== undefined) acc[platform] = visible;
    return acc;
  }, {});
}

function normalizeJsonbStringArray(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value.map((item) => String(item)).filter((item) => item.trim() !== ''));
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '[]';
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return JSON.stringify(parsed.map((item) => String(item)).filter((item) => item.trim() !== ''));
      }
    } catch {
      return JSON.stringify([trimmed]);
    }
    return JSON.stringify([trimmed]);
  }
  if (value === null || value === undefined) return '[]';
  return JSON.stringify([String(value)]);
}

type AdminProjectType = 'code' | 'design' | 'tool';

function normalizeProjectType(value: unknown, category: unknown): AdminProjectType {
  const normalizedValue = String(value ?? '').trim().toLowerCase();
  if (['code', 'coding', 'web', 'lap-trinh', 'lập trình'].includes(normalizedValue)) return 'code';
  if (['design', 'thiet-ke', 'thiết kế'].includes(normalizedValue)) return 'design';
  if (['tool', 'tools', 'cong-cu', 'công cụ'].includes(normalizedValue)) return 'tool';

  const normalizedCategory = String(category ?? '').trim().toLowerCase();
  if (normalizedCategory === 'design') return 'design';
  if (normalizedCategory === 'tools' || normalizedCategory === 'tool') return 'tool';
  return 'code';
}

function categoryFromProjectType(projectType: AdminProjectType): string {
  if (projectType === 'design') return 'design';
  if (projectType === 'tool') return 'tools';
  return 'web';
}

function normalizeJsonObject(value: unknown): Record<string, any> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, any>;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      return {};
    }
  }
  return {};
}

const TECH_STACK_CATEGORIES = ['Frontend', 'Backend', 'Design', 'Tools'] as const;

function normalizeTechStackCategory(value: unknown): string {
  const normalized = String(value ?? '').trim().toLowerCase();
  const match = TECH_STACK_CATEGORIES.find((category) => category.toLowerCase() === normalized);
  return match || 'Frontend';
}

function normalizeLegacyTechStack(value: unknown): Array<{ name: string; category: string }> {
  const parsed = normalizeJsonObject(value);
  const source = Array.isArray(parsed.techs) ? parsed.techs : Array.isArray(value) ? value : [];
  return source
    .map((item: any) => ({
      name: String(item?.name ?? '').trim(),
      category: normalizeTechStackCategory(item?.category)
    }))
    .filter((item) => item.name);
}

async function ensureTechStackTable() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS tbl_tech_stack (
      id          SERIAL PRIMARY KEY,
      name        TEXT        NOT NULL,
      category    VARCHAR(30) NOT NULL DEFAULT 'Frontend',
      order_index INT         DEFAULT 0,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      updated_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const countRows = await runQuery('SELECT COUNT(*)::int AS count FROM tbl_tech_stack');
  if ((countRows[0]?.count ?? 0) > 0) return;

  await runQuery(`
    CREATE TABLE IF NOT EXISTS tbl_settings (
      key         VARCHAR(100) PRIMARY KEY,
      value       TEXT         NOT NULL,
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);

  const legacyRows = await runQuery("SELECT value FROM tbl_settings WHERE key = 'tech_stack_options' LIMIT 1");
  const legacyTechs = normalizeLegacyTechStack(legacyRows[0]?.value);
  for (const [index, tech] of legacyTechs.entries()) {
    await runQuery(
      `INSERT INTO tbl_tech_stack (name, category, order_index, updated_at)
       VALUES ($1, $2, $3, NOW())`,
      [tech.name, tech.category, index]
    );
  }
}

function normalizeProjectPayload(body: Record<string, any>) {
  const projectType = normalizeProjectType(body.project_type ?? body.projectType, body.category);
  const category = categoryFromProjectType(projectType);
  const parseTags = (tags: any): string[] => {
    if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
    if (typeof tags === 'string') return tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
    return [];
  };

  const designDetailsVn = normalizeJsonObject(body.design_details_vn);
  const designDetailsEn = normalizeJsonObject(body.design_details_en);
  const toolDetailsVn = normalizeJsonObject(body.tool_details_vn);
  const toolDetailsEn = normalizeJsonObject(body.tool_details_en);

  if (projectType === 'design') {
    const figmaUrl = String(body.figma_url ?? body.figmaUrl ?? designDetailsVn.figmaUrl ?? designDetailsVn.figma_url ?? '').trim();
    const dribbbleUrl = String(body.dribbble_url ?? body.dribbbleUrl ?? designDetailsVn.dribbbleUrl ?? designDetailsVn.dribbble_url ?? '').trim();
    Object.assign(designDetailsVn, { figmaUrl, dribbbleUrl });
    Object.assign(designDetailsEn, { figmaUrl, dribbbleUrl });
  }

  if (projectType === 'tool') {
    const platformsSource = body.platforms ?? body.compatible_environments ?? body.compatibleEnvironments ?? toolDetailsVn.platforms;
    const platforms = Array.isArray(platformsSource)
      ? platformsSource.map((item) => String(item).trim()).filter(Boolean)
      : String(platformsSource ?? '').split(',').map((item) => item.trim()).filter(Boolean);
    const installCmd = String(body.install_cmd ?? body.installCmd ?? toolDetailsVn.installCmd ?? toolDetailsVn.install_cmd ?? '').trim();
    Object.assign(toolDetailsVn, { installCmd, platforms });
    Object.assign(toolDetailsEn, { installCmd, platforms });
  }

  return {
    projectType,
    category,
    tags: projectType === 'code' ? parseTags(body.tags) : [],
    demoUrl: projectType === 'code' ? (body.demo_url || body.demoUrl || null) : null,
    githubUrl: projectType === 'code' ? (body.github_url || body.githubUrl || null) : null,
    techStack: projectType === 'code' ? (body.tech_stack || body.techStack || '[]') : '[]',
    designDetailsVn: projectType === 'design' ? designDetailsVn : {},
    designDetailsEn: projectType === 'design' ? designDetailsEn : {},
    toolDetailsVn: projectType === 'tool' ? toolDetailsVn : {},
    toolDetailsEn: projectType === 'tool' ? toolDetailsEn : {}
  };
}

async function tableColumns(tableName: string): Promise<Set<string>> {
  const rows = await runQuery(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_schema = 'public'
        AND table_name = $1`,
    [tableName]
  );
  return new Set(rows.map((row: any) => row.column_name));
}

async function ensureProfileTable() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS tbl_profile (
      id                 INT PRIMARY KEY DEFAULT 1,
      name               VARCHAR(100) DEFAULT '',
      title_en           VARCHAR(200) DEFAULT '',
      title_vn           VARCHAR(200) DEFAULT '',
      bio_en             TEXT DEFAULT '',
      bio_vn             TEXT DEFAULT '',
      avatar_url         TEXT DEFAULT '',
      email              VARCHAR(200) DEFAULT '',
      phone              VARCHAR(50) DEFAULT '',
      github_url         TEXT DEFAULT '',
      facebook_url       TEXT DEFAULT '',
      zalo_url           TEXT DEFAULT '',
      songphuong_url     TEXT DEFAULT '',
      github_visible     BOOLEAN DEFAULT TRUE,
      facebook_visible   BOOLEAN DEFAULT TRUE,
      email_visible      BOOLEAN DEFAULT TRUE,
      phone_visible      BOOLEAN DEFAULT TRUE,
      zalo_visible       BOOLEAN DEFAULT TRUE,
      songphuong_visible BOOLEAN DEFAULT TRUE,
      updated_at         TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  const columns = await tableColumns('tbl_profile');
  const optionalColumns: Record<string, string> = {
    github_visible: 'BOOLEAN DEFAULT TRUE',
    facebook_visible: 'BOOLEAN DEFAULT TRUE',
    email_visible: 'BOOLEAN DEFAULT TRUE',
    phone_visible: 'BOOLEAN DEFAULT TRUE',
    zalo_visible: 'BOOLEAN DEFAULT TRUE',
    songphuong_visible: 'BOOLEAN DEFAULT TRUE',
    updated_at: 'TIMESTAMPTZ DEFAULT NOW()'
  };

  for (const [column, definition] of Object.entries(optionalColumns)) {
    if (!columns.has(column)) {
      await runQuery(`ALTER TABLE tbl_profile ADD COLUMN IF NOT EXISTS ${column} ${definition}`);
    }
  }

  await runQuery(
    `INSERT INTO tbl_profile (
      id, name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, phone,
      github_url, facebook_url, zalo_url, songphuong_url, updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
    ON CONFLICT (id) DO NOTHING`,
    [
      DEFAULT_PROFILE.id,
      DEFAULT_PROFILE.name,
      DEFAULT_PROFILE.title_en,
      DEFAULT_PROFILE.title_vn,
      DEFAULT_PROFILE.bio_en,
      DEFAULT_PROFILE.bio_vn,
      DEFAULT_PROFILE.avatar_url,
      DEFAULT_PROFILE.email,
      DEFAULT_PROFILE.phone,
      DEFAULT_PROFILE.github_url,
      DEFAULT_PROFILE.facebook_url,
      DEFAULT_PROFILE.zalo_url,
      DEFAULT_PROFILE.songphuong_url
    ]
  );
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
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];
    
    const secret = new TextEncoder().encode(JWT_SECRET);
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

      const secret = new TextEncoder().encode(JWT_SECRET);
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
        await ensureProfileTable();
        const rows = await runQuery('SELECT * FROM tbl_profile LIMIT 1');
        if (rows.length === 0) throw new Error('EMPTY_TABLE');
        const p = rows[0];
        
        res.setHeader('x-database-status', 'online');
        return res.status(200).json({
          id: p.id,
          name: p.name,
          title: lang === 'en' ? (p.title_en || p.title_vn) : (p.title_vn || p.title_en),
          bio: lang === 'en' ? (p.bio_en || p.bio_vn) : (p.bio_vn || p.bio_en),
          avatarUrl: normalizeAvatarUrl(p.avatar_url),
          email: p.email,
          phone: p.phone,
          githubUrl: p.github_url,
          facebookUrl: p.facebook_url,
          zaloUrl: p.zalo_url,
          songphuongUrl: p.songphuong_url,
          titleEn: p.title_en,
          titleVn: p.title_vn,
          bioEn: p.bio_en,
          bioVn: p.bio_vn,
          githubVisible: p.github_visible !== false,
          facebookVisible: p.facebook_visible !== false,
          emailVisible: p.email_visible !== false,
          phoneVisible: p.phone_visible !== false,
          zaloVisible: p.zalo_visible !== false,
          songphuongVisible: p.songphuong_visible !== false
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
          visible: p.visible,
          updatedAt: p.updated_at
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
            githubUrl: proj.github_url,
            duration: lang === 'en' ? proj.duration_en : proj.duration_vn,
            role: lang === 'en' ? proj.role_en : proj.role_vn,
            status: proj.status,
            type: lang === 'en' ? proj.type_en : proj.type_vn,
            achievement: lang === 'en' ? proj.achievement_en : proj.achievement_vn,
            techStack: proj.tech_stack,
            features: lang === 'en' ? proj.features_en : proj.features_vn,
            designDetails: lang === 'en' ? proj.design_details_en : proj.design_details_vn,
            toolDetails: lang === 'en' ? proj.tool_details_en : proj.tool_details_vn
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
    const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Thiếu token xác thực.' });
    }

    const isAuthorized = await verifyAdminJWT(req);
    if (!isAuthorized) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Token JWT không hợp lệ hoặc hết hạn.' });
    }

    // --- 1. PROFILE ---
    if (req.method === 'GET' && path === '/admin/profile') {
      try {
        await ensureProfileTable();
        const [profile] = await runQuery('SELECT * FROM tbl_profile WHERE id = 1 LIMIT 1');
        if (profile) {
          await syncSocialLinksFromProfile(profile);
        }
        return res.status(200).json(profile || DEFAULT_PROFILE);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/profile') {
      const b = req.body ?? {};
      try {
        await ensureProfileTable();
        const socialVisibility = normalizeSocialVisibility(b);
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
          songphuong_url: b.songphuong_url ?? b.songphuongUrl ?? b.songPhuongUrl ?? '',
          github_visible: socialVisibility.github,
          facebook_visible: socialVisibility.facebook,
          email_visible: socialVisibility.gmail,
          phone_visible: socialVisibility.phone,
          zalo_visible: socialVisibility.zalo,
          songphuong_visible: socialVisibility.songphuong
        };

        const columns = await tableColumns('tbl_profile');
        const profilePatch: Record<string, any> = {
          name: nextProfile.name,
          title_en: nextProfile.title_en,
          title_vn: nextProfile.title_vn,
          bio_en: nextProfile.bio_en,
          bio_vn: nextProfile.bio_vn,
          avatar_url: nextProfile.avatar_url,
          email: nextProfile.email,
          phone: nextProfile.phone,
          github_url: nextProfile.github_url,
          facebook_url: nextProfile.facebook_url,
          zalo_url: nextProfile.zalo_url,
          songphuong_url: nextProfile.songphuong_url,
          github_visible: nextProfile.github_visible,
          facebook_visible: nextProfile.facebook_visible,
          email_visible: nextProfile.email_visible,
          phone_visible: nextProfile.phone_visible,
          zalo_visible: nextProfile.zalo_visible,
          songphuong_visible: nextProfile.songphuong_visible,
        };
        const keys = Object.keys(profilePatch).filter((key) => columns.has(key) && profilePatch[key] !== undefined);
        if (keys.length > 0) {
          const assignments = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
          const values = keys.map((key) => profilePatch[key]);
          values.push(1);

          await runQuery(
            `UPDATE tbl_profile SET ${assignments}, updated_at = NOW() WHERE id = $${values.length}`,
            values
          );
        }
        await syncSocialLinksFromProfile(nextProfile, socialVisibility, Object.keys(socialVisibility).length > 0);
        const [updatedProfile] = await runQuery('SELECT * FROM tbl_profile WHERE id = 1');
        return res.status(200).json({
          success: true,
          profile: updatedProfile,
          socialVisibility,
          message: 'Cập nhật Profile và đồng bộ liên hệ thành công.'
        });
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
        return res.status(200).json(rows.map((row: any) => ({
          ...row,
          project_type: normalizeProjectType(row.project_type, row.category)
        })));
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/projects') {
      const b = req.body ?? {};
      if (!b.id || !b.name) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'ID and Name are required' });
      }
      const projectPayload = normalizeProjectPayload(b);

      try {
        const rows = await runQuery(
          `INSERT INTO tbl_projects (
            id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible,
            duration_vn, duration_en, role_vn, role_en, status, type_vn, type_en,
            achievement_vn, achievement_en, tech_stack, features_vn, features_en, design_details_vn, design_details_en, tool_details_vn, tool_details_en
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27) RETURNING *`,
          [
            b.id,
            b.name,
            projectPayload.category,
            b.color || '#2563EB',
            projectPayload.tags,
            b.desc_vn || '',
            b.desc_en || '',
            projectPayload.demoUrl,
            projectPayload.githubUrl,
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.visible !== false,
            b.duration_vn || null,
            b.duration_en || null,
            b.role_vn || null,
            b.role_en || null,
            b.status || null,
            b.type_vn || null,
            b.type_en || null,
            b.achievement_vn || null,
            b.achievement_en || null,
            projectPayload.techStack,
            b.features_vn || '[]',
            b.features_en || '[]',
            projectPayload.designDetailsVn,
            projectPayload.designDetailsEn,
            projectPayload.toolDetailsVn,
            projectPayload.toolDetailsEn
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
      const projectPayload = normalizeProjectPayload(b);

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
            visible = $10,
            duration_vn = $12,
            duration_en = $13,
            role_vn = $14,
            role_en = $15,
            status = $16,
            type_vn = $17,
            type_en = $18,
            achievement_vn = $19,
            achievement_en = $20,
            tech_stack = $21,
            features_vn = $22,
            features_en = $23,
            design_details_vn = $24,
            design_details_en = $25,
            tool_details_vn = $26,
            tool_details_en = $27
          WHERE id = $11 RETURNING *`,
          [
            b.name || '',
            projectPayload.category,
            b.color || '#2563EB',
            projectPayload.tags,
            b.desc_vn || '',
            b.desc_en || '',
            projectPayload.demoUrl,
            projectPayload.githubUrl,
            b.order_index !== undefined ? Number(b.order_index) : 0,
            b.visible !== false,
            b.id,
            b.duration_vn || null,
            b.duration_en || null,
            b.role_vn || null,
            b.role_en || null,
            b.status || null,
            b.type_vn || null,
            b.type_en || null,
            b.achievement_vn || null,
            b.achievement_en || null,
            projectPayload.techStack,
            b.features_vn || '[]',
            b.features_en || '[]',
            projectPayload.designDetailsVn,
            projectPayload.designDetailsEn,
            projectPayload.toolDetailsVn,
            projectPayload.toolDetailsEn
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
      const safeDescVn = normalizeJsonbStringArray(b.desc_vn ?? b.descVn ?? b.desc);
      const safeDescEn = normalizeJsonbStringArray(b.desc_en ?? b.descEn ?? b.desc);
      try {
        const rows = await runQuery(
          `INSERT INTO tbl_timeline (
            role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index
          ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10) RETURNING *`,
          [
            b.role_vn || '',
            b.role_en || '',
            b.company || '',
            b.company_url || null,
            b.period_vn || '',
            b.period_en || '',
            safeDescVn,
            safeDescEn,
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
      const safeDescVn = normalizeJsonbStringArray(b.desc_vn ?? b.descVn ?? b.desc);
      const safeDescEn = normalizeJsonbStringArray(b.desc_en ?? b.descEn ?? b.desc);
      try {
        const rows = await runQuery(
          `UPDATE tbl_timeline SET
            role_vn = $1,
            role_en = $2,
            company = $3,
            company_url = $4,
            period_vn = $5,
            period_en = $6,
            desc_vn = $7::jsonb,
            desc_en = $8::jsonb,
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
            safeDescVn,
            safeDescEn,
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
            { key: 'og_image', value: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/images/brand/songphuong-logo.png' },
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
      const { socialLinks, seoSettings, appSettings } = b;
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

        if (appSettings && typeof appSettings === 'object') {
          const keys = Object.keys(appSettings);
          for (const key of keys) {
            const val = String(appSettings[key] ?? '');
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

    // --- 7. TECH STACK MANAGER ---
    if (req.method === 'GET' && path === '/admin/tech-stack') {
      try {
        await ensureTechStackTable();
        const rows = await runQuery('SELECT * FROM tbl_tech_stack ORDER BY order_index ASC, id ASC');
        return res.status(200).json(rows);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'POST' && path === '/admin/tech-stack') {
      const b = req.body ?? {};
      const name = String(b.name ?? '').trim();
      if (!name) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Tech name is required.' });
      }
      try {
        await ensureTechStackTable();
        const rows = await runQuery(
          `INSERT INTO tbl_tech_stack (name, category, order_index, updated_at)
           VALUES ($1, $2, $3, NOW())
           RETURNING *`,
          [name, normalizeTechStackCategory(b.category), Number.isFinite(Number(b.order_index)) ? Number(b.order_index) : 0]
        );
        return res.status(201).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'PUT' && path === '/admin/tech-stack') {
      const b = req.body ?? {};
      try {
        await ensureTechStackTable();

        if (Array.isArray(b.items)) {
          await runQuery('DELETE FROM tbl_tech_stack');
          const inserted = [];
          for (const [index, item] of b.items.entries()) {
            const name = String(item?.name ?? '').trim();
            if (!name) continue;
            const rows = await runQuery(
              `INSERT INTO tbl_tech_stack (name, category, order_index, updated_at)
               VALUES ($1, $2, $3, NOW())
               RETURNING *`,
              [name, normalizeTechStackCategory(item?.category), index]
            );
            inserted.push(rows[0]);
          }
          return res.status(200).json({ success: true, items: inserted });
        }

        if (!b.id) {
          return res.status(400).json({ error: 'BAD_REQUEST', message: 'ID is required.' });
        }
        const name = String(b.name ?? '').trim();
        if (!name) {
          return res.status(400).json({ error: 'BAD_REQUEST', message: 'Tech name is required.' });
        }
        const rows = await runQuery(
          `UPDATE tbl_tech_stack
           SET name = $1,
               category = $2,
               order_index = $3,
               updated_at = NOW()
           WHERE id = $4
           RETURNING *`,
          [name, normalizeTechStackCategory(b.category), Number.isFinite(Number(b.order_index)) ? Number(b.order_index) : 0, b.id]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'NOT_FOUND', message: 'Tech Stack item not found.' });
        }
        return res.status(200).json(rows[0]);
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    if (req.method === 'DELETE' && path === '/admin/tech-stack') {
      const b = req.body ?? {};
      if (!b.id) {
        return res.status(400).json({ error: 'BAD_REQUEST', message: 'Missing Tech Stack ID' });
      }
      try {
        await ensureTechStackTable();
        await runQuery('DELETE FROM tbl_tech_stack WHERE id = $1', [b.id]);
        return res.status(200).json({ success: true });
      } catch (e: any) {
        return res.status(500).json({ error: 'DATABASE_ERROR', message: e.message });
      }
    }

    // --- 8. CHATBOT MANAGER ---
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
