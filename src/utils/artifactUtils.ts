import { Artifact, ArtifactType, ArtifactLayer, GraphSnapshot } from '../types';
import { ArtifactRegistry } from '../core/registry/ArtifactRegistry';

/**
 * Derives the implicit or default architectural layer for a given ArtifactType.
 * It first consults the dynamic ArtifactRegistry contracts. If not found,
 * it checks the base type contract or falls back to legacy known categorizations.
 * 
 * @param type The artifact type (e.g., 'API', 'DAO', 'CODE_ENTITY')
 * @returns The resolved ArtifactLayer (e.g., 'IMPLEMENTATION', 'ARCHITECTURE') or undefined.
 */
export function getImplicitLayer(type: ArtifactType): ArtifactLayer | undefined {
  const contract = ArtifactRegistry.getContract(type);
  if (contract && contract.layer) {
    return contract.layer as ArtifactLayer;
  }
  
  // Try fallback to base type
  const baseType = ArtifactRegistry.getBaseType(type);
  const baseContract = ArtifactRegistry.getContract(baseType);
  if (baseContract && baseContract.layer) {
    return baseContract.layer as ArtifactLayer;
  }

  // Final manual fallback for legacy known types if registry somehow misses them
  switch (baseType) {
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

/**
 * Returns the declared architectural layer of an artifact. Let's first check if
 * a `layer` was explicitly overridden in the artifact YAML payload. Otherwise,
 * falls back to the implicit layer bound to the type's contract.
 *
 * @param artifact The fully parsed artifact object.
 * @returns The resolved overarching layer.
 */
export function getArtifactLayer(artifact: Artifact): ArtifactLayer | undefined {
  if (artifact.layer) {
    return artifact.layer as ArtifactLayer;
  }
  return getImplicitLayer(artifact.type);
}

/**
 * Traverses up REFINES or IMPLEMENTS relations recursively to find 
 * inherited ownership boundaries (owner or team).
 *
 * @param artifactId The starting node to ascend from.
 * @param graph The whole parsed topological graph.
 * @param visited Mechanism to avoid cyclical lookup explosions.
 * @returns An object containing owner and/or team if found in ancestor path.
 */
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

/**
 * Returns the explicit owner of an artifact, or its inherited owner if omitted.
 *
 * @param artifact The artifact object.
 * @param graph The whole architecture graph (needed for traversal).
 * @returns The resolved owner name, or undefined.
 */
export function getArtifactOwner(artifact: Artifact, graph: GraphSnapshot | null): string | undefined {
  if (artifact.ownership?.owner) return artifact.ownership.owner;
  if (!graph) return undefined;
  return findInheritedOwnership(artifact.id, graph, new Set()).owner;
}

/**
 * Returns the explicit owning team of an artifact, or its inherited team if omitted.
 *
 * @param artifact The artifact object.
 * @param graph The whole architecture graph (needed for traversal).
 * @returns The resolved team name, or undefined.
 */
export function getArtifactTeam(artifact: Artifact, graph: GraphSnapshot | null): string | undefined {
  if (artifact.ownership?.team) return artifact.ownership.team;
  if (!graph) return undefined;
  return findInheritedOwnership(artifact.id, graph, new Set()).team;
}
