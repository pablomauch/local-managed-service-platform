require('dotenv').config({ path: '.env.local' });
const { getDb } = require('./connection');
const { CREATE_CLIENTS, CREATE_CASES, CREATE_DOCUMENTS, CREATE_TASKS } = require('./schema');

async function migrate() {
  const pool = getDb();
  await pool.query(CREATE_CLIENTS);
  await pool.query(CREATE_CASES);
  await pool.query(CREATE_DOCUMENTS);
  await pool.query(CREATE_TASKS);
  await pool.end();

  const target = process.env.DATABASE_URL
    ? '(from DATABASE_URL)'
    : `${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;

  console.log('Migration complete.');
  console.log('Database: ' + target);
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
