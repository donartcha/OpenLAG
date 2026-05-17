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
  🛠️  OpenLAG CLI
  
  Usage:
    openlag generate    - Generates static data from /docs
    openlag build       - Builds the static site (requires vite)
    openlag init        - Initializes a basic /docs structure
    openlag preview     - Starts a local preview server
    openlag lint        - Runs OpenLAG linter against /docs
  `);
};

switch (command) {
  case 'generate':
    console.log("🚀 Generating OpenLAG data...");
    // Ejecutamos el script de generación que ya tenemos
    execSync('tsx scripts/generate-static-data.ts', { stdio: 'inherit' });
    break;

  case 'lint':
    console.log("🔍 Linting OpenLAG architecture...");
    // Forward all remaining args to the lint script
    const lintArgs = args.slice(1).join(' ');
    try {
      execSync(`tsx scripts/lint-cli.ts ${lintArgs}`, { stdio: 'inherit' });
    } catch (error) {
      process.exit(1);
    }
    break;

  case 'build':
    console.log("📦 Building static site...");
    execSync('npm run build', { stdio: 'inherit' });
    break;

  case 'init':
    console.log("📁 Initializing OpenLAG project...");
    try {
      execSync('tsx scripts/init-project.ts', { stdio: 'inherit' });
    } catch (error) {
      process.exit(1);
    }
    break;

  default:
    printHelp();
    break;
}
