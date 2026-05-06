const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', (req, res) => {
  const rows = getDb().prepare('SELECT * FROM documents ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = getDb().prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Document not found' });
  res.json(row);
});

router.post('/', (req, res) => {
  const { case_id, filename, stored_path } = req.body;
  if (!case_id || !filename || !stored_path) {
    return res.status(400).json({ error: 'case_id, filename, and stored_path are required' });
  }
  const result = getDb()
    .prepare('INSERT INTO documents (case_id, filename, stored_path) VALUES (?, ?, ?)')
    .run(case_id, filename, stored_path);
  res.status(201).json({ id: result.lastInsertRowid });
});

module.exports = router;
