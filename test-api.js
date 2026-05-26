import handler from './api/index.js';

// Mock Vercel Request and Response
const req = {
  method: 'GET',
  url: '/api/profile',
  headers: { host: 'localhost:3000' }
};

let responseStatus = 200;
let responseHeaders = {};

const res = {
  setHeader: (key, value) => { responseHeaders[key] = value; },
  status: (code) => { responseStatus = code; return res; },
  json: (data) => {
    console.log(`\n=== API Response (${responseStatus}) ===`);
    console.log(`Headers:`, responseHeaders);
    console.log(`Data:`, JSON.stringify(data, null, 2));
  },
  end: () => console.log('Response Ended')
};

async function run() {
  console.log('Testing /api/profile...');
  await handler(req, res);

  console.log('\nTesting /api/health...');
  req.url = '/api/health';
  await handler(req, res);
}

run();
