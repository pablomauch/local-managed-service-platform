const { getDb } = require('../../../lib/db');
const { dbErrorMessage } = require('../../../lib/api-error');

export default async function handler(req, res) {
  const pool = getDb();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(`
        SELECT c.*, cl.name AS client_name
        FROM cases c
        LEFT JOIN clients cl ON cl.id = c.client_id
        ORDER BY c.created_at DESC
      `);
      return res.json(rows);
    } catch (err) {
      console.error('[/api/cases GET]', err.message);
      const msg = dbErrorMessage(err) || 'Error al obtener los casos.';
      return res.status(500).json({ error: msg });
    }
  }

  if (req.method === 'POST') {
    const { client_id, title, description, status, priority } = req.body || {};
    if (!client_id) return res.status(400).json({ error: 'El cliente es obligatorio.' });
    if (!title || !title.trim()) return res.status(400).json({ error: 'El título es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'INSERT INTO cases (client_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [client_id, title.trim(), description?.trim() || null, status || 'abierto', priority || 'media']
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('[/api/cases POST]', err.message);
      const msg = dbErrorMessage(err) || 'Error al crear el caso.';
      return res.status(500).json({ error: msg });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
