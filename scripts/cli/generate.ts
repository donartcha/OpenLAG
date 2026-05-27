import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { parseOpenLagDocs } from "../core/parser.js";
import { loadArtifactContracts } from "../core/artifact-contracts.js";
import { loadRelationContracts } from "../core/relation-contracts.js";
import { Version, Change, SystemVersion, GraphSnapshot } from "../../src/types.js";
import chokidar from "chokidar";
import chalk from "chalk";
import { runLintRules } from "../lint/lint-rules.js";
import { defaultProfiles } from "../lint/lint-profiles.js";

interface StaticState {
  versions: Version[];
  systemVersions: SystemVersion[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
  lintReports: Record<string, any>;
  metadata?: { name: string; description: string; [key: string]: any };
}

function isDescendant(currentVersionId: string, artifactVersionId: string, versions: Version[]): boolean {
    const artifactVersion = versions.find(v => v.id === artifactVersionId);
    if (!artifactVersion) return false;
    
    let temp = versions.find(v => v.id === currentVersionId);
    let depth = 0;
    while (temp && temp.parentVersion) {
        depth++;
        if (depth > 50) return false;
        if (temp.parentVersion === artifactVersionId) return true;
        temp = versions.find(v => v.id === temp!.parentVersion);
    }
    return false;
}

export function generateData(docsDir: string, outputDir: string, silent = false) {
  if (!silent) console.log(chalk.blue("🚀 Generating OpenLAG Static Data..."));

  const artifactContracts = loadArtifactContracts(path.join(docsDir, 'contracts', 'artifacts'));
  const relationContracts = loadRelationContracts(path.join(docsDir, 'contracts', 'relations'));
  const rulesDir = path.join(docsDir, 'contracts', 'rules');
  const ruleContracts: any[] = [];
  if (fs.existsSync(rulesDir)) {
    for (const file of fs.readdirSync(rulesDir)) {
      if (!file.endsWith('.yaml')) continue;
      const raw = fs.readFileSync(path.join(rulesDir, file), 'utf-8');
      const parsed = yaml.load(raw);
      if (parsed) ruleContracts.push(parsed);
    }
  }
  const parsedData = parseOpenLagDocs(docsDir);

  let metadata = { name: "OpenLAG Project", description: "Architecture documentation." };
  const metadataPath = path.join(docsDir, '..', 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    } catch (e) {
      if (!silent) console.warn(chalk.yellow("⚠️  Could not parse metadata.json"));
    }
  }

  const lintReports: Record<string, any> = {};
  for (const profileName of ['draft', 'develop', 'feature', 'release']) {
    const profile = defaultProfiles[profileName];
    if (profile) {
      lintReports[profileName] = { issues: runLintRules(parsedData, profile) };
    }
  }

  const state: StaticState = {
    versions: parsedData.versions,
    systemVersions: parsedData.systemVersions,
    graphs: {},
    changes: parsedData.changes,
    lintReports,
    metadata
  };

  const allArtifacts = parsedData.artifacts;
  const allRelations = parsedData.relations;

  state.versions.forEach(v => {
    state.graphs[v.id] = {
      artifacts: allArtifacts.filter(a => a.type === 'SYSTEM_VERSION' || a.type === 'VERSION' || a.version === v.id || isDescendant(v.id, a.version, state.versions)),
      relations: allRelations.filter(r => {
        const fromArt = allArtifacts.find(a => a.id === r.from);
        return fromArt && (fromArt.type === 'SYSTEM_VERSION' || fromArt.type === 'VERSION' || fromArt.version === v.id || isDescendant(v.id, fromArt.version, state.versions));
      })
    };
  });

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  if (artifactContracts.length > 0) {
    fs.writeFileSync(
      path.join(outputDir, 'artifact-definitions.json'),
      JSON.stringify(artifactContracts, null, 2)
    );
  }

  if (relationContracts.length > 0) {
    fs.writeFileSync(
      path.join(outputDir, 'relation-definitions.json'),
      JSON.stringify(relationContracts, null, 2)
    );
  }

  if (ruleContracts.length > 0) {
    fs.writeFileSync(
      path.join(outputDir, 'rule-definitions.json'),
      JSON.stringify(ruleContracts, null, 2)
    );
  }

  fs.writeFileSync(
    path.join(outputDir, 'graph-data.json'),
    JSON.stringify(state, null, 2)
  );

  if (!silent) console.log(chalk.green("✅ Data generated at"), chalk.cyan(path.join(outputDir, 'graph-data.json')));
}

export function watchData(docsDir: string, outputDir: string) {
  console.log(chalk.yellow("👀 Watching for changes in"), chalk.cyan(docsDir));
  
  const watcher = chokidar.watch(docsDir, {
    ignoreInitial: true,
    persistent: true
  });

  const runCleanly = () => {
    try {
      generateData(docsDir, outputDir, true);
      console.log(chalk.dim(`[${new Date().toLocaleTimeString()}] `) + chalk.green("Regenerated graph-data.json"));
    } catch (e) {
      console.error(chalk.red("❌ Error during regeneration:"), e);
    }
  };

  // Debounce to avoid multiple rapid regenerations
  let timeout: NodeJS.Timeout;
  const debouncedRun = () => {
    clearTimeout(timeout);
    timeout = setTimeout(runCleanly, 300);
  };

  watcher.on('all', (event, path) => {
    debouncedRun();
  });
}
