const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT c.*, cl.name AS client_name FROM cases c LEFT JOIN clients cl ON cl.id = c.client_id WHERE c.id = $1',
        [id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Caso no encontrado.' });
      return res.json(rows[0]);
    } catch {
      return res.status(500).json({ error: 'Error al obtener el caso.' });
    }
  }

  if (req.method === 'PUT') {
    const { client_id, title, description, status, priority } = req.body || {};
    if (!client_id) return res.status(400).json({ error: 'El cliente es obligatorio.' });
    if (!title || !title.trim()) return res.status(400).json({ error: 'El título es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'UPDATE cases SET client_id=$1, title=$2, description=$3, status=$4, priority=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
        [client_id, title.trim(), description?.trim() || null, status || 'abierto', priority || 'media', id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Caso no encontrado.' });
      return res.json(rows[0]);
    } catch {
      return res.status(500).json({ error: 'Error al actualizar el caso.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
