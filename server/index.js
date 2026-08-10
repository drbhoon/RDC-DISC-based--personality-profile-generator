require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes  = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assessRoutes = require('./routes/assessRoutes');

const app = express();

// On the HR platform the app is mounted at hr.rdcc.ai/disc and nginx proxies
// the prefix through unstripped, so every route has to live under it. Empty
// everywhere else, which mounts the router at "/" exactly as before.
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/$/, '');

/**
 * APP_URL may carry the mount path (https://hr.rdcc.ai/disc) while CORS wants
 * the bare origin.
 *
 * This MUST NOT throw. new URL() rejects a value with no scheme, and Railway
 * had APP_URL set to a bare hostname — so the server died on line 1 of startup,
 * every boot, and the whole app returned 502. A CORS setting is not worth
 * taking the application down for: a malformed value now falls back to the
 * permissive default and says so in the log.
 */
function corsOrigin() {
  const raw = process.env.APP_URL;
  if (process.env.NODE_ENV !== 'production' || !raw) return '*';
  try {
    // Tolerate a bare host by assuming https, which is what it always is here.
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    console.warn(`[cors] APP_URL is not a usable URL (${raw}); allowing all origins.`);
    return '*';
  }
}

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: corsOrigin(), credentials: true }));
app.use(express.json({ limit: '2mb' }));

const router = express.Router();

// ── API Routes ─────────────────────────────────────────────────────────────
router.use('/api/auth',   authRoutes);
router.use('/api/admin',  adminRoutes);
router.use('/api/assess', assessRoutes);

// ── Health check ───────────────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Serve React build in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  router.use(express.static(clientDist));
  // SPA fallback — let React Router handle all non-API paths
  router.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use(BASE_PATH || '/', router);

// Unprefixed health check as well, so container/uptime probes can hit the
// service directly without knowing the mount path.
if (BASE_PATH) {
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
}

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`RDC People Science server listening on port ${PORT}`);
});
