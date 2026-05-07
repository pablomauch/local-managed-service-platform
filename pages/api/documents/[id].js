const { getDb } = require('../../../lib/db');

export default async function handler(req, res) {
  const pool = getDb();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT d.*, c.title AS case_title FROM documents d LEFT JOIN cases c ON c.id = d.case_id WHERE d.id = $1',
        [id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Documento no encontrado.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/documents/:id GET]', err.message);
      return res.status(500).json({ error: 'Error al obtener el documento.' });
    }
  }

  if (req.method === 'PUT') {
    const { case_id, file_name, document_type, storage_path, status } = req.body || {};
    if (!case_id) return res.status(400).json({ error: 'El caso es obligatorio.' });
    if (!file_name || !file_name.trim()) return res.status(400).json({ error: 'El nombre del archivo es obligatorio.' });
    try {
      const { rows } = await pool.query(
        'UPDATE documents SET case_id=$1, file_name=$2, document_type=$3, storage_path=$4, status=$5, updated_at=NOW() WHERE id=$6 RETURNING *',
        [case_id, file_name.trim(), document_type || 'otro', storage_path?.trim() || null, status || 'activo', id]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Documento no encontrado.' });
      return res.json(rows[0]);
    } catch (err) {
      console.error('[/api/documents/:id PUT]', err.message);
      return res.status(500).json({ error: 'Error al actualizar el documento.' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido.' });
}
