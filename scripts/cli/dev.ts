import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

import { generateData, watchData } from './generate.js';
import { resolveViteBin } from './vite-bin.js';

export function runDevServer() {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const viteBin = resolveViteBin(import.meta.url);
  const viteConfig = path.join(packageRoot, 'vite.config.ts');
  const projectRoot = process.cwd();
  const docsDir = path.join(projectRoot, 'docs');
  const outputDir = path.join(projectRoot, 'public');

  generateData(docsDir, outputDir);
  watchData(docsDir, outputDir);

  console.log(chalk.blue('Starting OpenLAG portal dev server...'));

  const vite = spawn(process.execPath, [viteBin, '--config', viteConfig], {
    cwd: packageRoot,
    env: {
      ...process.env,
      OPENLAG_PROJECT_ROOT: projectRoot,
    },
    stdio: 'inherit',
  });

  vite.on('close', (code) => {
    process.exit(code || 0);
  });
}
