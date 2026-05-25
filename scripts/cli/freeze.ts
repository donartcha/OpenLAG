import chalk from 'chalk';
import { Command } from 'commander';

import { createDocumentationFreeze } from '../core/freeze.js';

export function registerFreezeCommand(program: Command) {
  program
    .command('freeze')
    .description('Generate a deterministic documentation freeze from the OpenLAG graph')
    .option('-p, --profile <profile>', 'Export profile from docs/export-profiles', 'architecture')
    .option('--format <format>', 'Output format (markdown in P1)', 'markdown')
    .option('-o, --output <path>', 'Output directory or .md file')
    .option('--dry-run', 'Preview what would be exported without writing files')
    .action((options) => {
      try {
        const result = createDocumentationFreeze({
          projectRoot: process.cwd(),
          profile: options.profile,
          format: options.format,
          output: options.output,
          dryRun: options.dryRun,
        });

        console.log(chalk.blue(`Profile: ${result.profile.id}`));
        console.log(chalk.blue(`Artifacts: ${result.artifactCount}`));
        console.log(chalk.blue(`Relations: ${result.relationCount}`));
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
