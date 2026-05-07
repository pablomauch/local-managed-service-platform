import { useState, useEffect } from 'react';

const FORM_VACIO = { name: '', description: '', status: 'activo' };

function badgeCliente(status) {
  const clase = status === 'activo' ? 'badge-green' : 'badge-gray';
  const texto = status === 'activo' ? 'Activo' : 'Inactivo';
  return <span className={`badge ${clase}`}>{texto}</span>;
}

function fecha(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('es-ES');
}

export default function ClientesPage() {
  const [clientes, setClientes]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState('');
  const [exito, setExito]         = useState('');
  const [editando, setEditando]   = useState(null);
  const [form, setForm]           = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const r = await fetch('/api/clients');
      if (!r.ok) {
        const datos = await r.json().catch(() => ({}));
        setError(datos.error || 'Error al obtener los clientes.');
        setClientes([]);
        return;
      }
      const datos = await r.json();
      setClientes(Array.isArray(datos) ? datos : []);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  }

  function iniciarEdicion(c) {
    setEditando(c);
    setForm({ name: c.name, description: c.description || '', status: c.status });
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
    const url    = editando ? `/api/clients/${editando.id}` : '/api/clients';
    const method = editando ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const datos = await r.json();
      if (!r.ok) { setError(datos.error || 'Error al guardar.'); return; }
      cancelar();
      setExito(editando ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.');
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
        <h1 className="page-title">Clientes</h1>
        <p className="page-desc">Gestión de clientes de la plataforma.</p>
      </div>

      <div className="card">
        <h2 className="card-title">{editando ? 'Editar cliente' : 'Nuevo cliente'}</h2>
        {error && <div className="msg msg-error">{error}</div>}
        {exito && <div className="msg msg-success">{exito}</div>}
        <form onSubmit={guardar}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="c-name">Nombre *</label>
              <input id="c-name" type="text" value={form.name}
                onChange={e => campo('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="c-status">Estado</label>
              <select id="c-status" value={form.status}
                onChange={e => campo('status', e.target.value)}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="form-group full">
              <label htmlFor="c-desc">Descripción</label>
              <textarea id="c-desc" value={form.description}
                onChange={e => campo('description', e.target.value)}
                placeholder="Descripción opcional del cliente" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : (editando ? 'Guardar cambios' : 'Crear cliente')}
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
        <h2 className="card-title">Listado de clientes</h2>
        <div className="table-wrap">
          {cargando ? (
            <p className="empty">Cargando…</p>
          ) : clientes.length === 0 ? (
            <p className="empty">No hay clientes registrados aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.description || '—'}</td>
                    <td>{badgeCliente(c.status)}</td>
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
