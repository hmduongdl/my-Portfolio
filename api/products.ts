import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { requireAuth } from './_lib/auth';
import { applyCors } from './_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM products ORDER BY order_index ASC, created_at DESC`;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'POST') {
    if (!(await requireAuth(req.headers.authorization))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b = (req.body ?? {}) as Record<string, unknown>;
    if (!b.name || !b.category) return res.status(400).json({ error: 'name and category are required' });

    try {
      const rows = await sql`
        INSERT INTO products
          (name, category, tag, price, old_price, discount, image_url, link, color, glyph, status, visible, order_index)
        VALUES (
          ${b.name as string},
          ${b.category as string},
          ${(b.tag as string) ?? null},
          ${(b.price as string) ?? null},
          ${(b.old_price as string) ?? null},
          ${(b.discount as number) ?? null},
          ${(b.image_url as string) ?? null},
          ${(b.link as string) ?? null},
          ${(b.color as string) ?? '#3B82F6'},
          ${(b.glyph as string) ?? '📦'},
          ${(b.status as string) ?? null},
          ${b.visible !== false},
          ${(b.order_index as number) ?? 0}
        )
        RETURNING *
      `;
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
