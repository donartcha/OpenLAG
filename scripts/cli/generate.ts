import fs from "fs";
import path from "path";
import { parseOpenLagDocs } from "../core/parser.js";
import { Version, Change, SystemVersion, GraphSnapshot } from "../../src/types.js";
import chokidar from "chokidar";
import chalk from "chalk";

interface StaticState {
  versions: Version[];
  systemVersions: SystemVersion[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
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

  const parsedData = parseOpenLagDocs(docsDir);

  const state: StaticState = {
    versions: parsedData.versions,
    systemVersions: parsedData.systemVersions,
    graphs: {},
    changes: parsedData.changes
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
