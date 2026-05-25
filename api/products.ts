import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { requireAuth } from './_lib/auth';
import { withErrorHandler } from './_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const showAll = req.query.all === 'true' || !!(await requireAuth(req.headers.authorization).catch(() => false));
    const rows = showAll ? await sql`
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
    ` : await sql`
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
      WHERE visible = true
      ORDER BY order_index ASC, id DESC
    `;
    
    // Map database fields to both camelCase and snake_case DTO format
    const mapped = rows.map((r: any) => ({
      id: Number(r.id),
      name: String(r.name || ''),
      category: String(r.category || ''),
      tag: r.tag ? String(r.tag) : null,
      price: r.price ? String(r.price) : null,
      oldPrice: r.old_price ? String(r.old_price) : null,
      discount: r.discount !== null && r.discount !== undefined ? Number(r.discount) : null,
      imageUrl: r.image_url ? String(r.image_url) : null,
      link: r.link ? String(r.link) : null,
      color: String(r.color || '#3B82F6'),
      glyph: String(r.glyph || '📦'),
      status: r.status ? String(r.status) : null,
      visible: r.visible !== false,
      orderIndex: Number(r.order_index ?? 0),

      // Compatibility properties
      old_price: r.old_price ? String(r.old_price) : null,
      image_url: r.image_url ? String(r.image_url) : null,
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

    const name = b.name as string;
    const category = b.category as string;
    const tag = (b.tag ?? b.override_tag ?? b.overrideTag) as string ?? null;
    const price = (b.price ?? b.override_price ?? b.overridePrice) as string ?? null;
    const old_price = (b.old_price ?? b.oldPrice) as string ?? null;
    const discount = (b.discount !== undefined && b.discount !== null) ? Number(b.discount) : null;
    const image_url = (b.image_url ?? b.imageUrl ?? b.override_image_url ?? b.overrideImageUrl) as string ?? null;
    const link = (b.link ?? b.product_url ?? b.productUrl) as string ?? null;
    const color = (b.color as string) ?? '#3B82F6';
    const glyph = (b.glyph as string) ?? '📦';
    const status = (b.status ?? b.override_status ?? b.overrideStatus) as string ?? null;
    const visible = b.visible !== false;
    const order_index = (b.order_index ?? b.orderIndex) !== undefined ? Number(b.order_index ?? b.orderIndex) : 0;

    const rows = await sql`
      INSERT INTO tbl_products
        (name, category, tag, price, old_price, discount, image_url, link, color, glyph, status, visible, order_index)
      VALUES (
        ${name},
        ${category},
        ${tag},
        ${price},
        ${old_price},
        ${discount},
        ${image_url},
        ${link},
        ${color},
        ${glyph},
        ${status},
        ${visible},
        ${order_index}
      )
      RETURNING *
    `;
    
    const r = rows[0];
    const createdProduct = {
      id: Number(r.id),
      name: String(r.name || ''),
      category: String(r.category || ''),
      tag: r.tag ? String(r.tag) : null,
      price: r.price ? String(r.price) : null,
      oldPrice: r.old_price ? String(r.old_price) : null,
      discount: r.discount !== null && r.discount !== undefined ? Number(r.discount) : null,
      imageUrl: r.image_url ? String(r.image_url) : null,
      link: r.link ? String(r.link) : null,
      color: String(r.color || '#3B82F6'),
      glyph: String(r.glyph || '📦'),
      status: r.status ? String(r.status) : null,
      visible: r.visible !== false,
      orderIndex: Number(r.order_index ?? 0),

      // Compatibility
      old_price: r.old_price ? String(r.old_price) : null,
      image_url: r.image_url ? String(r.image_url) : null,
      order_index: Number(r.order_index ?? 0)
    };

    return res.status(201).json(createdProduct);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
