require('dotenv').config();
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const { CREATE_CLIENTS, CREATE_CASES, CREATE_DOCUMENTS, CREATE_TASKS } = require('./schema');

const STORAGE_PATH = process.env.STORAGE_PATH;

if (!STORAGE_PATH) {
  console.error('ERROR: STORAGE_PATH is not set. Copy .env.example to .env and set it.');
  process.exit(1);
}

fs.mkdirSync(STORAGE_PATH, { recursive: true });

const dbPath = path.join(STORAGE_PATH, 'platform.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

db.exec(CREATE_CLIENTS);
db.exec(CREATE_CASES);
db.exec(CREATE_DOCUMENTS);
db.exec(CREATE_TASKS);

db.close();

console.log('Migration complete.');
console.log('Database: ' + dbPath);
