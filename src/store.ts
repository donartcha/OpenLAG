import { create } from 'zustand';
import { Version, Change, GraphSnapshot, Artifact, Relation, SystemVersion } from './types';
import { GraphIndex, buildGraphIndex, projectSubgraph, GraphQueryOptions, DEFAULT_NEIGHBORHOOD_DEPTH } from './core/graph/GraphQueryLayer';

interface Settings {
  graphFocusDepth: number;
  docsFocusDepth: number;
  defaultDocsFocusMode: boolean;
  showWeakRelations: boolean;
  language: 'EN' | 'ES';
}

interface StoreState {
  versions: Version[];
  systemVersions: SystemVersion[];
  changes: Change[];
  currentVersionId: string | null;
  fullGraph: GraphSnapshot | null;
  graphIndex: GraphIndex | null;
  currentSubgraph: GraphSnapshot | null;
  activeView: 'graph' | 'docs' | 'impact' | 'orphans' | 'guide' | 'settings';
  selectedArtifactId: string | null;
  isLoading: boolean;
  settings: Settings;
  globalFilters: {
    layer: string;
    owner: string;
    team: string;
  };
  
  initializeStore: () => Promise<void>;
  setVersion: (versionId: string) => void;
  setView: (view: 'graph' | 'docs' | 'impact' | 'orphans' | 'guide' | 'settings') => void;
  setSelectedArtifact: (id: string | null) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  setGlobalFilter: (filterType: 'layer' | 'owner' | 'team', value: string) => void;
  refreshSubgraph: () => void;
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
  fullGraph: null,
  graphIndex: null,
  currentSubgraph: null,
  activeView: 'graph',
  selectedArtifactId: null,
  isLoading: false,
  settings: {
    graphFocusDepth: DEFAULT_NEIGHBORHOOD_DEPTH,
    docsFocusDepth: 1,
    defaultDocsFocusMode: true,
    showWeakRelations: false,
    language: 'EN',
  },
  globalFilters: {
    layer: 'ALL',
    owner: 'ALL',
    team: 'ALL',
  },
  updateSettings: (newSettings) => {
    set((state) => ({ settings: { ...state.settings, ...newSettings } }));
    get().refreshSubgraph();
  },
  setGlobalFilter: (filterType, value) => {
    set((state) => ({
      globalFilters: {
        ...state.globalFilters,
        [filterType]: value
      }
    }));
    get().refreshSubgraph();
  },
  
  refreshSubgraph: () => {
    const { fullGraph, graphIndex, selectedArtifactId, settings, globalFilters } = get();
    if (!fullGraph || !graphIndex) return;

    const options: GraphQueryOptions = {
        focusId: selectedArtifactId || undefined,
        depth: settings.graphFocusDepth,
        showWeakRelations: settings.showWeakRelations,
        filterLayer: globalFilters.layer,
        filterOwner: globalFilters.owner,
        filterTeam: globalFilters.team
    };

    const subgraph = projectSubgraph(fullGraph, graphIndex, options);
    set({ currentSubgraph: subgraph });
  },

  initializeStore: async () => {
    
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
      console.error("OpenLAG Error: Could not fetch static data.", e);
      set({ isLoading: false });
    }
  },

  setVersion: (versionId) => {
    if (!cachedData) return;
    const fullGraph = cachedData.graphs[versionId] || null;
    let graphIndex = null;
    if (fullGraph) {
       graphIndex = buildGraphIndex(fullGraph);
    }
    set({ currentVersionId: versionId, selectedArtifactId: null, fullGraph, graphIndex });
    get().refreshSubgraph();
  },

  setView: (view) => set({ activeView: view }),
  setSelectedArtifact: (id) => {
      set({ selectedArtifactId: id });
      get().refreshSubgraph();
  }
}));
