const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Railway's Postgres requires TLS; the HR platform's runs on a private
  // Docker network with TLS disabled, and pg fails outright if it asks for a
  // secure connection the server cannot offer. PGSSL=disable opts out.
  ssl: process.env.PGSSL === 'disable'
    ? false
    : process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err);
});

module.exports = pool;
