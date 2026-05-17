#!/usr/bin/env node
import { Command } from 'commander';
import { generateData, watchData } from '../scripts/cli/generate.js';
import { initProject } from '../scripts/cli/init.js';
import { lintDocs } from '../scripts/cli/lint.js';
import { runDevServer } from '../scripts/cli/dev.js';
import { buildPortal } from '../scripts/cli/build.js';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const program = new Command();

program
  .name('openlag')
  .description('Architecture as Code CLI tool')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new OpenLAG project')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --desc <description>', 'Project description')
  .action((options) => {
    initProject(options.name, options.desc);
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
  .option('-p, --profile <profile>', 'Lint profile (develop, feature, release)', 'develop')
  .option('--json', 'Output report in JSON format')
  .option('--strict', 'Fail on warnings')
  .action((options) => {
    lintDocs(options.profile, options.json, options.strict);
  });

program
  .command('preview')
  .description('Preview the production build')
  .action(() => {
    execSync('npx vite preview', { stdio: 'inherit' });
  });

program
  .command('check')
  .description('Run all checks (typecheck, lint, tests, openlag lint)')
  .action(() => {
    console.log(chalk.blue('🔍 Running all checks...'));
    try {
      console.log(chalk.dim('\n1. Typecheck:'));
      execSync('npm run typecheck', { stdio: 'inherit' });

      console.log(chalk.dim('\n2. Lint (ESLint):'));
      execSync('npm run lint', { stdio: 'inherit' });

      console.log(chalk.dim('\n3. OpenLAG Lint:'));
      lintDocs('develop');

      console.log(chalk.green('\n✅ All checks passed!'));
    } catch (e) {
      console.error(chalk.red('\n❌ System check failed'));
      process.exit(1);
    }
  });

program.parse();
