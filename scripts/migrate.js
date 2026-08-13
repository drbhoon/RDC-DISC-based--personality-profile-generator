/**
 * migrate.js — Applies every migration in ./migrations, in filename order.
 *
 * Run on every boot by docker-entrypoint.sh. Each file must be safe to re-run
 * (CREATE ... IF NOT EXISTS, ALTER ... ADD COLUMN IF NOT EXISTS), because there
 * is no ledger of what has already been applied — the idempotence IS the
 * ledger. That is a deliberate trade for an app this size: nothing to get out
 * of step with, and a fresh database self-provisions.
 *
 * It used to name 001_init.sql explicitly, which meant a second migration file
 * would sit in the directory looking applied and never run.
 *
 * Usage:
 *   node scripts/migrate.js
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const pool = require('../server/db');

async function migrate() {
  const dir = path.join(__dirname, '..', 'migrations');
  const files = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    // Zero-padded numeric prefixes, so a plain sort is the right order.
    .sort();

  if (files.length === 0) {
    console.log('No migrations found.');
    await pool.end();
    return;
  }

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await pool.query(sql);
    console.log(`Migration ${file} applied successfully.`);
  }
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
