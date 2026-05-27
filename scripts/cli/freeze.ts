import chalk from 'chalk';
import { Command } from 'commander';

import { createDocumentationFreeze } from '../core/freeze.js';

export function registerFreezeCommand(program: Command) {
  program
    .command('freeze')
    .description('Generate a deterministic documentation freeze from the OpenLAG graph')
    .option('-p, --profile <profile>', 'Export profile from docs/contracts/export-profiles', 'architecture')
    .option('--format <format>', 'Output format (markdown, json, html, pdf)', 'markdown')
    .option('--template <template>', 'Freeze HTML/PDF template id or path override')
    .option('-o, --output <path>', 'Output directory or target file')
    .option('--dry-run', 'Preview what would be exported without writing files')
    .addHelpText('after', `

Examples:
  $ openlag freeze --profile architecture --format markdown
  $ openlag freeze --profile architecture --format html --template audit-dossier
  $ openlag freeze --profile architecture --format pdf --output exports/audit.pdf
  $ openlag freeze --profile architecture --dry-run

Notes:
  Export profiles live in docs/contracts/export-profiles/*.yaml.
  If --output has an extension it is used as the target file.
  If --output has no extension it is used as the output directory.
`)
    .action((options) => {
      try {
        const result = createDocumentationFreeze({
          projectRoot: process.cwd(),
          profile: options.profile,
          format: options.format,
          template: options.template,
          output: options.output,
          dryRun: options.dryRun,
        });

        console.log(chalk.blue(`Profile: ${result.profile.id}`));
        console.log(chalk.blue(`Artifacts: ${result.artifactCount}`));
        console.log(chalk.blue(`Relations: ${result.relationCount}`));
        console.log(chalk.blue(`Format: ${result.format}`));
        console.log(chalk.blue(`Output: ${result.outputFile}`));

        if (result.dryRun) {
          console.log(chalk.yellow('Dry run only. No files were written.'));
        } else {
          console.log(chalk.green('Documentation freeze generated.'));
        }
      } catch (error) {
        console.error(chalk.red((error as Error).message));
        process.exit(1);
      }
    });
}
