const { Pool } = require('pg');

// Maps pg/Node error codes to safe, user-facing Spanish messages.
// The raw error is always logged server-side; this function only
// produces what is safe to return in an HTTP response.
function dbErrorMessage(err) {
  const code = err.code;
  if (code === '42P01') return 'Las tablas no existen en la base de datos. Ejecute: npm run db:init';
  if (code === '23502') return 'Faltan campos obligatorios en la solicitud.';
  if (code === '23503') return 'El registro relacionado no existe.';
  if (code === '23505') return 'Ya existe un registro con esos datos.';
  if (code === '28P01' || code === '28000') return 'Error de autenticación con la base de datos. Verifique las credenciales en .env.local.';
  if (code === '3D000') return 'La base de datos configurada no existe. Verifique DATABASE_NAME en .env.local.';
  if (code === 'ECONNREFUSED' || code === 'ETIMEDOUT') {
    return 'No se pudo conectar a la base de datos. Verifique que PostgreSQL esté activo.';
  }
  return null;
}

module.exports = { dbErrorMessage };
