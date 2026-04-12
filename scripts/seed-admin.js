/**
 * seed-admin.js — One-time script to create the initial admin user.
 *
 * Usage:
 *   ADMIN_USERNAME=admin ADMIN_PASSWORD=yourpassword node scripts/seed-admin.js
 *
 * Or with .env file:
 *   node -r dotenv/config scripts/seed-admin.js
 *   (set ADMIN_USERNAME and ADMIN_PASSWORD in .env)
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool   = require('../server/db');

async function seed() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables first.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admins (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, hash]
  );

  console.log(`Admin user "${username}" created/updated successfully.`);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
