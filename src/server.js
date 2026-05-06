require('dotenv').config({ path: '.env.local' });
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;

if (!process.env.DATABASE_URL && !process.env.DATABASE_NAME) {
  console.error('ERROR: Database is not configured.');
  console.error('Copy .env.example to .env.local and set DATABASE_NAME (or DATABASE_URL).');
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/health',    require('./routes/health'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/cases',     require('./routes/cases'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tasks',     require('./routes/tasks'));

app.listen(PORT, () => {
  const dbTarget = process.env.DATABASE_URL
    ? '(from DATABASE_URL)'
    : `${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;
  console.log('Server:   http://localhost:' + PORT);
  console.log('Database: ' + dbTarget);
});
