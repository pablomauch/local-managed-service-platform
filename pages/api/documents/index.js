const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(`
        SELECT d.*, c.title AS case_title
        FROM documents d
        LEFT JOIN cases c ON c.id = d.case_id
        ORDER BY d.created_at DESC
      `);
      return res.json(rows);
    } catch {
      return res.status(500).json({ error: 'Error al obtener los documentos.' });
    }
  }

  if (req.method === 'POST') {
    const { case_id, file_name, document_type, storage_path, status } = req.body || {};
    if (!case_id) return res.status(400).json({ error: 'El caso es obligatorio.' });
    if (!file_name || !file_name.trim()) return res.status(400).json({ error: 'El nombre del archivo es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'INSERT INTO documents (case_id, file_name, document_type, storage_path, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [case_id, file_name.trim(), document_type || 'otro', storage_path?.trim() || null, status || 'activo']
      );
      return res.status(201).json(rows[0]);
    } catch {
      return res.status(500).json({ error: 'Error al registrar el documento.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
