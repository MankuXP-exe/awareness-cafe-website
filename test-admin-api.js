const crypto = require("crypto");
const http = require("http");

const JWT_SECRET = "awareness-cafe-jwt-secret-2026-super-secure-key";

// Create token
const payload = { username: "admin", role: "admin", exp: Math.floor(Date.now() / 1000) + 86400 };
const header = { alg: "HS256", typ: "JWT" };
const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const headerB64 = encode(header);
const payloadB64 = encode(payload);
const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${headerB64}.${payloadB64}`).digest("base64url");
const token = `${headerB64}.${payloadB64}.${signature}`;

// Fetch
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/team',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.end();
