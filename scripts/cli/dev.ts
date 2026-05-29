import { spawn, execFileSync } from 'child_process';
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

  console.log(chalk.blue('Generating contracts (artifacts & relations)...'));
  try {
    execFileSync('tsx', [path.join(packageRoot, 'scripts/generate-artifacts.ts')], { stdio: 'inherit', cwd: projectRoot });
    execFileSync('tsx', [path.join(packageRoot, 'scripts/generate-relations.ts')], { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.yellow(`Warning: Could not regenerate contracts. Reason: ${message}`));
    console.error(chalk.yellow('OpenLAG will continue using project public/*.json contract files when present, or bundled generated defaults as fallback.'));
  }

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
