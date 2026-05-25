import type { VercelRequest, VercelResponse } from '@vercel/node';
import { applyCors } from './cors';

export function withErrorHandler(handler: (req: VercelRequest, res: VercelResponse) => Promise<any> | any) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Apply CORS on all responses
    applyCors(res);
    
    // Always set JSON content type
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS request globally
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    try {
      await handler(req, res);
    } catch (err: any) {
      console.error(`CRITICAL ERROR AT ENDPOINT [${req.method}] ${req.url}:`, err);
      
      const statusCode = err.status || err.statusCode || 500;
      return res.status(statusCode).json({
        error: true,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  };
}
