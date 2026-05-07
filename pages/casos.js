import { useState, useEffect } from 'react';

const FORM_VACIO = { client_id: '', title: '', description: '', status: 'abierto', priority: 'media' };

function badgeEstado(s) {
  const m = { abierto: ['badge-blue','Abierto'], en_progreso: ['badge-yellow','En progreso'], cerrado: ['badge-gray','Cerrado'] };
  const [clase, texto] = m[s] || ['badge-gray', s];
  return <span className={`badge ${clase}`}>{texto}</span>;
}

function badgePrioridad(p) {
  const m = { alta: ['badge-red','Alta'], media: ['badge-yellow','Media'], baja: ['badge-gray','Baja'] };
  const [clase, texto] = m[p] || ['badge-gray', p];
  return <span className={`badge ${clase}`}>{texto}</span>;
}

function fecha(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('es-ES');
}

export default function CasosPage() {
  const [casos, setCasos]         = useState([]);
  const [clientes, setClientes]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
  const [exito, setExito]         = useState('');
  const [editando, setEditando]   = useState(null);
  const [form, setForm]           = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); cargarClientes(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const r = await fetch('/api/cases');
      setCasos(await r.json());
    } catch {
      setError('No se pudieron cargar los casos.');
    } finally {
      setCargando(false);
    }
  }

  async function cargarClientes() {
    try {
      const r = await fetch('/api/clients');
      setClientes(await r.json());
    } catch { /* silencioso */ }
  }

  function iniciarEdicion(c) {
    setEditando(c);
    setForm({
      client_id:   String(c.client_id),
      title:       c.title,
      description: c.description || '',
      status:      c.status,
      priority:    c.priority,
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
    const url    = editando ? `/api/cases/${editando.id}` : '/api/cases';
    const method = editando ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const datos = await r.json();
      if (!r.ok) { setError(datos.error || 'Error al guardar.'); return; }
      setExito(editando ? 'Caso actualizado correctamente.' : 'Caso creado correctamente.');
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
        <h1 className="page-title">Casos</h1>
        <p className="page-desc">Casos asociados a los clientes de la plataforma.</p>
      </div>

      <div className="card">
        <h2 className="card-title">{editando ? 'Editar caso' : 'Nuevo caso'}</h2>
        {error && <div className="msg msg-error">{error}</div>}
        {exito && <div className="msg msg-success">{exito}</div>}
        <form onSubmit={guardar}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ca-client">Cliente *</label>
              <select id="ca-client" value={form.client_id}
                onChange={e => campo('client_id', e.target.value)} required>
                <option value="">— Seleccione un cliente —</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ca-title">Título *</label>
              <input id="ca-title" type="text" value={form.title}
                onChange={e => campo('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="ca-status">Estado</label>
              <select id="ca-status" value={form.status}
                onChange={e => campo('status', e.target.value)}>
                <option value="abierto">Abierto</option>
                <option value="en_progreso">En progreso</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ca-priority">Prioridad</label>
              <select id="ca-priority" value={form.priority}
                onChange={e => campo('priority', e.target.value)}>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div className="form-group full">
              <label htmlFor="ca-desc">Descripción</label>
              <textarea id="ca-desc" value={form.description}
                onChange={e => campo('description', e.target.value)}
                placeholder="Descripción opcional del caso" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : (editando ? 'Guardar cambios' : 'Crear caso')}
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
        <h2 className="card-title">Listado de casos</h2>
        <div className="table-wrap">
          {cargando ? (
            <p className="empty">Cargando…</p>
          ) : casos.length === 0 ? (
            <p className="empty">No hay casos registrados aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {casos.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.title}</strong></td>
                    <td>{c.client_name || '—'}</td>
                    <td>{badgeEstado(c.status)}</td>
                    <td>{badgePrioridad(c.priority)}</td>
                    <td>{fecha(c.created_at)}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => iniciarEdicion(c)}>
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
