require('dotenv').config({ path: '.env.local' });
const { getDb } = require('./connection');

// ---------------------------------------------------------------------------
// Datos demo ficticios — no representan personas, empresas ni clientes reales.
// Todos los nombres siguen el patrón "* Demo NN" para identificarlos como demo.
// ---------------------------------------------------------------------------

const DEMO_CLIENTS = [
  { name: 'Cliente Demo 01', description: 'Empresa de servicios ficticios número 1',  status: 'activo'   },
  { name: 'Cliente Demo 02', description: 'Empresa de servicios ficticios número 2',  status: 'activo'   },
  { name: 'Cliente Demo 03', description: 'Empresa de servicios ficticios número 3',  status: 'activo'   },
  { name: 'Cliente Demo 04', description: 'Empresa de servicios ficticios número 4',  status: 'activo'   },
  { name: 'Cliente Demo 05', description: 'Empresa de servicios ficticios número 5',  status: 'activo'   },
  { name: 'Cliente Demo 06', description: 'Empresa de servicios ficticios número 6',  status: 'inactivo' },
  { name: 'Cliente Demo 07', description: 'Empresa de servicios ficticios número 7',  status: 'activo'   },
  { name: 'Cliente Demo 08', description: 'Empresa de servicios ficticios número 8',  status: 'inactivo' },
  { name: 'Cliente Demo 09', description: 'Empresa de servicios ficticios número 9',  status: 'activo'   },
  { name: 'Cliente Demo 10', description: 'Empresa de servicios ficticios número 10', status: 'activo'   },
];

// clientIndex = índice en DEMO_CLIENTS (0-based)
const DEMO_CASES = [
  { clientIndex: 0, title: 'Caso Demo 01', description: 'Descripción ficticia del caso 1',  status: 'abierto',     priority: 'alta'  },
  { clientIndex: 0, title: 'Caso Demo 02', description: 'Descripción ficticia del caso 2',  status: 'en_progreso', priority: 'media' },
  { clientIndex: 1, title: 'Caso Demo 03', description: 'Descripción ficticia del caso 3',  status: 'abierto',     priority: 'baja'  },
  { clientIndex: 1, title: 'Caso Demo 04', description: 'Descripción ficticia del caso 4',  status: 'cerrado',     priority: 'media' },
  { clientIndex: 2, title: 'Caso Demo 05', description: 'Descripción ficticia del caso 5',  status: 'abierto',     priority: 'alta'  },
  { clientIndex: 3, title: 'Caso Demo 06', description: 'Descripción ficticia del caso 6',  status: 'en_progreso', priority: 'media' },
  { clientIndex: 4, title: 'Caso Demo 07', description: 'Descripción ficticia del caso 7',  status: 'abierto',     priority: 'baja'  },
  { clientIndex: 5, title: 'Caso Demo 08', description: 'Descripción ficticia del caso 8',  status: 'cerrado',     priority: 'alta'  },
  { clientIndex: 6, title: 'Caso Demo 09', description: 'Descripción ficticia del caso 9',  status: 'en_progreso', priority: 'media' },
  { clientIndex: 7, title: 'Caso Demo 10', description: 'Descripción ficticia del caso 10', status: 'abierto',     priority: 'baja'  },
];

// caseIndex = índice en DEMO_CASES (0-based)
const DEMO_DOCUMENTS = [
  { caseIndex: 0, file_name: 'Documento Demo 01.pdf', document_type: 'contrato', status: 'activo'    },
  { caseIndex: 0, file_name: 'Documento Demo 02.pdf', document_type: 'informe',  status: 'activo'    },
  { caseIndex: 1, file_name: 'Documento Demo 03.pdf', document_type: 'otro',     status: 'activo'    },
  { caseIndex: 2, file_name: 'Documento Demo 04.pdf', document_type: 'contrato', status: 'archivado' },
  { caseIndex: 2, file_name: 'Documento Demo 05.pdf', document_type: 'informe',  status: 'activo'    },
  { caseIndex: 3, file_name: 'Documento Demo 06.pdf', document_type: 'otro',     status: 'activo'    },
  { caseIndex: 4, file_name: 'Documento Demo 07.pdf', document_type: 'contrato', status: 'activo'    },
  { caseIndex: 5, file_name: 'Documento Demo 08.pdf', document_type: 'informe',  status: 'archivado' },
  { caseIndex: 6, file_name: 'Documento Demo 09.pdf', document_type: 'otro',     status: 'activo'    },
  { caseIndex: 7, file_name: 'Documento Demo 10.pdf', document_type: 'contrato', status: 'activo'    },
];

