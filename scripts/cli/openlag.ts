#!/usr/bin/env node
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import { Command } from 'commander';

import { buildPortal } from './build.js';
import { runDevServer } from './dev.js';
import { generateData, watchData } from './generate.js';
import { initProject } from './init.js';
import { lintDocs } from './lint.js';
import { resolveViteBin } from './vite-bin.js';
import { registerImpactCommand } from './impact.js';
import { registerFreezeCommand } from './freeze.js';
import { registerAuthoringCommands } from './authoring.js';

const program = new Command();
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8'));

function runVitePreview() {
  const viteBin = resolveViteBin(import.meta.url);
  execFileSync(process.execPath, [viteBin, 'preview', '--outDir', path.join(process.cwd(), 'dist')], {
    cwd: packageRoot,
    env: {
      ...process.env,
      OPENLAG_PROJECT_ROOT: process.cwd(),
    },
    stdio: 'inherit',
  });
}

program.name('openlag').description('Architecture as Code traceability graph generator').version(packageJson.version);

program
  .command('init')
  .description('Initialize a new OpenLAG project')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --desc <description>', 'Project description')
  .option('--all', 'Include optional synthetic relations')
  .action((options) => {
    initProject(options.name, options.desc, options.all);
  });

program
  .command('generate')
  .description('Generate static graph data from markdown docs')
  .option('-w, --watch', 'Watch mode')
  .action((options) => {
    const docsDir = path.join(process.cwd(), 'docs');
    const outputDir = path.join(process.cwd(), 'public');

    if (options.watch) {
      watchData(docsDir, outputDir);
    } else {
      generateData(docsDir, outputDir);
    }
  });

program
  .command('dev')
  .description('Start development server with live data refresh')
  .action(() => {
    runDevServer();
  });

program
  .command('build')
  .description('Build the OpenLAG portal for production')
  .action(() => {
    buildPortal();
  });

program
  .command('lint')
  .description('Validate architecture documentation')
  .option('-p, --profile <profile>', 'Lint profile (draft, develop, feature, release)', 'develop')
  .option('--json', 'Output report in JSON format')
  .option('--strict', 'Fail on warnings')
  .action((options) => {
    lintDocs(options.profile, options.json, options.strict);
  });

program
  .command('preview')
  .description('Preview the production build')
  .action(() => {
    runVitePreview();
  });

program
  .command('check')
  .description('Generate graph data and validate architecture documentation')
  .option('-p, --profile <profile>', 'Lint profile (draft, develop, feature, release)', 'develop')
  .option('--strict', 'Fail on warnings')
  .action((options) => {
    console.log(chalk.blue('Running OpenLAG checks...'));

    const docsDir = path.join(process.cwd(), 'docs');
    const outputDir = path.join(process.cwd(), 'public');

    try {
      generateData(docsDir, outputDir);
      lintDocs(options.profile, false, options.strict);
      console.log(chalk.green('\nOpenLAG checks passed.'));
    } catch {
      console.error(chalk.red('\nOpenLAG checks failed.'));
      process.exit(1);
    }
  });

registerImpactCommand(program);
registerFreezeCommand(program);
registerAuthoringCommands(program);

program.parse();
