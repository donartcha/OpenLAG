import { Artifact } from '../../types';

export interface StrategyResultGroup {
  id: string;
  title: string;
  artifacts: Artifact[];
}

export interface ProjectionStrategyInfo {
  id: string;
  label: string;
  description: string;
}

export interface ProjectionStrategy {
  info: ProjectionStrategyInfo;
  project(artifacts: Artifact[], options?: any): StrategyResultGroup[];
}
