const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    await getDb().query('SELECT 1');
    res.json({
      status: 'ok',
      app: 'running',
      db: 'connected',
      ai: process.env.LLM_PROVIDER || 'disabled',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: 'error',
      app: 'running',
      db: 'disconnected',
      message: err.message,
    });
  }
});

module.exports = router;
