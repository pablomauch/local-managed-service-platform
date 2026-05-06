const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connection');

router.get('/', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM clients ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await getDb().query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const { rows } = await getDb().query(
      'INSERT INTO clients (name, email, phone) VALUES ($1, $2, $3) RETURNING id',
      [name, email || null, phone || null]
    );
    res.status(201).json({ id: rows[0].id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  const { name, email, phone } = req.body;
  const pool = getDb();
  try {
    const { rows } = await pool.query('SELECT id FROM clients WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Client not found' });
    await pool.query(
      `UPDATE clients SET
        name       = COALESCE($1, name),
        email      = COALESCE($2, email),
        phone      = COALESCE($3, phone),
        updated_at = NOW()
      WHERE id = $4`,
      [name || null, email || null, phone || null, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
