import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../_lib/auth';
import { applyCors } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (!(await requireAuth(req.headers.authorization))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = Number(req.query.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  if (req.method === 'PUT') {
    const b = (req.body ?? {}) as Record<string, unknown>;
    try {
      const rows = await sql`
        UPDATE social_links SET
          url         = COALESCE(${(b.url as string) ?? null}, url),
          visible     = COALESCE(${b.visible !== undefined ? (b.visible as boolean) : null}, visible),
          order_index = COALESCE(${(b.order_index as number) ?? null}, order_index),
          updated_at  = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
