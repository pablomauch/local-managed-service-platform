const { getDb } = require('../../../lib/db');
const { dbErrorMessage } = require('../../../lib/api-error');

export default async function handler(req, res) {
  const pool = getDb();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(`
        SELECT t.*, c.title AS case_title
        FROM tasks t
        LEFT JOIN cases c ON c.id = t.case_id
        ORDER BY t.created_at DESC
      `);
      return res.json(rows);
    } catch (err) {
      console.error('[/api/tasks GET]', err.message);
      const msg = dbErrorMessage(err) || 'Error al obtener las tareas.';
      return res.status(500).json({ error: msg });
    }
  }

  if (req.method === 'POST') {
    const { case_id, title, description, status, due_date } = req.body || {};
    if (!case_id) return res.status(400).json({ error: 'El caso es obligatorio.' });
    if (!title || !title.trim()) return res.status(400).json({ error: 'El título es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'INSERT INTO tasks (case_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [case_id, title.trim(), description?.trim() || null, status || 'pendiente', due_date || null]
      );
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('[/api/tasks POST]', err.message);
      const msg = dbErrorMessage(err) || 'Error al crear la tarea.';
      return res.status(500).json({ error: msg });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
