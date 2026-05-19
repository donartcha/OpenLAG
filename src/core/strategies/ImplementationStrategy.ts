import { ProjectionStrategy, StrategyResultGroup } from './types';
import { Artifact, ArtifactType } from '../../types';

const IMPLEMENTATION_ORDER: ArtifactType[] = [
  'DECISION',
  'DESIGN',
  'COMPONENT',
  'FEATURE',
  'CODE_ENTITY',
  'TEST_CASE'
] as ArtifactType[];

export const ImplementationStrategy: ProjectionStrategy = {
  info: {
    id: 'implementation',
    label: 'Implementation',
    description: 'Shows what must be implemented first.'
  },
  project: (artifacts: Artifact[]): StrategyResultGroup[] => {
    const groupsMap = new Map<ArtifactType, Artifact[]>();
    
    IMPLEMENTATION_ORDER.forEach(type => {
      groupsMap.set(type, []);
    });

    artifacts.forEach(artifact => {
      if (groupsMap.has(artifact.type)) {
        groupsMap.get(artifact.type)!.push(artifact);
      }
    });

    const results: StrategyResultGroup[] = [];
    IMPLEMENTATION_ORDER.forEach(type => {
      const arts = groupsMap.get(type);
      if (arts && arts.length > 0) {
        results.push({
          id: `impl-${type}`,
          title: type.replace(/_/g, ' '),
          artifacts: arts
        });
      }
    });

    return results;
  }
};
