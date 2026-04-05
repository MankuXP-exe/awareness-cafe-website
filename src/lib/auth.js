/**
 * Simple JWT-based admin authentication.
 * Used for the single-admin café management panel.
 */

const JWT_SECRET = process.env.JWT_SECRET || "awareness-cafe-default-secret";

/**
 * Creates a base64-encoded JWT token (simplified — no external dependency).
 * Payload: { username, role, exp }
 */
export function createToken(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const data = { ...payload, iat: now, exp: now + 86400 }; // 24h expiry

  const encode = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString("base64url");

  const headerB64 = encode(header);
  const payloadB64 = encode(data);
  const signature = createHmac(headerB64, payloadB64);

  return `${headerB64}.${payloadB64}.${signature}`;
}

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws if invalid or expired.
 */
export function verifyToken(token) {
  if (!token) throw new Error("No token provided");

  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token format");

  const [headerB64, payloadB64, signature] = parts;

  // Verify signature
  const expectedSig = createHmac(headerB64, payloadB64);
  if (signature !== expectedSig) throw new Error("Invalid signature");

  // Decode payload
  const payload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString()
  );

  // Check expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}

/**
 * Middleware helper — extracts and verifies the Bearer token from request headers.
 * Returns the decoded payload or null if invalid.
 */
export function requireAuth(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

/**
 * Creates HMAC-SHA256 signature using Web Crypto-compatible approach.
 * Uses Node.js crypto module (server-side only).
 */
function createHmac(headerB64, payloadB64) {
  const crypto = require("crypto");
  return crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
}
