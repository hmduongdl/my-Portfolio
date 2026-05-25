import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../utils/authMiddleware';
import { withErrorHandler } from '../_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const b = req.body ?? {};

  // GET: Fetch all products with raw base and override fields
  if (req.method === 'GET') {
    const rows = await sql`
      SELECT * FROM tbl_products
      ORDER BY order_index ASC, id DESC
    `;

    // Map database fields to ensure frontend compatibility
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

      // Overrides
      overrideName: r.override_name ? String(r.override_name) : null,
      overridePrice: r.override_price ? String(r.override_price) : null,
      overrideImageUrl: r.override_image_url ? String(r.override_image_url) : null,
      overrideStatus: r.override_status ? String(r.override_status) : null,
      overrideTag: r.override_tag ? String(r.override_tag) : null,

      // Compatibility snake_case properties
      old_price: r.old_price ? String(r.old_price) : null,
      image_url: r.image_url ? String(r.image_url) : null,
      order_index: Number(r.order_index ?? 0),
      override_name: r.override_name ? String(r.override_name) : null,
      override_price: r.override_price ? String(r.override_price) : null,
      override_image_url: r.override_image_url ? String(r.override_image_url) : null,
      override_status: r.override_status ? String(r.override_status) : null,
      override_tag: r.override_tag ? String(r.override_tag) : null
    }));

    return res.status(200).json(mapped);
  }

  // POST: Create a new product
  if (req.method === 'POST') {
    const name = b.name ?? '';
    const category = b.category ?? '';
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and Category are required' });
    }

    const tag = b.tag ?? null;
    const price = b.price ?? null;
    const old_price = b.old_price ?? b.oldPrice ?? null;
    const discount = (b.discount !== undefined && b.discount !== null) ? Number(b.discount) : null;
    const image_url = b.image_url ?? b.imageUrl ?? null;
    const link = b.link ?? null;
    const color = b.color ?? '#3B82F6';
    const glyph = b.glyph ?? '📦';
    const status = b.status ?? null;

    // Overrides
    const override_name = b.override_name ?? b.overrideName ?? null;
    const override_price = b.override_price ?? b.overridePrice ?? null;
    const override_image_url = b.override_image_url ?? b.overrideImageUrl ?? null;
    const override_status = b.override_status ?? b.overrideStatus ?? null;
    const override_tag = b.override_tag ?? b.overrideTag ?? null;

    const visible = b.visible !== false;
    const order_index = b.order_index !== undefined ? Number(b.order_index) : 0;

    const rows = await sql`
      INSERT INTO tbl_products (
        name, category, tag, price, old_price, discount, image_url, link, color, glyph, status,
        override_name, override_price, override_image_url, override_status, override_tag,
        visible, order_index
      ) VALUES (
        ${name}, ${category}, ${tag}, ${price}, ${old_price}, ${discount}, ${image_url}, ${link}, ${color}, ${glyph}, ${status},
        ${override_name}, ${override_price}, ${override_image_url}, ${override_status}, ${override_tag},
        ${visible}, ${order_index}
      ) RETURNING *
    `;

    return res.status(201).json(rows[0]);
  }

  // PUT: Update an existing product
  if (req.method === 'PUT') {
    const id = b.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing ID' });
    }

    const name = b.name ?? '';
    const category = b.category ?? '';
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and Category are required' });
    }

    const tag = b.tag ?? null;
    const price = b.price ?? null;
    const old_price = b.old_price ?? b.oldPrice ?? null;
    const discount = (b.discount !== undefined && b.discount !== null) ? Number(b.discount) : null;
    const image_url = b.image_url ?? b.imageUrl ?? null;
    const link = b.link ?? null;
    const color = b.color ?? '#3B82F6';
    const glyph = b.glyph ?? '📦';
    const status = b.status ?? null;

    // Overrides
    const override_name = b.override_name ?? b.overrideName ?? null;
    const override_price = b.override_price ?? b.overridePrice ?? null;
    const override_image_url = b.override_image_url ?? b.overrideImageUrl ?? null;
    const override_status = b.override_status ?? b.overrideStatus ?? null;
    const override_tag = b.override_tag ?? b.overrideTag ?? null;

    const visible = b.visible !== false;
    const order_index = b.order_index !== undefined ? Number(b.order_index) : 0;

    const rows = await sql`
      UPDATE tbl_products SET
        name = ${name},
        category = ${category},
        tag = ${tag},
        price = ${price},
        old_price = ${old_price},
        discount = ${discount},
        image_url = ${image_url},
        link = ${link},
        color = ${color},
        glyph = ${glyph},
        status = ${status},
        override_name = ${override_name},
        override_price = ${override_price},
        override_image_url = ${override_image_url},
        override_status = ${override_status},
        override_tag = ${override_tag},
        visible = ${visible},
        order_index = ${order_index},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(rows[0]);
  }

  // DELETE: Delete a product
  if (req.method === 'DELETE') {
    const id = b.id;
    if (!id) {
      return res.status(400).json({ error: 'Missing ID' });
    }

    await sql`DELETE FROM tbl_products WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
