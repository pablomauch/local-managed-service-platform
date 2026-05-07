# Manual de operación local

Procedimiento paso a paso para iniciar y apagar el entorno de desarrollo local.

---

## Rutas del sistema

| Qué | Ruta |
|-----|------|
| Instalación PostgreSQL | `C:\Program Files\PostgreSQL\18` |
| Directorio de datos PostgreSQL | `C:\dev\managed-service-platform-data\postgres-data` |
| Log de PostgreSQL | `C:\dev\managed-service-platform-data\postgres-log.txt` |
| Directorio de la aplicación | `C:\dev\managed-service-platform` |

PostgreSQL **no** está configurado como servicio de Windows.
Debe iniciarse manualmente en cada sesión.

---

## Atajos de escritorio

Tres atajos cubren las tareas más comunes. Cada uno abre una ventana CMD
que permanece abierta (`cmd.exe /k`) para poder leer la salida.

| Atajo | Script | Propósito |
|-------|--------|-----------|
| Iniciar Plataforma Local | `scripts\start-local.cmd` | Iniciar PostgreSQL y el servidor |
| Revisar Entorno Local | `scripts\check-local.cmd` | Validar Node, npm, pg_ctl, puerto, carpeta |
| Detener PostgreSQL Local | `scripts\stop-postgres.cmd` | Detener PostgreSQL |

### Cómo crear o recrear un atajo

1. Clic derecho en el Escritorio → **Nuevo → Acceso directo**.
2. Pegar el destino correspondiente de la tabla siguiente.
3. Asignar el nombre del atajo.
4. Opcionalmente, configurar **Iniciar en**: `C:\dev\managed-service-platform`.

| Atajo | Destino |
|-------|---------|
| Iniciar Plataforma Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\start-local.cmd"` |
| Revisar Entorno Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\check-local.cmd"` |
| Detener PostgreSQL Local | `cmd.exe /k "C:\dev\managed-service-platform\scripts\stop-postgres.cmd"` |

Usar `cmd.exe /k` (no `/c`) para que la ventana permanezca abierta.

---

## Procedimiento de inicio

Los pasos 1–4 están automatizados en el atajo **Iniciar Plataforma Local**.

### Paso 1 — Iniciar PostgreSQL

```cmd
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" start -D "C:\dev\managed-service-platform-data\postgres-data" -l "C:\dev\managed-service-platform-data\postgres-log.txt"
```

Salida esperada:

```
waiting for server to start.... done
server started
```

Si dice `server is already running`, continuar al paso 2.

### Paso 2 — Verificar que el puerto 5432 está escuchando

```cmd
netstat -an | findstr :5432
```

Salida esperada:

```
  TCP    0.0.0.0:5432           0.0.0.0:0              LISTENING
```

Si el puerto no aparece, PostgreSQL no inició correctamente.
Revisar el log: `C:\dev\managed-service-platform-data\postgres-log.txt`.

### Paso 3 — Iniciar la aplicación

```cmd
cd /d C:\dev\managed-service-platform
npm run dev
```

Salida esperada:

```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

Dejar esta ventana abierta. La aplicación corre en primer plano.

### Paso 4 — Verificar el healthcheck

Abrir una segunda ventana CMD y ejecutar:

```cmd
curl -s http://localhost:3000/api/health
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

| Campo | Valor esperado | Significado |
|-------|---------------|-------------|
| `status` | `ok` | La aplicación inició sin errores |
| `app` | `running` | El proceso Next.js está activo |
| `db` | `connected` | La conexión a PostgreSQL funcionó |
| `ai` | `disabled` | No se realizarán llamadas externas de IA |

Si `db` es `disconnected`, verificar PostgreSQL (paso 2) y que
`DATABASE_PASSWORD` en `.env.local` sea correcto.

---

## Inicializar la base de datos (primera vez)

Ejecutar una sola vez, o cuando se reinicie con una base de datos vacía:

```cmd
cd /d C:\dev\managed-service-platform
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

El comando es idempotente: si las tablas ya existen no hace cambios.

---

## Cargar datos de demostración (opcional)

Ejecutar después de `db:init` para poblar la base con datos ficticios:

```cmd
cd /d C:\dev\managed-service-platform
npm run db:seed
```

Salida esperada:

```
Insertando clientes demo...
OK  10 clientes
Insertando casos demo...
OK  10 casos
Insertando documentos demo...
OK  10 documentos
Insertando tareas demo...
OK  10 tareas

Carga de datos demo completada.
Base de datos: localhost:5432/managed_service_local

NOTA: Los datos insertados son ficticios y sirven solo para demostración.
      No representan personas, empresas ni clientes reales.
