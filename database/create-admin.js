#!/usr/bin/env node
/**
 * Tạo SQL để insert/update admin user với bcrypt password.
 * Usage: node database/create-admin.js <username> <password>
 * Ví dụ: node database/create-admin.js admin mysecretpassword
 *
 * Copy output SQL và chạy trong NeonSQL SQL Editor.
 */
import bcrypt from 'bcryptjs';

const [, , username = 'admin', password] = process.argv;

if (!password) {
  console.error('Usage: node database/create-admin.js <username> <password>');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

console.log(`-- Paste vào NeonSQL SQL Editor:
INSERT INTO tbl_users (username, password_hash, created_at) VALUES ('${username}', '${hash}', NOW());
`);
