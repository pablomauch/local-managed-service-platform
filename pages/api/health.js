const { getDb } = require('../../lib/db');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  try {
    await getDb().query('SELECT 1');
    res.json({
      status: 'ok',
      app: 'running',
      db: 'connected',
      ai: process.env.LLM_PROVIDER || 'disabled',
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(503).json({ status: 'error', app: 'running', db: 'disconnected' });
  }
}
