# Data Inventory — Portfolio

Báo cáo liệt kê cấu trúc dữ liệu (schema) có thể chỉnh sửa qua Admin UI.
Nguồn: mã nguồn trong repository (About, Finder, Projects, Mail, MenuBar, index.html), DB schema & seed.

---

## 1) Thông tin cá nhân (Profile — `tbl_profile`)

| Field Name | Type (DB / Frontend) | Mô tả | Dữ liệu thực tế hiện tại |
|---|---|---|---|
| id | INT (PK, singleton) | ID row duy nhất (id = 1) | 1 (schema enforced) |
| name | VARCHAR(100) | Tên hiển thị | Hoàng Minh Dương |
| title_en | VARCHAR(200) | Title (English) | Web Developer · IT Student |
| title_vn | VARCHAR(200) | Title (Tiếng Việt) | Nhà phát triển Web · Sinh viên IT |
| bio_en | TEXT | Mô tả dài (EN) | IT Student at Da Lat University & Web Developer at Song Phương Technology. Passionate about creative UI design and optimizing user experience. |
| bio_vn | TEXT | Mô tả dài (VN) | Sinh viên IT tại Đại học Đà Lạt & Web Developer tại Song Phương Technology. Đam mê thiết kế giao diện sáng tạo và tối ưu hóa trải nghiệm người dùng. |
| avatar_url | TEXT | Đường dẫn avatar | /images/profile/my-avatar.webp |
| email | VARCHAR(200) | Email liên hệ | duonghm.work@gmail.com |
| phone | VARCHAR(50) | Số điện thoại | (empty in seed) |
| github_url | TEXT | Link GitHub | https://github.com/hmduongdl |
| facebook_url | TEXT | Link Facebook | https://facebook.com/ |
| zalo_url | TEXT | Link Zalo | https://zalo.me/ |
| songphuong_url | TEXT | Link công ty / employer | https://songphuong.vn |
| updated_at | TIMESTAMPTZ | Thời điểm cập nhật | DB-managed (NOW()) |

**Hỗ trợ đa ngôn ngữ (EN/VN):** `title_en`/`title_vn`, `bio_en`/`bio_vn`. Frontend chọn language qua `useOSStore.language`.

---

## 2) Lịch sử công việc & Học tập (Timeline — array schema)

Mỗi item trong mảng timeline có các trường:

- `role` (string) — Chức danh / vai trò
- `company` (string) — Tên đơn vị
- `company_url` (string?) — Link công ty (nullable)
- `period` (string) — Khoảng thời gian (ví dụ: "Tháng 3, 2025 - Hiện tại")
- `desc` (string[]) — Mảng bullet points mô tả công việc / hoạt động
- `type` ('work'|'education'|'freelance') — Loại để style

Ví dụ (dữ liệu hiện tại từ `timelineVN`):
- Web Developer — Song Phương Technology — https://songphuong.vn — "Tháng 3, 2025 - Hiện tại" — desc: ["Thiết kế và phát triển giao diện...", ...] — type: work
- Sinh viên CNTT — Trường Đại học Đà Lạt — https://dlu.edu.vn — period..., type: education
- Nhà thiết kế đồ họa 2D — Freelance — period: "Trước đây" — type: freelance

**Hỗ trợ đa ngôn ngữ:** timeline có dữ liệu VN/EN; UI chọn theo `language`.

---

## 3) Sản phẩm Song Phương (Products — `tbl_products` / API)

DB schema + API trả về `products_resolved` (COALESCE override nếu admin đã override).

Các trường chính (Admin UI cần hỗ trợ):

| Field Name | Type | Mô tả | Ví dụ / seed |
|---|---:|---|---|
| id | SERIAL / number | PK | 1..n |
| name | VARCHAR(300) / string | Tên sản phẩm | SP PC INTEL Core i5-12400F |
| category | VARCHAR(50) / enum | Danh mục (PC Gaming, Office PC, Laptop, VGA, Gaming Gear, Keyboard, Audio) | PC Gaming |
| tag | VARCHAR(50) / string? | Thẻ nhỏ (nullable) | NULL |
| price | VARCHAR(50) / string | Giá bán (lưu string để hỗ trợ 'Liên hệ') | "Liên hệ" (seed) |
| old_price | VARCHAR(50)? | Giá gốc (nullable) | NULL |
| discount | INT? | % giảm (nullable) | NULL |
| image_url | TEXT | URL ảnh | '' → frontend fallback |
| link / product_url | TEXT | Link sản phẩm / chi tiết | https://songphuong.vn |
| color | VARCHAR(20) | Màu chủ đạo card (hex) | #3B82F6 |
| glyph | VARCHAR(20) | Emoji/biểu tượng | 🖥 |
| status | ENUM('New','Hot','Sale') | Tag hiển thị | 'Hot' / 'New' / 'Sale' / NULL |
| override_name | VARCHAR(300)? | (Admin override) tên hiển thị tạm | NULL |
| override_price | VARCHAR(50)? | (Admin override) giá hiển thị | NULL |
| override_image_url | TEXT? | (Admin override) ảnh | NULL |
| override_status | VARCHAR(10)? | override status | NULL |
| override_tag | VARCHAR(50)? | override tag | NULL |
| visible | BOOLEAN | Bật/tắt hiển thị | true |
| order_index | INT | Thứ tự hiển thị | seed uses 0..n |
| created_at / updated_at | TIMESTAMPTZ | timestamps | DB-managed |

