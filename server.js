/**
 * Vault PH — local dev server: static files + POST /api/register writes to users.json
 * Run: npm start   (or: node server.js)
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const ROOT = path.resolve(__dirname);
const USERS_FILE = path.join(ROOT, "users.json");
const PORT = Number(process.env.PORT) || 3000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const rel = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const full = path.normalize(path.join(ROOT, rel));
  const relToRoot = path.relative(ROOT, full);
  if (relToRoot.startsWith("..") || path.isAbsolute(relToRoot)) return null;
  return full;
}

function readBody(req, maxBytes) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    var total = 0;
    req.on("data", function (chunk) {
      total += chunk.length;
      if (total > maxBytes) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", function () {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

function handleRegister(req, res) {
  readBody(req, 256 * 1024)
    .then(function (raw) {
      var data = JSON.parse(raw || "{}");
      var user = data && data.user;
      if (!user || typeof user.email !== "string" || !user.email.trim()) {
        res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Missing user.email" }));
        return;
      }

      var doc = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      var users = Array.isArray(doc.users) ? doc.users : [];
      var emailNorm = user.email.trim().toLowerCase();
      var taken = users.some(function (u) {
        return u && u.email && String(u.email).trim().toLowerCase() === emailNorm;
      });
      if (taken) {
        res.writeHead(409, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify({ error: "Email already registered" }));
        return;
      }

      users.push(user);
      doc.users = users;
      doc.updatedAt = new Date().toISOString();
      if (typeof doc.version !== "number") doc.version = 1;

      fs.writeFileSync(USERS_FILE, JSON.stringify(doc, null, 2), "utf8");

      res.writeHead(201, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ ok: true }));
    })
    .catch(function (err) {
      res.writeHead(err.message === "Body too large" ? 413 : 500, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify({ error: err.message || "Server error" }));
    });
}

function serveStatic(req, res) {
  var u = new URL(req.url || "/", "http://127.0.0.1");
  var filePath = safePath(u.pathname);
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, function (err, st) {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    var ext = path.extname(filePath).toLowerCase();
    var type = MIME[ext] || "application/octet-stream";
    var headers = { "Content-Type": type };
    if (ext === ".json") {
      headers["Cache-Control"] = "no-store, max-age=0";
    }
    res.writeHead(200, headers);
    fs.createReadStream(filePath).pipe(res);
  });
}

http
  .createServer(function (req, res) {
    var pathname = (req.url || "/").split("?")[0];

    if (req.method === "OPTIONS" && pathname === "/api/register") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      });
      res.end();
      return;
    }

    if (req.method === "POST" && pathname === "/api/register") {
      handleRegister(req, res);
      return;
    }
    if (req.method === "GET" || req.method === "HEAD") {
      serveStatic(req, res);
      return;
    }
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method not allowed");
  })
  .listen(PORT, function () {
    console.log("Vault PH server at http://localhost:" + PORT);
    console.log("Create account will append to users.json when you use this server.");
  });
