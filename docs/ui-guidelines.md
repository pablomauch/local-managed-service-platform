# Guía de interfaz de usuario

## Principios generales

- Toda la interfaz visible para el usuario debe estar en **español**.
- El diseño debe ser **limpio, sobrio y profesional**.
- Evitar estética recargada, colores agresivos o efectos innecesarios.
- Priorizar legibilidad y claridad sobre decoración.

---

## Idioma

- Títulos, etiquetas, botones, mensajes de error y texto de ayuda: en español.
- Nombres internos de tablas, campos y variables: pueden mantenerse en inglés
  por consistencia técnica (`clients`, `cases`, `documents`, `tasks`).
- Los textos que el usuario lee en pantalla siempre en español.

---

## Layout

- Usar un layout de página consistente con encabezado, área de contenido y
  navegación simple.
- Las páginas de listado muestran una tabla o lista de registros y un botón
  para crear nuevo registro.
- Los formularios de creación y edición son simples, con campos etiquetados
  claramente y un botón de acción primario.
- No usar modales complejos si un formulario en la misma página o en una
  página separada es suficiente.

---

## Componentes

### Tablas

- Columnas con encabezados descriptivos en español.
- Filas con datos legibles; fechas en formato `DD/MM/AAAA` o ISO según contexto.
- Botón de acción por fila (por ejemplo: "Editar") visible y accesible.
- Mensaje explícito cuando la tabla está vacía: "No hay registros aún."

### Formularios

- Cada campo tiene una etiqueta (`<label>`) en español.
- Campos obligatorios indicados claramente.
- Botón de envío con texto descriptivo: "Guardar", "Crear", "Actualizar".
- Botón de cancelar o volver cuando corresponda.

### Botones

- Texto claro y accionable: "Crear cliente", "Guardar cambios", "Volver".
- Botones primarios para la acción principal.
- No usar solo íconos sin texto en acciones críticas.

### Mensajes de error y estado

- Errores mostrados cerca del campo o en un área visible de la página.
- Texto en español comprensible: "Este campo es obligatorio.",
  "No se pudo conectar a la base de datos."
- No exponer mensajes técnicos internos al usuario.

### Estados de carga

- Indicar visualmente cuando una operación está en progreso.
- Deshabilitar el botón de envío mientras se procesa la solicitud.

---

## Consistencia entre módulos

Los cuatro módulos (Clientes, Casos, Documentos, Tareas) deben seguir el
mismo patrón visual:

| Elemento | Patrón |
|----------|--------|
| Página de listado | Título del módulo + tabla + botón "Crear nuevo" |
| Página de detalle/edición | Formulario con campos del registro + "Guardar" + "Volver" |
| Mensajes de estado | Mismo estilo visual en todos los módulos |
| Colores de estado | Consistentes: verde = activo/completado, amarillo = pendiente, rojo = error |

---

## Frameworks visuales

- Usar los estilos disponibles en el proyecto antes de agregar un nuevo
  framework.
- Si se necesita agregar Tailwind CSS, shadcn/ui u otro framework, justificarlo
  explícitamente y aprobarlo antes de instalarlo.
- No mezclar múltiples sistemas de estilos en el mismo proyecto.

---

## Página de inicio

- La página principal (`/`) muestra accesos directos a los cuatro módulos y
  al estado del sistema.
- Cards o enlaces claramente etiquetados en español.
- Sin contenido de relleno ni datos de demostración visibles en producción.
