# local-managed-service-platform

Local managed service platform prototype — Windows lab scaffold.

For detailed startup and shutdown procedures see
[`docs/local-runbook.md`](docs/local-runbook.md).

## Prerequisites

- [Node.js LTS](https://nodejs.org/) (v20 or later)
- PostgreSQL installed and available on your PATH
- Windows PowerShell or Command Prompt

No Docker. No WSL. No Linux-only tools.

---

## Architecture

The app runs as a **single Next.js process on `http://localhost:3000`**.
API routes are served by the same process under `/api`.
There is no separate backend running on `localhost:4000` or any other port.

| What | Where |
|------|-------|
| Application (UI + API) | `http://localhost:3000` |
| All API endpoints | `http://localhost:3000/api` |
| PostgreSQL | local service, started manually with `pg_ctl` |

PostgreSQL is the only separate local process. It must be running before you
start the app or run migrations.

See [`docs/architecture.md`](docs/architecture.md) for full architectural notes.

---

## PostgreSQL: start and stop manually

Replace `C:\pg-data` with the actual path to your PostgreSQL data directory.

### PowerShell

```powershell
# Start
pg_ctl start -D "C:\pg-data" -l "C:\pg-data\postgres.log"

# Stop
pg_ctl stop -D "C:\pg-data"
```

### Command Prompt (CMD)

```cmd
:: Start
pg_ctl start -D "C:\pg-data" -l "C:\pg-data\postgres.log"

:: Stop
pg_ctl stop -D "C:\pg-data"
```

---

## Quick start (Windows)

### 1. Clone and enter the repository

```powershell
git clone https://github.com/pablomauch/local-managed-service-platform.git
cd local-managed-service-platform
```

### 2. Install dependencies

```powershell
npm install
```

### 3. Create your local environment file

**PowerShell:**

```powershell
Copy-Item .env.example .env.local
```

**CMD:**

```cmd
copy .env.example .env.local
```

Open `.env.local` in any text editor and replace `CHANGE_ME` with your actual
PostgreSQL password. All other defaults match a standard local PostgreSQL install.

```
DATABASE_PASSWORD=your_real_password_here
DATABASE_URL=postgresql://app_user:your_real_password_here@localhost:5432/managed_service_local
```

> **`.env.local` must never be committed or uploaded to GitHub.**
> It is listed in `.gitignore` and will not be staged accidentally.
> Real passwords must only exist in `.env.local` on your local PC.

### 4. Start PostgreSQL

Start PostgreSQL manually with `pg_ctl` (see the section above) before
continuing. PostgreSQL must be running for migrations and for the app to start.

### 5. Run database migrations

```powershell
npm run db:migrate
```

Expected output:

```
Migration complete.
Database: localhost:5432/managed_service_local
```

### 6. Start the development server

```powershell
npm run dev
```

Expected output:

```
Server:   http://localhost:3000
Database: localhost:5432/managed_service_local
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
Click **Check health** — you should see:

```json
{
  "status": "ok",
  "app": "running",
  "db": "connected",
  "ai": "disabled",
  "timestamp": "..."
}
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot reload (nodemon) |
| `npm run build` | Syntax-check all source files |
| `npm run db:migrate` | Create or update the database schema |
| `npm start` | Start server without hot reload |

---

## Environment variables

All configuration is read from `.env.local` at startup. Never commit `.env.local`.
See `.env.example` for the full list of supported variables with placeholder values.

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_URL` | `http://localhost:3000` | Full URL of the app |
| `FRONTEND_PORT` | `3000` | Frontend port |
| `FRONTEND_URL` | `http://localhost:3000` | Frontend URL |
| `BACKEND_PORT` | `3000` | Backend port (same process as frontend) |
| `BACKEND_URL` | `http://localhost:3000` | Backend URL (same process as frontend) |
| `NEXT_PUBLIC_API_URL` | `/api` | API base path used by the frontend |
| `DATABASE_HOST` | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | `5432` | PostgreSQL port |
| `DATABASE_NAME` | — | Database name (required) |
| `DATABASE_USER` | — | Database user |
| `DATABASE_PASSWORD` | — | Database password — set in `.env.local` only |
| `DATABASE_URL` | — | Full connection URL (overrides individual vars) |
| `LLM_PROVIDER` | `disabled` | AI provider — keep as `disabled` |
| `ALLOW_EXTERNAL_AI_CALLS` | `false` | Must stay `false` |
| `ALLOW_EXTERNAL_REQUESTS` | `false` | Must stay `false` |

---

## API endpoints

All endpoints are served by the single app process at `http://localhost:3000/api`.

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

All runtime data is stored in PostgreSQL (`managed_service_local` database by
default). The database runs locally on your PC and is never uploaded anywhere.

> Real client names, case data, and documents must stay only on your local PC.
> Never push database dumps or exports to GitHub.

---

## Project structure

```
local-managed-service-platform/
├── scripts/
│   ├── build.js           # Cross-platform syntax checker
│   ├── check-local.cmd    # Validate local environment (Node, npm, pg, folder)
│   ├── start-local.cmd    # Start PostgreSQL then the dev server
│   └── stop-postgres.cmd  # Stop PostgreSQL
├── src/
│   ├── server.js          # Express entry point
│   ├── db/
│   │   ├── connection.js  # PostgreSQL pool
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
│   ├── architecture.md    # Architecture notes
│   └── local-runbook.md   # Startup and shutdown procedure
├── .env.example           # Safe placeholder values — commit this
├── .gitignore
└── package.json
```
