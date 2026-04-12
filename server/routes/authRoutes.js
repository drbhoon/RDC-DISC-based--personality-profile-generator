const express  = require('express');
const bcrypt   = require('bcryptjs');
const pool     = require('../db');
const { signAdminToken, requireAdmin } = require('../auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, username, password_hash FROM admins WHERE username = $1',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signAdminToken(admin.id, admin.username);
    return res.json({ token, username: admin.username });
  } catch (err) {
    console.error('[auth/login]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/logout  (client simply discards its token)
router.post('/logout', requireAdmin, (req, res) => {
  return res.json({ success: true });
});

module.exports = router;
