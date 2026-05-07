# Guía de desarrollo de backend

## Base de datos

- Usar exclusivamente **PostgreSQL** como motor de base de datos.
- No usar SQLite, archivos JSON ni ninguna otra base de datos.
- La conexión se configura mediante variables de entorno leídas desde `.env.local`.
- Nunca hardcodear credenciales, hosts, puertos ni nombres de base de datos en
  el código fuente.
- Usar `DATABASE_URL` o las variables individuales `DATABASE_HOST`,
  `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`.

---

## Conexión a la base de datos

- Usar un pool de conexiones (`pg.Pool`) con instancia singleton.
- Inicializar el pool en `src/db/connection.js` (o equivalente en Next.js).
- El pool lee la configuración exclusivamente desde variables de entorno.
- Si las variables requeridas no están presentes al arrancar, el proceso debe
  salir con un mensaje de error claro antes de aceptar peticiones.

---

## API routes

- Todos los endpoints bajo el prefijo `/api`.
- Usar los métodos HTTP correctamente:
  - `GET` para leer recursos.
  - `POST` para crear recursos.
  - `PUT` / `PATCH` para actualizar recursos.
  - `DELETE` para eliminar recursos (cuando corresponda).
- Las rutas dentro de Next.js viven en `pages/api/` o `app/api/` según la
  versión del router utilizada.
- No crear un servidor Express separado ni un proceso backend independiente.

---

## Validación de entrada

- Validar todos los campos requeridos en cada endpoint antes de ejecutar
  consultas a la base de datos.
- Rechazar peticiones inválidas con código HTTP `400` y mensaje descriptivo.
- Usar consultas parametrizadas (`$1`, `$2`, ...) para evitar SQL injection.
- No confiar en que el cliente envíe datos correctos.

---

## Manejo de errores

- Responder siempre con JSON: `{ "error": "descripción del error" }`.
- Usar códigos HTTP apropiados:
  - `400` — datos de entrada inválidos.
  - `404` — recurso no encontrado.
  - `500` — error interno del servidor.
- No exponer mensajes de excepción internos, rutas del sistema de archivos ni
  detalles de la base de datos en las respuestas de error.
- Registrar errores detallados en consola (servidor), no en la respuesta HTTP.

---

## Esquema de base de datos

- Definir el esquema en `src/db/schema.js` (o equivalente).
- Usar `CREATE TABLE IF NOT EXISTS` para que las migraciones sean idempotentes.
- Tipos de columna preferidos en PostgreSQL:
  - Identificadores: `SERIAL PRIMARY KEY`
  - Texto: `TEXT`
  - Timestamps: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - Fechas opcionales: `DATE`
- Definir claves foráneas explícitamente con `FOREIGN KEY ... REFERENCES`.

---

## Scripts de base de datos

- El script `npm run db:migrate` ejecuta `src/db/migrate.js` y crea o actualiza
  las tablas.
- Cargar `.env.local` al inicio del script con `dotenv.config({ path: '.env.local' })`.
- El script debe informar qué tablas fueron procesadas y terminar con un
  mensaje de éxito o error claro.

---

## Healthcheck

- Mantener siempre operativo el endpoint `GET /api/health`.
- Debe verificar la conexión a PostgreSQL con una consulta simple (`SELECT 1`).
- Debe reportar el estado de la IA (`LLM_PROVIDER`).
- No exponer la contraseña de la base de datos ni ningún secreto en la respuesta.
- Respuesta esperada:

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

## Alcance actual del backend

Por ahora el backend vive completamente dentro de las API routes de Next.js.
No agregar:

- Un servidor Express separado.
- Un proceso backend en otro puerto.
- Middleware de autenticación.
- Carga real de archivos al sistema de archivos.
- Llamadas a servicios externos de IA.
- Colas de tareas o workers en background.
