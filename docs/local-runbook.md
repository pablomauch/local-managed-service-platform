# Local Runbook

Step-by-step startup and shutdown procedure for the local development environment.

---

## Local paths

| What | Path |
|------|------|
| PostgreSQL installation | `C:\Program Files\PostgreSQL\18` |
| PostgreSQL data directory | `C:\dev\managed-service-platform-data\postgres-data` |
| PostgreSQL log file | `C:\dev\managed-service-platform-data\postgres-log.txt` |
| Application directory | `C:\dev\managed-service-platform` |

PostgreSQL is **not** configured as a Windows service. It must be started
manually every session.

---

## Desktop shortcuts

Three shortcuts on the desktop cover the most common tasks.
Each shortcut opens a CMD window that stays open (`cmd.exe /k`) so you can
read the output after the command finishes.

| Shortcut name | Script | Purpose |
|---------------|--------|---------|
| Iniciar Plataforma Local | `scripts\start-local.cmd` | Start PostgreSQL then the dev server |
| Revisar Entorno Local | `scripts\check-local.cmd` | Validate Node, npm, pg_ctl, port, project folder |
| Detener PostgreSQL Local | `scripts\stop-postgres.cmd` | Stop PostgreSQL |

### How to create or recreate a shortcut

1. Right-click the Desktop → **New → Shortcut**.
2. Set the target to the appropriate line from the table below.
3. Set the name to the shortcut name in the table above.
4. Optionally set **Start in** to `C:\dev\managed-service-platform`.

| Shortcut name | Target field |
|---------------|-------------|
| Iniciar Plataforma Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\start-local.cmd"` |
| Revisar Entorno Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\check-local.cmd"` |
| Detener PostgreSQL Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\stop-postgres.cmd"` |

`cmd.exe /k` keeps the window open after the script finishes so you can read
any warnings or errors. Do not use `cmd.exe /c` (that closes immediately).

---

## Startup procedure

Follow these steps in order. The **Iniciar Plataforma Local** shortcut
automates steps 1–4.

### Step 1 — Start PostgreSQL

```cmd
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\dev\managed-service-platform-data\postgres-data" -l "C:\dev\managed-service-platform-data\postgres-log.txt"
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
`C:\dev\managed-service-platform-data\postgres-log.txt` before continuing.

### Step 3 — Start the application

```cmd
cd /d C:\dev\managed-service-platform
npm run dev
```

Expected output:

```
Server:   http://localhost:3000
Database: localhost:5432/managed_service_local
```

Leave this window open. The app runs in the foreground.

### Step 4 — Verify the health endpoint

Open a second CMD window and run:

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
| `app` | `running` | Process is up |
| `db` | `connected` | PostgreSQL connection succeeded |
| `ai` | `disabled` | No external AI calls will be made |

If `db` is `disconnected`, stop here. Check PostgreSQL is running (Step 2)
and that `DATABASE_PASSWORD` in `.env.local` is correct.

---

## Shutdown procedure

### Step 1 — Stop the application

In the window running `npm run dev`, press `Ctrl+C` and confirm if prompted.

### Step 2 — Stop PostgreSQL

Use the **Detener PostgreSQL Local** shortcut, or run:

```cmd
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "C:\dev\managed-service-platform-data\postgres-data"
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

## Helper scripts reference

| Script | What it does |
|--------|-------------|
| `scripts\start-local.cmd` | Starts PostgreSQL, waits, checks port 5432, then runs `npm run dev` |
| `scripts\stop-postgres.cmd` | Stops PostgreSQL and verifies port 5432 is closed |
| `scripts\check-local.cmd` | Checks Node.js, npm, pg_ctl, port 5432, project folder, package.json, .env.local, node_modules |

All scripts use absolute paths and can be run from any directory.

---

## Runtime data

All PostgreSQL data is stored outside the repository.
No runtime data is written inside `C:\dev\managed-service-platform`.

| What | Where |
|------|-------|
| PostgreSQL rows | `C:\dev\managed-service-platform-data\postgres-data` |
| PostgreSQL log | `C:\dev\managed-service-platform-data\postgres-log.txt` |
| Application logs | console output only (no log files at this stage) |

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
- Check `C:\dev\managed-service-platform-data\postgres-log.txt` for errors.

### Port 3000 already in use

Another process is using port 3000. Find and stop it:

```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

Or change `PORT` in `.env.local` to a free port (e.g. `3001`).

### pg_ctl not found or wrong version

Confirm PostgreSQL 18 is installed at `C:\Program Files\PostgreSQL\18`.
The scripts call `pg_ctl.exe` using its full absolute path, so it does not
need to be on the system PATH.
