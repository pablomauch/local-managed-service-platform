# CLAUDE.md — Guía permanente para tareas de Claude Code

Este archivo define las reglas permanentes que toda tarea de Claude Code
debe respetar en este repositorio. Leer antes de modificar cualquier archivo.

---

## Arquitectura actual

- Aplicación **Next.js** de proceso único corriendo en `http://localhost:3000`.
- Las rutas API están bajo `/api` dentro del mismo proceso.
- **No existe backend separado** en `localhost:4000` ni en ningún otro puerto.
- PostgreSQL corre localmente, iniciado manualmente con `pg_ctl`. No es un
  servicio de Windows.
- La configuración runtime se lee exclusivamente desde `.env.local`.
- La IA está **deshabilitada por defecto** (`LLM_PROVIDER=disabled`).
- El repositorio GitHub es **público**. Solo se commitea código genérico y
  documentación sin datos reales.
- Los datos runtime viven fuera del repositorio en
  `C:\dev\managed-service-platform-data`.

---

## Reglas de seguridad

- Nunca commitear `.env.local`.
- Nunca incluir passwords, tokens, API keys ni secretos en ningún archivo.
- Nunca incluir datos reales, datos corporativos ni nombres de clientes.
- No llamar servicios externos por defecto.
- No activar la IA sin aprobación explícita.
- Validar siempre que `.gitignore` proteja archivos sensibles antes de commitear.
- Los endpoints API no deben exponer mensajes de error con detalles internos
  del servidor ni rutas del sistema de archivos.

Ver reglas completas en [`docs/security-rules.md`](docs/security-rules.md).

---

## Reglas de UI

- Todo el texto visible para el usuario debe estar en **español**.
- Diseño limpio, sobrio y profesional. Sin estética recargada.
- Usar layout claro: cards, tablas simples, formularios legibles.
- Botones con textos claros y accionables.
- Mensajes de error comprensibles en español.
- No agregar frameworks visuales nuevos salvo necesidad justificada y aprobada.
- Mantener consistencia visual entre Clientes, Casos, Documentos y Tareas.

Ver guía completa en [`docs/ui-guidelines.md`](docs/ui-guidelines.md).

---

## Reglas de backend

- Usar solo PostgreSQL como base de datos.
- Leer credenciales exclusivamente desde variables de entorno.
- No hardcodear credenciales, puertos ni rutas de base de datos.
- Todos los endpoints bajo `/api`.
- Validar datos de entrada en cada endpoint.
- Responder errores con JSON claro: `{ "error": "mensaje descriptivo" }`.
- Mantener el backend dentro de las API routes de Next.js.
- No crear un proceso backend separado.

Ver guía completa en [`docs/backend-guidelines.md`](docs/backend-guidelines.md).

---

## Restricciones técnicas

- Solo comandos compatibles con **Windows CMD**.
- No agregar Docker.
- No agregar WSL.
- No usar comandos exclusivos de Linux.
- No agregar dependencias npm sin justificación explícita.
- No construir funcionalidades grandes en un solo cambio.
- No agregar autenticación, roles, carga real de archivos, dashboards complejos,
  automatización de workflows ni integraciones externas sin aprobación.

Ver reglas completas en [`docs/development-rules.md`](docs/development-rules.md).

---

## Checklist antes de commitear

Verificar cada punto antes de hacer `git commit`:

- [ ] No hay `.env.local` en los archivos staged.
- [ ] No hay passwords, tokens ni secretos en ningún archivo.
- [ ] No hay datos reales, nombres corporativos ni nombres de clientes.
- [ ] Los textos visibles para el usuario están en español.
- [ ] Los endpoints nuevos validan entrada y devuelven errores JSON.
- [ ] No se hardcodearon credenciales de base de datos.
- [ ] No se agregaron comandos exclusivos de Linux.
- [ ] No se rompió el healthcheck `/api/health`.
- [ ] La documentación afectada fue actualizada.
- [ ] El commit es pequeño y describe con precisión qué cambió.

---

## Qué no hacer

- No commitear `.env.local` bajo ninguna circunstancia.
- No agregar un servidor Express o backend separado mientras la app sea Next.js.
- No referenciar `localhost:4000` en documentación ni en código.
- No activar llamadas a Ollama, OpenAI ni ningún servicio de IA externo.
- No agregar datos seed con información real.
- No construir la plataforma completa de una sola vez.
- No saltear la actualización de documentación cuando cambia la arquitectura.
