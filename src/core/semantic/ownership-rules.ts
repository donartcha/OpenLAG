import { Ownership } from '../../types.js';

export function resolveArtifactOwnership(localOwnership?: Ownership, parentOwnership?: Ownership): Ownership {
  if (!localOwnership && !parentOwnership) return {};
  
  return {
    owner: localOwnership?.owner || parentOwnership?.owner,
    team: localOwnership?.team || parentOwnership?.team,
    maintainers: localOwnership?.maintainers || parentOwnership?.maintainers || [],
    reviewers: localOwnership?.reviewers || parentOwnership?.reviewers || [],
    steward: localOwnership?.steward || parentOwnership?.steward,
  };
}
