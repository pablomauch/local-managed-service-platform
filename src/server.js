require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const STORAGE_PATH = process.env.STORAGE_PATH;

if (!STORAGE_PATH) {
  console.error('ERROR: STORAGE_PATH is not set. Copy .env.example to .env and set it.');
  process.exit(1);
}

fs.mkdirSync(STORAGE_PATH, { recursive: true });

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/health',    require('./routes/health'));
app.use('/api/clients',   require('./routes/clients'));
app.use('/api/cases',     require('./routes/cases'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/tasks',     require('./routes/tasks'));

app.listen(PORT, () => {
  console.log('Server:  http://localhost:' + PORT);
  console.log('Storage: ' + STORAGE_PATH);
});
