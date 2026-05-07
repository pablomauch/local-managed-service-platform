require('dotenv').config({ path: '.env.local' });
const { getDb } = require('./connection');
const { CREATE_CLIENTS, CREATE_CASES, CREATE_DOCUMENTS, CREATE_TASKS } = require('./schema');

async function init() {
  const pool = getDb();
  try {
    await pool.query(CREATE_CLIENTS);
    console.log('OK  clients');
    await pool.query(CREATE_CASES);
    console.log('OK  cases');
    await pool.query(CREATE_DOCUMENTS);
    console.log('OK  documents');
    await pool.query(CREATE_TASKS);
    console.log('OK  tasks');
    await pool.end();

    const target = process.env.DATABASE_URL
      ? '(desde DATABASE_URL)'
      : `${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;

    console.log('\nInicialización completa.');
    console.log('Base de datos: ' + target);
  } catch (err) {
    console.error('\nError durante la inicialización:', err.message);
    process.exit(1);
  }
}

init();
