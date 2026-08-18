// server.js
// Entry point for the AI Agent Audit Trail API.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyConnection, closeDriver } = require('./db');

const agentsRouter = require('./routes/agents');
const actionsRouter = require('./routes/actions');
const traceRouter = require('./routes/trace');
const violationsRouter = require('./routes/violations');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigin = process.env.FRONTEND_URL;
app.use(
  cors(
    allowedOrigin
      ? { origin: allowedOrigin }
      : {}
  )
);
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again shortly.' },
});
app.use('/api', apiLimiter);

// Simple health check — also useful for the frontend to detect "DB unreachable"
// state gracefully, per the assignment's error-handling requirement.
app.get('/api/health', async (req, res) => {
  const connected = await verifyConnection();
  res.status(connected ? 200 : 503).json({ status: connected ? 'ok' : 'db_unreachable' });
});

app.use('/api/agents', agentsRouter);
app.use('/api/actions', actionsRouter);
app.use('/api/trace', traceRouter);
app.use('/api/violations', violationsRouter);

// Centralized error handler — any route that throws lands here instead of
// crashing the process or leaking a raw stack trace to the client.
app.use((err, req, res, next) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, async () => {
  console.log(`[server] Listening on port ${PORT}`);
  const connected = await verifyConnection();
  if (!connected) {
    console.warn('[server] WARNING: CognoDB is not reachable at startup. API will return 503s on DB routes.');
  }
});

process.on('SIGINT', async () => {
  await closeDriver();
  process.exit(0);
});