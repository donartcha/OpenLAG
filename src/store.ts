import { create } from 'zustand';
import { Version, Change, GraphSnapshot, Artifact, Relation, SystemVersion } from './types';

interface StoreState {
  versions: Version[];
  systemVersions: SystemVersion[];
  changes: Change[];
  currentVersionId: string | null;
  graph: GraphSnapshot | null;
  activeView: 'graph' | 'docs' | 'impact' | 'orphans' | 'guide';
  selectedArtifactId: string | null;
  isLoading: boolean;
  
  fetchVersions: () => Promise<void>;
  fetchGraph: (versionId: string) => Promise<void>;
  setVersion: (versionId: string) => void;
  setView: (view: 'graph' | 'docs' | 'impact' | 'orphans' | 'guide') => void;
  setSelectedArtifact: (id: string | null) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  versions: [],
  systemVersions: [],
  changes: [],
  currentVersionId: null,
  graph: null,
  activeView: 'graph',
  selectedArtifactId: null,
  isLoading: false,

  fetchVersions: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/state');
      const data = await res.json();
      set({ 
        versions: data.versions, 
        systemVersions: data.systemVersions || [],
        changes: data.changes, 
        isLoading: false 
      });
      if (data.versions.length > 0 && !get().currentVersionId) {
        get().setVersion(data.versions[data.versions.length - 1].id);
      }
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  fetchGraph: async (versionId) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/versions/${versionId}/graph`);
      const graph = await res.json();
      set({ graph, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  setVersion: (versionId) => {
    if (get().currentVersionId === versionId) return;
    set({ currentVersionId: versionId, selectedArtifactId: null });
    get().fetchGraph(versionId);
  },

  setView: (view) => set({ activeView: view }),
  setSelectedArtifact: (id) => set({ selectedArtifactId: id })
}));
