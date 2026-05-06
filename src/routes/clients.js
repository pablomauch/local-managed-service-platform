const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM clients ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Client not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const result = getDb()
    .prepare('INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)')
    .run(name, email || null, phone || null);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM clients WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Client not found' });
  db.prepare(`
    UPDATE clients SET
      name       = COALESCE(?, name),
      email      = COALESCE(?, email),
      phone      = COALESCE(?, phone),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(name || null, email || null, phone || null, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
