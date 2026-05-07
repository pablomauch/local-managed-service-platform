const CREATE_CLIENTS = `
  CREATE TABLE IF NOT EXISTS clients (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'activo',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

const CREATE_CASES = `
  CREATE TABLE IF NOT EXISTS cases (
    id          SERIAL PRIMARY KEY,
    client_id   INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'abierto',
    priority    TEXT NOT NULL DEFAULT 'media',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (client_id) REFERENCES clients(id)
  )
`;

const CREATE_DOCUMENTS = `
  CREATE TABLE IF NOT EXISTS documents (
    id            SERIAL PRIMARY KEY,
    case_id       INTEGER NOT NULL,
    file_name     TEXT NOT NULL,
    document_type TEXT NOT NULL DEFAULT 'otro',
    storage_path  TEXT,
    status        TEXT NOT NULL DEFAULT 'activo',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (case_id) REFERENCES cases(id)
  )
`;

const CREATE_TASKS = `
  CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    case_id     INTEGER NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'pendiente',
    due_date    DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (case_id) REFERENCES cases(id)
  )
`;

module.exports = { CREATE_CLIENTS, CREATE_CASES, CREATE_DOCUMENTS, CREATE_TASKS };
