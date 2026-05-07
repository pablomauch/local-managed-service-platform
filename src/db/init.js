require('dotenv').config({ path: '.env.local' });
const { getDb } = require('./connection');
const { CREATE_CLIENTS, CREATE_CASES, CREATE_DOCUMENTS, CREATE_TASKS } = require('./schema');

// ---------------------------------------------------------------------------
// ALTER TABLE statements para agregar columnas faltantes sin tocar datos.
// ADD COLUMN IF NOT EXISTS es un no-op si la columna ya existe, por lo que
// estas sentencias son seguras de ejecutar múltiples veces.
// ---------------------------------------------------------------------------

const ALTER_CLIENTS = [
  "ALTER TABLE clients ADD COLUMN IF NOT EXISTS description TEXT",
  "ALTER TABLE clients ADD COLUMN IF NOT EXISTS status      TEXT NOT NULL DEFAULT 'activo'",
  "ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
  "ALTER TABLE clients ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
];

const ALTER_CASES = [
  "ALTER TABLE cases ADD COLUMN IF NOT EXISTS description TEXT",
  "ALTER TABLE cases ADD COLUMN IF NOT EXISTS status      TEXT NOT NULL DEFAULT 'abierto'",
  "ALTER TABLE cases ADD COLUMN IF NOT EXISTS priority    TEXT NOT NULL DEFAULT 'media'",
  "ALTER TABLE cases ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
  "ALTER TABLE cases ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
];

const ALTER_DOCUMENTS = [
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_type TEXT NOT NULL DEFAULT 'otro'",
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS storage_path  TEXT",
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS status        TEXT NOT NULL DEFAULT 'activo'",
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()",
  "ALTER TABLE documents ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()",
];

const ALTER_TASKS = [
  "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS description TEXT",
  "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS status      TEXT NOT NULL DEFAULT 'pendiente'",
  "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date    DATE",
  "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
  "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()",
];

const TABLES = [
  { nombre: 'clients',   create: CREATE_CLIENTS,   alter: ALTER_CLIENTS   },
  { nombre: 'cases',     create: CREATE_CASES,     alter: ALTER_CASES     },
  { nombre: 'documents', create: CREATE_DOCUMENTS, alter: ALTER_DOCUMENTS },
  { nombre: 'tasks',     create: CREATE_TASKS,     alter: ALTER_TASKS     },
];

async function init() {
  const pool = getDb();

  try {
    console.log('Verificando y actualizando esquema de base de datos...\n');

    for (const tabla of TABLES) {
      // 1. Crear tabla si no existe (no-op si ya existe)
      await pool.query(tabla.create);

      // 2. Agregar columnas faltantes (no-op por columna si ya existe)
      for (const sql of tabla.alter) {
        await pool.query(sql);
      }

      console.log('OK  ' + tabla.nombre);
      console.log('    → tabla creada o ya existía');
      console.log('    → columnas faltantes agregadas (si las había)');
      console.log('    → datos existentes no modificados');
    }

    await pool.end();

    const target = process.env.DATABASE_URL
      ? '(desde DATABASE_URL)'
      : `${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;

    console.log('\nInicialización completa. No se eliminaron datos.');
    console.log('Base de datos: ' + target);
    console.log('Este comando puede ejecutarse múltiples veces de forma segura.');

  } catch (err) {
    console.error('\nError durante la inicialización:', err.message);
    process.exit(1);
  }
}

init();
