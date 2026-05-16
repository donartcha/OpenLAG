import fs from "fs";
import path from "path";
import { parseOpenLagDocs, OpenLagData } from "./core/parser.js";
import { Version, Artifact, Relation, Change, SystemVersion, GraphSnapshot } from "../src/types.js";

// --- Domain Model mapping  ---

interface StaticState {
  versions: Version[];
  systemVersions: SystemVersion[];
  graphs: Record<string, GraphSnapshot>;
  changes: Change[];
}

function isDescendant(currentVersionId: string, artifactVersionId: string, versions: Version[]): boolean {
    const artifactVersion = versions.find(v => v.id === artifactVersionId);
    const currentVersion = versions.find(v => v.id === currentVersionId);
    if (!artifactVersion || !currentVersion) return false;
    
    let temp = currentVersion;
    let depth = 0;
    while (temp.parentVersion) {
        depth++;
        if (depth > 20) return false;
        if (temp.parentVersion === artifactVersionId) return true;
        const parent = versions.find(v => v.id === temp.parentVersion);
        if (!parent) break;
        temp = parent;
    }
    return false;
}

function generate() {
  console.log("🚀 Starting OpenLAG Static Generation...");
  const docsDir = path.join(process.cwd(), 'docs');

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
      artifacts: allArtifacts.filter(a => a.version === v.id || isDescendant(v.id, a.version, state.versions)),
      relations: allRelations.filter(r => {
        const fromArt = allArtifacts.find(a => a.id === r.from);
        return fromArt && (fromArt.version === v.id || isDescendant(v.id, fromArt.version, state.versions));
      })
    };
  });

  const outDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, 'graph-data.json'),
    JSON.stringify(state, null, 2)
  );

  console.log("✅ Static data generated at public/graph-data.json");
}

generate();

