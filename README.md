# local-managed-service-platform

Local managed service platform prototype — Windows lab scaffold.

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (v20 or later)
- Windows PowerShell or Command Prompt

No Docker. No WSL. No Linux-only tools.

---

## Quick start (Windows PowerShell)

### 1. Clone and enter the repository

```powershell
git clone https://github.com/pablomauch/local-managed-service-platform.git
cd local-managed-service-platform
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Configure environment

```powershell
Copy-Item .env.example .env
```

Open `.env` in any text editor and set `STORAGE_PATH` to a folder **outside** the repository.
The folder will be created automatically if it does not exist.

```
STORAGE_PATH=C:\managed-service-data
PORT=3000
NODE_ENV=development
```

### 4. Run database migrations

```powershell
npm run db:migrate
```

Expected output:

```
Migration complete.
Database: C:\managed-service-data\platform.db
```

### 5. Start the development server

```powershell
npm run dev
```

Expected output:

```
Server:  http://localhost:3000
Storage: C:\managed-service-data
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
Click **Check health** — you should see `{ "status": "ok", "db": "connected", ... }`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot reload (nodemon) |
| `npm run build` | Syntax-check all source files |
| `npm run db:migrate` | Create or update the database schema |
| `npm start` | Start server without hot reload |

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Service health check |
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create a client `{ name, email?, phone? }` |
| GET | `/api/clients/:id` | Get a client |
| PATCH | `/api/clients/:id` | Update a client |
| GET | `/api/cases` | List all cases |
| POST | `/api/cases` | Create a case `{ client_id, title }` |
| GET | `/api/cases/:id` | Get a case |
| PATCH | `/api/cases/:id` | Update a case `{ title?, status? }` |
| GET | `/api/documents` | List all documents |
| POST | `/api/documents` | Register a document `{ case_id, filename, stored_path }` |
| GET | `/api/documents/:id` | Get a document |
| GET | `/api/tasks` | List all tasks |
| POST | `/api/tasks` | Create a task `{ case_id, title, due_date? }` |
| GET | `/api/tasks/:id` | Get a task |
| PATCH | `/api/tasks/:id` | Update a task `{ title?, status?, due_date? }` |

---

## Data storage

All runtime data (SQLite database, future file uploads) is written to `STORAGE_PATH`.  
This path must be **outside** the repository. It is never committed to source control.

The SQLite database file is `platform.db` inside `STORAGE_PATH`.

---

## Project structure

```
local-managed-service-platform/
├── scripts/
│   └── build.js          # Cross-platform syntax checker
├── src/
│   ├── server.js          # Express entry point
│   ├── db/
│   │   ├── connection.js  # SQLite singleton
│   │   ├── migrate.js     # Migration runner
│   │   └── schema.js      # Table definitions
│   ├── routes/
│   │   ├── health.js
│   │   ├── clients.js
│   │   ├── cases.js
│   │   ├── documents.js
│   │   └── tasks.js
│   └── public/
│       └── index.html     # Health check UI
├── docs/
├── .env.example
├── .gitignore
└── package.json
```
