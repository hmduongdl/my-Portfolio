import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '../_lib/db';
import { requireAuth } from '../utils/authMiddleware';
import { withErrorHandler } from '../_lib/error';

async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await requireAuth(req))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Ensure tbl_settings exists
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_settings (
      key         VARCHAR(100) PRIMARY KEY,
      value       TEXT         NOT NULL,
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `;

  // GET: Fetch social links and SEO key-value configurations
  if (req.method === 'GET') {
    const socialLinks = await sql`
      SELECT * FROM social_links
      ORDER BY order_index ASC, id ASC
    `;

    const seoRows = await sql`
      SELECT * FROM tbl_settings
    `;

    const seoSettings: Record<string, string> = {};
    // Seed defaults if empty
    if (seoRows.length === 0) {
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
        seoSettings[d.key] = d.value;
      }
    } else {
      for (const r of seoRows) {
        seoSettings[r.key] = r.value;
      }
    }

    return res.status(200).json({
      socialLinks,
      seoSettings
    });
  }

  // PUT: Update social links and SEO settings
  if (req.method === 'PUT') {
    const b = req.body ?? {};
    const { socialLinks, seoSettings } = b;

    // 1. Update social links
    if (Array.isArray(socialLinks)) {
      for (const link of socialLinks) {
        if (link.platform) {
          await sql`
            UPDATE social_links
            SET url = ${link.url ?? ''},
                visible = ${link.visible !== false},
                updated_at = NOW()
            WHERE platform = ${link.platform}
          `;
        }
      }
    }

    // 2. Upsert SEO configurations
    if (seoSettings && typeof seoSettings === 'object') {
      const keys = Object.keys(seoSettings);
      for (const key of keys) {
        const val = String(seoSettings[key] ?? '');
        await sql`
          INSERT INTO tbl_settings (key, value)
          VALUES (${key}, ${val})
          ON CONFLICT (key) DO UPDATE SET
            value = EXCLUDED.value,
            updated_at = NOW()
        `;
      }
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withErrorHandler(handler);
