import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { requireAuth } from './_lib/auth';
import { applyCors } from './_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM profile WHERE id = 1`;
      return res.status(200).json(rows[0] ?? null);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    if (!(await requireAuth(req.headers.authorization))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b = (req.body ?? {}) as Record<string, string>;
    const { name, title_en, title_vn, bio_en, bio_vn, avatar_url, email, phone,
            github_url, facebook_url, zalo_url, songphuong_url } = b;

    try {
      const rows = await sql`
        INSERT INTO profile (id, name, title_en, title_vn, bio_en, bio_vn, avatar_url,
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
