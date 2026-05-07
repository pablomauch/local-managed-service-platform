# Plataforma Local de Servicios Gestionados

Prototipo local para la gestión de clientes, casos, documentos y tareas.  
La aplicación corre como un único proceso Next.js en `http://localhost:3000`.

Para el procedimiento completo de inicio y apagado ver
[`docs/local-runbook.md`](docs/local-runbook.md).

---

## Requisitos previos

- [Node.js LTS](https://nodejs.org/) v20 o superior
- PostgreSQL 18 instalado en `C:\Program Files\PostgreSQL\18`
- Windows PowerShell o Command Prompt

Sin Docker. Sin WSL. Sin herramientas exclusivas de Linux.

---

## Arquitectura

La aplicación es un **único proceso Next.js en `http://localhost:3000`**.  
No existe un backend separado en otro puerto.

| Qué | Dónde |
|-----|-------|
| Aplicación completa (UI + API) | `http://localhost:3000` |
| Endpoints API | `http://localhost:3000/api` |
| PostgreSQL | proceso local, iniciado manualmente con `pg_ctl` |

Ver [`docs/architecture.md`](docs/architecture.md) para detalles completos.

---

## PostgreSQL: iniciar y detener

PostgreSQL **no** está configurado como servicio de Windows. Debe iniciarse manualmente.

Reemplazar `C:\dev\pg-data` con la ruta real del directorio de datos de PostgreSQL.

### PowerShell

```powershell
# Iniciar
pg_ctl start -D "C:\dev\managed-service-platform-data\postgres-data" -l "C:\dev\managed-service-platform-data\postgres-log.txt"

# Detener
pg_ctl stop -D "C:\dev\managed-service-platform-data\postgres-data"
```

### Command Prompt (CMD)

```cmd
:: Iniciar
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\dev\managed-service-platform-data\postgres-data" -l "C:\dev\managed-service-platform-data\postgres-log.txt"

:: Detener
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "C:\dev\managed-service-platform-data\postgres-data"
```

---

## Inicio rápido (Windows)

### 1. Clonar e instalar

```powershell
git clone https://github.com/pablomauch/local-managed-service-platform.git
cd local-managed-service-platform
npm install
```

### 2. Crear el archivo de entorno local

**PowerShell:**
```powershell
Copy-Item .env.example .env.local
```

**CMD:**
```cmd
copy .env.example .env.local
```

Abrir `.env.local` con cualquier editor de texto y reemplazar `CHANGE_ME` con
la contraseña real de PostgreSQL.

> **`.env.local` nunca debe commitearse ni subirse a GitHub.**  
> Contiene credenciales reales. El repositorio es público.  
> Los datos reales deben quedarse solo en la PC local.

### 3. Iniciar PostgreSQL

Iniciar PostgreSQL con `pg_ctl` antes de continuar (ver sección anterior).

### 4. Inicializar la base de datos

```powershell
npm run db:init
```

Salida esperada:

```
OK  clients
OK  cases
OK  documents
OK  tasks

Inicialización completa.
Base de datos: localhost:5432/managed_service_local
```

> Si las tablas ya existen, el comando no hace nada (es idempotente).

### 5. Iniciar la aplicación

```powershell
npm run dev
```

Salida esperada:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Módulos disponibles

| URL | Módulo |
|-----|--------|
| `http://localhost:3000/` | Inicio — accesos y estado del sistema |
| `http://localhost:3000/clientes` | CRUD de clientes |
| `http://localhost:3000/casos` | CRUD de casos |
| `http://localhost:3000/documentos` | CRUD de documentos |
| `http://localhost:3000/tareas` | CRUD de tareas |

---

## Verificar el healthcheck

```powershell
curl http://localhost:3000/api/health
```

Respuesta esperada:

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

## Scripts npm

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia la aplicación en modo desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm start` | Inicia la aplicación compilada |
| `npm run db:init` | Crea las tablas de la base de datos (idempotente) |
| `npm run db:migrate` | Runner de migraciones (alternativo) |

---

## Variables de entorno

La configuración se lee desde `.env.local` al iniciar. Nunca commitear `.env.local`.  
Ver `.env.example` para la lista completa con valores de ejemplo.

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `APP_URL` | `http://localhost:3000` | URL completa de la aplicación |
| `NEXT_PUBLIC_API_URL` | `/api` | Base de las rutas API |
| `DATABASE_HOST` | `localhost` | Host de PostgreSQL |
| `DATABASE_PORT` | `5432` | Puerto de PostgreSQL |
| `DATABASE_NAME` | — | Nombre de la base de datos (requerido) |
| `DATABASE_USER` | — | Usuario de PostgreSQL |
| `DATABASE_PASSWORD` | — | Contraseña — solo en `.env.local` |
| `DATABASE_URL` | — | URL completa (reemplaza las variables individuales) |
| `LLM_PROVIDER` | `disabled` | Proveedor de IA — mantener en `disabled` |

---

## Endpoints API

Todos los endpoints son servidos por el proceso Next.js en `http://localhost:3000/api`.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Verificación de estado del sistema |
| GET | `/api/clients` | Listar clientes |
| POST | `/api/clients` | Crear cliente |
| GET | `/api/clients/:id` | Obtener cliente |
| PUT | `/api/clients/:id` | Actualizar cliente |
| GET | `/api/cases` | Listar casos |
| POST | `/api/cases` | Crear caso |
| GET | `/api/cases/:id` | Obtener caso |
| PUT | `/api/cases/:id` | Actualizar caso |
| GET | `/api/documents` | Listar documentos |
| POST | `/api/documents` | Registrar documento |
| GET | `/api/documents/:id` | Obtener documento |
| PUT | `/api/documents/:id` | Actualizar documento |
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/:id` | Obtener tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |

---

## Datos y seguridad

- Todos los datos runtime (filas de PostgreSQL) se almacenan localmente.
- El repositorio es **público**. Nunca subir `.env.local`, dumps de base de datos
  ni datos reales a GitHub.
- Los datos reales de clientes deben quedarse solo en la PC local.

---

## Scripts de ayuda (Windows CMD)

| Script | Propósito |
|--------|-----------|
| `scripts\start-local.cmd` | Iniciar PostgreSQL y el servidor |
| `scripts\stop-postgres.cmd` | Detener PostgreSQL |
| `scripts\check-local.cmd` | Validar el entorno local |

---

## Estructura del proyecto

```
local-managed-service-platform/
├── lib/
│   └── db.js                 # Pool PostgreSQL singleton (Next.js)
├── pages/
│   ├── _app.js               # Layout con navegación
│   ├── index.js              # Página de inicio
│   ├── clientes.js           # CRUD clientes
│   ├── casos.js              # CRUD casos
│   ├── documentos.js         # CRUD documentos
│   ├── tareas.js             # CRUD tareas
│   └── api/
│       ├── health.js
│       ├── clients/
│       ├── cases/
│       ├── documents/
│       └── tasks/
├── styles/
│   └── globals.css
├── src/db/
│   ├── connection.js         # Pool PostgreSQL (scripts)
│   ├── init.js               # Script db:init
│   ├── migrate.js            # Script db:migrate
│   └── schema.js             # Definición de tablas
├── scripts/
│   ├── check-local.cmd
│   ├── start-local.cmd
│   └── stop-postgres.cmd
├── docs/
│   ├── architecture.md
│   ├── backend-guidelines.md
│   ├── development-rules.md
│   ├── local-runbook.md
│   ├── security-rules.md
│   └── ui-guidelines.md
├── CLAUDE.md
├── .env.example
├── next.config.js
└── package.json
```
