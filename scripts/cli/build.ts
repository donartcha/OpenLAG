import { execSync } from 'child_process';
import { generateData } from './generate.js';
import path from 'path';
import chalk from 'chalk';

export function buildPortal() {
  const docsDir = path.join(process.cwd(), 'docs');
  const outputDir = path.join(process.cwd(), 'public');

  // 1. Generate data
  generateData(docsDir, outputDir);

  // 2. Run Vite build
  console.log(chalk.blue("🏗️  Building OpenLAG Portal..."));
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log(chalk.green("✅ Portal build complete!"));
  } catch (e) {
    console.error(chalk.red("❌ Build failed"));
    process.exit(1);
  }
}
