import '../styles/globals.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LINKS = [
  { href: '/',           label: 'Inicio'     },
  { href: '/clientes',   label: 'Clientes'   },
  { href: '/casos',      label: 'Casos'      },
  { href: '/documentos', label: 'Documentos' },
  { href: '/tareas',     label: 'Tareas'     },
];

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <nav className="nav">
        <span className="nav-brand">Plataforma Local</span>
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link${router.pathname === href ? ' active' : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Component {...pageProps} />
    </>
  );
}
