# Hướng Dẫn Triển Khai Hệ Thống (Deployment Guide)

Tài liệu này hướng dẫn chi tiết quy trình kết nối cơ sở dữ liệu Neon SQL với dự án trên Vercel, cách thêm biến môi trường và thực hiện deploy lại từ đầu (redeploy).

## 1. Lấy Connection String từ Neon SQL

1. Đăng nhập vào trang quản trị [Neon.tech](https://neon.tech/).
2. Chọn dự án database của bạn.
3. Tại trang **Dashboard**, phần **Connection Details**, chọn branch và role thích hợp.
4. Sao chép chuỗi **Connection string**. Chuỗi này có định dạng:
   `postgres://[user]:[password]@[host]/[dbname]?sslmode=require`

> [!IMPORTANT]
> Hãy đảm bảo rằng tham số `?sslmode=require` luôn có mặt ở cuối chuỗi để Neon SQL chấp nhận kết nối an toàn từ Vercel.

## 2. Thêm Biến Môi Trường (Environment Variables) trên Vercel

1. Truy cập [Vercel Dashboard](https://vercel.com) và chọn dự án của bạn.
2. Chuyển sang tab **Settings** (Cài đặt) trên menu ngang.
3. Chọn mục **Environment Variables** (Biến môi trường) ở thanh bên trái.
4. Thêm lần lượt các biến sau:
   - **`DATABASE_URL`**: Dán chuỗi kết nối bạn vừa lấy ở Bước 1.
   - **`JWT_SECRET`**: Một chuỗi ngẫu nhiên dùng để xác thực (VD: tạo bằng lệnh hex 64 ký tự).
   - **`FRONTEND_URL`**: URL trang web thực tế của bạn (VD: `https://your-portfolio.vercel.app`).
   - **`NODE_ENV`**: Đặt là `production`.
5. Đảm bảo tích chọn áp dụng cho các môi trường (Production, Preview, Development) tùy theo nhu cầu và nhấn **Save**.

## 3. Quy Trình Chạy Redeploy Không Dùng Cache

Khi có sự thay đổi về Biến môi trường, Vercel cần một bản build hoàn toàn mới để áp dụng những thay đổi này do tính năng lưu trữ cache trong quá trình build.

**Thông qua Vercel CLI:**
Chạy lệnh sau tại thư mục gốc của dự án để ép buộc (force) Vercel bỏ qua cache và build lại từ đầu:
```bash
vercel --force
```

**Thông qua giao diện Vercel Dashboard:**
1. Vào mục **Deployments**.
2. Nhấn vào biểu tượng dấu 3 chấm (`...`) ở bản deploy mới nhất.
3. Chọn **Redeploy** (lưu ý không đánh dấu tùy chọn "Use existing Build Cache").

## 4. Kiểm tra Kết Nối API

Sau khi redeploy thành công, bạn hãy thử truy cập vào các đường dẫn API để xác nhận hệ thống đã hoạt động bình thường, ví dụ:
- `https://your-domain.vercel.app/api/profile`
- `https://your-domain.vercel.app/api/projects`
