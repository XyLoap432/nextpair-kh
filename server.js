const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const publicDir = fs.existsSync(path.join(root, "public")) ? path.join(root, "public") : root;
const dataFile = fs.existsSync(path.join(root, "data", "db.json")) ? path.join(root, "data", "db.json") : path.join(root, "db.json");
const uploadDir = path.join(root, "uploads");
const PORT = process.env.PORT || 5173;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nextpairkh2026";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || sha256(ADMIN_PASSWORD);
const SESSION_TTL_MS = 1000 * 60 * 60 * 2;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const sessions = new Map();
const rateBuckets = new Map();
const loginFailures = new Map();

fs.mkdirSync(uploadDir, { recursive: true });

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

function readDb() {
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeDb(db) {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function securityHeaders(type) {
  return {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cache-Control": type.includes("text/html") ? "no-store" : "public, max-age=300",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self'",
      "img-src 'self' data: https://images.unsplash.com",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  };
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, securityHeaders(type));
  res.end(Buffer.isBuffer(body) || typeof body === "string" ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 8_000_000) reject(new Error("Request too large"));
    });
    req.on("end", () => resolve(body ? JSON.parse(body) : {}));
    req.on("error", reject);
  });
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) return send(res, 404, "Not found", "text/plain; charset=utf-8");
    send(res, 200, content, mime[path.extname(filePath)] || "application/octet-stream");
  });
}

