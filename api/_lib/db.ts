import { db } from '../utils/db';

export const sql = async (strings: TemplateStringsArray, ...values: any[]): Promise<any[]> => {
  let queryText = '';
  for (let i = 0; i < strings.length; i++) {
    queryText += strings[i];
    if (i < values.length) {
      queryText += `$${i + 1}`;
    }
  }

  try {
    const result = await db.query(queryText, values);
    return result.rows as any[];
  } catch (err: any) {
    console.error("NEON SQL ERROR:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      severity: err.severity,
      hint: err.hint,
    });
    
    if (err.message?.includes('AccessDenied') || err.code === '28P01' || err.message?.includes('password authentication failed')) {
      throw new Error(`Database connection failed: Access Denied. Verify username and password. Original error: ${err.message}`);
    }
    if (err.message?.includes('timeout') || err.message?.includes('ETIMEDOUT') || err.code === '08006') {
      throw new Error(`Database connection failed: Connection Timeout. Verify host and network connectivity. Original error: ${err.message}`);
    }
    
    throw err;
  }
};
