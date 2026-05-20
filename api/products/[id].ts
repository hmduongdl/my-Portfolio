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
    if (!b.name || !b.category) return res.status(400).json({ error: 'name and category are required' });

    try {
      const rows = await sql`
        UPDATE products SET
          name              = ${b.name as string},
          category          = ${b.category as string},
          tag               = ${(b.tag as string) ?? null},
          price             = ${(b.price as string) ?? null},
          old_price         = ${(b.old_price as string) ?? null},
          discount          = ${(b.discount as number) ?? null},
          image_url         = ${(b.image_url as string) ?? null},
          link              = ${(b.link as string) ?? null},
          color             = ${(b.color as string) ?? '#3B82F6'},
          glyph             = ${(b.glyph as string) ?? '📦'},
          status            = ${(b.status as string) ?? null},
          visible           = ${b.visible !== false},
          order_index       = ${(b.order_index as number) ?? 0},
          override_name     = ${(b.override_name as string) ?? null},
          override_price    = ${(b.override_price as string) ?? null},
          override_image_url = ${(b.override_image_url as string) ?? null},
          override_status   = ${(b.override_status as string) ?? null},
          override_tag      = ${(b.override_tag as string) ?? null},
          updated_at        = NOW()
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

  if (req.method === 'DELETE') {
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
