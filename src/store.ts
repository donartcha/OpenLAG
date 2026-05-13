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
  
  initializeStore: () => Promise<void>;
  setVersion: (versionId: string) => void;
  setView: (view: 'graph' | 'docs' | 'impact' | 'orphans' | 'guide') => void;
  setSelectedArtifact: (id: string | null) => void;
}

// Global variable to store fetched data
let cachedData: {
  versions: Version[];
  systemVersions: SystemVersion[];
  changes: Change[];
  graphs: Record<string, GraphSnapshot>;
} | null = null;

export const useStore = create<StoreState>((set, get) => ({
  versions: [],
  systemVersions: [],
  changes: [],
  currentVersionId: null,
  graph: null,
  activeView: 'graph',
  selectedArtifactId: null,
  isLoading: false,

  initializeStore: async () => {
    if (cachedData) return;
    
    set({ isLoading: true });
    try {
      const response = await fetch('/graph-data.json');
      if (!response.ok) throw new Error("Failed to load graph data");
      
      cachedData = await response.json();
      
      if (cachedData) {
        const { versions, systemVersions, changes } = cachedData;
        set({ 
          versions, 
          systemVersions: systemVersions || [],
          changes,
          isLoading: false
        });
        
        if (versions.length > 0 && !get().currentVersionId) {
          get().setVersion(versions[versions.length - 1].id);
        }
      }
    } catch (e) {
      console.error("ArchGraph Error: Could not fetch static data.", e);
      set({ isLoading: false });
    }
  },

  setVersion: (versionId) => {
    if (!cachedData) return;
    const graph = cachedData.graphs[versionId] || null;
    set({ currentVersionId: versionId, selectedArtifactId: null, graph });
  },

  setView: (view) => set({ activeView: view }),
  setSelectedArtifact: (id) => set({ selectedArtifactId: id })
}));
