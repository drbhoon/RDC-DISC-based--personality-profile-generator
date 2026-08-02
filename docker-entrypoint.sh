#!/usr/bin/env sh
set -e

# 001_init.sql is entirely CREATE ... IF NOT EXISTS, so running it on every
# boot is safe and keeps a fresh database self-provisioning.
echo "[entrypoint] applying migrations"
node scripts/migrate.js

# Seeding upserts on username, so this also serves as a password reset: change
# ADMIN_PASSWORD in .env and restart. Skipped when the credentials are absent.
if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "[entrypoint] seeding admin '$ADMIN_USERNAME'"
  node scripts/seed-admin.js
else
  echo "[entrypoint] ADMIN_USERNAME/ADMIN_PASSWORD not set — skipping admin seed"
fi

echo "[entrypoint] starting server"
exec node server/index.js
