/**
 * SCRIPT RESET VÀ KHỞI TẠO TÀI KHOẢN ADMIN DÀNH CHO HOÀNG MINH DƯƠNG
 * * Cách chạy:
 * 1. Đảm bảo đã khai báo DATABASE_URL trong file .env ở thư mục gốc.
 * 2. Chạy lệnh: node database/reset-admin.js <tên_đăng_nhập> <mật_khẩu_mới>
 * Ví dụ: node database/reset-admin.js duongadmin duong12345
 */

import pkg from 'pg';
const { Pool } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tự động tải biến môi trường từ file .env
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
        if (key && val) {
          process.env[key] = val;
        }
      }
    });
  }
} catch (e) {
  console.log("⚠️ Không thể tải file .env trực tiếp, dùng biến môi trường hệ thống.");
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function run() {
  // Lấy tham số dòng lệnh
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("\n❌ LỖI: Thiếu tham số đầu vào!");
    console.log("👉 Hướng dẫn cú pháp: node database/reset-admin.js <username> <password>");
    console.log("💡 Ví dụ: node database/reset-admin.js duongadmin duong12345\n");
    process.exit(1);
  }

  const username = args[0];
  const rawPassword = args[1];

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("\n❌ LỖI: Không tìm thấy biến môi trường DATABASE_URL trong file .env!");
    console.log("👉 Vui lòng kiểm tra lại file .env ở thư mục gốc của dự án.\n");
    process.exit(1);
  }

  console.log(`\n⚙️ Đang tiến hành băm mật khẩu cho tài khoản "${username}"...`);
  const passwordHash = await hashPassword(rawPassword);

  // Khởi tạo pool kết nối Postgres với cấu hình SSL an toàn
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("🔌 Đang kết nối tới Neon SQL Database Cloud...");
    
    // 1. Tạo bảng tbl_users nếu chưa tồn tại
    console.log("📁 Kiểm tra cấu trúc bảng người dùng...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tbl_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Xóa tài khoản cũ trùng tên nếu có để tránh xung đột UNIQUE
    await pool.query(`DELETE FROM tbl_users WHERE username = $1`, [username]);

    // 3. Ghi tài khoản admin mới vào cơ sở dữ liệu
    console.log("✍️ Đang ghi đè tài khoản Admin mới vào cơ sở dữ liệu...");
    await pool.query(
      `INSERT INTO tbl_users (username, password_hash, created_at) VALUES ($1, $2, NOW())`,
      [username, passwordHash]
    );

    console.log("\n============================================================");
    console.log("🟢 THÀNH CÔNG: Tài khoản Admin đã được cập nhật trực tiếp!");
    console.log(`   - Tài khoản: ${username}`);
    console.log(`   - Mật khẩu:  ${rawPassword}`);
    console.log("============================================================\n");

    console.log("💡 CÂU LỆNH SQL DỰ PHÒNG (Dùng để dán trực tiếp vào Neon Console nếu cần):");
    console.log(`\nINSERT INTO tbl_users (username, password_hash, created_at) \nVALUES ('${username}', '${passwordHash}', NOW()) \nON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;\n`);

  } catch (error) {
    console.error("\n🔴 LỖI: Không thể thực thi cập nhật trên Neon SQL!");
    console.error("Chi tiết lỗi:", error.message);
    
    console.log("\n💡 GIẢI PHÁP THỦ CÔNG:");
    console.log("Bạn có thể truy cập vào Neon Console > SQL Editor và dán câu lệnh sau:");
    console.log(`\nINSERT INTO tbl_users (username, password_hash, created_at) VALUES ('${username}', '${passwordHash}', NOW());\n`);
  } finally {
    await pool.end();
  }
}

run();
