const path = require('path');
const Database = require('better-sqlite3');

let db;

function getDb() {
  if (!db) {
    const dbPath = path.join(process.env.STORAGE_PATH, 'platform.db');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
    db.pragma('journal_mode = WAL');
  }
  return db;
}

module.exports = { getDb };