// caseIndex = índice en DEMO_CASES (0-based)
const DEMO_TASKS = [
  { caseIndex: 0, title: 'Tarea Demo 01', description: 'Descripción ficticia de la tarea 1',  status: 'pendiente',   due_date: '2026-06-30' },
  { caseIndex: 0, title: 'Tarea Demo 02', description: 'Descripción ficticia de la tarea 2',  status: 'en_progreso', due_date: '2026-07-15' },
  { caseIndex: 1, title: 'Tarea Demo 03', description: 'Descripción ficticia de la tarea 3',  status: 'completada',  due_date: null         },
  { caseIndex: 2, title: 'Tarea Demo 04', description: 'Descripción ficticia de la tarea 4',  status: 'pendiente',   due_date: '2026-08-01' },
  { caseIndex: 3, title: 'Tarea Demo 05', description: 'Descripción ficticia de la tarea 5',  status: 'completada',  due_date: null         },
  { caseIndex: 4, title: 'Tarea Demo 06', description: 'Descripción ficticia de la tarea 6',  status: 'pendiente',   due_date: '2026-09-15' },
  { caseIndex: 5, title: 'Tarea Demo 07', description: 'Descripción ficticia de la tarea 7',  status: 'en_progreso', due_date: '2026-07-31' },
  { caseIndex: 6, title: 'Tarea Demo 08', description: 'Descripción ficticia de la tarea 8',  status: 'pendiente',   due_date: null         },
  { caseIndex: 7, title: 'Tarea Demo 09', description: 'Descripción ficticia de la tarea 9',  status: 'completada',  due_date: '2026-04-30' },
  { caseIndex: 8, title: 'Tarea Demo 10', description: 'Descripción ficticia de la tarea 10', status: 'pendiente',   due_date: '2026-12-01' },
];

async function seed() {
  const pool = getDb();

  // Idempotency: if 'Cliente Demo 01' already exists, skip entirely.
  const { rows: check } = await pool.query(
    "SELECT id FROM clients WHERE name = $1 LIMIT 1",
    ['Cliente Demo 01']
  );
  if (check.length > 0) {
    console.log('Los datos demo ya existen. No se insertaron duplicados.');
    console.log('Para volver a cargarlos, elimine los registros demo manualmente.');
    await pool.end();
    return;
  }

  // 1. Clients
  console.log('Insertando clientes demo...');
  const clientIds = [];
  for (const c of DEMO_CLIENTS) {
    const { rows } = await pool.query(
      'INSERT INTO clients (name, description, status) VALUES ($1, $2, $3) RETURNING id',
      [c.name, c.description, c.status]
    );
    clientIds.push(rows[0].id);
  }
  console.log('OK  ' + DEMO_CLIENTS.length + ' clientes');

  // 2. Cases
  console.log('Insertando casos demo...');
  const caseIds = [];
  for (const c of DEMO_CASES) {
    const { rows } = await pool.query(
      'INSERT INTO cases (client_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [clientIds[c.clientIndex], c.title, c.description, c.status, c.priority]
    );
    caseIds.push(rows[0].id);
  }
  console.log('OK  ' + DEMO_CASES.length + ' casos');

  // 3. Documents
  console.log('Insertando documentos demo...');
  for (const d of DEMO_DOCUMENTS) {
    await pool.query(
      'INSERT INTO documents (case_id, file_name, document_type, status) VALUES ($1, $2, $3, $4)',
      [caseIds[d.caseIndex], d.file_name, d.document_type, d.status]
    );
  }
  console.log('OK  ' + DEMO_DOCUMENTS.length + ' documentos');

  // 4. Tasks
  console.log('Insertando tareas demo...');
  for (const t of DEMO_TASKS) {
    await pool.query(
      'INSERT INTO tasks (case_id, title, description, status, due_date) VALUES ($1, $2, $3, $4, $5)',
      [caseIds[t.caseIndex], t.title, t.description, t.status, t.due_date]
    );
  }
  console.log('OK  ' + DEMO_TASKS.length + ' tareas');

  await pool.end();

  const target = process.env.DATABASE_URL
    ? '(desde DATABASE_URL)'
    : `${process.env.DATABASE_HOST || 'localhost'}:${process.env.DATABASE_PORT || 5432}/${process.env.DATABASE_NAME}`;

  console.log('\nCarga de datos demo completada.');
  console.log('Base de datos: ' + target);
  console.log('\nNOTA: Los datos insertados son ficticios y sirven solo para demostración.');
  console.log('      No representan personas, empresas ni clientes reales.');
}

seed().catch(err => {
  console.error('\nError durante la carga de datos demo:', err.message);
  if (err.code === '42P01') {
    console.error('→ La tabla no existe. Ejecute primero: npm run db:init');
  } else if (err.code === '42703') {
    console.error('→ Una columna no existe en la tabla. Ejecute primero: npm run db:init');
    console.error('  db:init agrega columnas faltantes sin eliminar datos.');
  }
  process.exit(1);
});
