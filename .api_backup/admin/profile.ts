import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../utils/authMiddleware';
import { withErrorHandler } from '../_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireAuth(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

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

export default withErrorHandler(handler);
