import { neon } from '@neondatabase/serverless';

let url = process.env.DATABASE_URL;

if (!url) {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = process.env.DB_NAME;

  if (host && user && password && dbName) {
    url = `postgresql://${user}:${password}@${host}/${dbName}?sslmode=require`;
  }
}

if (!url) {
  console.warn("WARNING: DATABASE_URL is not defined, and fallback DB variables are missing.");
}

const client = url ? neon(url) : null;

export const sql = async (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> => {
  if (!client) {
    throw new Error('Database client could not be initialized. DATABASE_URL is not set.');
  }

  try {
    const result = await client(strings, ...values);
    return result as any[];
  } catch (err: any) {
    console.error("NEON SQL ERROR:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      severity: err.severity,
      hint: err.hint,
    });
    
    // Check for common connection errors and customize error message
    if (err.message?.includes('AccessDenied') || err.code === '28P01' || err.message?.includes('password authentication failed')) {
      throw new Error(`Database connection failed: Access Denied. Verify username and password. Original error: ${err.message}`);
    }
    if (err.message?.includes('timeout') || err.message?.includes('ETIMEDOUT') || err.code === '08006') {
      throw new Error(`Database connection failed: Connection Timeout. Verify host and network connectivity. Original error: ${err.message}`);
    }
    
    throw err;
  }
};
