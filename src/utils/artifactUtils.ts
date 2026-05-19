import { Artifact, ArtifactType, ArtifactLayer, GraphSnapshot } from '../types';

export function getImplicitLayer(type: ArtifactType): ArtifactLayer | undefined {
  switch (type) {
    case 'PROJECT':
    case 'EPIC':
    case 'FEATURE':
    case 'REQUIREMENT':
    case 'USE_CASE':
    case 'BUSINESS_RULE':
      return 'BUSINESS';
    case 'DESIGN':
    case 'DECISION':
    case 'API':
    case 'COMPONENT':
      return 'ARCHITECTURE';
    case 'CODE_ENTITY':
    case 'TEST_CASE':
    case 'DATABASE_ENTITY':
    case 'CHANGE':
    case 'BUG':
    case 'LIBRARY':
    case 'ENVIRONMENT':
      return 'IMPLEMENTATION';
    case 'INFRASTRUCTURE':
    case 'DEPLOYMENT':
    case 'MONITORING':
    case 'INCIDENT':
    case 'MAINTENANCE':
    case 'PIPELINE':
    case 'CHECK':
      return 'OPERATIONS';
    case 'GLOSSARY_TERM':
    case 'DOCUMENTATION':
    case 'PROCESS':
    case 'VERSION':
    case 'SYSTEM_VERSION':
      return 'DOCUMENTATION';
    default:
      return undefined;
  }
}

export function getArtifactLayer(artifact: Artifact): ArtifactLayer | undefined {
  if (artifact.layer) {
    return artifact.layer;
  }
  return getImplicitLayer(artifact.type);
}

// Traverse up REFINES or IMPLEMENTS relations to find inherited ownership
function findInheritedOwnership(
  artifactId: string,
  graph: GraphSnapshot,
  visited: Set<string>
): { owner?: string; team?: string } {
  if (visited.has(artifactId)) return {};
  visited.add(artifactId);

  const artifact = graph.artifacts.find(a => a.id === artifactId);
  if (!artifact) return {};

  if (artifact.ownership?.owner || artifact.ownership?.team) {
    return { owner: artifact.ownership.owner, team: artifact.ownership.team };
  }

  // Look for incoming REFINES or IMPLEMENTS (e.g. this artifact REFINES parent or this artifact IMPLEMENTS parent)
  // Actually, wait: 'from' REFINES 'to' meant "from is smaller, to is bigger". So 'to' is the parent!
  const parentRelations = graph.relations.filter(
    r => r.from === artifactId && (r.type === 'REFINES' || r.type === 'IMPLEMENTS')
  );

  for (const rel of parentRelations) {
    const parentOwnership = findInheritedOwnership(rel.to, graph, visited);
    if (parentOwnership.owner || parentOwnership.team) {
      return parentOwnership;
    }
  }

  return {};
}

export function getArtifactOwner(artifact: Artifact, graph: GraphSnapshot | null): string | undefined {
  if (artifact.ownership?.owner) return artifact.ownership.owner;
  if (!graph) return undefined;
  return findInheritedOwnership(artifact.id, graph, new Set()).owner;
}

export function getArtifactTeam(artifact: Artifact, graph: GraphSnapshot | null): string | undefined {
  if (artifact.ownership?.team) return artifact.ownership.team;
  if (!graph) return undefined;
  return findInheritedOwnership(artifact.id, graph, new Set()).team;
}
