import path from 'path';
import { runLint, printHumanReport, loadConfig } from '../lint/lint-engine.js';
import chalk from 'chalk';

export function lintDocs(profile: string, jsonOutput = false, strictWarnings = false) {
  const docsDir = path.join(process.cwd(), 'docs');
  const configPath = path.join(process.cwd(), 'openlag.config.yml');

  const config = loadConfig(configPath);
  
  const report = runLint(docsDir, configPath, profile);

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }

  const failOnWarnings = strictWarnings || config.failOnWarnings;

  let hasErrors = report.summary.errors > 0;
  if (failOnWarnings && report.summary.warnings > 0) {
      hasErrors = true;
  }

  if (hasErrors) {
     process.exit(1);
  }
}
