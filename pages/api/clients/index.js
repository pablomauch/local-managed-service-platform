const { getDb } = require('../../../lib/db');
const { dbErrorMessage } = require('../../../lib/api-error');

export default async function handler(req, res) {
  const pool = getDb();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
      return res.json(rows);
    } catch (err) {
      console.error('[/api/clients GET]', err.message);
      const msg = dbErrorMessage(err) || 'Error al obtener los clientes.';
      return res.status(500).json({ error: msg });
    }
  }

  if (req.method === 'POST') {
    const { name, description, status } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'El nombre es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'INSERT INTO clients (name, description, status) VALUES ($1, $2, $3) RETURNING *',
        [name.trim(), description?.trim() || null, status || 'activo']
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('[/api/clients POST]', err.message);
      const msg = dbErrorMessage(err) || 'Error al crear el cliente.';
      return res.status(500).json({ error: msg });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
