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

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  // APP_URL may carry the mount path (https://hr.rdcc.ai/disc); CORS needs the
  // bare origin. Same-origin requests skip CORS entirely, so this only matters
  // for the root-mounted deployments.
  origin: process.env.NODE_ENV === 'production' && process.env.APP_URL
    ? new URL(process.env.APP_URL).origin
    : '*',
  credentials: true,
}));
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
