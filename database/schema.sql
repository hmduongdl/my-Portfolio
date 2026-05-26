-- ============================================================
-- Portfolio Admin System — NeonSQL Schema
-- Chạy toàn bộ file này trong NeonSQL SQL Editor
-- ============================================================

-- 1. Profile (singleton row, id luôn = 1)
CREATE TABLE IF NOT EXISTS profile (
  id             INT PRIMARY KEY DEFAULT 1,
  name           VARCHAR(100)  NOT NULL DEFAULT 'Hoàng Minh Dương',
  title_en       VARCHAR(200)  DEFAULT 'Web Developer · IT Student',
  title_vn       VARCHAR(200)  DEFAULT 'Nhà phát triển Web · Sinh viên IT',
  bio_en         TEXT          DEFAULT '',
  bio_vn         TEXT          DEFAULT '',
  avatar_url     TEXT          DEFAULT '/my-avatar.jpg',
  email          VARCHAR(200)  DEFAULT '',
  phone          VARCHAR(50)   DEFAULT '',
  github_url     TEXT          DEFAULT '',
  facebook_url   TEXT          DEFAULT '',
  zalo_url       TEXT          DEFAULT '',
  songphuong_url TEXT          DEFAULT 'https://songphuong.vn',
  updated_at     TIMESTAMPTZ   DEFAULT NOW(),
  CONSTRAINT profile_singleton CHECK (id = 1)
);

-- 2. Social links (có toggle visible và thứ tự hiển thị)
CREATE TABLE IF NOT EXISTS social_links (
  id          SERIAL       PRIMARY KEY,
  platform    VARCHAR(50)  UNIQUE NOT NULL,
  label       VARCHAR(100) NOT NULL,
  url         TEXT         NOT NULL DEFAULT '',
  visible     BOOLEAN      DEFAULT true,
  order_index INT          DEFAULT 0,
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- 3. Products với override support
--    Khi override_* != NULL → dùng giá trị override thay cho base.
--    Xem view products_resolved để lấy dữ liệu đã áp override.
CREATE TABLE IF NOT EXISTS products (
  id          SERIAL      PRIMARY KEY,

  -- Base data (nguồn gốc)
  name        VARCHAR(300) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  tag         VARCHAR(50),
  price       VARCHAR(50),
  old_price   VARCHAR(50),
  discount    INT,
  image_url   TEXT,
  link        TEXT,
  color       VARCHAR(20)  DEFAULT '#3B82F6',
  glyph       VARCHAR(20)  DEFAULT '📦',
  status      VARCHAR(10)  CHECK (status IS NULL OR status IN ('New','Hot','Sale')),

  -- Override columns (NULL = dùng base data)
  override_name      VARCHAR(300),
  override_price     VARCHAR(50),
  override_image_url TEXT,
  override_status    VARCHAR(10) CHECK (override_status IS NULL OR override_status IN ('New','Hot','Sale')),
  override_tag       VARCHAR(50),

  -- Control
  visible     BOOLEAN     DEFAULT true,
  order_index INT         DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- View: trả về dữ liệu đã áp override — dùng trong Finder app
CREATE OR REPLACE VIEW products_resolved AS
SELECT
  id,
  COALESCE(override_name,      name)      AS name,
  category,
  COALESCE(override_tag,       tag)       AS tag,
  COALESCE(override_price,     price)     AS price,
  old_price,
  discount,
  COALESCE(override_image_url, image_url) AS image_url,
  link,
  color,
  glyph,
  COALESCE(override_status,    status)    AS status,
  visible,
  order_index,
  -- Flags
  (override_name IS NOT NULL OR override_price IS NOT NULL
   OR override_image_url IS NOT NULL OR override_status IS NOT NULL
   OR override_tag IS NOT NULL) AS has_override,
  -- Raw override values (dùng trong admin để biết cái gì đang bị override)
  override_name,
  override_price,
  override_image_url,
  override_status,
  override_tag,
  created_at,
  updated_at
FROM products;

-- 4. Admin users
CREATE TABLE IF NOT EXISTS tbl_users (
  id            SERIAL      PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Triggers: tự cập nhật updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_updated_at    ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_social_links_updated_at ON social_links;
CREATE TRIGGER trg_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
