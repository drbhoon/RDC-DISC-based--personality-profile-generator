/**
 * migrate.js — Runs the initial database migration.
 *
 * Usage:
 *   node scripts/migrate.js
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('../server/db');

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'migrations', '001_init.sql'), 'utf8');
  await pool.query(sql);
  console.log('Migration 001_init.sql applied successfully.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
