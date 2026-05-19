import { ProjectionStrategy, StrategyResultGroup } from './types';
import { Artifact } from '../../types';
import { getArtifactLayer } from '../../utils/artifactUtils';

export const ImplementationStrategy: ProjectionStrategy = {
  info: {
    id: 'implementation',
    label: 'Implementation',
    description: 'Shows what must be implemented first.'
  },
  project: (artifacts: Artifact[]): StrategyResultGroup[] => {
    const filtered = artifacts.filter(a => getArtifactLayer(a) === 'IMPLEMENTATION');
    const typesMap = new Map<string, Artifact[]>();

    filtered.forEach(a => {
      if (!typesMap.has(a.type)) typesMap.set(a.type, []);
      typesMap.get(a.type)!.push(a);
    });

    return Array.from(typesMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([type, arts]) => ({
        id: `impl-${type}`,
        title: type.replace(/_/g, ' '),
        artifacts: arts
      }));
  }
};
