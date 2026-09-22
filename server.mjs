import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT || 5173);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

function serveFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const acceptEncoding = req.headers['accept-encoding'] || '';

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
  };

  if (filePath.includes(`${path.sep}assets${path.sep}`)) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable';
  } else {
    headers['Cache-Control'] = 'no-cache';
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    const shouldCompress = /text|javascript|json|xml|svg/.test(contentType);
    if (shouldCompress && /\bgzip\b/.test(acceptEncoding)) {
      zlib.gzip(content, (gzipErr, compressed) => {
        if (!gzipErr) {
          headers['Content-Encoding'] = 'gzip';
          headers['Vary'] = 'Accept-Encoding';
          res.writeHead(200, headers);
          res.end(compressed);
        } else {
          res.writeHead(200, headers);
          res.end(content);
        }
      });
    } else {
      res.writeHead(200, headers);
      res.end(content);
    }
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url ? req.url.split('?')[0] : '/';
  const decodedPath = decodeURIComponent(urlPath);
  let filePath = path.join(DIST_DIR, decodedPath);

  // Proteção contra Directory Traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(req, res, filePath);
    } else {
      // Fallback SPA: qualquer rota desconhecida devolve index.html
      serveFile(req, res, path.join(DIST_DIR, 'index.html'));
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Lari Nails Web (Distroless SPA Server) listening on port ${PORT}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
