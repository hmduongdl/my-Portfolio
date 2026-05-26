-- ============================================================
-- Seed dữ liệu ban đầu v2
-- Chạy SAU khi đã chạy schema.sql
-- ============================================================

-- ── Profile mặc định ─────────────────────────────────────────
-- Seed vào cả tbl_profile (primary) và profile (backward compat)
INSERT INTO tbl_profile (id, name, title_en, title_vn, bio_en, bio_vn,
  avatar_url, email, phone, github_url, facebook_url, zalo_url, songphuong_url)
VALUES (
  1,
  'Hoàng Minh Dương',
  'Web Developer · IT Student at Dalat University',
  'Nhà phát triển Web · Sinh viên CNTT Đại học Đà Lạt',
  'IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience.',
  'Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng.',
  '/my-avatar.jpg',
  'hoanglong.workdl@gmail.com',
  'tel:0911818016',
  'https://github.com/hmduongdl',
  'https://www.facebook.com/hmd.stewiclez',
  'https://zalo.me/0911818016',
  'https://songphuong.vn'
)
ON CONFLICT (id) DO NOTHING;

-- Backward compat profile table
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
  'hoanglong.workdl@gmail.com',
  'tel:0911818016',
  'https://github.com/hmduongdl',
  'https://www.facebook.com/hmd.stewiclez',
  'https://zalo.me/0911818016',
  'https://songphuong.vn'
)
ON CONFLICT (id) DO NOTHING;

-- ── Social links ──────────────────────────────────────────────
INSERT INTO tbl_social_links (platform, label, url, visible, order_index) VALUES
  ('github',   'GitHub',   'https://github.com/hmduongdl',               true,  0),
  ('facebook', 'Facebook', 'https://www.facebook.com/hmd.stewiclez',      true,  1),
  ('gmail',    'Gmail',    'mailto:hoanglong.workdl@gmail.com',           true,  2),
  ('phone',    'Phone',    'tel:0911818016',                              true,  3),
  ('zalo',     'Zalo',     'https://zalo.me/0911818016',                  true,  4)
ON CONFLICT (platform) DO NOTHING;

-- ── Products ──────────────────────────────────────────────────
INSERT INTO tbl_products (name, category, price, old_price, discount, image_url, link, glyph, color, status, visible, order_index) VALUES
  ('SP PC INTEL i5 12400F (i5 12400F/ B760/ Ram 8GB/ RTX 3050/ SSD 256GB/ 500W/ DOS)', 'PC Gaming', '15.390.000', '16.399.000', 6, 'https://songphuong.vn/Content/uploads/2023/05/SP-PC-INTEL-i5-12400F-1-2.webp', 'https://songphuong.vn/product/sp-pc-intel-i5-12400f/', '🖥', '#3B82F6', 'Hot', true, 0),
  ('SP PC INTEL i5 14400F RTX 5060 (i5 14400F/ B760/ Ram 16GB/ RTX 5060/ SSD 256GB/ 650W/ DOS)', 'PC Gaming', '23.790.000', '24.610.000', 3, 'https://songphuong.vn/Content/uploads/2025/11/SP-PC-INTEL-i5-14400F-RTX-5060-1.jpg', 'https://songphuong.vn/product/sp-pc-intel-i5-14400f-rtx-5060/', '🖥', '#2563EB', 'New', true, 1),
  ('SP PC AMD 3200G (Ryzen 3 3200G/ B450/ Ram 8GB DDR4/ SSD 256GB/ 250W/ DOS)', 'Office PC', '6.890.000', '7.319.000', 6, 'https://songphuong.vn/Content/uploads/2023/07/SP-PC-AMD-3000G.jpg', 'https://songphuong.vn/product/sp-pc-amd-3200g/', '🖥', '#6B7280', NULL, true, 2),
  ('Laptop Acer Aspire Lite 14 N23G2 – AL14-52M-32KV (Intel Core i3-1305U, RAM 8GB, SSD 256GB, 14 Inch WUXGA, Win11 Home)', 'Laptop', '11.390.000', '', 0, 'https://songphuong.vn/Content/uploads/2025/08/Laptop-Acer-Aspire-Lite-14-AL14-52M-32KV-2.webp', 'https://songphuong.vn/product/laptop-acer-aspire-lite-14-n23g2/', '💻', '#8B5CF6', 'Sale', true, 3),
  ('VGA Colorful iGame GeForce RTX 5060 TI Ultra W DUO OC 16GB', 'VGA', '15.090.000', '16.490.000', 8, 'https://songphuong.vn/Content/uploads/2025/04/VGA-Colorful-iGame-GeForce-RTX-5060-TI-Ultra-W-DUO-OC-16GB.jpg', 'https://songphuong.vn/product/vga-colorful-rtx-5060-ti-ultra-w-duo-oc-16gb/', '🎮', '#10B981', NULL, true, 4),
  ('Chuột Machenike L8 Pro Tri-Mode (White/Black, Wireless, 26000 DPI, RGB, Kèm Dock Sạc)', 'Gaming Gear', '1.390.000', '1.690.000', 18, 'https://songphuong.vn/Content/uploads/2025/06/L8-Pro-Tri-Modes-5.webp', 'https://songphuong.vn/product/chuot-machenike-l8-pro-tri-mode/', '🖱', '#F59E0B', 'Hot', true, 5),
  ('Tay Cầm Chơi Game Machenike G3 V2 Tri-mode (Black, Có dây, 2.4G Wireless, Bluetooth 5.0, RGB)', 'Gaming Gear', '729.000', '890.000', 18, 'https://songphuong.vn/Content/uploads/2025/04/MACHENIKE-G3-V2-Tri-mode-1.jpg', 'https://songphuong.vn/product/tay-cam-choi-game-machenike-g3-v2-black/', '🕹', '#D97706', 'Hot', true, 6),
  ('Bàn phím cơ Xiberia CZ98 Black Gradient (Hotswap/Magnetic switch/Led RGB/Waterproof)', 'Keyboard', '1.690.000', '1.950.000', 13, 'https://songphuong.vn/Content/uploads/2025/06/Ban-phim-co-Xiberia-CZ98-Black-Gradient-2.webp', 'https://songphuong.vn/product/ban-phim-co-xiberia-cz98-black-gradient/', '⌨', '#EC4899', 'New', true, 7),
  ('Loa Bluetooth Thonet & Vander KUMPEL 2.0 (Đen/Trắng)', 'Audio', '2.690.000', '3.580.000', 25, 'https://songphuong.vn/Content/uploads/2025/06/KUMPEL-2.0-2.webp', 'https://songphuong.vn/product/loa-bluetooth-thonet-vander-kumpel-2-0/', '🔊', '#06B6D4', 'Sale', true, 8)
ON CONFLICT DO NOTHING;

-- ============================================================
-- TẠO ADMIN USER:
-- Chạy lệnh sau để sinh SQL tạo tài khoản admin:
--   node database/create-admin.js <mật-khẩu-của-bạn>
-- Sau đó paste output vào NeonSQL SQL Editor.
-- ============================================================
