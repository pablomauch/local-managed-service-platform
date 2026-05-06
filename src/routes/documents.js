const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM documents ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Document not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, filename, stored_path } = req.body;
  if (!case_id || !filename || !stored_path) {
    return res.status(400).json({ error: 'case_id, filename, and stored_path are required' });
  }
  try {
    const { rows } = await getDb().query(
      'INSERT INTO documents (case_id, filename, stored_path) VALUES ($1, $2, $3) RETURNING id',
      [case_id, filename, stored_path]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
