import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { requireAuth } from './_lib/auth';
import { withErrorHandler } from './_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  const lang = (req.query.lang as string) === 'en' ? 'en' : 'vn';

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

  // Seed default row if empty
  const countRes = await sql`SELECT COUNT(*)::int AS c FROM tbl_profile`;
  if (Number(countRes[0]?.c ?? 0) === 0) {
    await sql`
      INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, github_url, facebook_url, songphuong_url)
      VALUES (1, 'Hoàng Minh Dương', 'Web Developer · IT Student', 'Nhà phát triển Web · Sinh viên CNTT', '', '', '/my-avatar.jpg', 'duonghm.work@gmail.com', 'https://github.com/hmduongdl', 'https://facebook.com/', 'https://songphuong.vn')
      ON CONFLICT (id) DO NOTHING
    `;
  }

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM tbl_profile WHERE id = 1`;
    const row = rows[0];
    if (!row) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Map to Frontend DTO structure
    const data = {
      name: String(row.name || ''),
      title: lang === 'en' ? String(row.title_en || row.title_vn || '') : String(row.title_vn || row.title_en || ''),
      bio: lang === 'en' ? String(row.bio_en || row.bio_vn || '') : String(row.bio_vn || row.bio_en || ''),
      email: String(row.email || ''),
      github: String(row.github_url || ''),
      facebook: String(row.facebook_url || ''),
      songphuong_url: String(row.songphuong_url || ''),
      avatar: String(row.avatar_url || ''),
      phone: String(row.phone || ''),
      zalo: String(row.zalo_url || '')
    };

    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    if (!(await requireAuth(req.headers.authorization))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b = (req.body ?? {}) as Record<string, string>;
    const { name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, phone,
            github_url, facebook_url, zalo_url, songphuong_url } = b;

    const rows = await sql`
      INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url,
        email, phone, github_url, facebook_url, zalo_url, songphuong_url)
      VALUES (1, ${name ?? ''}, ${title_en ?? ''}, ${title_vn ?? ''},
        ${bio_en ?? ''}, ${bio_vn ?? ''}, ${avatar_url ?? ''},
        ${email ?? ''}, ${phone ?? ''}, ${github_url ?? ''},
        ${facebook_url ?? ''}, ${zalo_url ?? ''}, ${songphuong_url ?? ''})
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

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
