const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { case_id, title, due_date } = req.body;
  if (!case_id || !title) return res.status(400).json({ error: 'case_id and title are required' });
  try {
    const { rows } = await getDb().query(
      'INSERT INTO tasks (case_id, title, due_date) VALUES ($1, $2, $3) RETURNING id',
      [case_id, title, due_date || null]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { title, status, due_date } = req.body;
  const pool = getDb();
  try {
    const { rows } = await pool.query('SELECT id FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Task not found' });
    await pool.query(
      `UPDATE tasks SET
        title      = COALESCE($1, title),
        status     = COALESCE($2, status),
        due_date   = COALESCE($3, due_date),
        updated_at = NOW()
      WHERE id = $4`,
      [title || null, status || null, due_date || null, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
