import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../utils/authMiddleware';
import { withErrorHandler } from '../_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const b = req.body ?? {};

  if (req.method === 'POST') {
    const { role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index } = b;
    
    // Ensure desc_vn and desc_en are JSON strings
    const safeDescVn = Array.isArray(desc_vn) ? JSON.stringify(desc_vn) : desc_vn;
    const safeDescEn = Array.isArray(desc_en) ? JSON.stringify(desc_en) : desc_en;

    const rows = await sql`
      INSERT INTO tbl_timeline
        (role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index)
      VALUES
        (${role_vn || ''}, ${role_en || ''}, ${company || ''}, ${company_url || null},
         ${period_vn || ''}, ${period_en || ''}, ${safeDescVn || '[]'}, ${safeDescEn || '[]'},
         ${type || 'work'}, ${order_index || 0})
      RETURNING *
    `;
    return res.status(201).json(rows[0]);
  }

  if (req.method === 'PUT') {
    const { id, role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index } = b;
    if (!id) return res.status(400).json({ error: 'Missing ID' });

    const safeDescVn = Array.isArray(desc_vn) ? JSON.stringify(desc_vn) : desc_vn;
    const safeDescEn = Array.isArray(desc_en) ? JSON.stringify(desc_en) : desc_en;

    const rows = await sql`
      UPDATE tbl_timeline SET
        role_vn = ${role_vn || ''},
        role_en = ${role_en || ''},
        company = ${company || ''},
        company_url = ${company_url || null},
        period_vn = ${period_vn || ''},
        period_en = ${period_en || ''},
        desc_vn = ${safeDescVn || '[]'},
        desc_en = ${safeDescEn || '[]'},
        type = ${type || 'work'},
        order_index = ${order_index || 0}
      WHERE id = ${id}
      RETURNING *
    `;
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(rows[0]);
  }

  if (req.method === 'DELETE') {
    const { id } = b;
    if (!id) return res.status(400).json({ error: 'Missing ID' });

    await sql`DELETE FROM tbl_timeline WHERE id = ${id}`;
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