```

El comando es idempotente: si los datos demo ya existen no inserta duplicados.

> **Los datos demo son completamente ficticios.** Nombres como "Cliente Demo 01",
> "Caso Demo 01", etc. No representan personas, empresas ni clientes reales.  
> No commitear exportaciones ni dumps de la base de datos.  
> `.env.local` nunca debe commitearse — contiene credenciales reales.  
> El repositorio es público.

---

## Acceder a los módulos CRUD

Con la aplicación corriendo, abrir en el navegador:

| URL | Módulo |
|-----|--------|
| `http://localhost:3000/` | Inicio y estado del sistema |
| `http://localhost:3000/clientes` | Gestión de clientes |
| `http://localhost:3000/casos` | Gestión de casos |
| `http://localhost:3000/documentos` | Registro de documentos |
| `http://localhost:3000/tareas` | Gestión de tareas |

---

## Procedimiento de apagado

### Paso 1 — Detener la aplicación

En la ventana donde corre `npm run dev`, presionar `Ctrl+C` y confirmar.

### Paso 2 — Detener PostgreSQL

Usar el atajo **Detener PostgreSQL Local**, o ejecutar:

```cmd
"C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe" stop -D "C:\dev\managed-service-platform-data\postgres-data"
```

Salida esperada:

```
waiting for server to shut down.... done
server stopped
```

### Paso 3 — Verificar que el puerto 5432 está cerrado

```cmd
netstat -an | findstr :5432
```

Salida esperada: sin líneas. Si aún aparece, esperar unos segundos y repetir.

---

## Referencia de scripts

| Script | Qué hace |
|--------|---------|
| `scripts\start-local.cmd` | Inicia PostgreSQL, espera, verifica puerto 5432, luego ejecuta `npm run dev` |
| `scripts\stop-postgres.cmd` | Detiene PostgreSQL y verifica que el puerto 5432 se cerró |
| `scripts\check-local.cmd` | Verifica Node.js, npm, pg_ctl, puerto 5432, carpeta del proyecto, package.json, .env.local, node_modules |

Todos los scripts usan rutas absolutas y pueden ejecutarse desde cualquier directorio.

---

## Datos y seguridad

Todos los datos PostgreSQL están almacenados fuera del repositorio.
Nada dentro de `C:\dev\managed-service-platform` cambia en tiempo de ejecución.

| Qué | Dónde |
|-----|-------|
| Filas de PostgreSQL | `C:\dev\managed-service-platform-data\postgres-data` |
| Log de PostgreSQL | `C:\dev\managed-service-platform-data\postgres-log.txt` |
| Logs de la aplicación | salida de consola únicamente |

> **`.env.local` nunca debe commitearse ni subirse a GitHub.**  
> El repositorio es público. Los datos reales y las contraseñas deben
> quedarse solo en la PC local.

---

## Resolución de problemas

### La aplicación termina inmediatamente con "Database is not configured"

`.env.local` no existe o `DATABASE_NAME` no está configurado.  
Copiar `.env.example` a `.env.local` y completar los valores reales.

### El healthcheck responde `db: disconnected`

- Confirmar que PostgreSQL está corriendo: `netstat -an | findstr :5432`
- Confirmar que `DATABASE_PASSWORD` en `.env.local` coincide con la contraseña del usuario PostgreSQL.
- Revisar el log: `C:\dev\managed-service-platform-data\postgres-log.txt`.

### El puerto 3000 ya está en uso

Otro proceso está usando el puerto 3000. Identificarlo y detenerlo:

```cmd
netstat -ano | findstr :3000
taskkill /PID <pid> /F
```

O cambiar `PORT` en `.env.local` a un puerto libre (por ejemplo `3001`).

### pg_ctl no se encuentra

Los scripts de ayuda usan la ruta absoluta
`C:\Program Files\PostgreSQL\18\bin\pg_ctl.exe`.  
Verificar que PostgreSQL 18 está instalado en esa ruta.

### La UI muestra "Las tablas no existen en la base de datos"

`npm run db:init` no se ha ejecutado aún, o se ejecutó contra una base de datos diferente.

```cmd
cd /d C:\dev\managed-service-platform
npm run db:init
```

### La UI muestra "Error de autenticación con la base de datos"

`DATABASE_PASSWORD` en `.env.local` es incorrecto, o `DATABASE_URL` todavía tiene
el valor `CHANGE_ME` del template.  
Editar `.env.local` y corregir la contraseña.

### La UI muestra "No se pudo conectar a la base de datos"

PostgreSQL no está corriendo. Verificar con:

```cmd
netstat -an | findstr :5432
```

Si no aparece el puerto, iniciar PostgreSQL (ver Paso 1 del procedimiento de inicio).

### npm run db:seed no inserta datos

Verificar que `npm run db:init` se ejecutó primero.  
Si los datos demo ya existen, el script no inserta duplicados y muestra:
`Los datos demo ya existen. No se insertaron duplicados.`  
Esto es el comportamiento correcto.
