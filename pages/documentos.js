import { useState, useEffect } from 'react';

const FORM_VACIO = { case_id: '', file_name: '', document_type: 'otro', storage_path: '', status: 'activo' };

function badgeEstado(s) {
  return s === 'activo'
    ? <span className="badge badge-green">Activo</span>
    : <span className="badge badge-gray">Archivado</span>;
}

function badgeTipo(t) {
  const m = { contrato: 'badge-blue', informe: 'badge-yellow', otro: 'badge-gray' };
  const etiquetas = { contrato: 'Contrato', informe: 'Informe', otro: 'Otro' };
  return <span className={`badge ${m[t] || 'badge-gray'}`}>{etiquetas[t] || t}</span>;
}

function fecha(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('es-ES');
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState([]);
  const [casos, setCasos]           = useState([]);
  const [cargando, setCargando]     = useState(true);
  const [error, setError]           = useState('');
  const [exito, setExito]           = useState('');
  const [editando, setEditando]     = useState(null);
  const [form, setForm]             = useState(FORM_VACIO);
  const [guardando, setGuardando]   = useState(false);

  useEffect(() => { cargar(); cargarCasos(); }, []);

  async function cargar() {
    setCargando(true);
    try {
      const r = await fetch('/api/documents');
      setDocumentos(await r.json());
    } catch {
      setError('No se pudieron cargar los documentos.');
    } finally {
      setCargando(false);
    }
  }

  async function cargarCasos() {
    try {
      const r = await fetch('/api/cases');
      setCasos(await r.json());
    } catch { /* silencioso */ }
  }

  function iniciarEdicion(d) {
    setEditando(d);
    setForm({
      case_id:       String(d.case_id),
      file_name:     d.file_name,
      document_type: d.document_type,
      storage_path:  d.storage_path || '',
      status:        d.status,
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
    const url    = editando ? `/api/documents/${editando.id}` : '/api/documents';
    const method = editando ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const datos = await r.json();
      if (!r.ok) { setError(datos.error || 'Error al guardar.'); return; }
      setExito(editando ? 'Documento actualizado correctamente.' : 'Documento registrado correctamente.');
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
        <h1 className="page-title">Documentos</h1>
        <p className="page-desc">Registro de documentos asociados a los casos.</p>
      </div>

      <div className="card">
        <h2 className="card-title">{editando ? 'Editar documento' : 'Registrar documento'}</h2>
        {error && <div className="msg msg-error">{error}</div>}
        {exito && <div className="msg msg-success">{exito}</div>}
        <form onSubmit={guardar}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="d-case">Caso *</label>
              <select id="d-case" value={form.case_id}
                onChange={e => campo('case_id', e.target.value)} required>
                <option value="">— Seleccione un caso —</option>
                {casos.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="d-name">Nombre del archivo *</label>
              <input id="d-name" type="text" value={form.file_name}
                onChange={e => campo('file_name', e.target.value)}
                placeholder="Ej: contrato-servicio.pdf" required />
            </div>
            <div className="form-group">
              <label htmlFor="d-type">Tipo de documento</label>
              <select id="d-type" value={form.document_type}
                onChange={e => campo('document_type', e.target.value)}>
                <option value="contrato">Contrato</option>
                <option value="informe">Informe</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="d-status">Estado</label>
              <select id="d-status" value={form.status}
                onChange={e => campo('status', e.target.value)}>
                <option value="activo">Activo</option>
                <option value="archivado">Archivado</option>
              </select>
            </div>
            <div className="form-group full">
              <label htmlFor="d-path">Ruta de almacenamiento</label>
              <input id="d-path" type="text" value={form.storage_path}
                onChange={e => campo('storage_path', e.target.value)}
                placeholder="Ej: C:\documentos\cliente\archivo.pdf (opcional)" />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={guardando}>
                {guardando ? 'Guardando…' : (editando ? 'Guardar cambios' : 'Registrar documento')}
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
        <h2 className="card-title">Listado de documentos</h2>
        <div className="table-wrap">
          {cargando ? (
            <p className="empty">Cargando…</p>
          ) : documentos.length === 0 ? (
            <p className="empty">No hay documentos registrados aún.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Archivo</th>
                  <th>Tipo</th>
                  <th>Caso</th>
                  <th>Estado</th>
                  <th>Registrado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.file_name}</strong></td>
                    <td>{badgeTipo(d.document_type)}</td>
                    <td>{d.case_title || '—'}</td>
                    <td>{badgeEstado(d.status)}</td>
                    <td>{fecha(d.created_at)}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm"
                        onClick={() => iniciarEdicion(d)}>
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
