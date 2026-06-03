-- ============================================================
-- Portfolio Admin System — NeonSQL Schema v2
-- Chạy toàn bộ file này trong NeonSQL SQL Editor
-- ============================================================

-- ============================================================
-- 1. PROFILE (singleton row, id luôn = 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_profile (
  id             INT PRIMARY KEY DEFAULT 1,
  name           VARCHAR(100)  NOT NULL DEFAULT 'Hoàng Minh Dương',
  title_en       VARCHAR(200)  DEFAULT 'Web Developer · IT Student',
  title_vn       VARCHAR(200)  DEFAULT 'Nhà phát triển Web · Sinh viên IT',
  bio_en         TEXT          DEFAULT '',
  bio_vn         TEXT          DEFAULT '',
  avatar_url     TEXT          DEFAULT '/images/profile/my-avatar.webp',
  email          VARCHAR(200)  DEFAULT '',
  phone          VARCHAR(50)   DEFAULT '',
  github_url     TEXT          DEFAULT '',
  facebook_url   TEXT          DEFAULT '',
  zalo_url       TEXT          DEFAULT '',
  songphuong_url TEXT          DEFAULT 'https://songphuong.vn',
  updated_at     TIMESTAMPTZ   DEFAULT NOW(),
  CONSTRAINT tbl_profile_singleton CHECK (id = 1)
);

-- Backward-compat alias (DB cũ dùng tên "profile")
CREATE TABLE IF NOT EXISTS profile (
  id             INT PRIMARY KEY DEFAULT 1,
  name           VARCHAR(100)  NOT NULL DEFAULT 'Hoàng Minh Dương',
  title_en       VARCHAR(200)  DEFAULT 'Web Developer · IT Student',
  title_vn       VARCHAR(200)  DEFAULT 'Nhà phát triển Web · Sinh viên IT',
  bio_en         TEXT          DEFAULT '',
  bio_vn         TEXT          DEFAULT '',
  avatar_url     TEXT          DEFAULT '/images/profile/my-avatar.webp',
  email          VARCHAR(200)  DEFAULT '',
  phone          VARCHAR(50)   DEFAULT '',
  github_url     TEXT          DEFAULT '',
  facebook_url   TEXT          DEFAULT '',
  zalo_url       TEXT          DEFAULT '',
  songphuong_url TEXT          DEFAULT 'https://songphuong.vn',
  updated_at     TIMESTAMPTZ   DEFAULT NOW(),
  CONSTRAINT profile_singleton CHECK (id = 1)
);

-- ============================================================
-- 2. SOCIAL LINKS
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_social_links (
  id          SERIAL       PRIMARY KEY,
  platform    VARCHAR(50)  UNIQUE NOT NULL,
  label       VARCHAR(100) NOT NULL,
  url         TEXT         NOT NULL DEFAULT '',
  visible     BOOLEAN      DEFAULT true,
  order_index INT          DEFAULT 0,
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 3. PRODUCTS (với override support)
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_products (
  id                 SERIAL       PRIMARY KEY,
  name               VARCHAR(300) NOT NULL,
  category           VARCHAR(50)  NOT NULL,
  tag                VARCHAR(50),
  price              VARCHAR(50),
  old_price          VARCHAR(50),
  discount           INT,
  image_url          TEXT,
  link               TEXT,
  color              VARCHAR(20)  DEFAULT '#3B82F6',
  glyph              VARCHAR(20)  DEFAULT '📦',
  status             VARCHAR(10)  CHECK (status IS NULL OR status IN ('New','Hot','Sale')),
  override_name      VARCHAR(300),
  override_price     VARCHAR(50),
  override_image_url TEXT,
  override_status    VARCHAR(10)  CHECK (override_status IS NULL OR override_status IN ('New','Hot','Sale')),
  override_tag       VARCHAR(50),
  visible            BOOLEAN      DEFAULT true,
  order_index        INT          DEFAULT 0,
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- Backward-compat alias
CREATE TABLE IF NOT EXISTS products (
  id                 SERIAL       PRIMARY KEY,
  name               VARCHAR(300) NOT NULL,
  category           VARCHAR(50)  NOT NULL,
  tag                VARCHAR(50),
  price              VARCHAR(50),
  old_price          VARCHAR(50),
  discount           INT,
  image_url          TEXT,
  link               TEXT,
  color              VARCHAR(20)  DEFAULT '#3B82F6',
  glyph              VARCHAR(20)  DEFAULT '📦',
  status             VARCHAR(10)  CHECK (status IS NULL OR status IN ('New','Hot','Sale')),
  override_name      VARCHAR(300),
  override_price     VARCHAR(50),
  override_image_url TEXT,
  override_status    VARCHAR(10)  CHECK (override_status IS NULL OR override_status IN ('New','Hot','Sale')),
  override_tag       VARCHAR(50),
  visible            BOOLEAN      DEFAULT true,
  order_index        INT          DEFAULT 0,
  created_at         TIMESTAMPTZ  DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  DEFAULT NOW()
);

-- View: trả về dữ liệu đã áp override
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
  link, color, glyph,
  COALESCE(override_status,    status)    AS status,
  visible, order_index,
  (override_name IS NOT NULL OR override_price IS NOT NULL
   OR override_image_url IS NOT NULL OR override_status IS NOT NULL
   OR override_tag IS NOT NULL)           AS has_override,
  override_name, override_price, override_image_url, override_status, override_tag,
  created_at, updated_at
FROM products;

-- ============================================================
-- 4. PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_projects (
  id          VARCHAR(100) PRIMARY KEY,
  name        VARCHAR(300) NOT NULL,
  category    VARCHAR(50)  NOT NULL,
  color       VARCHAR(20)  DEFAULT '#2563EB',
  tags        TEXT[]       DEFAULT '{}',
  desc_vn     TEXT         DEFAULT '',
  desc_en     TEXT         DEFAULT '',
  demo_url    TEXT,
  github_url  TEXT,
  visible     BOOLEAN      DEFAULT true,
  order_index INT          DEFAULT 0,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 5. TIMELINE — Mốc lịch sử làm việc / học tập / freelance
--    desc_vn và desc_en lưu dạng JSONB (mảng string)
--    để hỗ trợ nhiều dòng gạch đầu dòng linh hoạt.
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_timeline (
  id          SERIAL       PRIMARY KEY,
  role_vn     VARCHAR(200) NOT NULL DEFAULT '',
  role_en     VARCHAR(200) NOT NULL DEFAULT '',
  company     VARCHAR(200) NOT NULL DEFAULT '',
  company_url TEXT,
  period_vn   VARCHAR(100) NOT NULL DEFAULT '',
  period_en   VARCHAR(100) NOT NULL DEFAULT '',
  desc_vn     JSONB        NOT NULL DEFAULT '[]'::jsonb,
  desc_en     JSONB        NOT NULL DEFAULT '[]'::jsonb,
  type        VARCHAR(20)  NOT NULL DEFAULT 'work'
              CHECK (type IN ('work', 'education', 'freelance')),
  order_index INT          NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 6. ADMIN USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_users (
  id            SERIAL      PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. SETTINGS (SEO + misc key-value store)
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_settings (
  key         VARCHAR(100) PRIMARY KEY,
  value       TEXT         NOT NULL,
  updated_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- 8. ALBUM GALLERY (multi-album photos + image SEO metadata)
-- ============================================================
CREATE TABLE IF NOT EXISTS tbl_albums (
  id          VARCHAR(50)  PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT          DEFAULT 0,
  visible     BOOLEAN      DEFAULT true
);

CREATE TABLE IF NOT EXISTS tbl_photos (
  id         SERIAL       PRIMARY KEY,
  album_id   VARCHAR(50)  NOT NULL REFERENCES tbl_albums(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  caption    TEXT,
  image_url  TEXT         NOT NULL,
  alt_text   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tbl_albums_visible_order
  ON tbl_albums (visible, order_index, id);

CREATE INDEX IF NOT EXISTS idx_tbl_photos_album_created
  ON tbl_photos (album_id, created_at DESC, id DESC);

-- ============================================================
-- TRIGGERS: tự động cập nhật updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_tbl_profile_updated_at ON tbl_profile;
CREATE TRIGGER trg_tbl_profile_updated_at
  BEFORE UPDATE ON tbl_profile
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tbl_products_updated_at ON tbl_products;
CREATE TRIGGER trg_tbl_products_updated_at
  BEFORE UPDATE ON tbl_products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tbl_social_links_updated_at ON tbl_social_links;
CREATE TRIGGER trg_tbl_social_links_updated_at
  BEFORE UPDATE ON tbl_social_links
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tbl_timeline_updated_at ON tbl_timeline;
CREATE TRIGGER trg_tbl_timeline_updated_at
  BEFORE UPDATE ON tbl_timeline
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_tbl_projects_updated_at ON tbl_projects;
CREATE TRIGGER trg_tbl_projects_updated_at
  BEFORE UPDATE ON tbl_projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SEED: Dữ liệu mẫu cho tbl_timeline
-- (Bỏ qua nếu đã có dữ liệu)
-- ============================================================
INSERT INTO tbl_timeline
  (role_vn, role_en, company, company_url, period_vn, period_en, desc_vn, desc_en, type, order_index)
VALUES
  (
    'Web Developer', 'Web Developer',
    'Song Phương Technology', 'https://songphuong.vn',
    'Tháng 3, 2025 - Hiện tại', 'Mar 2025 - Present',
    '["Thiết kế và phát triển giao diện người dùng sáng tạo cho các trang web và ứng dụng của công ty.", "Quản lý hệ thống cơ sở dữ liệu và tích hợp các API dịch vụ.", "Tối ưu hóa hiệu suất ứng dụng và trải nghiệm người dùng."]'::jsonb,
    '["Designed and developed creative user interfaces for company websites and applications.", "Managed database systems and integrated service APIs.", "Optimized application performance and user experience."]'::jsonb,
    'work', 0
  ),
  (
    'Sinh viên CNTT', 'IT Student',
    'Trường Đại học Đà Lạt', 'https://dlu.edu.vn',
    'Tháng 8, 2025 - 2029', 'Aug 2025 - 2029',
    '["Theo học ngành Công nghệ Thông tin.", "Nghiên cứu các thuật toán cơ bản, cấu trúc dữ liệu và phát triển phần mềm."]'::jsonb,
    '["Studying Information Technology.", "Researching fundamental algorithms, data structures and software development."]'::jsonb,
    'education', 1
  ),
  (
    'Nhà thiết kế đồ họa 2D', '2D Graphic Designer',
    'Freelance', NULL,
    'Trước đây', 'Previously',
    '["Thiết kế logo, nhận diện thương hiệu và ấn phẩm truyền thông cho khách hàng.", "Làm việc với Photoshop, Illustrator và Figma."]'::jsonb,
    '["Designed logos, brand identities and media publications for clients.", "Worked with Photoshop, Illustrator and Figma."]'::jsonb,
    'freelance', 2
  )
ON CONFLICT DO NOTHING;
