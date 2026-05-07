const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT t.*, c.title AS case_title FROM tasks t LEFT JOIN cases c ON c.id = t.case_id WHERE t.id = $1',
        [id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Tarea no encontrada.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/tasks/:id GET]', err.message);
      return res.status(500).json({ error: 'Error al obtener la tarea.' });
    }
  }

  if (req.method === 'PUT') {
    const { case_id, title, description, status, due_date } = req.body || {};
    if (!case_id) return res.status(400).json({ error: 'El caso es obligatorio.' });
    if (!title || !title.trim()) return res.status(400).json({ error: 'El título es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'UPDATE tasks SET case_id=$1, title=$2, description=$3, status=$4, due_date=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
        [case_id, title.trim(), description?.trim() || null, status || 'pendiente', due_date || null, id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Tarea no encontrada.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/tasks/:id PUT]', err.message);
      return res.status(500).json({ error: 'Error al actualizar la tarea.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
