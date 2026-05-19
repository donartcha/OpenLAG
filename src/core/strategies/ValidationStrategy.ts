import { ProjectionStrategy, StrategyResultGroup } from './types';
import { Artifact, ArtifactType } from '../../types';

const VALIDATION_ORDER: ArtifactType[] = [
  'REQUIREMENT',
  'FEATURE',
  'TEST_CASE',
  'BUG',
  'CHANGE',
  'INCIDENT'
] as ArtifactType[];

export const ValidationStrategy: ProjectionStrategy = {
  info: {
    id: 'validation',
    label: 'Validation',
    description: 'Visualizes validation traceability.'
  },
  project: (artifacts: Artifact[]): StrategyResultGroup[] => {
    const groupsMap = new Map<ArtifactType, Artifact[]>();
    VALIDATION_ORDER.forEach(type => {
      groupsMap.set(type, []);
    });

    artifacts.forEach(artifact => {
      if (groupsMap.has(artifact.type)) {
        groupsMap.get(artifact.type)!.push(artifact);
      }
    });

    const results: StrategyResultGroup[] = [];
    VALIDATION_ORDER.forEach(type => {
      const arts = groupsMap.get(type);
      if (arts && arts.length > 0) {
        results.push({
          id: `valid-${type}`,
          title: type.replace(/_/g, ' '),
          artifacts: arts
        });
      }
    });

    return results;
  }
};
