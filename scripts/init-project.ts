import fs from 'fs';
import path from 'path';

/**
 * OpenLAG Project Initializer
 * Purpose: Configures the OpenLAG portal for a specific project.
 */

const PROJECT_NAME = process.env.PROJECT_NAME || 'My OpenLAG Project';
const PROJECT_DESC = process.env.PROJECT_DESCRIPTION || 'Living Architecture documentation for my system.';

const ROOT_DIR = process.cwd();

async function init() {
  console.log(`🛠️  Initializing OpenLAG for: ${PROJECT_NAME}`);

  // 1. Update metadata.json
  const metadataPath = path.join(ROOT_DIR, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    metadata.name = PROJECT_NAME;
    metadata.description = PROJECT_DESC;
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log('✅ Updated metadata.json');
  }

  // 2. Update index.html title
  const htmlPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${PROJECT_NAME} | OpenLAG</title>`);
    fs.writeFileSync(htmlPath, html);
    console.log('✅ Updated index.html title');
  }

  // 3. Initialize /docs if empty or missing
  const docsDir = path.join(ROOT_DIR, 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
    console.log('✅ Created /docs directory');
  }

  const manifestPath = path.join(docsDir, 'project-manifest.md');
  if (!fs.existsSync(manifestPath)) {
    const manifestContent = `---
id: project-manifest
type: MANIFEST
status: release
title: "${PROJECT_NAME} - Architectural Manifest"
description: "${PROJECT_DESC}"
---

# Architecture Manifest: ${PROJECT_NAME}

## Core Versions
\`\`\`yaml
- id: v-1.0.0
  name: "Baseline"
  timestamp: "${new Date().toISOString().split('T')[0]}"
  parentVersion: null
\`\`\`

## System Components
\`\`\`yaml
- id: component-core
  component: "Core System"
  version: "1.0.0"
\`\`\`

## Change Log
\`\`\`yaml
[]
\`\`\`
`;
    fs.writeFileSync(manifestPath, manifestContent);
    console.log('✅ Created initial docs/project-manifest.md');
  }

  // 4. Create a sample doc if empty
  const sampleDocPath = path.join(docsDir, 'architecture-overview.md');
  if (!fs.existsSync(sampleDocPath)) {
    const sampleContent = `---
id: arch-overview
type: DOCUMENT
status: draft
title: "Architecture Overview"
description: "High-level description of the system architecture."
---

# Architecture Overview

This document describes the high-level architecture of ${PROJECT_NAME}.

## Key Principles
- Traceability first.
- Documentation as Code.
- Graph-based relationships.
`;
    fs.writeFileSync(sampleDocPath, sampleContent);
    console.log('✅ Created initial docs/architecture-overview.md');
  }

  console.log('\n🚀 Project initialized successfully!');
  console.log('Next steps:');
  console.log('1. Edit docs/ to reflect your architecture.');
  console.log('2. Run "npm run dev" to see your portal.');
}

init().catch(err => {
  console.error('❌ Error during initialization:', err);
  process.exit(1);
});
