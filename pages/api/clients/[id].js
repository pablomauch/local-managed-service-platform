const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM clients WHERE id = $1', [id]);
      if (!rows[0]) return res.status(404).json({ error: 'Cliente no encontrado.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/clients/:id GET]', err.message);
      return res.status(500).json({ error: 'Error al obtener el cliente.' });
    }
  }

  if (req.method === 'PUT') {
    const { name, description, status } = req.body || {};
    if (!name || !name.trim()) return res.status(400).json({ error: 'El nombre es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'UPDATE clients SET name=$1, description=$2, status=$3, updated_at=NOW() WHERE id=$4 RETURNING *',
        [name.trim(), description?.trim() || null, status || 'activo', id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Cliente no encontrado.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/clients/:id PUT]', err.message);
      return res.status(500).json({ error: 'Error al actualizar el cliente.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
