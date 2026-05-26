import { ArtifactType } from "../../../src/types.js";
import { inferLayer } from "../../../src/core/semantic/artifact-layers.js";
import { ArtifactRegistry } from "../../../src/core/registry/ArtifactRegistry.js";

export function normalizeArtifact(parsed: any, fullPath: string, body: string): any {
  const p = {...parsed};

  const typeValue = (p.type || p.Type) as ArtifactType;

  // Rule: Layer is inferred from registry. If not natively found, use legacy inferLayer
  // User override in YAML (p.layer) has highest priority for the struct
  const contract = ArtifactRegistry.getContract(typeValue);
  const derivedLayer = contract?.layer || inferLayer(typeValue);

  return {
    id: String(p.id || p.ID || ''),
    type: typeValue,
    title: String(p.title || p.Title || (p.id || p.ID || '')),
    version: p.version || p.Version,
    description: body || p.description,
    status: p.status,
    layer: p.layer || derivedLayer,
    ownership: p.ownership || p.owner ? { owner: p.owner, ...p.ownership } : undefined,
    file: fullPath,
    raw: p
  };
}
