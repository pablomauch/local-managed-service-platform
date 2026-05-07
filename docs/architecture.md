# Arquitectura

## Estado actual

Este es un **scaffold mínimo operativo**. La plataforma completa no está
construida aún. Este documento refleja el estado actual y las decisiones de
diseño que guiarán el desarrollo futuro.

---

## Topología de runtime

### Proceso único Next.js

La aplicación corre como un **único proceso Next.js en `http://localhost:3000`**.

- La UI y todas las rutas API son servidas por el mismo proceso.
- Las rutas API están bajo el prefijo `/api`
  (por ejemplo: `http://localhost:3000/api/health`).
- No existe un proceso backend separado. `BACKEND_URL` y `FRONTEND_URL`
  apuntan ambas a `http://localhost:3000`.
- No hay reverse proxy, contenedor ni service mesh en esta etapa.

### PostgreSQL

PostgreSQL es el único proceso local separado.

- Corre en `localhost:5432` por defecto.
- Se inicia manualmente con `pg_ctl` antes de arrancar la app o ejecutar
  migraciones.
- La base de datos se llama `managed_service_local`.
- Las credenciales de conexión se leen exclusivamente desde variables de
  entorno (`DATABASE_*` o `DATABASE_URL`).
- No hay credenciales hardcodeadas en el código fuente.
- Los datos runtime (filas, referencias a archivos futuros) se almacenan en
  la instancia PostgreSQL local y nunca salen de la máquina local.

**Instalación:** `C:\Program Files\PostgreSQL\18`
**Directorio de datos:** `C:\dev\managed-service-platform-data\postgres-data`
**Log:** `C:\dev\managed-service-platform-data\postgres-log.txt`

### Sin Docker, sin WSL

El scaffold corre de forma nativa en Windows usando Node.js y una instalación
local de PostgreSQL. Docker y WSL están explícitamente fuera de alcance.

---

## Configuración de entorno

- `.env.example` está commiteado y contiene únicamente valores de placeholder
  seguros. Es seguro para un repositorio público.
- `.env.local` se crea localmente copiando `.env.example` y completando con
  valores reales. Está en `.gitignore` y nunca debe commitearse.
- Los passwords, datos reales y datos de clientes deben existir únicamente
  en `.env.local` en la PC del desarrollador.

---

## Rutas API

Todas las rutas API están bajo el prefijo `/api` en la app Next.js.
El frontend lee `NEXT_PUBLIC_API_URL` (por defecto: `/api`) para construir
las peticiones, sin URLs hardcodeadas en el código cliente.

Rutas actuales:

| Prefijo | Recurso |
|---------|---------|
| `/api/health` | Estado del sistema |
| `/api/clients` | Clientes |
| `/api/cases` | Casos |
| `/api/documents` | Documentos |
| `/api/tasks` | Tareas |

---

## Base de datos — esquema actual

| Tabla | Descripción |
|-------|-------------|
| `clients` | Clientes de la plataforma |
| `cases` | Casos asociados a clientes |
| `documents` | Documentos asociados a casos |
| `tasks` | Tareas asociadas a casos |

Todos los IDs son `SERIAL PRIMARY KEY`. Los timestamps usan `TIMESTAMPTZ`.

---

## IA

La IA está deshabilitada por defecto y debe permanecer así para uso local.

| Variable | Valor |
|----------|-------|
| `LLM_PROVIDER` | `disabled` |
| `ALLOW_EXTERNAL_AI_CALLS` | `false` |
| `ALLOW_EXTERNAL_REQUESTS` | `false` |

La app no llama a Ollama, OpenAI ni ningún servicio externo de IA.

---

## Repositorio público — reglas de seguridad

El repositorio está en GitHub como repositorio **público**. Por eso:

- Nunca se commitea `.env.local` ni ningún archivo con credenciales reales.
- `.env.example` contiene únicamente placeholders (`CHANGE_ME`, `disabled`).
- No se incluyen datos de clientes, nombres corporativos ni información personal.
- No se incluyen volcados de base de datos ni archivos exportados.
- El código commiteado es genérico y no contiene lógica de negocio específica
  de ningún cliente.

Ver reglas completas en [`docs/security-rules.md`](security-rules.md).

---

## Datos runtime

Todo dato generado en tiempo de ejecución vive **fuera del repositorio**:

| Qué | Dónde |
|-----|-------|
| Filas PostgreSQL | directorio de datos de PostgreSQL |
| Futuros archivos subidos | `C:\dev\managed-service-platform-data` |
| Logs de la aplicación | salida de consola únicamente (por ahora) |

Nada dentro de `C:\dev\managed-service-platform` (el repositorio) cambia en
tiempo de ejecución.

---

## Directorio del proyecto

```
local-managed-service-platform/
├── scripts/
│   ├── build.js              # Verificador de sintaxis cross-platform
│   ├── check-local.cmd       # Validar entorno local
│   ├── start-local.cmd       # Iniciar PostgreSQL y el servidor
│   └── stop-postgres.cmd     # Detener PostgreSQL
├── src/
│   ├── server.js             # Punto de entrada Express (scaffold actual)
│   ├── db/
│   │   ├── connection.js     # Pool PostgreSQL
│   │   ├── migrate.js        # Runner de migraciones
│   │   └── schema.js         # Definición de tablas
│   ├── routes/
│   │   ├── health.js
│   │   ├── clients.js
│   │   ├── cases.js
│   │   ├── documents.js
│   │   └── tasks.js
│   └── public/
│       └── index.html        # UI de healthcheck
├── docs/
│   ├── architecture.md       # Este archivo
│   ├── backend-guidelines.md
│   ├── development-rules.md
│   ├── local-runbook.md
│   ├── security-rules.md
│   └── ui-guidelines.md
├── CLAUDE.md                 # Guía permanente para Claude Code
├── .env.example              # Placeholders seguros — se commitea
├── .gitignore
└── package.json
```
