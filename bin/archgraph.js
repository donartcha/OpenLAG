#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const command = args[0];

const printHelp = () => {
  console.log(`
  🛠️  ArchGraph CLI
  
  Usage:
    archgraph generate    - Generates static data from /docs
    archgraph build       - Builds the static site (requires vite)
    archgraph init        - Initializes a basic /docs structure
    archgraph preview     - Starts a local preview server
  `);
};

switch (command) {
  case 'generate':
    console.log("🚀 Generating ArchGraph data...");
    // Ejecutamos el script de generación que ya tenemos
    execSync('tsx scripts/generate-static-data.ts', { stdio: 'inherit' });
    break;

  case 'build':
    console.log("📦 Building static site...");
    execSync('npm run build', { stdio: 'inherit' });
    break;

  case 'init':
    console.log("📁 Initializing docs directory...");
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir);
      // Crear manifiesto básico si no existe
      const manifestPath = path.join(docsDir, 'project-manifest.md');
      if (!fs.existsSync(manifestPath)) {
        fs.writeFileSync(manifestPath, `---
title: "My System Architecture"
---

## Versions
\`\`\`yaml
- id: v-1
  name: 1.0.0
  timestamp: "${new Date().toISOString().split('T')[0]}"
  parentVersion: null
\`\`\`

## System Versions
\`\`\`yaml
- id: sv-1
  component: Core
  version: 1.0.0
\`\`\`

## Changes
\`\`\`yaml
[]
\`\`\``);
      }
      console.log("✅ Docs initialized.");
    } else {
      console.log("⚠️ Docs directory already exists.");
    }
    break;

  default:
    printHelp();
    break;
}
