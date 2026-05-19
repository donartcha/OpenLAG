import { ProjectionStrategy, StrategyResultGroup } from './types';
import { Artifact, ArtifactType, ArtifactLayer } from '../../types';
import { getArtifactLayer } from '../../utils/artifactUtils';

const LAYER_ORDER: ArtifactLayer[] = [
  'BUSINESS',
  'ARCHITECTURE',
  'IMPLEMENTATION',
  'VERIFICATION',
  'OPERATIONS',
  'GOVERNANCE',
  'DOCUMENTATION'
];

export const LifecycleStrategy: ProjectionStrategy = {
  info: {
    id: 'lifecycle',
    label: 'Lifecycle Stage',
    description: 'Natural evolution of the software from vision to changelog.'
  },
  project: (artifacts: Artifact[]): StrategyResultGroup[] => {
    // Group by Layer
    const groupsMap = new Map<string, Artifact[]>();
    
    LAYER_ORDER.forEach(layer => {
      groupsMap.set(layer, []);
    });

    artifacts.forEach(artifact => {
      const layer = getArtifactLayer(artifact) || 'UNKNOWN';
      if (groupsMap.has(layer)) {
        groupsMap.get(layer)!.push(artifact);
      } else {
        if (!groupsMap.has(layer)) groupsMap.set(layer, []);
        groupsMap.get(layer)!.push(artifact);
      }
    });

    const results: StrategyResultGroup[] = [];
    LAYER_ORDER.forEach(layer => {
      const arts = groupsMap.get(layer);
      if (arts && arts.length > 0) {
        results.push({
          id: `lifecycle-layer-${layer}`,
          title: layer.replace(/_/g, ' '),
          artifacts: arts
        });
      }
    });

    // Handle any unknown or custom layers
    Array.from(groupsMap.entries())
      .filter(([layer]) => !LAYER_ORDER.includes(layer as ArtifactLayer) && groupsMap.get(layer)!.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([layer, arts]) => {
          results.push({
            id: `lifecycle-other-${layer}`,
            title: layer.replace(/_/g, ' '),
            artifacts: arts
          });
      });

    return results;
  }
};
