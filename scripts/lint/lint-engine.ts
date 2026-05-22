import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import chalk from 'chalk';
import { parseOpenLagDocs } from "../core/parser.js";
import { runLintRules } from "./lint-rules.js";
import { defaultProfiles } from "./lint-profiles.js";
import { LintConfig, LintReport, LintIssue, LintSummary } from "./lint-types.js";

export function loadConfig(configPath: string): LintConfig {
  const defaultConfig: LintConfig = {
    defaultProfile: 'develop',
    failOnWarnings: false,
    profiles: {}
  };

  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const parsed = yaml.load(fileContent) as any;
      if (parsed && parsed.lint) {
        return {
          ...defaultConfig,
          ...parsed.lint
        };
      }
    } catch (e) {
      console.warn("⚠️  Could not parse openlag.config.yml, using defaults.");
    }
  }

  return defaultConfig;
}

export function runLint(docsDir: string, configPath: string, profileName?: string): LintReport {
  const config = loadConfig(configPath);
  const selectedProfileName = profileName || config.defaultProfile;
  
  const baseProfile = defaultProfiles[selectedProfileName] || defaultProfiles['develop'];
  const customProfileOverrides = config.profiles[selectedProfileName] || {};
  
  const activeProfile = { ...baseProfile, ...customProfileOverrides };

  const parsedData = parseOpenLagDocs(docsDir);
  const issues = runLintRules(parsedData, activeProfile);

  const summary: LintSummary = {
     errors: 0,
     warnings: 0,
     info: 0
  };

  for (const issue of issues) {
     if (issue.severity === 'error') summary.errors++;
     if (issue.severity === 'warning') summary.warnings++;
     if (issue.severity === 'info') summary.info++;
  }

  return {
    profile: selectedProfileName,
    summary,
    issues
  };
}

export function printHumanReport(report: LintReport) {
  console.log(`\n` + chalk.bold(`OpenLAG Lint Report`));
  console.log(chalk.dim(`Profile: ${report.profile}\n`));

  if (report.issues.length === 0) {
      console.log(chalk.green(`✅ No issues found!\n`));
  } else {
      for (const issue of report.issues) {
          const sevColor = issue.severity === 'error' ? chalk.red : (issue.severity === 'warning' ? chalk.yellow : chalk.cyan);
          const severityLabel = issue.severity.toUpperCase().padEnd(7);
          const ruleLabel = issue.rule.padEnd(30);
          const context = issue.artifactId ? chalk.magenta(`[${issue.artifactId}] `) : (issue.file ? chalk.magenta(`[${path.basename(issue.file)}] `) : '');
          console.log(`${sevColor(severityLabel)} ${chalk.dim(ruleLabel)} ${context}${issue.message}`);
      }
  }

  console.log(`\n` + chalk.bold(`Summary:`));
  console.log(chalk.red(`Errors:   ${report.summary.errors}`));
  console.log(chalk.yellow(`Warnings: ${report.summary.warnings}`));
  console.log(chalk.cyan(`Info:     ${report.summary.info}\n`));
}
