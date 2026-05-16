import path from 'path';
import { runLint, printHumanReport, loadConfig } from './lint/lint-engine.js';

function parseArgs() {
  const args = process.argv.slice(2);
  let profile = '';
  let jsonOutput = false;
  let strictWarnings = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--profile' && args[i + 1]) {
      profile = args[i + 1];
      i++;
    } else if (args[i] === '--json') {
      jsonOutput = true;
    } else if (args[i] === '--strict-warnings') {
      strictWarnings = true;
    }
  }

  return { profile, jsonOutput, strictWarnings };
}

function main() {
  const args = parseArgs();
  const docsDir = path.join(process.cwd(), 'docs');
  const configPath = path.join(process.cwd(), 'openlag.config.yml');

  const config = loadConfig(configPath);
  
  const report = runLint(docsDir, configPath, args.profile);

  if (args.jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printHumanReport(report);
  }

  const failOnWarnings = args.strictWarnings || config.failOnWarnings;

  let hasErrors = report.summary.errors > 0;
  if (failOnWarnings && report.summary.warnings > 0) {
      hasErrors = true;
  }

  if (hasErrors) {
     process.exit(1);
  } else {
     process.exit(0);
  }
}

main();
