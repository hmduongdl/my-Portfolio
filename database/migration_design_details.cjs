const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/portfolio',
});

async function migrate() {
  console.log('Connecting to database...');
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    console.log('Adding design_details_vn and design_details_en to tbl_projects...');
    
    // Add columns if they don't exist
    await client.query(`
      ALTER TABLE tbl_projects 
      ADD COLUMN IF NOT EXISTS design_details_vn JSONB DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS design_details_en JSONB DEFAULT '{}'::jsonb;
    `);

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
