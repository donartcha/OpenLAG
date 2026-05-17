import { spawn } from 'child_process';
import { watchData, generateData } from './generate.js';
import path from 'path';
import chalk from 'chalk';

export function runDevServer() {
  const docsDir = path.join(process.cwd(), 'docs');
  const outputDir = path.join(process.cwd(), 'public');

  // 1. Initial generation
  generateData(docsDir, outputDir);

  // 2. Start watcher
  watchData(docsDir, outputDir);

  // 3. Start Vite
  console.log(chalk.blue("✨ Starting View Layer (Vite)..."));
  
  const vite = spawn('npx', ['vite'], {
    stdio: 'inherit',
    shell: true
  });

  vite.on('close', (code) => {
    process.exit(code || 0);
  });
}
