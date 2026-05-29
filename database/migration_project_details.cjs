require('dotenv').config({ path: '../.env' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrationSql = `
  -- Add new columns for project detail view
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS duration_vn VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS duration_en VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS role_vn VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS role_en VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS status VARCHAR(50);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS type_vn VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS type_en VARCHAR(100);
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS achievement_vn TEXT;
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS achievement_en TEXT;
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS features_vn JSONB DEFAULT '[]'::jsonb;
  ALTER TABLE tbl_projects ADD COLUMN IF NOT EXISTS features_en JSONB DEFAULT '[]'::jsonb;

  -- Insert default tech_stack_options into tbl_settings if it doesn't exist
  INSERT INTO tbl_settings (key, value, updated_at) 
  VALUES (
    'tech_stack_options', 
    '{"categories": ["Frontend", "Backend", "Database", "DevOps", "Design"], "techs": [{"name": "React", "icon": "react", "category": "Frontend"}, {"name": "Node.js", "icon": "nodedotjs", "category": "Backend"}]}', 
    NOW()
  ) 
  ON CONFLICT (key) DO NOTHING;
`;

async function runMigration() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Running migration...');
    await client.query(migrationSql);
    console.log('Migration completed successfully.');
    client.release();
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

runMigration();
