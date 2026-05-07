# Reglas de seguridad

## Repositorio público

Este repositorio está en GitHub como repositorio **público**. Cualquier persona
puede leer su contenido. Por eso se aplican las siguientes reglas sin excepción.

---

## Lo que nunca debe commitearse

- `.env.local` — contiene credenciales reales. Está en `.gitignore`.
- Passwords, tokens, API keys o secretos de cualquier tipo.
- Datos reales de clientes, datos corporativos o información personal.
- Volcados o exportaciones de la base de datos.
- Archivos de log que puedan contener datos sensibles.
- Cualquier archivo generado en tiempo de ejecución dentro del repo.

### Verificación antes de cada commit

```cmd
git diff --cached --name-only
```

Confirmar que ninguno de los archivos listados es sensible antes de proceder.

---

## Variables de entorno

- `.env.example` contiene únicamente valores de placeholder seguros
  (`CHANGE_ME`, `disabled`, `false`, hostnames locales).
- `.env.local` existe solo en la PC local del desarrollador y nunca se sube.
- Las variables de entorno se leen en tiempo de ejecución; no se hardcodean
  en el código fuente.
- Si se agregan nuevas variables, agregarlas a `.env.example` con placeholder,
  documentarlas en el README y en esta guía si corresponde.

---

## Datos en el repositorio

- No agregar datos seed con información real.
- Si se necesitan datos de prueba, usar ejemplos genéricos y claramente
  ficticios: "Cliente de ejemplo", "Caso de prueba 001", etc.
- No incluir nombres corporativos ni nombres de clientes reales en ningún
  archivo commiteado.

---

## Datos runtime

- Los datos runtime (filas de PostgreSQL, futuros archivos subidos) viven
  exclusivamente en la PC local fuera del repositorio:
  `C:\dev\managed-service-platform-data`.
- Nada dentro de `C:\dev\managed-service-platform` (el repositorio) debe
  cambiar en tiempo de ejecución.

---

## Servicios externos

- No llamar a servicios externos por defecto.
- `ALLOW_EXTERNAL_REQUESTS=false` y `ALLOW_EXTERNAL_AI_CALLS=false` deben
  mantenerse en `false` salvo aprobación explícita.
- La IA permanece deshabilitada (`LLM_PROVIDER=disabled`).
- No integrar Ollama, OpenAI, ni ningún otro proveedor de IA sin aprobación.
- No agregar integraciones con servicios de terceros (webhooks, APIs externas,
  servicios de email, etc.) sin aprobación explícita.

---

## Seguridad en los endpoints API

- Usar siempre consultas parametrizadas para evitar SQL injection.
- No exponer mensajes de excepción internos, rutas del sistema de archivos ni
  detalles de la base de datos en las respuestas HTTP de error.
- No exponer la contraseña de la base de datos ni ningún secreto en respuestas
  de la API, incluyendo `/api/health`.
- Validar todos los datos de entrada antes de procesarlos.

---

## .gitignore

El archivo `.gitignore` debe proteger siempre:

- `.env.local` y cualquier variante de `.env.*` excepto `.env.example`.
- `node_modules/`.
- Archivos de build y caché.
- Archivos de log.

Verificar que `.gitignore` esté actualizado si se agregan nuevos tipos de
archivos al proyecto.
