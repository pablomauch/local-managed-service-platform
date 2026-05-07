import { useState, useEffect } from 'react';
import Link from 'next/link';

const MODULOS = [
  {
    href: '/clientes',
    icon: '👥',
    title: 'Clientes',
    desc: 'Gestión de clientes de la plataforma.',
  },
  {
    href: '/casos',
    icon: '📁',
    title: 'Casos',
    desc: 'Casos asociados a cada cliente.',
  },
  {
    href: '/documentos',
    icon: '📄',
    title: 'Documentos',
    desc: 'Registro de documentos por caso.',
  },
  {
    href: '/tareas',
    icon: '✅',
    title: 'Tareas',
    desc: 'Tareas y seguimiento por caso.',
  },
];

export default function Inicio() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'error' }));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Plataforma Local de Servicios Gestionados</h1>
        <p className="page-desc">
          Entorno de trabajo local para la gestión de clientes, casos, documentos y tareas.
        </p>
      </div>

      <div className="module-grid">
        {MODULOS.map(m => (
          <Link key={m.href} href={m.href} className="module-card">
            <span className="module-card-icon">{m.icon}</span>
            <span className="module-card-title">{m.title}</span>
            <span className="module-card-desc">{m.desc}</span>
          </Link>
        ))}
      </div>

      <div className="card">
        <h2 className="card-title">Estado del sistema</h2>
        {!health ? (
          <p className="empty">Verificando...</p>
        ) : (
          <div className="health-grid">
            <div className="health-item">
              <div className="health-label">Sistema</div>
              <div className={`health-value ${health.status === 'ok' ? 'ok' : 'error'}`}>
                {health.status === 'ok' ? 'Operativo' : 'Error'}
              </div>
            </div>
            <div className="health-item">
              <div className="health-label">Aplicación</div>
              <div className={`health-value ${health.app === 'running' ? 'ok' : 'error'}`}>
                {health.app === 'running' ? 'Activa' : 'Inactiva'}
              </div>
            </div>
            <div className="health-item">
              <div className="health-label">Base de datos</div>
              <div className={`health-value ${health.db === 'connected' ? 'ok' : 'error'}`}>
                {health.db === 'connected' ? 'Conectada' : 'Desconectada'}
              </div>
            </div>
            <div className="health-item">
              <div className="health-label">Inteligencia artificial</div>
              <div className="health-value">
                {health.ai === 'disabled' ? 'Deshabilitada' : health.ai}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
