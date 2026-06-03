-- ============================================================
-- Migration: Multi-album gallery + per-image SEO metadata
-- Mã task: TSK-ALBUM-DB
-- Chạy trong Neon SQL Editor hoặc psql.
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
