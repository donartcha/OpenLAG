import fs from "fs";
import path from "path";
import yaml from "js-yaml";
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
  console.log(`\nOpenLAG Lint Report`);
  console.log(`Profile: ${report.profile}\n`);

  if (report.issues.length === 0) {
      console.log(`✅ No issues found!\n`);
  } else {
      for (const issue of report.issues) {
          const sevColor = issue.severity === 'error' ? '\x1b[31m' : (issue.severity === 'warning' ? '\x1b[33m' : '\x1b[36m');
          const reset = '\x1b[0m';
          const severityLabel = issue.severity.toUpperCase().padEnd(7);
          const ruleLabel = issue.rule.padEnd(30);
          console.log(`${sevColor}${severityLabel}${reset} ${ruleLabel} ${issue.message}`);
      }
  }

  console.log(`\nSummary:`);
  console.log(`Errors: ${report.summary.errors}`);
  console.log(`Warnings: ${report.summary.warnings}`);
  console.log(`Info: ${report.summary.info}\n`);
}
