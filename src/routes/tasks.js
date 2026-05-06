const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Task not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { case_id, title, due_date } = req.body;
  if (!case_id || !title) return res.status(400).json({ error: 'case_id and title are required' });
  const result = getDb()
    .prepare('INSERT INTO tasks (case_id, title, due_date) VALUES (?, ?, ?)')
    .run(case_id, title, due_date || null);
  res.status(201).json({ id: result.lastInsertRowid });
});

router.patch('/:id', (req, res) => {
  const { title, status, due_date } = req.body;
  const db = getDb();
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  db.prepare(`
    UPDATE tasks SET
      title      = COALESCE(?, title),
      status     = COALESCE(?, status),
      due_date   = COALESCE(?, due_date),
      updated_at = datetime('now')
    WHERE id = ?
  `).run(title || null, status || null, due_date || null, req.params.id);
  res.json({ ok: true });
});

module.exports = router;
