const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM cases ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM cases WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Case not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { client_id, title } = req.body;
  if (!client_id || !title) return res.status(400).json({ error: 'client_id and title are required' });
  try {
    const { rows } = await getDb().query(
      'INSERT INTO cases (client_id, title) VALUES ($1, $2) RETURNING id',
      [client_id, title]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { title, status } = req.body;
  const pool = getDb();
  try {
    const { rows } = await pool.query('SELECT id FROM cases WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Case not found' });
    await pool.query(
      `UPDATE cases SET
        title      = COALESCE($1, title),
        status     = COALESCE($2, status),
        updated_at = NOW()
      WHERE id = $3`,
      [title || null, status || null, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
