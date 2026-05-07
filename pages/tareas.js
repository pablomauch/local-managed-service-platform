import { useState, useEffect } from 'react';

const FORM_VACIO = { case_id: '', title: '', description: '', status: 'pendiente', due_date: '' };

function badgeEstado(s) {
  const m = {
    pendiente:   ['badge-yellow',  'Pendiente'],
    en_progreso: ['badge-blue',    'En progreso'],
    completada:  ['badge-green',   'Completada'],
  };
  const [clase, texto] = m[s] || ['badge-gray', s];
  return <span className={`badge ${clase}`}>{texto}</span>;
}

function fecha(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('es-ES');
}

export default function TareasPage() {
  const [tareas, setTareas]       = useState([]);
  const [casos, setCasos]         = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
  const [exito, setExito]         = useState('');
  const [editando, setEditando]   = useState(null);
  const [form, setForm]           = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); cargarCasos(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const r = await fetch('/api/tasks');
      if (!r.ok) {
        const datos = await r.json().catch(() => ({}));
        setError(datos.error || 'Error al obtener las tareas.');
        setTareas([]);
        return;
      }
      const datos = await r.json();
      setTareas(Array.isArray(datos) ? datos : []);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }

  async function cargarCasos() {
    try {
      const r = await fetch('/api/cases');
      if (!r.ok) return;
      const datos = await r.json();
      setCasos(Array.isArray(datos) ? datos : []);
    } catch { /* silencioso */ }
  }

  function iniciarEdicion(t) {
    setEditando(t);
    setForm({
      case_id:     String(t.case_id),
      title:       t.title,
      description: t.description || '',
      status:      t.status,
      due_date:    t.due_date ? t.due_date.substring(0, 10) : '',
    });
    setError('');
    setExito('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelar() {
    setEditando(null);
    setForm(FORM_VACIO);
    setError('');
    setExito('');
  }

  function campo(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function guardar(e) {
    e.preventDefault();
    setError('');
    setExito('');
    setGuardando(true);
    const url    = editando ? `/api/tasks/${editando.id}` : '/api/tasks';
    const method = editando ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const datos = await r.json();
      if (!r.ok) { setError(datos.error || 'Error al guardar.'); return; }
      setExito(editando ? 'Tarea actualizada correctamente.' : 'Tarea creada correctamente.');
      cancelar();
      cargar();
    } catch {
      setError('Error de conexión. Verifique que la aplicación esté activa.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Tareas</h1>
        <p className="page-desc">Tareas y seguimiento asociados a los casos.</p>
      </div>

      <div className="card">
        <h2 className="card-title">{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
        {error && <div className="msg msg-error">{error}</div>}
        {exito && <div className="msg msg-success">{exito}</div>}
        <form onSubmit={guardar}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="t-case">Caso *</label>
              <select id="t-case" value={form.case_id}
                onChange={e => campo('case_id', e.target.value)} required>
                <option value="">— Seleccione un caso —</option>
                {casos.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="t-title">Título *</label>
              <input id="t-title" type="text" value={form.title}
                onChange={e => campo('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="t-status">Estado</label>
              <select id="t-status" value={form.status}
                onChange={e => campo('status', e.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="t-due">Fecha de vencimiento</label>
              <input id="t-due" type="date" value={form.due_date}
                onChange={e => campo('due_date', e.target.value)} />
            </div>
            <div className="form-group full">
              <label htmlFor="t-desc">Descripción</label>
              <textarea id="t-desc" value={form.description}
                onChange={e => campo('description', e.target.value)}
                placeholder="Descripción opcional de la tarea" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : (editando ? 'Guardar cambios' : 'Crear tarea')}
              </button>
              {editando && (
                <button type="button" className="btn btn-secondary" onClick={cancelar}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="card">
        <h2 className="card-title">Listado de tareas</h2>
        <div className="table-wrap">
          {cargando ? (
            <p className="empty">Cargando…</p>
          ) : tareas.length === 0 ? (
            <p className="empty">No hay tareas registradas aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Caso</th>
                  <th>Estado</th>
                  <th>Vencimiento</th>
                  <th>Creada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td>{t.case_title || '—'}</td>
                    <td>{badgeEstado(t.status)}</td>
                    <td>{fecha(t.due_date)}</td>
                    <td>{fecha(t.created_at)}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => iniciarEdicion(t)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
