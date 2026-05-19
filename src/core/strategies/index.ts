import { ProjectionStrategy, ProjectionStrategyInfo } from './types';
import { LifecycleStrategy } from './LifecycleStrategy';
import { ImplementationStrategy } from './ImplementationStrategy';
import { ValidationStrategy } from './ValidationStrategy';
import { Artifact } from '../../types';

// More strategies would be implemented similarly (Architecture, Governance, etc.)
// For now, we will add placeholders for them that just filter certain types.

const ArchitectureStrategy: ProjectionStrategy = {
  info: { id: 'architecture', label: 'Architecture', description: 'Architectural views' },
  project: (artifacts) => {
    const types = ['DECISION', 'DESIGN', 'COMPONENT', 'API', 'INTERFACE'];
    return types.map(t => ({
      id: `arch-${t}`,
      title: t,
      artifacts: artifacts.filter(a => a.type === t)
    })).filter(g => g.artifacts.length > 0);
  }
};

const GovernanceStrategy: ProjectionStrategy = {
  info: { id: 'governance', label: 'Governance', description: 'Governance and compliance views' },
  project: (artifacts) => {
    const types = ['RISK', 'BUSINESS_RULE', 'GLOSSARY_TERM', 'CHECK', 'PROCESS'];
    return types.map(t => ({
      id: `gov-${t}`,
      title: t,
      artifacts: artifacts.filter(a => a.type === t)
    })).filter(g => g.artifacts.length > 0);
  }
};

const ReleaseStrategy: ProjectionStrategy = {
  info: { id: 'release', label: 'Release View', description: 'What goes in a release' },
  project: (artifacts) => {
    const types = ['VERSION', 'EPIC', 'FEATURE', 'CHANGE', 'TEST_CASE', 'BUG'];
    return types.map(t => ({
      id: `rel-${t}`,
      title: t,
      artifacts: artifacts.filter(a => a.type === t)
    })).filter(g => g.artifacts.length > 0);
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
