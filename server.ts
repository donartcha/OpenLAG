import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import crypto from "crypto";

// --- Domain Model ---
type ArtifactType = 'REQUIREMENT' | 'USE_CASE' | 'DESIGN' | 'COMPONENT' | 'CODE_ENTITY' | 'TEST' | 'DOCUMENTATION' | 'INCIDENT';
type RelationType = 'DERIVES_FROM' | 'IMPLEMENTS' | 'VALIDATES' | 'JUSTIFIES' | 'TESTS' | 'BREAKS' | 'FIXES' | 'REFINES';
type ChangeType = 'ERROR' | 'EVOLUTION' | 'REFACTOR' | 'ADAPTATION';

interface Version {
  id: string;
  timestamp: string;
  parentVersion: string | null;
  name: string;
}

interface Artifact {
  id: string;
  type: ArtifactType;
  subType?: string;
  title: string;
  description: string;
  version: string; // The version in which it was introduced
}

interface Relation {
  id: string;
  from: string;
  to: string;
  type: RelationType;
}

interface Change {
  id: string;
  type: ChangeType;
  title: string;
  description: string;
  affects: string[];
  versionFrom: string;
  versionTo: string;
}

interface GraphSnapshot {
  artifacts: Artifact[];
  relations: Relation[];
}

