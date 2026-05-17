import { GraphSnapshot, Artifact, Relation } from "../../types.js";

export interface GraphIndex {
  artifactsById: Map<string, Artifact>;
  relationsBySource: Map<string, Relation[]>;
  relationsByTarget: Map<string, Relation[]>;
  artifactsByType: Map<string, Artifact[]>;
  artifactsByLayer: Map<string, Artifact[]>;
  artifactsByStatus: Map<string, Artifact[]>;
  artifactsByOwner: Map<string, Artifact[]>;
  artifactsByTeam: Map<string, Artifact[]>;
}

export interface GraphQueryOptions {
  focusId?: string;
  depth?: number;
  maxNodes?: number;
  showWeakRelations?: boolean;
  filterLayer?: string;
  filterOwner?: string;
  filterTeam?: string;
}

export const MAX_RENDER_NODES = 150;
export const MAX_RENDER_EDGES = 300;
export const DEFAULT_NEIGHBORHOOD_DEPTH = 1;
export const MAX_EXPANSION_DEPTH = 3;
export const HUB_COLLAPSE_THRESHOLD = 25;
export const WEAK_RELATIONS_VISIBLE_BY_DEFAULT = false;

const WEAK_CATEGORIES = ['SEMANTIC', 'TRACEABILITY', 'DEPENDENCY'];

export function buildGraphIndex(graph: GraphSnapshot): GraphIndex {
  const index: GraphIndex = {
    artifactsById: new Map(),
    relationsBySource: new Map(),
    relationsByTarget: new Map(),
    artifactsByType: new Map(),
    artifactsByLayer: new Map(),
    artifactsByStatus: new Map(),
    artifactsByOwner: new Map(),
    artifactsByTeam: new Map(),
  };

  graph.artifacts.forEach(a => {
    index.artifactsById.set(a.id, a);
    
    if (a.type) {
      if (!index.artifactsByType.has(a.type)) index.artifactsByType.set(a.type, []);
      index.artifactsByType.get(a.type)!.push(a);
    }
    
    if (a.layer) {
      if (!index.artifactsByLayer.has(a.layer)) index.artifactsByLayer.set(a.layer, []);
      index.artifactsByLayer.get(a.layer)!.push(a);
    }
    
    if (a.status) {
      if (!index.artifactsByStatus.has(a.status)) index.artifactsByStatus.set(a.status, []);
      index.artifactsByStatus.get(a.status)!.push(a);
    }

    if (a.ownership?.owner) {
      if (!index.artifactsByOwner.has(a.ownership.owner)) index.artifactsByOwner.set(a.ownership.owner, []);
      index.artifactsByOwner.get(a.ownership.owner)!.push(a);
    }

    if (a.ownership?.team) {
      if (!index.artifactsByTeam.has(a.ownership.team)) index.artifactsByTeam.set(a.ownership.team, []);
      index.artifactsByTeam.get(a.ownership.team)!.push(a);
    }
  });

  graph.relations.forEach(r => {
    if (!index.relationsBySource.has(r.from)) index.relationsBySource.set(r.from, []);
    index.relationsBySource.get(r.from)!.push(r);
    
    if (!index.relationsByTarget.has(r.to)) index.relationsByTarget.set(r.to, []);
    index.relationsByTarget.get(r.to)!.push(r);
  });

  return index;
}

function isRelationAllowed(rel: Relation, options: GraphQueryOptions): boolean {
  if (!options.showWeakRelations && WEAK_CATEGORIES.includes(rel.strength || (rel.category === 'SEMANTIC' ? 'WEAK' : 'STRONG'))) {
    // we need to rely on rel config here, wait rel has only type?
    // we should use a registry maybe, but for now let's just make it generic
    // wait relation has type, category is not always present in data, but it might be.
    // Assuming strength is mapped somehow or we check relation type
    if (['RELATES_TO', 'DOCUMENTS'].includes(rel.type)) {
      return false;
    }
  }
  return true;
}

export function projectSubgraph(graph: GraphSnapshot, index: GraphIndex, options: GraphQueryOptions): GraphSnapshot {
  const { 
    focusId, 
    depth = DEFAULT_NEIGHBORHOOD_DEPTH, 
    filterLayer = 'ALL', 
    filterOwner = 'ALL', 
    filterTeam = 'ALL' 
  } = options;

  let artifacts = new Set<Artifact>();
  let relations = new Set<Relation>();

  const isArtifactAllowed = (a: Artifact) => {
    if (filterLayer !== 'ALL' && a.layer !== filterLayer) return false;
    if (filterOwner !== 'ALL' && a.ownership?.owner !== filterOwner) return false;
    if (filterTeam !== 'ALL' && a.ownership?.team !== filterTeam) return false;
    return true;
  };

  if (focusId) {
    // Neighborhood exploration
    const root = index.artifactsById.get(focusId);
    if (!root || !isArtifactAllowed(root)) return { artifacts: [], relations: [] };
    
    artifacts.add(root);
    let queue: { id: string, currentDepth: number }[] = [{ id: focusId, currentDepth: 0 }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const { id, currentDepth } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);

      if (currentDepth >= depth) continue;

      const outgoing = index.relationsBySource.get(id) || [];
      const incoming = index.relationsByTarget.get(id) || [];

      [...outgoing, ...incoming].forEach(rel => {
        if (!isRelationAllowed(rel, options)) return;

        const otherId = rel.from === id ? rel.to : rel.from;
        const otherArt = index.artifactsById.get(otherId);
        
        if (otherArt && isArtifactAllowed(otherArt)) {
          relations.add(rel);
          artifacts.add(otherArt);
          if (!visited.has(otherId)) {
            queue.push({ id: otherId, currentDepth: currentDepth + 1 });
          }
        }
      });
    }

  } else {
    // If no focus, return all (subject to limits and filters layer)
    // and hide weak relations if flag is off
    graph.artifacts.forEach(a => {
      if (isArtifactAllowed(a)) artifacts.add(a);
    });
    graph.relations.forEach(r => {
      const from = index.artifactsById.get(r.from);
      const to = index.artifactsById.get(r.to);
      if (from && to && isArtifactAllowed(from) && isArtifactAllowed(to) && isRelationAllowed(r, options)) {
        relations.add(r);
      }
    });

    // If still too large, we might truncate to prevent crash, though graph limits are handled later or gracefully
    if (artifacts.size > MAX_RENDER_NODES && !focusId) {
      const allArtifacts = Array.from(artifacts).slice(0, MAX_RENDER_NODES);
      const allowedIds = new Set(allArtifacts.map(a => a.id));
      const filteredRelations = Array.from(relations).filter(r => allowedIds.has(r.from) && allowedIds.has(r.to));
      
      return {
        artifacts: allArtifacts,
        relations: filteredRelations
      };
    }
  }

  // Hub suppression or capping
  if (artifacts.size > MAX_RENDER_NODES) {
     const allArtifacts = Array.from(artifacts).slice(0, MAX_RENDER_NODES);
     const allowedIds = new Set(allArtifacts.map(a => a.id));
     const filteredRelations = Array.from(relations).filter(r => allowedIds.has(r.from) && allowedIds.has(r.to));
     return {
       artifacts: allArtifacts,
       relations: filteredRelations
     };
  }

  return {
    artifacts: Array.from(artifacts),
    relations: Array.from(relations)
  };
}
