import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { applyCors } from './_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    try {
      const rows = await sql`SELECT * FROM social_links ORDER BY order_index ASC, id ASC`;
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
