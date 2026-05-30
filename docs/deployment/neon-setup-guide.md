# Hướng dẫn chi tiết: Cấu hình Neon Database cho dự án đã deploy trên Vercel

Vì dự án của bạn (cả Frontend và thư mục `api/` cho Backend) đã được đưa lên Vercel, phần kết nối với Neon Database sẽ được thực hiện chủ yếu qua việc cấu hình **Biến môi trường (Environment Variables)** trên Vercel.

Có 2 cách để cấu hình:
1. **Cách 1 (Khuyên dùng & Nhanh nhất):** Sử dụng Vercel Integration có sẵn của Neon.
2. **Cách 2:** Thêm biến môi trường thủ công vào Vercel.

Dưới đây là chi tiết từng cách.

---

## Cách 1: Sử dụng "Neon Vercel Integration" (Tự động)

Đây là cách an toàn và tự động nhất. Neon và Vercel có sự hợp tác sâu, cho phép tự động thêm chuỗi kết nối vào dự án Vercel của bạn.

### Bước 1: Liên kết Neon với Vercel
1. Đăng nhập vào trang quản trị [Neon.tech](https://neon.tech/).
2. Chọn dự án database bạn đã tạo.
3. Ở menu bên trái, tìm đến mục **Integrations**.
4. Chọn **Vercel** và nhấn **Add Vercel Integration**.
5. Một cửa sổ đăng nhập Vercel sẽ hiện ra. Bạn hãy cấp quyền cho Neon truy cập vào Vercel của bạn.

### Bước 2: Chọn dự án Vercel cần kết nối
1. Sau khi cấp quyền, Neon sẽ hiển thị danh sách các dự án đang có trên Vercel của bạn.
2. Chọn đúng tên dự án Vercel mà bạn đang chạy Portfolio này.
3. Chọn Branch (thường là `main` cho môi trường Production).
4. Nhấn **Connect**.

> **Kết quả:** Neon sẽ tự động tạo một biến môi trường tên là `DATABASE_URL` (và một số biến khác) trong phần **Settings > Environment Variables** của dự án trên Vercel.

### Bước 3: Redeploy lại dự án
Vì Vercel chỉ nhận biến môi trường mới khi có bản build mới, bạn cần Deploy lại:
1. Vào trang quản trị dự án trên [Vercel](https://vercel.com).
2. Vào mục **Deployments**.
3. Bấm vào dấu 3 chấm `...` ở bản deploy mới nhất (màu xanh lá) và chọn **Redeploy**.

---

## Cách 2: Thêm biến môi trường thủ công (Nếu không dùng Integration)

Nếu bạn muốn tự tay thiết lập, hãy làm theo các bước sau:

### Bước 1: Lấy `DATABASE_URL` từ Neon
1. Vào bảng điều khiển [Neon](https://neon.tech).
2. Ở trang **Dashboard**, phần **Connection Details**, sao chép toàn bộ chuỗi **Connection string**. 
   *(Chuỗi này bắt đầu bằng `postgresql://...`)*

### Bước 2: Thêm vào Vercel
1. Truy cập vào [Vercel Dashboard](https://vercel.com) và chọn dự án của bạn.
2. Chuyển sang tab **Settings** (Cài đặt) trên menu ngang.
3. Chọn mục **Environment Variables** (Biến môi trường) ở thanh bên trái.
4. Thêm biến mới với thông tin sau:
   - **Key:** `DATABASE_URL`
   - **Value:** Dán chuỗi kết nối bạn vừa copy ở Bước 1 vào đây.
   - **Environments:** Tích chọn tất cả (Production, Preview, Development).
5. Nhấn nút **Save**.

### Bước 3: Redeploy
Tương tự như Cách 1, để API nhận biến môi trường này, bạn sang tab **Deployments** -> Chọn bản deploy mới nhất -> Bấm `...` -> **Redeploy**.

---

## Bước Quan Trọng: Khởi tạo bảng (Schema) và dữ liệu mẫu

Vì Vercel chỉ chạy code tĩnh và Serverless Functions, nó không tự động tạo bảng trong Database. Bạn **bắt buộc** phải chạy lệnh SQL để tạo các bảng.

1. Vào giao diện điều khiển của [Neon](https://neon.tech) -> Dự án của bạn.
2. Chọn menu **SQL Editor** ở thanh bên trái.
3. Trên máy tính của bạn, mở file `database/schema.sql`. Copy toàn bộ text trong đó.
4. Dán vào **SQL Editor** của Neon và nhấn **Run** ở góc trên bên phải. *(Lúc này các bảng `users`, `projects`... sẽ được tạo)*.
5. (Tuỳ chọn) Nếu bạn muốn có dữ liệu xem thử, tiếp tục copy nội dung của file `database/seed.sql` và dán vào SQL Editor rồi nhấn **Run**.

---

## Kiểm tra kết nối

Sau khi Redeploy trên Vercel và chạy `schema.sql` trên Neon:
- Truy cập vào trang web trên Vercel của bạn.
- Khi truy cập vào các trang liên quan đến API (như xem danh sách project), các Serverless Functions trong thư mục `api/` sẽ tự động đọc `process.env.DATABASE_URL` và kết nối với Neon thành công bằng HTTP (nhờ thư viện `@neondatabase/serverless`).

**Lưu ý nếu gặp lỗi:**
Nếu API trả về lỗi `500`, hãy vào tab **Logs** trên Vercel, chọn **Runtime Logs** để xem chính xác lỗi là gì (thường là do quên chưa chạy Schema hoặc sai tên biến môi trường).
