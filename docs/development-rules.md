# Reglas de desarrollo

## Entorno de trabajo

- El entorno de desarrollo es **Windows** nativo.
- No usar Docker.
- No usar WSL (Windows Subsystem for Linux).
- No agregar comandos exclusivos de Linux (`chmod`, `export`, `source`,
  rutas con `/`, etc.).
- Usar rutas Windows con barras invertidas (`C:\dev\...`) en scripts y
  documentación.
- Los scripts de automatización deben ser archivos `.cmd` compatibles con
  CMD de Windows.

---

## Dependencias

- No agregar dependencias npm sin justificación explícita.
- Antes de instalar un paquete nuevo, verificar que no exista una solución
  con las dependencias ya instaladas.
- Documentar el motivo de cada dependencia nueva en el commit correspondiente.
- No instalar herramientas globales (herramientas de CLI globales) como
  requisito del proyecto.

---

## Tamaño de los cambios

- Mantener commits pequeños y revisables.
- No construir múltiples funcionalidades en un solo commit.
- Cada commit debe describir con precisión qué cambió y por qué.
- Preferir cambios incrementales sobre refactorizaciones masivas.

---

## Documentación

- Actualizar `README.md` cuando cambie el procedimiento de instalación,
  configuración o uso.
- Actualizar `docs/local-runbook.md` cuando cambien los pasos de inicio o
  apagado del entorno.
- Actualizar `docs/architecture.md` cuando cambie la arquitectura del sistema.
- Toda la documentación visible para el desarrollador puede estar en español.
- No dejar documentación desactualizada en el repositorio.

---

## Variables de entorno y configuración

- No modificar `.env.local`.
- No commitear `.env.local`.
- Si se agregan nuevas variables de entorno, agregarlas a `.env.example` con
  valores de placeholder y documentarlas.
- La aplicación debe arrancar con un error claro si faltan variables requeridas.

---

## Base de datos

- No agregar datos seed con información real.
- Si se necesitan datos de ejemplo, usar valores claramente ficticios y
  genéricos.
- Las migraciones deben ser idempotentes (`CREATE TABLE IF NOT EXISTS`).
- No ejecutar migraciones destructivas (DROP TABLE, ALTER TABLE con pérdida
  de datos) sin revisión explícita.

---

## Alcance de las funcionalidades

No agregar todavía sin aprobación explícita:

- Autenticación o gestión de usuarios.
- Carga real de archivos al sistema de archivos.
- Funcionalidades de IA o LLM.
- Roles o permisos.
- Dashboards complejos con gráficas.
- Automatización de workflows.
- Integraciones con servicios externos.
- Envío de emails.
- Notificaciones.

---

## Checklist de commit

Antes de cada `git commit`, verificar:

- [ ] `git diff --cached --name-only` no muestra `.env.local` ni archivos sensibles.
- [ ] No hay passwords, tokens ni secretos en los archivos modificados.
- [ ] No hay datos reales ni nombres corporativos.
- [ ] Los textos visibles para el usuario están en español.
- [ ] Los scripts nuevos usan solo comandos compatibles con Windows CMD.
- [ ] La documentación afectada fue actualizada.
- [ ] El mensaje del commit describe con precisión qué cambió.
