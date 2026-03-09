import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-me";

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Also check cookies
  const cookies = request.headers.get("cookie") || "";
  const tokenCookie = cookies.split(";").find((c) => c.trim().startsWith("admin_token="));
  if (tokenCookie) {
    return tokenCookie.split("=")[1].trim();
  }

  return null;
}

export function requireAuth(request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { error: "Invalid or expired token", status: 401 };
  }

  return { user: decoded };
}
