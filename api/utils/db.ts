import { Pool } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

let pool: Pool;
if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
} else {
  if (!(global as any).pool) {
    (global as any).pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });
  }
  pool = (global as any).pool;
}

export const db = pool;
