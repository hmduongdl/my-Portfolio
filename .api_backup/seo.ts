import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib/db';
import { applyCors } from './_lib/cors';
import { withErrorHandler } from './_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  applyCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure tbl_settings exists
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_settings (
      key         VARCHAR(100) PRIMARY KEY,
      value       TEXT         NOT NULL,
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `;

  // Fetch all SEO configurations
  const rows = await sql`
    SELECT * FROM tbl_settings
  `;

  const settingsObj: Record<string, string> = {};
  
  if (rows.length === 0) {
    const defaults = [
      { key: 'seo_title', value: 'Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology' },
      { key: 'seo_description', value: 'Hoàng Minh Dương — Sinh viên IT Đại học Đà Lạt, Web Developer thực chiến tại Song Phương Technology, Freelance Designer. Chuyên React, TypeScript, Node.js và thiết kế UI/UX hiện đại.' },
      { key: 'seo_keywords', value: 'Hoàng Minh Dương, Web Developer, Front End Developer, React, TypeScript, Node.js, Song Phương Technology, Đại học Đà Lạt, Freelance Designer, Portfolio' },
      { key: 'og_image', value: 'https://hmduongdl.github.io/Minimalist-Design-Portfolio/songphuong-logo.png' },
      { key: 'twitter_card', value: 'summary_large_image' }
    ];
    for (const d of defaults) {
      await sql`
        INSERT INTO tbl_settings (key, value) VALUES (${d.key}, ${d.value})
        ON CONFLICT (key) DO NOTHING
      `;
      settingsObj[d.key] = d.value;
    }
  } else {
    for (const r of rows) {
      settingsObj[r.key] = r.value;
    }
  }

  return res.status(200).json(settingsObj);
}

export default withErrorHandler(handler);
