const { Pool } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const checkUsers = await pool.query('SELECT COUNT(*) FROM admin_users');
    if (parseInt(checkUsers.rows[0].count) === 0) {
      const hash = bcrypt.hashSync('admin123', 10);
      await pool.query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
      console.log('Inserted default admin user (admin / admin123)');
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();
