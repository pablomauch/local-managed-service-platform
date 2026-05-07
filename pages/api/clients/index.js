const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
      return res.json(rows);
    } catch (err) {
      console.error('[/api/clients GET]', err.message);
      return res.status(500).json({ error: 'Error al obtener los clientes.' });
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
      return res.status(500).json({ error: 'Error al crear el cliente.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
