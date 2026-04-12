require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes  = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const assessRoutes = require('./routes/assessRoutes');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.APP_URL : '*',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));

// ── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',   authRoutes);
app.use('/api/admin',  adminRoutes);
app.use('/api/assess', assessRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Serve React build in production ───────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDist));
  // SPA fallback — let React Router handle all non-API paths
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`RDC People Science server listening on port ${PORT}`);
});
