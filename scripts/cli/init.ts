import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

/**
 * OpenLAG Project Initializer
 * Purpose: Configures the OpenLAG portal for a specific project.
 */

export async function initProject(projectName?: string, projectDesc?: string, includeAllRelations?: boolean) {
  const name = projectName || process.env.PROJECT_NAME || 'My OpenLAG Project';
  const desc = projectDesc || process.env.PROJECT_DESCRIPTION || 'Living Architecture documentation for my system.';

  const ROOT_DIR = process.cwd();

  console.log(chalk.blue(`🛠️  Initializing OpenLAG for: `) + chalk.bold(name));

  // 1. Update metadata.json
  const metadataPath = path.join(ROOT_DIR, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    metadata.name = name;
    metadata.description = desc;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(chalk.green('✅ Updated metadata.json'));
  }

  // 2. Update index.html title
  const htmlPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${name} | OpenLAG</title>`);
    fs.writeFileSync(htmlPath, html);
    console.log(chalk.green('✅ Updated index.html title'));
  }

  // 3. Initialize /docs if empty or missing
  const docsDir = path.join(ROOT_DIR, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
    console.log(chalk.green('✅ Created /docs directory'));
  }

  // 3.1 Initialize /docs/relations with Mandatory Core Relations
  const relationsDir = path.join(docsDir, 'relations');
  if (!fs.existsSync(relationsDir)) {
    fs.mkdirSync(relationsDir);
    console.log(chalk.green('✅ Created /docs/relations directory'));
  } else {
    // Purge existing relations to ensure only mandatory ones exist on init
    const files = fs.readdirSync(relationsDir);
    for (const file of files) {
      if (file.endsWith('.yaml')) {
        fs.unlinkSync(path.join(relationsDir, file));
      }
    }
  }

  const mandatoryRelations = [
    {
      name: 'IMPLEMENTS.yaml',
      content: `relation: IMPLEMENTS
description: "Conecta implementación con necesidad funcional/técnica."
category: TRACEABILITY
allowedFrom: [CODE_ENTITY, COMPONENT, API, DATABASE_ENTITY, SYSTEM_VERSION]
allowedTo: [REQUIREMENT, FEATURE, EPIC, DESIGN, USE_CASE, BUSINESS_RULE]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
    },
    {
      name: 'TESTS.yaml',
      content: `relation: TESTS
description: "Conecta tests con comportamiento validado."
category: TRACEABILITY
allowedFrom: [TEST_CASE, TEST]
allowedTo: [REQUIREMENT, FEATURE, EPIC, CODE_ENTITY, COMPONENT, API, DATABASE_ENTITY, BUG, INCIDENT]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
    },
    {
      name: 'REFINES.yaml',
      content: `relation: REFINES
description: "Descompone artefactos en otros más concretos."
category: TRACEABILITY
allowedFrom: [FEATURE, REQUIREMENT, BUG, RISK, DESIGN]
allowedTo: [EPIC, FEATURE, PROJECT, BUSINESS_RULE, REQUIREMENT, DESIGN]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
    },
    {
      name: 'FIXES.yaml',
      content: `relation: FIXES
description: "Conecta correcciones con bugs o incidentes."
category: TRACEABILITY
allowedFrom: [CHANGE, CODE_ENTITY, COMPONENT, SYSTEM_VERSION]
allowedTo: [BUG, INCIDENT, RISK]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
    },
    {
      name: 'DOCUMENTS.yaml',
      content: `relation: DOCUMENTS
description: "Conecta documentación con el artefacto descrito."
category: SEMANTIC
allowedFrom: [DOCUMENTATION, GLOSSARY_TERM]
allowedTo: [PROJECT, EPIC, FEATURE, REQUIREMENT, BUSINESS_RULE, USE_CASE, DESIGN, DECISION, CODE_ENTITY, TEST_CASE, CHANGE, BUG, RISK, GLOSSARY_TERM, COMPONENT, API, DATABASE_ENTITY, TEST, DOCUMENTATION, INCIDENT, INFRASTRUCTURE, DEPLOYMENT, MONITORING, MAINTENANCE, SYSTEM_VERSION, VERSION]
multiplicity:
  from: many
  to: many
validation:
  severity: info`
    },
    {
      name: 'JUSTIFIES.yaml',
      content: `relation: JUSTIFIES
description: "Conecta decisiones con aquello que justifican."
category: SEMANTIC
allowedFrom: [DECISION, BUSINESS_RULE, DOCUMENTATION, RISK]
allowedTo: [DESIGN, REQUIREMENT, FEATURE, EPIC, PROJECT, CODE_ENTITY, COMPONENT, INFRASTRUCTURE, DEPLOYMENT, MAINTENANCE]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
    }
  ];

  mandatoryRelations.forEach(rel => {
    fs.writeFileSync(path.join(relationsDir, rel.name), rel.content);
  });
  console.log(chalk.green('✅ Created Mandatory Core Relations (IMPLEMENTS, TESTS, REFINES, FIXES, DOCUMENTS, JUSTIFIES)'));

  if (includeAllRelations) {
    const optionalRelations = [
      {
        name: 'DEPENDS_ON.yaml',
        content: `relation: DEPENDS_ON
description: "Acoplamiento estático arquitectónico o de empaquetado."
category: STRUCTURAL
allowedFrom: [CODE_ENTITY, COMPONENT, API, DATABASE_ENTITY, LIBRARY, VERSION, SYSTEM_VERSION]
allowedTo: [CODE_ENTITY, COMPONENT, API, DATABASE_ENTITY, LIBRARY, VERSION, SYSTEM_VERSION]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      },
      {
        name: 'USES.yaml',
        content: `relation: USES
description: "Llamada funcional, invocación o flujo en tiempo de ejecución."
category: OPERATIONAL
allowedFrom: [CODE_ENTITY, COMPONENT, API, FEATURE, USE_CASE]
allowedTo: [CODE_ENTITY, COMPONENT, API, SYSTEM_VERSION]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      },
      {
        name: 'DEPLOYS.yaml',
        content: `relation: DEPLOYS
description: "Instanciación de componentes o release en infraestructura."
category: OPERATIONAL
allowedFrom: [DEPLOYMENT, PIPELINE, SYSTEM_VERSION]
allowedTo: [COMPONENT, INFRASTRUCTURE, ENVIRONMENT, DATABASE_ENTITY]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
      },
      {
        name: 'MONITORS.yaml',
        content: `relation: MONITORS
description: "Relación de observabilidad."
category: OPERATIONAL
allowedFrom: [MONITORING, CHECK]
allowedTo: [COMPONENT, INFRASTRUCTURE, DEPLOYMENT, DATABASE_ENTITY, API]
multiplicity:
  from: many
  to: many
validation:
  severity: info`
      },
      {
        name: 'IMPACTS.yaml',
        content: `relation: IMPACTS
description: "Descripción de posibles efectos colaterales."
category: SEMANTIC
allowedFrom: [CHANGE, RISK, BUG, INCIDENT, DECISION]
allowedTo: [PROJECT, EPIC, FEATURE, REQUIREMENT, DESIGN, CODE_ENTITY, COMPONENT, API, DATABASE_ENTITY, SYSTEM_VERSION]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      },
      {
        name: 'BLOCKS.yaml',
        content: `relation: BLOCKS
description: "Descripción de impedimentos directos."
category: DEPENDENCY
allowedFrom: [BUG, RISK, INCIDENT, CHANGE, DECISION, REQUIREMENT, FEATURE, EPIC]
allowedTo: [PROJECT, EPIC, FEATURE, REQUIREMENT, BUG, CHANGE, DEPLOYMENT, DEPLOYMENT]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
      },
      {
        name: 'BREAKS.yaml',
        content: `relation: BREAKS
description: "Averías o rupturas confirmadas."
category: OPERATIONAL
allowedFrom: [CHANGE, CODE_ENTITY, COMPONENT, SYSTEM_VERSION]
allowedTo: [TEST_CASE, TEST, API, COMPONENT, REQUIREMENT, FEATURE]
multiplicity:
  from: many
  to: many
validation:
  severity: error`
      },
      {
        name: 'REPLACES.yaml',
        content: `relation: REPLACES
description: "Evolución e histórico, deprecando versiones anteriores."
category: EVOLUTIONARY
allowedFrom: [COMPONENT, API, SYSTEM_VERSION, VERSION, REQUIREMENT, FEATURE, DESIGN, DECISION]
allowedTo: [COMPONENT, API, SYSTEM_VERSION, VERSION, REQUIREMENT, FEATURE, DESIGN, DECISION]
multiplicity:
  from: many
  to: one
validation:
  severity: info`
      },
      {
        name: 'DERIVES_FROM.yaml',
        content: `relation: DERIVES_FROM
description: "Evolución conceptual genérica."
category: SEMANTIC
allowedFrom: [REQUIREMENT, FEATURE, DESIGN, BUSINESS_RULE, DECISION, USE_CASE]
allowedTo: [REQUIREMENT, FEATURE, DESIGN, BUSINESS_RULE, DECISION, USE_CASE]
multiplicity:
  from: many
  to: many
validation:
  severity: info`
      },
      {
        name: 'VALIDATES.yaml',
        content: `relation: VALIDATES
description: "Validación empírica/humana (QA Manual)."
category: TRACEABILITY
allowedFrom: [PROCESS, CHECK, DOCUMENTATION]
allowedTo: [REQUIREMENT, FEATURE, USE_CASE, DEPLOYMENT]
multiplicity:
  from: many
  to: many
validation:
  severity: info`
      },
      {
        name: 'DEFINES.yaml',
        content: `relation: DEFINES
description: "Entidades que instauran glosarios o normas."
category: SEMANTIC
allowedFrom: [BUSINESS_RULE, DECISION, DOCUMENTATION, GLOSSARY_TERM]
allowedTo: [REQUIREMENT, FEATURE, DESIGN, PROJECT, COMPONENT, API, DATABASE_ENTITY]
multiplicity:
  from: many
  to: many
validation:
  severity: info`
      },
      {
        name: 'CALLS.yaml',
        content: `relation: CALLS
description: "Trazabilidad de invocación a nivel código."
category: STRUCTURAL
allowedFrom: [CODE_ENTITY]
allowedTo: [CODE_ENTITY, API]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      },
      {
        name: 'IMPORTS.yaml',
        content: `relation: IMPORTS
description: "Trazabilidad de importación estática a nivel de código."
category: STRUCTURAL
allowedFrom: [CODE_ENTITY]
allowedTo: [CODE_ENTITY, LIBRARY]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      },
      {
        name: 'RELATES_TO.yaml',
        content: `relation: RELATES_TO
description: |
  Uso genérico propenso a polución semántica. (DISCOURAGED)
  Para mantener un grafo limpio, solo úsala aportando rationale explícito:
  
  relations:
    - to: mi-otro-artefacto
      type: RELATES_TO
      rationale: "No encaja con USES o DEPENDS_ON debido al contexto X."
category: SEMANTIC
allowedFrom: [PROJECT, EPIC, FEATURE, REQUIREMENT, BUSINESS_RULE, USE_CASE, DESIGN, DECISION, CODE_ENTITY, TEST_CASE, CHANGE, BUG, RISK, GLOSSARY_TERM, COMPONENT, API, DATABASE_ENTITY, TEST, DOCUMENTATION, INCIDENT, INFRASTRUCTURE, DEPLOYMENT, MONITORING, MAINTENANCE, SYSTEM_VERSION, VERSION]
allowedTo: [PROJECT, EPIC, FEATURE, REQUIREMENT, BUSINESS_RULE, USE_CASE, DESIGN, DECISION, CODE_ENTITY, TEST_CASE, CHANGE, BUG, RISK, GLOSSARY_TERM, COMPONENT, API, DATABASE_ENTITY, TEST, DOCUMENTATION, INCIDENT, INFRASTRUCTURE, DEPLOYMENT, MONITORING, MAINTENANCE, SYSTEM_VERSION, VERSION]
multiplicity:
  from: many
  to: many
validation:
  severity: warn`
      }
    ];

    optionalRelations.forEach(rel => {
      fs.writeFileSync(path.join(relationsDir, rel.name), rel.content);
    });
    console.log(chalk.green('✅ Created Official Optional Relations'));
  }


  const versionsDir = path.join(docsDir, 'versions');
  if (!fs.existsSync(versionsDir)) {
    fs.mkdirSync(versionsDir);
    console.log(chalk.green('✅ Created /docs/versions directory'));
  }

  const versionPath = path.join(versionsDir, 'v-1.0.0.md');
  if (!fs.existsSync(versionPath)) {
    const versionsContent = `---
id: v-1.0.0
type: VERSION
name: "Baseline"
timestamp: "${new Date().toISOString().split('T')[0]}"
parentVersion: null
layer: DOCUMENTATION
title: "Project Release v1.0.0"
description: "Initial release"
ownership:
  owner: architecture
  team: architecture
relations: []
---
`;
    fs.writeFileSync(versionPath, versionsContent);
    console.log(chalk.green('✅ Created initial docs/versions/v-1.0.0.md'));
  }

  const componentsVersionsPath = path.join(versionsDir, 'sys-core-1.0.md');
  if (!fs.existsSync(componentsVersionsPath)) {
    const cvContent = `---
id: sys-core-1.0
type: SYSTEM_VERSION
component: "Core System"
version: "1.0.0"
releaseDate: "${new Date().toISOString().split('T')[0]}"
layer: OPERATIONS
title: "Core System v1.0"
description: "Base framework."
ownership:
  owner: architecture
  team: architecture
relations: []
---
`;
    fs.writeFileSync(componentsVersionsPath, cvContent);
    console.log(chalk.green('✅ Created initial docs/versions/sys-core-1.0.md'));
  }

  // 4. Create a sample doc if empty
  const architectureDir = path.join(docsDir, 'architecture');
  if (!fs.existsSync(architectureDir)) {
    fs.mkdirSync(architectureDir);
    console.log(chalk.green('✅ Created /docs/architecture directory'));
  }

  const sampleDocPath = path.join(architectureDir, 'architecture-overview.md');
  if (!fs.existsSync(sampleDocPath)) {
    const sampleContent = `---
id: arch-overview
type: DOCUMENT
status: draft
title: "Architecture Overview"
description: "High-level description of the system architecture."
---

# Architecture Overview

This document describes the high-level architecture of ${name}.

## Key Principles
- Traceability first.
- Documentation as Code.
- Graph-based relationships.
`;
    fs.writeFileSync(sampleDocPath, sampleContent);
    console.log(chalk.green('✅ Created initial docs/architecture/architecture-overview.md'));
  }

  console.log('\n' + chalk.cyan('🚀 Project initialized successfully!'));
  console.log('Next steps:');
  console.log('1. Edit ' + chalk.cyan('docs/') + ' to reflect your architecture.');
  console.log('2. Run ' + chalk.cyan('openlag dev') + ' to see your portal.');
}
