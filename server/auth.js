const jwt = require('jsonwebtoken');

/**
 * Express middleware — verifies Admin JWT from Authorization header.
 * Header format: Authorization: Bearer <token>
 */
function requireAdmin(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Signs a JWT for an admin. Expires in 8 hours per spec.
 */
function signAdminToken(adminId, username) {
  return jwt.sign(
    { sub: adminId, username },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

module.exports = { requireAdmin, signAdminToken };
