# Local Runbook

Step-by-step startup and shutdown procedure for the local development environment.

## Prerequisites

- Node.js v20 or later installed and on the PATH
- PostgreSQL installed and on the PATH (`pg_ctl`, `psql` available in CMD)
- Repository cloned to `C:\dev\managed-service-platform`
- `.env.local` created from `.env.example` with real credentials (never committed)
- PostgreSQL data directory exists (e.g. `C:\dev\pg-data`)
- Runtime data directory exists: `C:\dev\managed-service-platform-data`

PostgreSQL is **not** configured as a Windows service. It must be started
manually every session.

---

## Startup procedure

Follow these steps in order. Do not skip steps.

### Step 1 — Start PostgreSQL

Open a Command Prompt and run:

```cmd
pg_ctl start -D "C:\dev\pg-data" -l "C:\dev\pg-data\postgres.log"
```

Expected output:

```
waiting for server to start.... done
server started
```

If it says `server is already running`, continue to the next step.

### Step 2 — Verify port 5432 is listening

```cmd
netstat -an | findstr :5432
```

Expected output (one or more lines):

```
  TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING
```

If port 5432 does not appear, PostgreSQL did not start. Check the log at
`C:\dev\pg-data\postgres.log` for errors before continuing.

### Step 3 — Start the application

```cmd
cd C:\dev\managed-service-platform
npm run dev
```

Expected output:

```
Server:   http://localhost:3000
Database: localhost:5432/managed_service_local
```

Leave this window open. The app runs in the foreground.

### Step 4 — Verify the health endpoint

Open a second Command Prompt and run:

```cmd
curl -s http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "app": "running",
  "db": "connected",
  "ai": "disabled",
  "timestamp": "..."
}
```

All four fields must match before the environment is considered healthy:

| Field | Expected value | Meaning |
|-------|---------------|---------|
| `status` | `ok` | App started without errors |
| `app` | `running` | Express / Next.js process is up |
| `db` | `connected` | PostgreSQL connection succeeded |
| `ai` | `disabled` | No external AI calls will be made |

If `db` is `disconnected`, stop here. Check PostgreSQL is running (Step 2)
and that `DATABASE_PASSWORD` in `.env.local` is correct.

---

## Shutdown procedure

### Step 1 — Stop the application

In the window running `npm run dev`, press `Ctrl+C` and confirm if prompted.

### Step 2 — Stop PostgreSQL

```cmd
pg_ctl stop -D "C:\dev\pg-data"
```

Expected output:

```
waiting for server to shut down.... done
server stopped
```

### Step 3 — Verify port 5432 is closed

```cmd
netstat -an | findstr :5432
```

Expected output: no lines. If lines still appear, wait a few seconds and retry.

---

## Helper scripts

Three CMD scripts are provided in the `scripts\` folder. They are shortcuts —
the manual steps above remain the authoritative procedure.

| Script | Purpose |
|--------|---------|
| `scripts\start-local.cmd` | Start PostgreSQL, verify port, then start the app |
| `scripts\stop-postgres.cmd` | Stop PostgreSQL |
| `scripts\check-local.cmd` | Validate Node, npm, PostgreSQL port, project folder |

Run them from the repository root or from any CMD window:

```cmd
scripts\start-local.cmd
scripts\stop-postgres.cmd
scripts\check-local.cmd
```

---

## Runtime data

All PostgreSQL data is stored in the PostgreSQL data directory outside the
repository. No runtime data is written inside `C:\dev\managed-service-platform`.

| What | Where |
|------|-------|
| PostgreSQL rows | inside the PostgreSQL data directory |
| Application logs | console output only (no log files at this stage) |
| Future file uploads | `C:\dev\managed-service-platform-data` |

> Real client names, case data, and credentials must stay only on the local PC.
> Never commit `.env.local`, database dumps, or any exported data to GitHub.

---

## Troubleshooting

### App exits immediately with "Database is not configured"

`.env.local` is missing or `DATABASE_NAME` is not set.
Copy `.env.example` to `.env.local` and fill in real values.

### Health endpoint returns `db: disconnected`

- Confirm PostgreSQL is running: `netstat -an | findstr :5432`
- Confirm `DATABASE_PASSWORD` in `.env.local` matches the PostgreSQL user password.
- Check `C:\dev\pg-data\postgres.log` for PostgreSQL errors.

### Port 3000 already in use

Another process is using port 3000. Find and stop it:

```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

Or change `PORT` in `.env.local` to a free port (e.g. `3001`).

### pg_ctl not found

PostgreSQL `bin` directory is not on the PATH.
Add it in System Properties → Environment Variables → PATH,
for example: `C:\Program Files\PostgreSQL\16\bin`
