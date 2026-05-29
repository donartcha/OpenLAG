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

if (process.argv.length === 3 && (process.argv[2] === '--version' || process.argv[2] === '-V')) {
  console.log(packageJson.version);
  process.exit(0);
}

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

program
  .name('openlag')
  .description('Architecture as Code traceability graph generator')
  .addHelpText('after', `

Common workflows:
  $ openlag --version
  $ openlag init --name "My System"
  $ openlag generate
  $ openlag lint --profile develop
  $ openlag check --profile release --strict
  $ openlag freeze --profile architecture --format html
  $ openlag freeze --profile architecture --version VER-050
`);

program
  .command('init')
  .description('Initialize a new OpenLAG project')
  .option('-n, --name <name>', 'Project name')
  .option('-d, --desc <description>', 'Project description')
  .option('--starter', 'Initialize with OpenLAG Lite starter contracts (4 artifact types, 4 relations, 1 export profile)')
  .option('--all', 'Include optional synthetic relations')
  .option('-p, --profile <profile>', 'Apply a profile pack (e.g. mvc, hexagonal)')
  .addHelpText('after', `

Examples:
  $ openlag init --name "My System"
  $ openlag init --name "My System" --desc "Architecture knowledge base"
  $ openlag init --starter
  $ openlag init --profile governance
  $ openlag init --all

Notes:
  Existing contract files are preserved.
  --starter applies the lightweight starter profile for new teams.
  --profile copies bundled contracts/templates into docs/contracts/.
`)
  .action((options) => {
    initProject(options.name, options.desc, options.all, options.profile, options.starter);
  });

program
  .command('generate')
  .description('Generate static graph data from markdown docs')
  .option('-w, --watch', 'Watch mode')
  .addHelpText('after', `

Examples:
  $ openlag generate
  $ openlag generate --watch

Output:
  public/graph-data.json
  public/artifact-definitions.json
  public/relation-definitions.json
`)
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
  .addHelpText('after', `

Example:
  $ openlag dev

Notes:
  Regenerates graph data and starts the Vite development portal.
`)
  .action(() => {
    runDevServer();
  });

program
  .command('build')
  .description('Build the OpenLAG portal for production')
  .addHelpText('after', `

Example:
  $ openlag build

Output:
  dist/
`)
  .action(() => {
    buildPortal();
  });

program
  .command('lint')
  .description('Validate architecture documentation')
  .option('-p, --profile <profile>', 'Lint profile (draft, develop, feature, release)', 'develop')
  .option('--json', 'Output report in JSON format')
  .option('--strict', 'Fail on warnings')
  .addHelpText('after', `

Examples:
  $ openlag lint
  $ openlag lint --profile feature
  $ openlag lint --profile release --strict
  $ openlag lint --json
`)
  .action((options) => {
    lintDocs(options.profile, options.json, options.strict);
  });

program
  .command('preview')
  .description('Preview the production build')
  .addHelpText('after', `

Example:
  $ openlag preview

Notes:
  Serves the production build from dist/.
`)
  .action(() => {
    runVitePreview();
  });

program
  .command('check')
  .description('Generate graph data and validate architecture documentation')
  .option('-p, --profile <profile>', 'Lint profile (draft, develop, feature, release)', 'develop')
  .option('--strict', 'Fail on warnings')
  .addHelpText('after', `

Examples:
  $ openlag check
  $ openlag check --profile release --strict

Notes:
  Runs generate first, then lint with the selected profile.
`)
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
