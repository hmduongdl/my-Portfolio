import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../utils/authMiddleware';
import { withErrorHandler } from '../_lib/error';

// Helper to convert JS array to PG array literal string (e.g. {"React","TS"})
const toPgArray = (arr: any): string => {
  if (!Array.isArray(arr)) return '{}';
  const escaped = arr.map(item => {
    const clean = String(item).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${clean}"`;
  });
  return `{${escaped.join(',')}}`;
};

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const b = req.body ?? {};

  // GET: Fetch all projects with raw descriptions
  if (req.method === 'GET') {
    const rows = await sql`
      SELECT * FROM tbl_projects
      ORDER BY order_index ASC, id DESC
    `;
    return res.status(200).json(rows);
  }

  // POST: Create a new project
  if (req.method === 'POST') {
    const { id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible } = b;
    if (!id || !name || !category) {
      return res.status(400).json({ error: 'ID, Name, and Category are required' });
    }

    const pgTags = toPgArray(tags);

    const rows = await sql`
      INSERT INTO tbl_projects (
        id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible
      ) VALUES (
        ${id}, ${name}, ${category}, ${color || '#2563EB'}, ${pgTags}, ${desc_vn || ''}, ${desc_en || ''},
        ${demo_url || null}, ${github_url || null}, ${Number(order_index) || 0}, ${visible !== false}
      )
      RETURNING *
    `;

    return res.status(201).json(rows[0]);
  }

  // PUT: Update an existing project
  if (req.method === 'PUT') {
    const { id, name, category, color, tags, desc_vn, desc_en, demo_url, github_url, order_index, visible } = b;
    if (!id) {
      return res.status(400).json({ error: 'Missing Project ID' });
    }

    const pgTags = toPgArray(tags);

    const rows = await sql`
      UPDATE tbl_projects SET
        name = ${name ?? ''},
        category = ${category ?? ''},
        color = ${color ?? '#2563EB'},
        tags = ${pgTags},
        desc_vn = ${desc_vn ?? ''},
        desc_en = ${desc_en ?? ''},
        demo_url = ${demo_url || null},
        github_url = ${github_url || null},
        order_index = ${Number(order_index) || 0},
        visible = ${visible !== false}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    return res.status(200).json(rows[0]);
  }

  // DELETE: Delete a project
  if (req.method === 'DELETE') {
    const { id } = b;
    if (!id) {
      return res.status(400).json({ error: 'Missing ID' });
    }

    await sql`DELETE FROM tbl_projects WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
