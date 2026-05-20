import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { sql } from '../_lib/db';
import { signToken } from '../_lib/auth';
import { applyCors } from '../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = (req.body ?? {}) as Record<string, string>;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  try {
    const rows = await sql`
      SELECT id, username, password_hash FROM admin_users WHERE username = ${username} LIMIT 1
    `;
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, String(rows[0].password_hash));
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = await signToken({ id: rows[0].id, username: rows[0].username });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
