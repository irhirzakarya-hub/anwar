const fs = require('fs');
const path = require('path');

// Pre-load assets into memory so Vercel bundler includes them in the deployment
let photoBuffer = null;
try {
  photoBuffer = fs.readFileSync(path.join(__dirname, 'PHOTO.jpeg'));
} catch (e) {
  try {
    photoBuffer = fs.readFileSync(path.join(__dirname, 'assets', 'PHOTO.jpeg'));
  } catch (err) {}
}

let avatarBuffer = null;
try {
  avatarBuffer = fs.readFileSync(path.join(__dirname, 'avatar.jpg'));
} catch (e) {}

let htmlBuffer = null;
try {
  htmlBuffer = fs.readFileSync(path.join(__dirname, 'index.html'));
} catch (e) {}

// Vercel Serverless Function handler
module.exports = (req, res) => {
  const rawUrl = decodeURI((req.url || '/').split('?')[0]);
  const lowerUrl = rawUrl.toLowerCase();

  res.setHeader('Access-Control-Allow-Origin', '*');

  // Serve photo directly
  if (lowerUrl.includes('photo.jpeg') || lowerUrl.includes('photo.jpg')) {
    if (photoBuffer) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.end(photoBuffer);
    }
  }

  // Serve avatar fallback
  if (lowerUrl.includes('avatar.jpg')) {
    if (avatarBuffer) {
      res.setHeader('Content-Type', 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      return res.end(avatarBuffer);
    }
  }

  // Always serve index.html for all page routes
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  if (htmlBuffer) {
    return res.end(htmlBuffer);
  } else {
    return res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
  }
};

// Allow running locally: node index.js
if (require.main === module) {
  const http = require('http');
  const server = http.createServer(module.exports);
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
