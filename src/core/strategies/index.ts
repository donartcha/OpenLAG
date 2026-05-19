export * from './types';
import { ProjectionStrategy, ProjectionStrategyInfo } from './types';
import { LifecycleStrategy } from './LifecycleStrategy';
import { ImplementationStrategy } from './ImplementationStrategy';
import { ValidationStrategy } from './ValidationStrategy';
import { Artifact } from '../../types';
import { getArtifactLayer } from '../../utils/artifactUtils';

// Helper function to group artifacts of a specific layer by their type
function groupByLayerAndType(artifacts: Artifact[], layer: string, idPrefix: string) {
  const filtered = artifacts.filter(a => getArtifactLayer(a) === layer);
  const typesMap = new Map<string, Artifact[]>();

  filtered.forEach(a => {
    if (!typesMap.has(a.type)) typesMap.set(a.type, []);
    typesMap.get(a.type)!.push(a);
  });

  return Array.from(typesMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([type, arts]) => ({
      id: `${idPrefix}-${type}`,
      title: type.replace(/_/g, ' '),
      artifacts: arts
    }));
}

const ArchitectureStrategy: ProjectionStrategy = {
  info: { id: 'architecture', label: 'Architecture', description: 'Architectural views' },
  project: (artifacts) => groupByLayerAndType(artifacts, 'ARCHITECTURE', 'arch')
};

const GovernanceStrategy: ProjectionStrategy = {
  info: { id: 'governance', label: 'Governance', description: 'Governance and compliance views' },
  project: (artifacts) => groupByLayerAndType(artifacts, 'GOVERNANCE', 'gov')
};

const ReleaseStrategy: ProjectionStrategy = {
  info: { id: 'release', label: 'Release View', description: 'What goes in a release' },
  // Release view can span multiple layers like BUSINESS (EPIC, FEATURE) and GOVERNANCE (VERSION)
  // Let's group by type but only for release-specific base types, or just group all artifacts broadly by type
  project: (artifacts) => {
     // A release view usually groups by Epic/Feature/Version
     // we'll filter by types that belong to BUSINESS or GOVERNANCE layers
     const filtered = artifacts.filter(a => ['BUSINESS', 'GOVERNANCE'].includes(getArtifactLayer(a) || ''));
     const typesMap = new Map<string, Artifact[]>();
      filtered.forEach(a => {
        if (!typesMap.has(a.type)) typesMap.set(a.type, []);
        typesMap.get(a.type)!.push(a);
      });

      return Array.from(typesMap.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([type, arts]) => ({
          id: `rel-${type}`,
          title: type.replace(/_/g, ' '),
          artifacts: arts
        }));
  }
};

const DomainStrategy: ProjectionStrategy = {
  info: { id: 'domain', label: 'Domain', description: 'Group by bounded context (component/tags)' },
  project: (artifacts) => {
    const domains = new Map<string, Artifact[]>();
    artifacts.forEach(a => {
      // Find domain based on tags or component
      let domain = 'General Domain';
      if (a.component) {
        domain = a.component;
      }

      if (!domains.has(domain)) domains.set(domain, []);
      domains.get(domain)!.push(a);
    });

    return Array.from(domains.entries()).map(([domain, arts]) => ({
      id: `dom-${domain}`,
      title: domain,
      artifacts: arts
    }));
  }
};

const DependencyStrategy: ProjectionStrategy = {
  info: { id: 'dependencies', label: 'Dependencies', description: 'Topological dependency mapping' },
  project: (artifacts) => {
    // A real topological sort is complex; for MVP we'll just group everything.
    return [{
      id: 'dep-all',
      title: 'Topological Order (Simulated)',
      artifacts: artifacts
    }];
  }
};

class StrategyRegistry {
  private strategies = new Map<string, ProjectionStrategy>();
  private defaultStrategyId = 'lifecycle';

  constructor() {
    this.register(LifecycleStrategy);
    this.register(DependencyStrategy);
    this.register(ImplementationStrategy);
    this.register(ValidationStrategy);
    this.register(ArchitectureStrategy);
    this.register(GovernanceStrategy);
    this.register(ReleaseStrategy);
    this.register(DomainStrategy);
  }

  register(strategy: ProjectionStrategy) {
    this.strategies.set(strategy.info.id, strategy);
  }

  getStrategy(id: string): ProjectionStrategy {
    return this.strategies.get(id) || this.strategies.get(this.defaultStrategyId)!;
  }

  getAll(): ProjectionStrategyInfo[] {
    return Array.from(this.strategies.values()).map(s => s.info);
  }
}

export const strategyRegistry = new StrategyRegistry();
