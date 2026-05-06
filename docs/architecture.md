# Architecture

## Overview

This is a minimal local-only scaffold. The full platform is not yet built.
The purpose of this document is to record the constraints and decisions that
govern how the platform will be developed.

---

## Runtime topology

### Single Next.js process

The application runs as a **single Next.js process on `http://localhost:3000`**.

- The UI and all API routes are served by the same process.
- API routes are mounted under `/api` (e.g. `http://localhost:3000/api/health`).
- There is no separate backend process. `BACKEND_URL` and `FRONTEND_URL` both
  point to `http://localhost:3000`.
- There is no reverse proxy, container, or service mesh at this stage.

### PostgreSQL

PostgreSQL is the only separate local process.

- It runs on `localhost:5432` by default.
- It must be started manually with `pg_ctl` before the app or migrations run.
- The database name is `managed_service_local`.
- Connection credentials are read exclusively from environment variables
  (`DATABASE_*` or `DATABASE_URL`). No credentials are hardcoded in source code.
- Runtime data (rows, future file references) is stored in the local PostgreSQL
  instance and never leaves the local machine.

### No Docker, no WSL

The scaffold runs natively on Windows using Node.js and a local PostgreSQL
installation. Docker and WSL are explicitly out of scope.

---

## Environment configuration

- `.env.example` is committed and contains only safe placeholder values.
  It is safe for a public GitHub repository.
- `.env.local` is created locally by copying `.env.example` and filling in
  real values. It is listed in `.gitignore` and must never be committed.
- Real passwords, client names, and personal data must only ever exist in
  `.env.local` on the developer's local PC.

---

## API

All API routes are served under the `/api` prefix by the Next.js app.
The frontend reads `NEXT_PUBLIC_API_URL` (default: `/api`) to construct API
requests, so no hardcoded URLs appear in client code.

Current routes:

| Prefix | Resource |
|--------|---------|
| `/api/health` | Health check |
| `/api/clients` | Clients |
| `/api/cases` | Cases |
| `/api/documents` | Documents |
| `/api/tasks` | Tasks |

---

## AI

AI is disabled by default and must remain disabled for local lab use.

| Variable | Value |
|----------|-------|
| `LLM_PROVIDER` | `disabled` |
| `ALLOW_EXTERNAL_AI_CALLS` | `false` |
| `ALLOW_EXTERNAL_REQUESTS` | `false` |

The app must not call Ollama, OpenAI, or any external AI service unless these
variables are explicitly changed in a controlled environment.

---

## Public repository safety rules

This repository is public. The following must never be committed:

- `.env.local` or any file containing real passwords
- Database dumps or exports
- Client names, case data, or any personally identifiable information
- Corporate names or internal project names
- API keys, tokens, or secrets of any kind

`.env.example` must always contain only placeholder values (`CHANGE_ME`,
`disabled`, `false`, local hostnames). It must be safe to read by anyone.

---

## Runtime data

All runtime data lives outside the repository:

- PostgreSQL rows are stored in the local PostgreSQL data directory.
- Any future file uploads will be stored in a path outside the repository root.
- Nothing in the repository directory should change at runtime.
