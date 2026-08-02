const jwt = require('jsonwebtoken');

/**
 * Express middleware — verifies Admin JWT from Authorization header.
 * Header format: Authorization: Bearer <token>
 */
// On the HR platform nginx has already verified the caller against the HR
// allowlist and forwards their address as X-Auth-Email. That header is blanked
// on every inbound request and re-set only from the auth_request result, so it
// cannot be forged. The JWT path below is unchanged and still serves Railway,
// local development, and anyone signing in with the app's own credentials.
const REQUIRE_SSO = process.env.REQUIRE_SSO === 'true';

function requireAdmin(req, res, next) {
  if (REQUIRE_SSO) {
    const email = req.headers['x-auth-email'];
    if (email) {
      req.admin = { sub: null, username: email, sso: true };
      return next();
    }
  }

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

module.exports = { requireAdmin, signAdminToken, REQUIRE_SSO };
