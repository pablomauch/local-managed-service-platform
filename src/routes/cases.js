const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM cases ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM cases WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Case not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { client_id, title } = req.body;
  if (!client_id || !title) return res.status(400).json({ error: 'client_id and title are required' });
  const result = getDb()
    .prepare('INSERT INTO cases (client_id, title) VALUES (?, ?)')
    .run(client_id, title);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { title, status } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM cases WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Case not found' });
  db.prepare(`
    UPDATE cases SET
      title      = COALESCE(?, title),
      status     = COALESCE(?, status),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(title || null, status || null, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
