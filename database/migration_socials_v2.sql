-- ============================================================
-- MIGRATION: Cập nhật URL đúng cho social links & profile
-- Chạy file này trong NeonSQL SQL Editor để đồng bộ dữ liệu.
-- File này an toàn để chạy nhiều lần (idempotent).
-- ============================================================

-- ── 1. Cập nhật tbl_social_links (nếu đã tồn tại) ───────────
-- Facebook URL chuẩn
INSERT INTO tbl_social_links (platform, label, url, visible, order_index)
VALUES ('facebook', 'Facebook', 'https://www.facebook.com/hmd.stewiclez', true, 1)
ON CONFLICT (platform) DO UPDATE SET
  url = 'https://www.facebook.com/hmd.stewiclez',
  updated_at = NOW();

-- Gmail đúng địa chỉ
INSERT INTO tbl_social_links (platform, label, url, visible, order_index)
VALUES ('gmail', 'Gmail', 'mailto:hoanglong.workdl@gmail.com', true, 2)
ON CONFLICT (platform) DO UPDATE SET
  url = 'mailto:hoanglong.workdl@gmail.com',
  updated_at = NOW();

-- Zalo với số điện thoại đúng
INSERT INTO tbl_social_links (platform, label, url, visible, order_index)
VALUES ('zalo', 'Zalo', 'https://zalo.me/0911818016', true, 4)
ON CONFLICT (platform) DO UPDATE SET
  url = 'https://zalo.me/0911818016',
  updated_at = NOW();

-- Phone
INSERT INTO tbl_social_links (platform, label, url, visible, order_index)
VALUES ('phone', 'Phone', 'tel:0911818016', true, 3)
ON CONFLICT (platform) DO UPDATE SET
  url = 'tel:0911818016',
  updated_at = NOW();

-- GitHub (no change, just ensure it's correct)
INSERT INTO tbl_social_links (platform, label, url, visible, order_index)
VALUES ('github', 'GitHub', 'https://github.com/hmduongdl', true, 0)
ON CONFLICT (platform) DO UPDATE SET
  url = 'https://github.com/hmduongdl',
  updated_at = NOW();

-- ── 2. Cập nhật bảng social_links cũ (nếu tồn tại) ──────────
-- (backward compat cho các DB chạy schema cũ)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_links') THEN
    INSERT INTO social_links (platform, label, url, visible, order_index) VALUES
      ('github',   'GitHub',   'https://github.com/hmduongdl',               true, 0),
      ('facebook', 'Facebook', 'https://www.facebook.com/hmd.stewiclez',      true, 1),
      ('gmail',    'Gmail',    'mailto:hoanglong.workdl@gmail.com',           true, 2),
      ('phone',    'Phone',    'tel:0911818016',                              true, 3),
      ('zalo',     'Zalo',     'https://zalo.me/0911818016',                  true, 4)
    ON CONFLICT (platform) DO UPDATE SET
      url = EXCLUDED.url,
      updated_at = NOW();
  END IF;
END $$;

-- ── 3. Cập nhật tbl_profile ───────────────────────────────────
UPDATE tbl_profile SET
  email         = 'hoanglong.workdl@gmail.com',
  phone         = 'tel:0911818016',
  facebook_url  = 'https://www.facebook.com/hmd.stewiclez',
  zalo_url      = 'https://zalo.me/0911818016',
  updated_at    = NOW()
WHERE id = 1;

-- ── 4. Cập nhật bảng profile cũ (nếu tồn tại) ───────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profile') THEN
    UPDATE profile SET
      email         = 'hoanglong.workdl@gmail.com',
      phone         = 'tel:0911818016',
      facebook_url  = 'https://www.facebook.com/hmd.stewiclez',
      zalo_url      = 'https://zalo.me/0911818016',
      updated_at    = NOW()
    WHERE id = 1;
  END IF;
END $$;

-- ── 5. Kiểm tra kết quả ───────────────────────────────────────
SELECT platform, label, url, visible FROM tbl_social_links ORDER BY order_index;
