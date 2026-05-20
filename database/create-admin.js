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

const hash = await bcrypt.hash(password, 12);

console.log(`-- Paste vào NeonSQL SQL Editor:
INSERT INTO admin_users (username, password_hash)
VALUES ('${username}', '${hash}')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;
`);
