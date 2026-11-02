const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Vercel Serverless Function & Node Handler
module.exports = (req, res) => {
  let reqPath = decodeURI((req.url || '/').split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.end(fs.readFileSync(filePath));
    }
  } catch (err) {}

  // Fallback to index.html
  const indexPath = path.join(__dirname, 'index.html');
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.end(fs.readFileSync(indexPath));
};

// Allow running locally: node index.js
if (require.main === module) {
  const http = require('http');
  const server = http.createServer(module.exports);
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}