function safeStaticPath(base, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const resolved = path.normalize(path.join(base, decoded));
  return resolved.startsWith(base) ? resolved : null;
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function safeCompareHex(a, b) {
  const left = Buffer.from(String(a), "hex");
  const right = Buffer.from(String(b), "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifyPassword(password) {
  return safeCompareHex(sha256(password), ADMIN_PASSWORD_HASH);
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "local").split(",")[0].trim();
}

function rateLimit(req, res, key, limit, windowMs) {
  const now = Date.now();
  const id = `${key}:${clientIp(req)}`;
  const bucket = rateBuckets.get(id) || { count: 0, resetAt: now + windowMs };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }
  bucket.count += 1;
  rateBuckets.set(id, bucket);
  if (bucket.count <= limit) return true;
  res.writeHead(429, { ...securityHeaders("application/json; charset=utf-8"), "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) });
  res.end(JSON.stringify({ error: "Too many requests. Please wait and try again." }));
  return false;
}

function isLockedOut(req) {
  const record = loginFailures.get(clientIp(req));
  return record && record.lockedUntil && record.lockedUntil > Date.now();
}

function recordLoginFailure(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const record = loginFailures.get(ip) || { count: 0, firstAt: now, lockedUntil: 0 };
  if (now - record.firstAt > 15 * 60 * 1000) {
    record.count = 0;
    record.firstAt = now;
  }
  record.count += 1;
  if (record.count >= 5) record.lockedUntil = now + 15 * 60 * 1000;
  loginFailures.set(ip, record);
}

function clearLoginFailures(req) {
  loginFailures.delete(clientIp(req));
}

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  sessions.set(token, { expiresAt });
  return { token, expiresAt };
}

function getBearerToken(req) {
  const header = String(req.headers.authorization || "");
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

function isAdmin(req) {
  const token = getBearerToken(req);
  const session = sessions.get(token);
  if (!session) return false;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  send(res, 401, { error: "Valid admin session required" });
  return false;
}

function isAllowedImage(buffer, mimeType) {
  const hex = buffer.subarray(0, 12).toString("hex");
  if (mimeType === "image/png") return hex.startsWith("89504e470d0a1a0a");
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") return hex.startsWith("ffd8ff");
  if (mimeType === "image/webp") return buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      return send(res, 204, "");
    }
    if (!rateLimit(req, res, "global", 240, 60 * 1000)) return;

    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/api/admin/login" && req.method === "POST") {
      if (!rateLimit(req, res, "admin-login", 8, 15 * 60 * 1000)) return;
      if (isLockedOut(req)) return send(res, 423, { error: "Too many failed logins. Try again later." });
      const { password } = await readBody(req);
      if (!verifyPassword(password || "")) {
        recordLoginFailure(req);
        return send(res, 401, { error: "Incorrect admin password" });
      }
      clearLoginFailures(req);
      return send(res, 200, createSession());
    }

    if (url.pathname === "/api/admin/status" && req.method === "GET") {
      return send(res, 200, { ok: isAdmin(req) });
    }

    if (url.pathname === "/api/admin/logout" && req.method === "POST") {
      const token = getBearerToken(req);
      if (token) sessions.delete(token);
      return send(res, 200, { ok: true });
    }

    if (url.pathname === "/api/db" && req.method === "GET") return send(res, 200, readDb());

    if (url.pathname === "/api/products" && req.method === "GET") {
      return send(res, 200, readDb().products);
    }

    if (url.pathname === "/api/products" && req.method === "POST") {
      if (!rateLimit(req, res, "admin-write", 60, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const db = readDb();
      const product = await readBody(req);
      product.id = product.id || crypto.randomUUID();
      db.products.unshift(product);
      writeDb(db);
      return send(res, 201, product);
    }

    const productMatch = url.pathname.match(/^\/api\/products\/([^/]+)$/);
    if (productMatch && req.method === "PUT") {
      if (!rateLimit(req, res, "admin-write", 60, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const db = readDb();
      const patch = await readBody(req);
      const index = db.products.findIndex(product => product.id === productMatch[1]);
      if (index < 0) return send(res, 404, { error: "Product not found" });
      db.products[index] = { ...db.products[index], ...patch, id: productMatch[1] };
      writeDb(db);
      return send(res, 200, db.products[index]);
    }

    if (productMatch && req.method === "DELETE") {
      if (!rateLimit(req, res, "admin-write", 60, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const db = readDb();
      db.products = db.products.filter(product => product.id !== productMatch[1]);
      writeDb(db);
      return send(res, 200, { ok: true });
    }

    if (url.pathname === "/api/settings" && req.method === "PUT") {
      if (!rateLimit(req, res, "admin-write", 60, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const db = readDb();
      db.settings = { ...db.settings, ...(await readBody(req)) };
      writeDb(db);
      return send(res, 200, db.settings);
    }

    if (url.pathname === "/api/banners" && req.method === "PUT") {
      if (!rateLimit(req, res, "admin-write", 60, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const db = readDb();
      db.banners = await readBody(req);
      writeDb(db);
      return send(res, 200, db.banners);
    }

    if (url.pathname === "/api/upload" && req.method === "POST") {
      if (!rateLimit(req, res, "admin-upload", 20, 60 * 1000)) return;
      if (!requireAdmin(req, res)) return;
      const { filename, dataUrl } = await readBody(req);
      const match = String(dataUrl || "").match(/^data:(image\/(png|jpeg|jpg|webp));base64,(.+)$/);
      if (!match) return send(res, 400, { error: "Only png, jpg, jpeg, or webp images are supported." });
      const imageBuffer = Buffer.from(match[3], "base64");
      if (imageBuffer.length > MAX_UPLOAD_BYTES) return send(res, 413, { error: "Image is too large. Max upload is 5MB." });
      if (!isAllowedImage(imageBuffer, match[1])) return send(res, 400, { error: "Invalid image file." });
      const ext = match[2] === "jpeg" ? "jpg" : match[2];
      const cleanName = String(filename || "pair").replace(/[^a-z0-9-_]/gi, "-").slice(0, 40);
      const savedName = `${Date.now()}-${cleanName}.${ext}`;
      fs.writeFileSync(path.join(uploadDir, savedName), imageBuffer);
      return send(res, 201, { url: `/uploads/${savedName}` });
    }

    if (url.pathname.startsWith("/uploads/")) {
      const filePath = safeStaticPath(uploadDir, url.pathname.replace("/uploads/", ""));
      return filePath ? serveFile(res, filePath) : send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    }

    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = safeStaticPath(publicDir, requested);
    if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) return serveFile(res, filePath);
    return serveFile(res, path.join(publicDir, "index.html"));
  } catch (error) {
    send(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, () => {
  console.log(`NextPair KH running at http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/#admin`);
});
