import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { requireAuth } from './_lib/auth';
import { withErrorHandler } from './_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
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
      ORDER BY order_index ASC, id DESC
    `;
    
    // Safely parse integers/booleans if driver returns them as string
    const mapped = rows.map((r: any) => ({
      id: Number(r.id),
      name: String(r.name || ''),
      category: String(r.category || ''),
      tag: r.tag ? String(r.tag) : null,
      price: r.price ? String(r.price) : null,
      old_price: r.old_price ? String(r.old_price) : null,
      discount: r.discount !== null && r.discount !== undefined ? Number(r.discount) : null,
      image_url: r.image_url ? String(r.image_url) : null,
      link: r.link ? String(r.link) : null,
      color: String(r.color || '#3B82F6'),
      glyph: String(r.glyph || '📦'),
      status: r.status ? String(r.status) : null,
      visible: r.visible !== false,
      order_index: Number(r.order_index ?? 0)
    }));

    return res.status(200).json(mapped);
  }

  if (req.method === 'POST') {
    if (!(await requireAuth(req.headers.authorization))) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const b = (req.body ?? {}) as Record<string, unknown>;
    if (!b.name || !b.category) return res.status(400).json({ error: 'name and category are required' });

    const rows = await sql`
      INSERT INTO tbl_products
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
