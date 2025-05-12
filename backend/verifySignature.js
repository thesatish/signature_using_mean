// backend/verifySignature.js
const crypto = require('crypto');

const NONCE_CACHE = new Set(); // Have to use redis
const SECRET = 'satish-sen';

module.exports = function verifySignature(req, res, next) {
  const signature = req.headers['x-signature'];
  const timestamp = req.headers['x-timestamp'];
  const nonce = req.headers['x-nonce'];

  if (!signature || !timestamp || !nonce) {
    return res.status(400).json({ message: 'Missing signature headers' });
  }

  // Prevent replay within 5 mins
  const now = Date.now();
  if (Math.abs(now - Number(timestamp)) > 5 * 60 * 1000) {
    return res.status(401).json({ message: 'Request expired' });
  }

  if (NONCE_CACHE.has(nonce)) {
    return res.status(409).json({ message: 'Replay attack detected' });
  }

  const expectedSignature = crypto
    .createHmac('sha256', SECRET)
    .update(JSON.stringify(req.body) + timestamp + nonce)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(403).json({ message: 'Invalid signature' });
  }

  NONCE_CACHE.add(nonce);
  setTimeout(() => NONCE_CACHE.delete(nonce), 5 * 60 * 1000);

  next();
};
