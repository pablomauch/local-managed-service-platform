const { Pool } = require('pg');

// Singleton global para evitar múltiples pools durante hot reload de Next.js
if (!globalThis._pgPool) {
  globalThis._pgPool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL })
    : new Pool({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
      });
}

module.exports = { getDb: () => globalThis._pgPool };
