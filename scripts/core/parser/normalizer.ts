import { ArtifactType } from "../../../src/types.js";
import { inferLayer } from "../../../src/core/semantic/artifact-layers.js";

export function normalizeArtifact(parsed: any, fullPath: string, body: string): any {
  const p = {...parsed};
  if (!p.schemaVersion) {
      p.schemaVersion = '1.0.0'; // Assign legacy version
  }

  const typeValue = (p.type || p.Type) as ArtifactType;
  return {
    id: String(p.id || p.ID || ''),
    type: typeValue,
    subType: p.subType || p.subtype || p.SubType,
    title: String(p.title || p.Title || (p.id || p.ID || '')),
    version: String(p.version || p.Version || 'v-1'),
    description: body,
    systemVersionId: p.systemVersionId || p.systemversionid,
    component: p.component,
    releaseDate: p.releaseDate || p.timestamp,
    status: p.status,
    layer: inferLayer(typeValue),
    ownership: p.ownership || p.owner ? { owner: p.owner, ...p.ownership } : undefined,
    file: fullPath,
    schemaVersion: p.schemaVersion
  };
}