**Lưu ý vận hành:**
- API `GET /api/products` trả về resolved fields (COALESCE override nếu có).
- Frontend dùng placeholder image `https://placehold.co/300x300/...` khi `image_url` trống.
- `price` được lưu/hiển thị dưới dạng string để hỗ trợ giá chữ ("Liên hệ").

**Placeholders UI:**
- Search placeholder: "Tìm kiếm..."
- Empty image → placeholder + gradient with `glyph`.

---

## 4) Dự án cá nhân (Projects — `tbl_projects`)

DB (created by `api/projects.ts`) và frontend mapping:

| Field Name | Type | Mô tả | Ví dụ (seed) |
|---|---:|---|---|
| id | TEXT (PK) | Slug / identifier | portfolio-macos |
| name | TEXT | Tên dự án | Song Phương macOS Portfolio |
| category | TEXT | project category (web|design|tools) | web |
| color | TEXT | Màu card (hex) | #2563EB |
| tags | TEXT[] | Mảng tags công nghệ | ["React","TypeScript","Zustand","Tailwind"] |
| desc_vn | TEXT | Mô tả tiếng Việt | (seed in api/projects.ts) |
| desc_en | TEXT | Mô tả tiếng Anh | (seed) |
| demo_url | TEXT? | Link demo | https://songphuong.vn or null |
| github_url | TEXT? | Link code | https://github.com/hmduongdl or null |
| order_index | INTEGER | Thứ tự | 1..n |
| visible | BOOLEAN | Bật/tắt hiển thị | true |

**Frontend `Project` mapping:** API chọn `desc_vn` hoặc `desc_en` dựa trên query `?lang=en|vn`.

---

## 5) Cấu hình hệ thống chung (System Settings)

### Social / Contact
- Bảng: `social_links` (id, platform, label, url, visible, order_index, updated_at)
- Seed examples: github (https://github.com/hmduongdl), facebook (https://facebook.com/), gmail (mailto:duonghm.work@gmail.com), phone (tel:+84), zalo (https://zalo.me/)

### Mail / Contact form
- Default "To" address in UI: `hoanglong.workdl@gmail.com` (hardcoded in `src/apps/Mail.tsx`)
- Default subject prefix: `[Portfolio Inquiry]` (mailto built in code)

### SEO & Meta (index.html)
Các trường cần cấu hình trong Admin UI:
- site `title` (document title)
- meta[name=description]
- meta[name=keywords]
- meta[name=author]
- canonical URL
- OpenGraph: `og:title`, `og:description`, `og:image`, `og:url`, `og:locale`
- Twitter card tags: `twitter:title`, `twitter:description`, `twitter:image`
- favicon / apple-touch-icon paths

Hiện tại `index.html` chứa:
- title: "Hoàng Minh Dương — Portfolio | Web Developer tại Song Phương Technology"
- description, keywords, og:image -> songphuong-logo.webp, canonical -> hmduongdl.github.io/Minimalist-Design-Portfolio/

### System UI state & tweaks (frontend storage)
- `useOSStore` (Zustand) giữ các giá trị: `language` ('en'|'vn'), `tweaks` (windowStyle, dockSize, dockMagnify, dockAutoHide, showMobilePreview), `activeAppName`, `openMenu`, `windows[]` (runtime window instances).

**Admin UI capabilities (recommend):**
- Thay đổi default language
- Chỉnh tweaks mặc định (windowStyle, dockSize, dockAutoHide...)
- Xoá / reset windows session (nếu cần)

---

## 6) Checklist các placeholder và nội dung hiển thị cần hỗ trợ chỉnh trong Admin UI
- Avatar fallback (sử dụng `profile.name` khi ảnh không có)
- Profile fields: name/title_en/title_vn/bio_en/bio_vn/avatar/email/phone/github/facebook/zalo/songphuong_url
- Timeline items (role/company/company_url/period/desc[]/type/order)
- Product items: name/category/price/old_price/discount/image_url/link/color/glyph/status/visible/order + override_* fields
- Project items: id/name/category/tags/desc_vn/desc_en/color/demo_url/github_url/visible/order
- Social links: platform/label/url/visible/order
- Mail: to address and subject prefix
- SEO: title/description/keywords/og/twitter/canonical/favicon
- UI: default language, tweaks

---

## Gợi ý bước tiếp theo
- Tôi có thể chuyển báo cáo này thành JSON Schema hoặc OpenAPI để autogenerate Admin forms.
- Hoặc commit `docs/database/data-inventory.md` vào repo và/hoặc sinh file `ADMIN_SCHEMA.json`.

---

*Báo cáo tạo tự động từ quét mã nguồn tại repository.*