// --- In-Memory State ---
const state: {
  versions: Version[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
} = {
  versions: [],
  graphs: {},
  changes: []
};

// Seed Data
function seedDatabase() {
  const v1NodeId = 'v-1';
  const timeV1 = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(); // 1 week ago

  state.versions.push({
    id: v1NodeId,
    timestamp: timeV1,
    parentVersion: null,
    name: 'v1.0.0'
  });

  // 1. Requisitos
  const rF: Artifact = { id: 'req-func-1', type: 'REQUIREMENT', subType: 'Functional Requirement', title: 'User Registration', description: 'Sistema debe permitir a los usuarios registrarse con email/password.', version: v1NodeId };
  const rNF: Artifact = { id: 'req-nfunc-1', type: 'REQUIREMENT', subType: 'Non-Functional Requirement', title: 'High Availability', description: 'El sistema debe tener un uptime de 99.9%.', version: v1NodeId };
  const rBR: Artifact = { id: 'req-br-1', type: 'REQUIREMENT', subType: 'Business Rule', title: 'Age Restriction', description: 'Solo usuarios mayores de 18 pueden registrarse.', version: v1NodeId };
  const rRes: Artifact = { id: 'req-res-1', type: 'REQUIREMENT', subType: 'Constraint', title: 'GDPR Compliance', description: 'Cumplir con las normas de privacidad europeas.', version: v1NodeId };

  // 2. Diseño
  const dArq: Artifact = { id: 'des-arq-1', type: 'DESIGN', subType: 'Architecture', title: 'Microservices Setup', description: 'Arquitectura basada en eventos usando RabbitMQ.', version: v1NodeId };
  const dAdrMarkdown = `# ADR-001: Use Postgres
## Context
We need a database to store user information and transactions.

## Decision
We decided to use PostgreSQL instead of MongoDB.
* Provides solid ACID properties.
* \`pg\` package is well supported.

\`\`\`mermaid
graph TD
  API[Auth API] --> DB[(PostgreSQL)]
\`\`\`
`;
  const dAdr: Artifact = { id: 'des-adr-1', type: 'DOCUMENTATION', subType: 'ADR', title: 'ADR-001: Use Postgres', description: dAdrMarkdown, version: v1NodeId };
  
  const dCmpMarkdown = `Diagrama C4 del subsistema de autenticación.
\`\`\`mermaid
C4Context
  Person(user, "User")
  System(auth, "Auth System")
  Rel(user, auth, "Authenticates")
\`\`\`
`;
  const dCmp: Artifact = { id: 'des-cmp-1', type: 'DESIGN', subType: 'Component Diagram', title: 'Auth Subsystem Diagram', description: dCmpMarkdown, version: v1NodeId };
  const dCon: Artifact = { id: 'des-con-1', type: 'DOCUMENTATION', subType: 'Service Contract', title: 'User-Auth OpenAPI Contract', description: 'Especificación OAS v3 para Auth API.', version: v1NodeId };

  // 3. Implementación
  const iCls: Artifact = { id: 'impl-cls-1', type: 'CODE_ENTITY', subType: 'Class', title: 'UserEntity.ts', description: 'Entidad de dominio User.', version: v1NodeId };
  const iCtr: Artifact = { id: 'impl-ctr-1', type: 'CODE_ENTITY', subType: 'Controller', title: 'AuthController.ts', description: 'Controlador HTTP para auth.', version: v1NodeId };
  const iDao: Artifact = { id: 'impl-dao-1', type: 'CODE_ENTITY', subType: 'DAO / Repository', title: 'UserRepository.ts', description: 'Acceso a datos de usuarios.', version: v1NodeId };
  const iApi: Artifact = { id: 'impl-api-1', type: 'CODE_ENTITY', subType: 'API Route', title: '/api/v1/auth', description: 'Router principal de autenticación.', version: v1NodeId };

  // 4. Verificación
  const vTst: Artifact = { id: 'ver-tst-1', type: 'TEST', subType: 'Test Case', title: 'Auth Regression Suite', description: 'Pruebas E2E de registro e inicio de sesión.', version: v1NodeId };
  const vRes: Artifact = { id: 'ver-res-1', type: 'DOCUMENTATION', subType: 'Test Results', title: 'Test Report v1.0', description: 'Reporte de cobertura al 90% en sonarQube.', version: v1NodeId };
  const vEvi: Artifact = { id: 'ver-evi-1', type: 'DOCUMENTATION', subType: 'Evidence', title: 'Sec Audit Approval', description: 'Aprobación de la auditoría de seguridad externa.', version: v1NodeId };

  // 5. Operación
  const oDep: Artifact = { id: 'ops-dep-1', type: 'COMPONENT', subType: 'Deployment', title: 'K8s Auth Deployment', description: 'Manifiestos de Kubernetes para Auth.', version: v1NodeId };
  const oRun: Artifact = { id: 'ops-run-1', type: 'DOCUMENTATION', subType: 'Runbook', title: 'DB Failover Runbook', description: 'Pasos para recuperar la base de datos.', version: v1NodeId };
  const oInc: Artifact = { id: 'ops-inc-1', type: 'INCIDENT', subType: 'Incident', title: 'INC-1020: Auth Timeout', description: 'Picos de latencia en /login.', version: v1NodeId };

  const artifacts = [
    rF, rNF, rBR, rRes, 
    dArq, dAdr, dCmp, dCon, 
    iCls, iCtr, iDao, iApi, 
    vTst, vRes, vEvi, 
    oDep, oRun, oInc
  ];

  // Relations connecting them semantically
  const relations: Relation[] = [
    { id: 'r1', from: dArq.id, to: rNF.id, type: 'DERIVES_FROM' },
    { id: 'r2', from: dAdr.id, to: dArq.id, type: 'JUSTIFIES' },
    { id: 'r3', from: dCmp.id, to: rF.id, type: 'DERIVES_FROM' },
    { id: 'r4', from: iCtr.id, to: dCon.id, type: 'IMPLEMENTS' },
    { id: 'r5', from: iCtr.id, to: iApi.id, type: 'IMPLEMENTS' },
    { id: 'r6', from: iDao.id, to: iCls.id, type: 'IMPLEMENTS' },
    { id: 'r7', from: iCtr.id, to: rBR.id, type: 'VALIDATES' },
    { id: 'r8', from: vTst.id, to: iCtr.id, type: 'TESTS' },
    { id: 'r9', from: vRes.id, to: vTst.id, type: 'REFINES' },
    { id: 'r10', from: oDep.id, to: dArq.id, type: 'IMPLEMENTS' },
    { id: 'r11', from: oInc.id, to: oDep.id, type: 'BREAKS' },
    { id: 'r12', from: oRun.id, to: oInc.id, type: 'REFINES' },
  ];

  state.graphs[v1NodeId] = { artifacts, relations };

  // V2
  const v2NodeId = 'v-2';
  const timeV2 = new Date().toISOString(); 
  state.versions.push({
    id: v2NodeId,
    timestamp: timeV2,
    parentVersion: v1NodeId,
    name: 'v1.1.0'
  });

  const opsIncFix: Artifact = { id: 'ops-inc-fix-1', type: 'CODE_ENTITY', subType: 'Patch', title: 'ConnectionPoolFix', description: 'Incrementado pool de DB', version: v2NodeId };
  
  const v2Artifacts = [...artifacts, opsIncFix];
  const v2Relations: Relation[] = [...relations, { id: 'r13', from: opsIncFix.id, to: oInc.id, type: 'FIXES' as RelationType }, { id: 'r14', from: opsIncFix.id, to: iDao.id, type: 'IMPLEMENTS' as RelationType }];

  state.changes.push({
    id: 'ch-1',
    type: 'ERROR',
    title: 'Fix Auth Timeout (INC-1020)',
    description: 'Se aumentó el tamaño del pool de conexiones para resolver los timeouts bajo carga.',
    affects: [oInc.id, opsIncFix.id, iDao.id], 
    versionFrom: v1NodeId,
    versionTo: v2NodeId
  });

  state.graphs[v2NodeId] = {
    artifacts: v2Artifacts,
    relations: v2Relations
  };
}

seedDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  app.get('/api/state', (req, res) => {
    res.json(state);
  });

  app.get('/api/versions', (req, res) => {
    res.json(state.versions);
  });

  app.get('/api/versions/:id/graph', (req, res) => {
    const { id } = req.params;
    const graph = state.graphs[id];
    if (!graph) return res.status(404).json({ error: 'Version not found' });
    res.json(graph);
  });

  app.get('/api/changes', (req, res) => {
    res.json(state.changes);
  });

  // Basic health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
