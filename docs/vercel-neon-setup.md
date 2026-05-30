# Hướng dẫn kết nối Vercel + NeonSQL

> Hướng dẫn từng bước deploy Portfolio lên Vercel và kết nối với NeonSQL database.

---

## Mục lục

1. [Tạo NeonSQL database](#1-tạo-neonsql-database)
2. [Chạy schema và seed data](#2-chạy-schema-và-seed-data)
3. [Tạo tài khoản admin](#3-tạo-tài-khoản-admin)
4. [Deploy lên Vercel](#4-deploy-lên-vercel)
5. [Cấu hình Environment Variables trên Vercel](#5-cấu-hình-environment-variables-trên-vercel)
6. [Kiểm tra hoạt động](#6-kiểm-tra-hoạt-động)
7. [Chạy local với Vercel CLI](#7-chạy-local-với-vercel-cli)
8. [Sơ đồ kiến trúc](#8-sơ-đồ-kiến-trúc)

---

## 1. Tạo NeonSQL database

### 1.1 Đăng ký tài khoản Neon

1. Truy cập **[console.neon.tech](https://console.neon.tech)**
2. Đăng nhập bằng GitHub hoặc Google
3. Nhấn **"New Project"**

### 1.2 Tạo project mới

| Trường | Giá trị gợi ý |
|---|---|
| Project name | `portfolio-db` |
| Cloud provider | AWS |
| Region | **Asia Pacific (Singapore)** — gần VN nhất |
| Postgres version | 16 (mới nhất) |

Nhấn **"Create project"**.

### 1.3 Lấy Connection String

Sau khi tạo xong, Neon hiện cửa sổ **"Connection Details"**:

1. Chọn tab **"Connection string"**
2. Chọn **"Pooled connection"** (khuyến nghị cho serverless)
3. Copy chuỗi có dạng:

```
postgres://user:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

> **Lưu ngay** chuỗi này — bạn sẽ cần ở bước 5.

---

## 2. Chạy schema và seed data

### 2.1 Mở SQL Editor của Neon

Trong Neon Console, click **"SQL Editor"** ở sidebar trái.

### 2.2 Chạy schema.sql

Copy toàn bộ nội dung file [`database/schema.sql`](../database/schema.sql) và paste vào SQL Editor, rồi nhấn **"Run"**.

Kết quả mong đợi:
```
CREATE TABLE  ✓ profile
CREATE TABLE  ✓ social_links
CREATE TABLE  ✓ products
CREATE VIEW   ✓ products_resolved
CREATE TABLE  ✓ tbl_users
```

### 2.3 Chạy seed.sql

Copy toàn bộ nội dung file [`database/seed.sql`](../database/seed.sql) và paste vào SQL Editor, rồi nhấn **"Run"**.

Kết quả mong đợi:
```
INSERT 0 1  ← profile
INSERT 0 5  ← social_links
```

### 2.4 Kiểm tra

Chạy lệnh này để xác nhận data đã vào:

```sql
SELECT name, email FROM profile;
SELECT platform, url, visible FROM social_links ORDER BY order_index;
```

---

## 3. Tạo tài khoản admin

### 3.1 Cài dependencies (nếu chưa)

```bash
npm install
```

### 3.2 Chạy script tạo password hash

```bash
node database/create-admin.js admin <mật-khẩu-của-bạn>
```

Ví dụ:
```bash
node database/create-admin.js admin MySecretPass123
```

Output sẽ là một câu SQL như sau:
```sql
INSERT INTO tbl_users (username, password_hash, created_at)
VALUES ('admin', '$2b$12$...', NOW())
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
```

### 3.3 Chạy SQL trong Neon

Copy output ở bước trên → paste vào **SQL Editor** → nhấn **"Run"**.

> **Quan trọng:** Đặt mật khẩu đủ mạnh (tối thiểu 12 ký tự, có chữ hoa, số, ký tự đặc biệt).

---

## 4. Deploy lên Vercel

### 4.1 Đẩy code lên GitHub

```bash
git add .
git commit -m "feat: add admin panel and API backend"
git push origin main
```

### 4.2 Import project vào Vercel

1. Truy cập **[vercel.com/new](https://vercel.com/new)**
2. Đăng nhập bằng GitHub
3. Nhấn **"Import"** bên cạnh repo `Portfolio`
4. Vercel tự detect **Vite** → Framework Preset: `Vite`
5. **Không thay đổi** Build Settings mặc định:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Nhấn **"Deploy"** *(bỏ qua env vars — sẽ thêm sau)*

> Deploy đầu tiên sẽ thất bại nếu thiếu env vars — không sao, ta sẽ thêm ở bước tiếp theo.

### 4.3 Sau khi deploy xong

Vercel cấp cho bạn URL dạng:
```
https://portfolio-abc123.vercel.app
```

Lưu URL này lại — cần dùng ở bước 5.

---

## 5. Cấu hình Environment Variables trên Vercel

### 5.1 Mở Settings

Trong Vercel Dashboard → chọn project → tab **"Settings"** → **"Environment Variables"**.

### 5.2 Thêm từng biến

Nhấn **"Add"** và điền lần lượt:

| Name | Value | Environments |
|---|---|---|
| `DATABASE_URL` | `postgres://user:pass@host/db?sslmode=require` | Production, Preview, Development |
| `JWT_SECRET` | *(random 64 chars — xem bên dưới)* | Production, Preview, Development |
| `FRONTEND_URL` | `https://portfolio-abc123.vercel.app` | Production |
| `FRONTEND_URL` | `http://localhost:5173` | Development |

**Tạo JWT_SECRET ngẫu nhiên:**

```bash
# Linux / macOS
openssl rand -hex 32

# Hoặc dùng Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> **Lưu ý `FRONTEND_URL`:** Thêm 2 lần — một cho Production (URL Vercel), một cho Development (localhost). Chọn đúng environment cho từng cái.

### 5.3 Redeploy để áp dụng

Sau khi thêm xong env vars:

1. Vào tab **"Deployments"**
2. Click vào deployment mới nhất
3. Nhấn **"..."** → **"Redeploy"**
4. Chờ ~1 phút → deploy thành công ✓

---

## 6. Kiểm tra hoạt động

### 6.1 Kiểm tra API

Mở trình duyệt hoặc dùng `curl`:

```bash
# Lấy profile (public)
curl https://portfolio-abc123.vercel.app/api/profile

# Lấy social links (public)
curl https://portfolio-abc123.vercel.app/api/social

# Lấy products (public)
curl https://portfolio-abc123.vercel.app/api/products
```

Kết quả mong đợi — JSON trả về data từ database.

### 6.2 Kiểm tra login

```bash
curl -X POST https://portfolio-abc123.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"<mật-khẩu>"}'
```

Kết quả mong đợi:
```json
{ "token": "eyJhbGciOiJIUzI1NiJ9..." }
```

### 6.3 Truy cập Admin Panel

Mở trình duyệt → `https://portfolio-abc123.vercel.app/admin`

Đăng nhập với username `admin` và mật khẩu đã tạo ở bước 3.

---

## 7. Chạy local với Vercel CLI

Khi develop local, bạn cần Vercel CLI để các API functions (`/api/*`) hoạt động.

### 7.1 Cài Vercel CLI

```bash
npm install -g vercel
```

### 7.2 Link project

```bash
vercel link
# → Chọn đúng team/project trên Vercel
```

### 7.3 Pull env vars từ Vercel

```bash
vercel env pull .env.local
# → Tự tạo file .env.local với đầy đủ biến
```

> Không cần tạo `.env.local` thủ công nữa — lệnh này kéo về từ Vercel dashboard.

### 7.4 Chạy dev server

```bash
vercel dev
```

| URL | Nội dung |
|---|---|
| `http://localhost:3000` | Portfolio (macOS desktop) |
| `http://localhost:3000/admin` | Admin Panel |
| `http://localhost:3000/api/profile` | API endpoint |

> **Không dùng `npm run dev`** khi cần test API — Vite dev server không xử lý `/api` functions. Dùng `vercel dev` để có cả FE lẫn API.

---

## 8. Sơ đồ kiến trúc

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL (1 project)                    │
│                                                          │
│  ┌─────────────────────┐   ┌──────────────────────────┐ │
│  │   Static Frontend   │   │   Serverless Functions   │ │
│  │   (Vite → dist/)    │   │      (/api/*.ts)          │ │
│  │                     │   │                          │ │
│  │  /          → SPA   │   │  /api/profile    GET|PUT │ │
│  │  /admin     → SPA   │   │  /api/social     GET     │ │
│  │  /admin/*   → SPA   │   │  /api/social/:id PUT     │ │
│  │                     │   │  /api/products   GET|POST│ │
│  │  React renders:     │   │  /api/products/:id PUT   │ │
│  │  - macOS Desktop    │   │               DELETE     │ │
│  │  - Admin Panel      │   │  /api/auth/login POST    │ │
│  └─────────────────────┘   └────────────┬─────────────┘ │
│                                         │               │
└─────────────────────────────────────────│───────────────┘
                                          │ DATABASE_URL
                                          │ (SSL/TLS)
                                          ▼
                          ┌───────────────────────────────┐
                          │         NEON (PostgreSQL)      │
                          │                               │
                          │  Tables:                      │
                          │  ├── profile      (1 row)     │
                          │  ├── social_links (5 rows)    │
                          │  ├── products     (n rows)    │
                          │  └── tbl_users    (1 row)     │
                          │                               │
                          │  View:                        │
                          │  └── products_resolved        │
                          │      (override logic)         │
                          └───────────────────────────────┘
```

### Luồng dữ liệu

```
Người dùng truy cập portfolio
        │
        ▼
   Vercel CDN phục vụ index.html (React SPA)
        │
        ├── path = /       → App.tsx render macOS Desktop
        │       │
        │       └── fetch /api/profile, /api/social, /api/products
        │               │
        │               └── Serverless function → query NeonSQL → JSON
        │
        └── path = /admin  → AdminApp.tsx render Admin Panel
                │
                ├── Login → POST /api/auth/login → JWT token
                │
                └── CRUD → PUT /api/profile, /api/social/:id, etc.
```

---

## Troubleshooting

| Vấn đề | Nguyên nhân | Cách xử lý |
|---|---|---|
| API trả về 500 | `DATABASE_URL` sai hoặc thiếu | Kiểm tra env var trong Vercel Dashboard |
| Login trả về 401 | Sai mật khẩu hoặc chưa tạo admin | Chạy lại `create-admin.js` |
| API trả về 401 | JWT token hết hạn (7 ngày) | Đăng nhập lại trong Admin Panel |
| `vercel dev` báo lỗi port | Port 3000 đang bị chiếm | `vercel dev --listen 3001` |
| Neon báo "too many connections" | Chưa dùng pooled connection | Thêm `?pgbouncer=true` vào cuối `DATABASE_URL` |
| Deploy thành công nhưng API 404 | `vercel.json` rewrite sai | Kiểm tra source `/((?!api/).*)` |

---

*Cập nhật lần cuối: 20/05/2026*
