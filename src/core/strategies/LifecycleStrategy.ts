import { ProjectionStrategy, StrategyResultGroup } from './types';
import { Artifact, ArtifactType } from '../../types';

const LIFECYCLE_ORDER: ArtifactType[] = [
  'VISION', 
  'PROJECT', 
  'VERSION', 
  'EPIC', 
  'REQUIREMENT', 
  'USE_CASE', 
  'DECISION', 
  'DESIGN', 
  'COMPONENT', 
  'FEATURE', 
  'CODE_ENTITY', 
  'TEST_CASE', 
  'RISK', 
  'CHANGE',
  'CHANGELOG'
] as ArtifactType[];

export const LifecycleStrategy: ProjectionStrategy = {
  info: {
    id: 'lifecycle',
    label: 'Lifecycle Stage',
    description: 'Natural evolution of the software from vision to changelog.'
  },
  project: (artifacts: Artifact[]): StrategyResultGroup[] => {
    // Group by ArtifactType according to LIFECYCLE_ORDER
    const groupsMap = new Map<ArtifactType, Artifact[]>();
    
    // Process all known types first
    LIFECYCLE_ORDER.forEach(type => {
      groupsMap.set(type, []);
    });

    const otherGroup: Artifact[] = [];

    artifacts.forEach(artifact => {
      if (groupsMap.has(artifact.type)) {
        groupsMap.get(artifact.type)!.push(artifact);
      } else {
        otherGroup.push(artifact);
      }
    });

    const results: StrategyResultGroup[] = [];
    LIFECYCLE_ORDER.forEach(type => {
      const arts = groupsMap.get(type);
      if (arts && arts.length > 0) {
        results.push({
          id: `lifecycle-${type}`,
          title: type.replace(/_/g, ' '),
          artifacts: arts
        });
      }
    });

    if (otherGroup.length > 0) {
      // Group others by their type
      const otherMap = new Map<string, Artifact[]>();
      otherGroup.forEach(a => {
        if (!otherMap.has(a.type)) otherMap.set(a.type, []);
        otherMap.get(a.type)!.push(a);
      });

      Array.from(otherMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .forEach(([type, arts]) => {
          results.push({
            id: `lifecycle-other-${type}`,
            title: type.replace(/_/g, ' '),
            artifacts: arts
          });
        });
    }

    return results;
  }
};
