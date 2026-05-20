-- ============================================================
-- Seed dữ liệu ban đầu
-- Chạy SAU khi đã chạy schema.sql
-- ============================================================

-- Profile mặc định
INSERT INTO profile (id, name, title_en, title_vn, bio_en, bio_vn,
  avatar_url, email, phone, github_url, facebook_url, zalo_url, songphuong_url)
VALUES (
  1,
  'Hoàng Minh Dương',
  'Web Developer · IT Student at Dalat University',
  'Nhà phát triển Web · Sinh viên CNTT Đại học Đà Lạt',
  'IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience.',
  'Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng.',
  '/my-avatar.jpg',
  'duonghm.work@gmail.com',
  '',
  'https://github.com/hmduongdl',
  'https://facebook.com/',
  'https://zalo.me/',
  'https://songphuong.vn'
)
ON CONFLICT (id) DO NOTHING;

-- Social links
INSERT INTO social_links (platform, label, url, visible, order_index) VALUES
  ('github',   'GitHub',   'https://github.com/hmduongdl',   true,  0),
  ('facebook', 'Facebook', 'https://facebook.com/',           true,  1),
  ('gmail',    'Gmail',    'mailto:duonghm.work@gmail.com',   true,  2),
  ('phone',    'Phone',    'tel:+84',                         true,  3),
  ('zalo',     'Zalo',     'https://zalo.me/',                true,  4)
ON CONFLICT (platform) DO NOTHING;

-- ============================================================
-- TẠO ADMIN USER:
-- Chạy lệnh sau để sinh SQL tạo tài khoản admin:
--   node database/create-admin.js <mật-khẩu-của-bạn>
-- Sau đó paste output vào NeonSQL SQL Editor.
-- ============================================================
