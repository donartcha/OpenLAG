import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';

import { generateData } from './generate.js';
import { resolveViteBin } from './vite-bin.js';

export function buildPortal() {
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const viteBin = resolveViteBin(import.meta.url);
  const viteConfig = path.join(packageRoot, 'vite.config.ts');
  const docsDir = path.join(process.cwd(), 'docs');
  const outputDir = path.join(process.cwd(), 'public');

  generateData(docsDir, outputDir);

  console.log(chalk.blue('Building OpenLAG portal...'));
  try {
    execFileSync(process.execPath, [viteBin, 'build', '--config', viteConfig], {
      cwd: packageRoot,
      env: {
        ...process.env,
        OPENLAG_PROJECT_ROOT: process.cwd(),
      },
      stdio: 'inherit',
    });
    console.log(chalk.green('Portal build complete.'));
  } catch {
    console.error(chalk.red('Build failed.'));
    process.exit(1);
  }
}
