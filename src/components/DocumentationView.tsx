import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store';
import { Artifact } from '../types';
import { Layers, FileText, FileCode2, ShieldCheck, ChevronRight, Search, GitPullRequest, Repeat, Box, Rocket, Activity, Wrench, Trash2, AlertCircle, Printer, Milestone, Bookmark, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

const OwnershipBadge = ({ artifact }: { artifact: Artifact }) => {
    if (!artifact.layer && !artifact.ownership?.owner && !artifact.ownership?.team) return null;
    return (
        <div className="flex gap-2 mb-3 mt-1 pointer-events-none">
            {artifact.layer && <span className="text-[9px] text-purple-400 border border-purple-400/20 bg-purple-400/5 px-1.5 py-0.5 rounded-sm font-mono tracking-tighter">LAYER: {artifact.layer}</span>}
            {artifact.ownership?.owner && <span className="text-[9px] text-blue-400 border border-blue-400/20 bg-blue-400/5 px-1.5 py-0.5 rounded-sm font-mono tracking-tighter">OWNER: {artifact.ownership?.owner}</span>}
            {artifact.ownership?.team && <span className="text-[9px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-1.5 py-0.5 rounded-sm font-mono tracking-tighter">TEAM: {artifact.ownership?.team}</span>}
        </div>
    );
};

const PHASES = [
  { id: 'strategy', title: 'Strategy & Planning', icon: Bookmark, types: ['PROJECT', 'EPIC', 'FEATURE', 'BUSINESS_RULE', 'DECISION', 'GLOSSARY_TERM', 'RISK', 'PROCESS'] },
  { id: 'req', title: 'Requirements / Analysis', icon: FileText, types: ['REQUIREMENT', 'USE_CASE'] },
  { id: 'design', title: 'Architecture & Design', icon: Layers, types: ['DESIGN', 'COMPONENT', 'API', 'DATABASE_ENTITY'] },
  { id: 'dev', title: 'Development', icon: FileCode2, types: ['CODE_ENTITY', 'LIBRARY', 'ENVIRONMENT'] },
  { id: 'review', title: 'Code Review', icon: GitPullRequest, types: ['CODE_ENTITY'] },
  { id: 'ci', title: 'Continuous Integration', icon: Repeat, types: ['INFRASTRUCTURE', 'PIPELINE'] },
  { id: 'verif', title: 'Testing / QA', icon: ShieldCheck, types: ['TEST', 'TEST_CASE', 'CHECK', 'BUG'] },
  { id: 'build', title: 'Build / Packaging', icon: Box, types: ['INFRASTRUCTURE'] },
  { id: 'deploy', title: 'Deployment', icon: Rocket, types: ['DEPLOYMENT'] },
  { id: 'monitor', title: 'Monitoring & Feedback', icon: Activity, types: ['MONITORING', 'INCIDENT'] },
  { id: 'docs', title: 'Documentation', icon: BookOpen, types: ['DOCUMENTATION'] },
  { id: 'maint', title: 'Maintenance / Refactoring', icon: Wrench, types: ['MAINTENANCE'] },
  { id: 'retire', title: 'Retirement / Replacement', icon: Trash2, types: ['MAINTENANCE'] },
  { id: 'versions', title: 'Releases & Versions', icon: Milestone, types: ['VERSION', 'SYSTEM_VERSION', 'CHANGE'] },
];

export const DocumentationView: React.FC = () => {
  const { fullGraph: graph, currentVersionId, versions, systemVersions, selectedArtifactId, setSelectedArtifact, settings, globalFilters, setGlobalFilter } = useStore();
  
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const filterLayer = globalFilters.layer;
  const filterOwner = globalFilters.owner;
  const filterTeam = globalFilters.team;

  const setFilterLayer = (val: string) => setGlobalFilter('layer', val);
  const setFilterOwner = (val: string) => setGlobalFilter('owner', val);
  const setFilterTeam = (val: string) => setGlobalFilter('team', val);
  const [graphFilterType, setGraphFilterType] = useState<string | 'ALL'>('ALL');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderMinified, setIsHeaderMinified] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isImpactFocusMode, setIsImpactFocusMode] = useState(settings.defaultDocsFocusMode);

  const filterOptions = useMemo(() => {
     if (!graph || !graph.artifacts) return { layers: [], owners: [], teams: [] };
     const layers = Array.from(new Set(graph.artifacts.map(a => a.layer).filter(Boolean))) as string[];
     const owners = Array.from(new Set(graph.artifacts.map(a => a.ownership?.owner).filter(Boolean))) as string[];
     const teams = Array.from(new Set(graph.artifacts.map(a => a.ownership?.team).filter(Boolean))) as string[];
     return { layers, owners, teams };
  }, [graph]);

  const orphanArtifactIds = useMemo(() => {
    if (!graph) return new Set<string>();
    const linked = new Set<string>();
    graph.relations.forEach(rel => {
      linked.add(rel.from);
      linked.add(rel.to);
    });
    const orphans = new Set<string>();
    graph.artifacts.forEach(art => {
      if (!linked.has(art.id)) orphans.add(art.id);
    });
    return orphans;
  }, [graph]);

  const reachableArtifactIds = useMemo(() => {
    if (!selectedArtifactId || !graph) return new Set<string>();
    
    const reachable = new Set<string>();
    reachable.add(selectedArtifactId);
    
    let currentLevelNodes = new Set<string>([selectedArtifactId]);
    const maxDepth = settings.docsFocusDepth === 0 ? Infinity : settings.docsFocusDepth;

    for (let depth = 0; depth < maxDepth; depth++) {
        let nextLevelNodes = new Set<string>();
        
        graph.relations.forEach(r => {
            if (currentLevelNodes.has(r.from) || currentLevelNodes.has(r.to)) {
                if (!reachable.has(r.from)) nextLevelNodes.add(r.from);
                if (!reachable.has(r.to)) nextLevelNodes.add(r.to);
            }
        });
        
        if (nextLevelNodes.size === 0) break;
        
        nextLevelNodes.forEach(n => reachable.add(n));
        currentLevelNodes = nextLevelNodes;
    }
    
    return reachable;
  }, [selectedArtifactId, graph, settings.docsFocusDepth]);

  const grouped = useMemo(() => {
    const groups: Record<string, Artifact[]> = {};
    if (graph && graph.artifacts) {
      graph.artifacts.forEach(a => {
        if (!groups[a.type]) {
          groups[a.type] = [];
        }
        groups[a.type].push(a);
      });
    }
    return groups;
  }, [graph]);

  const filteredGroups = useMemo(() => {
    const filterBySearch = (list: Artifact[] = []) => {
      if (!searchQuery.trim()) return list;
      const term = searchQuery.toLowerCase();
      return list.filter(a => 
          a.title.toLowerCase().includes(term) || 
          a.description.toLowerCase().includes(term) ||
          a.id.toLowerCase().includes(term) ||
          (a.subType && a.subType.toLowerCase().includes(term))
      );
    };

    const filterByGraph = (list: Artifact[] = []) => {
        if (!selectedArtifactId || !isImpactFocusMode) return list;
        return list.filter(a => reachableArtifactIds.has(a.id));
    };

    const filterByLayerAndOwnership = (list: Artifact[] = []) => {
        return list.filter(a => {
            if (filterLayer !== 'ALL' && a.layer !== filterLayer) return false;
            if (filterOwner !== 'ALL' && a.ownership?.owner !== filterOwner) return false;
            if (filterTeam !== 'ALL' && a.ownership?.team !== filterTeam) return false;
            return true;
        });
    };

    const applyFilters = (list: Artifact[] = []) => filterByGraph(filterByLayerAndOwnership(filterBySearch(list)));
    
    const result: Record<string, Artifact[]> = {};
    Object.keys(grouped).forEach(key => {
      result[key] = applyFilters(grouped[key]);
    });
    return result;
  }, [grouped, searchQuery, selectedArtifactId, reachableArtifactIds, isImpactFocusMode, filterLayer, filterOwner, filterTeam]);

  const phasesData = useMemo(() => {
    return PHASES.map(phase => {
      let filteredArtifactsInPhase = phase.types.flatMap(type => 
        (filteredGroups[type] || [])
      );

      if (phase.id === 'dev') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType !== 'Review');
      } else if (phase.id === 'review') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType === 'Review');
      } else if (phase.id === 'ci') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.type === 'PIPELINE' || (a.type === 'INFRASTRUCTURE' && a.subType?.includes('CI')));
      } else if (phase.id === 'build') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.type === 'INFRASTRUCTURE' && (a.subType === 'Build' || a.subType === 'Package'));
      } else if (phase.id === 'maint') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.type === 'MAINTENANCE' && a.subType !== 'Retirement');
      } else if (phase.id === 'retire') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.type === 'MAINTENANCE' && a.subType === 'Retirement');
      }
      
      const subTypes = Array.from(new Set(filteredArtifactsInPhase.map(a => a.subType).filter(Boolean))) as string[];
      
      if (phase.id === 'design' && (filteredGroups['COMPONENT'] || []).length > 0) {
          const compSubTypes = Array.from(new Set((filteredGroups['COMPONENT'] || []).map(a => a.subType).filter(Boolean))) as string[];
          for (const s of compSubTypes) {
              if (!subTypes.includes(s)) subTypes.push(s);
          }
          if (compSubTypes.length === 0 && !subTypes.includes('Component')) {
              subTypes.push('Component');
          }
      }
      return {
         ...phase,
         count: filteredArtifactsInPhase.length,
         subTypes,
      }
    });
  }, [filteredGroups]);

  useEffect(() => {
    if (selectedArtifactId) {
      setTimeout(() => {
        const el = document.getElementById(selectedArtifactId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [selectedArtifactId, filteredGroups]);

  if (!graph) return <div className="p-8">Loading documentation...</div>;

  const currentVersion = versions.find(v => v.id === currentVersionId);

  const handlePhaseClick = (phaseId: string) => {
      if (selectedPhase === phaseId && !selectedSubType) {
          setSelectedPhase(null);
      } else {
          setSelectedPhase(phaseId);
          setSelectedSubType(null);
      }
  };

  const handleSubTypeClick = (phaseId: string, subType: string) => {
      if (selectedSubType === subType) {
          setSelectedSubType(null);
          setSelectedPhase(phaseId);
      } else {
          setSelectedPhase(phaseId);
          setSelectedSubType(subType);
      }
  };

  const shouldShow = (hasItems: boolean) => !(isImpactFocusMode && selectedArtifactId && !hasItems);

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex overflow-hidden print-block">
      {/* Sidebar */}
      <div className={`shrink-0 bg-[#0c0c0c] border-r border-white/5 flex flex-col transition-all duration-300 print-hidden ${isSidebarCollapsed ? 'w-12' : 'w-64'}`}>
         <div className="p-4 border-b border-white/5 sticky top-0 bg-[#0c0c0c]/90 backdrop-blur z-10 flex items-center justify-between">
           {!isSidebarCollapsed && <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Lifecycle Phases</div>}
           <button 
             onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
             className="p-1 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
           >
             <ChevronRight className={`transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} size={16} />
           </button>
         </div>
         
         <div className={`p-4 space-y-1 overflow-y-auto custom-scrollbar flex-1 ${isSidebarCollapsed ? 'items-center px-2' : ''}`}>
            {!isSidebarCollapsed && (
              <button 
                  className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded transition-colors mb-2 ${!selectedPhase ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
                  onClick={() => { setSelectedPhase(null); setSelectedSubType(null); }}
              >
                  All Assets
              </button>
            )}
            
            {phasesData.map((phase, idx) => {
                const Icon = phase.icon;
                const isPhaseSelected = selectedPhase === phase.id;
                
                if (isSidebarCollapsed) {
                   return (
                     <button 
                        key={phase.id}
                        onClick={() => handlePhaseClick(phase.id)}
                        className={`p-2 rounded transition-colors mb-1 group relative ${isPhaseSelected ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:bg-white/5'}`}
                        title={phase.title}
                     >
                        <Icon size={18} />
                        <div className="absolute left-full ml-2 px-2 py-1 bg-black border border-white/20 text-[10px] whitespace-nowrap rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50">
                          {phase.title} ({phase.count})
                        </div>
                     </button>
                   )
                }

                return (
                    <div key={phase.id} className="flex flex-col mb-1">
                        <button 
                            onClick={() => handlePhaseClick(phase.id)}
                            className={`w-full text-left px-3 py-2 text-xs transition-colors rounded-sm flex items-center justify-between group
                                ${isPhaseSelected && !selectedSubType ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-white/60 hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={14} className={isPhaseSelected && !selectedSubType ? "text-emerald-400" : "text-white/40 group-hover:text-white/70"} />
                                <span>{idx + 1}. {phase.title}</span>
                            </div>
                            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded-sm tabular-nums opacity-60 group-hover:opacity-100">{phase.count}</span>
                        </button>
                        
                        {(isPhaseSelected || selectedPhase === phase.id) && phase.subTypes.length > 0 && (
                            <div className="flex flex-col ml-6 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                                {phase.subTypes.map(st => (
                                    <button 
                                        key={st}
                                        onClick={() => handleSubTypeClick(phase.id, st)}
                                        className={`text-left px-2 py-1.5 text-[10px] uppercase tracking-widest transition-colors rounded-sm
                                            ${selectedSubType === st ? 'text-white bg-white/10 font-bold' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
         </div>
      </div>

      <div className="flex-1 overflow-y-auto relative flex flex-col group/doc">
        <div className="flex flex-col w-full bg-[#0a0a0a] min-h-max">
          {/* Minimized Header Controls */}
          <div className={`sticky top-0 z-30 transition-all duration-300 bg-[#0a0a0a]/80 backdrop-blur-md px-8 lg:px-16 border-b border-white/5 flex items-center justify-between print-hidden ${isHeaderMinified ? 'py-2' : 'py-8 pt-12 pb-4'}`}>
            <div className="flex items-center gap-4">
               <h1 className={`font-serif italic tracking-tight transition-all duration-300 ${isHeaderMinified ? 'text-lg' : 'text-3xl'}`}>
               {selectedSubType ? `${selectedSubType} Documentation` : selectedPhase ? phasesData.find(p => p.id === selectedPhase)?.title : 'System Documentation'}
               </h1>
               <div className="h-4 w-px bg-white/10" />
               <button 
                 onClick={() => setIsHeaderMinified(!isHeaderMinified)}
                 className="p-1 hover:bg-white/10 rounded transition-colors text-white/20 hover:text-white/60"
                 title={isHeaderMinified ? "Expand Header" : "Minimize Header"}
               >
                 <ChevronRight className={`transition-transform duration-300 ${isHeaderMinified ? 'rotate-90' : '-rotate-90'}`} size={14} />
               </button>
            </div>

            <div className="flex flex-col md:flex-row gap-2 items-center">
                {selectedArtifactId && (
                    <div className="flex items-center gap-2 mr-4">
                        <button 
                            onClick={() => setIsImpactFocusMode(!isImpactFocusMode)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-sm border transition-all text-[10px] font-mono tracking-tight cursor-pointer ${isImpactFocusMode ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'}`}
                        >
                            <Activity size={12} className={isImpactFocusMode ? 'animate-pulse' : ''} />
                            FOCUS: {isImpactFocusMode ? 'ON' : 'OFF'}
                        </button>
                        <div className="h-4 w-[1px] bg-white/10 mx-1" />
                        <span className="text-[10px] text-white/40 font-mono italic">
                             {selectedArtifactId}
                        </span>
                        <button 
                            onClick={() => setSelectedArtifact(null)}
                            className="p-1 text-white/20 hover:text-red-400 transition-colors"
                            title="Clear Selection"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
                
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="relative w-full md:w-40">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={14} className="text-white/40" />
                            </div>
                            <input
                                type="text"
                                placeholder="Keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                            />
                        </div>
                        <div className="flex gap-1 w-full lg:w-auto">
                            <select
                                value={graphFilterType}
                                onChange={(e) => setGraphFilterType(e.target.value)}
                                className={`bg-transparent py-1 px-2 text-[9px] focus:outline-none cursor-pointer uppercase tracking-wider transition-all border rounded-sm ${
                                    graphFilterType !== 'ALL' 
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold' 
                                        : 'border-white/10 text-white/50 hover:border-white/20'
                                }`}
                            >
                                <option value="ALL" className="bg-[#0c0c0c] text-white">All Types</option>
                                {Object.keys(grouped).map(type => (
                                    <option key={type} value={type} className="bg-[#0c0c0c] text-white">{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <select
                                value={selectedArtifactId || ''}
                                onChange={(e) => setSelectedArtifact(e.target.value || null)}
                                className={`bg-transparent py-1 px-2 text-[9px] focus:outline-none cursor-pointer font-mono max-w-[120px] transition-all border rounded-sm ${
                                    selectedArtifactId 
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold' 
                                        : 'border-white/10 text-white/50 hover:border-white/20'
                                }`}
                            >
                                <option value="" className="bg-[#0c0c0c] text-white">Artifact...</option>
                                {(graph?.artifacts || [])
                                    .filter(a => graphFilterType === 'ALL' || a.type === graphFilterType)
                                    .sort((a,b) => a.id.localeCompare(b.id))
                                    .map(a => (
                                    <option key={a.id} value={a.id} className="text-white bg-[#0c0c0c]">
                                        {a.id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => window.print()}
                            className="flex items-center justify-center p-1.5 ml-2 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white print-hidden"
                            title="Print Native (System Print Dialog)"
                        >
                            <Printer size={16} />
                        </button>
                    </div>
                    <div className="flex gap-1 w-full mt-2 lg:mt-0">
                        <select
                            value={filterLayer}
                            onChange={(e) => setFilterLayer(e.target.value)}
                            className={`bg-transparent py-1 px-1 text-[9px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border rounded-sm ${
                                filterLayer !== 'ALL' 
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold' 
                                    : 'border-white/10 text-white/50 hover:border-white/20'
                            }`}
                        >
                            <option value="ALL" className="bg-[#0c0c0c] text-white font-normal">LAYER</option>
                            {filterOptions.layers.map(layer => (
                                <option key={layer} value={layer} className="bg-[#0c0c0c] text-white font-normal">{layer}</option>
                            ))}
                        </select>
                        <select
                            value={filterOwner}
                            onChange={(e) => setFilterOwner(e.target.value)}
                            className={`bg-transparent py-1 px-1 text-[9px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border rounded-sm ${
                                filterOwner !== 'ALL' 
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold' 
                                    : 'border-white/10 text-white/50 hover:border-white/20'
                            }`}
                        >
                            <option value="ALL" className="bg-[#0c0c0c] text-white font-normal">OWNER</option>
                            {filterOptions.owners.map(owner => (
                                <option key={owner} value={owner} className="bg-[#0c0c0c] text-white font-normal">{owner}</option>
                            ))}
                        </select>
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className={`bg-transparent py-1 px-1 text-[9px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border rounded-sm ${
                                filterTeam !== 'ALL' 
                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold' 
                                    : 'border-white/10 text-white/50 hover:border-white/20'
                            }`}
                        >
                            <option value="ALL" className="bg-[#0c0c0c] text-white font-normal">TEAM</option>
                            {filterOptions.teams.map(team => (
                                <option key={team} value={team} className="bg-[#0c0c0c] text-white font-normal">{team}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
          </div>
          
          <div className="px-8 lg:px-16 pt-4 shrink-0">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12 mb-8 mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                  <div className="text-xs font-mono text-white/40">
                      SYS DOMAIN: <span className="text-emerald-400 font-bold tracking-widest">{selectedSubType ? `${selectedSubType} Documentation` : selectedPhase ? phasesData.find(p => p.id === selectedPhase)?.title : 'System Documentation'}</span><br/>
                      VERSION: <span className="text-white/80">{currentVersion?.name} ({currentVersionId})</span><br/>
                      DATE: {new Date().toISOString().split('T')[0]}
                  </div>
                  {systemVersions.length > 0 && (
                      <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setShowInventory(!showInventory)}
                            className="text-[10px] uppercase tracking-widest text-white/20 font-bold flex items-center gap-2 hover:text-white/40 transition-colors print-hidden"
                          >
                            System Inventory
                            <ChevronRight size={10} className={`transition-transform ${showInventory ? 'rotate-90' : ''}`} />
                          </button>
                          {showInventory && (
                            <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-top-2 duration-300">
                                {systemVersions.map(sv => (
                                    <div key={sv.id} className="flex items-center gap-2 bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] tabular-nums">
                                        <span className="text-emerald-500 font-bold">{sv.component}</span>
                                        <span className="text-white/40 font-mono">{sv.version}</span>
                                    </div>
                                ))}
                            </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 lg:px-16 pb-12 custom-scrollbar">
            {phasesData.map((phase, idx) => {
                if (selectedPhase && selectedPhase !== phase.id) return null;
                
                let phaseArtifacts = phase.types.flatMap(type => filteredGroups[type] || []);

                if (phase.id === 'dev') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.subType !== 'Review');
                } else if (phase.id === 'review') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.subType === 'Review');
                } else if (phase.id === 'ci') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.type === 'PIPELINE' || (a.type === 'INFRASTRUCTURE' && a.subType?.includes('CI')));
                } else if (phase.id === 'build') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.type === 'INFRASTRUCTURE' && (a.subType === 'Build' || a.subType === 'Package'));
                } else if (phase.id === 'maint') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.type === 'MAINTENANCE' && a.subType !== 'Retirement');
                } else if (phase.id === 'retire') {
                    phaseArtifacts = phaseArtifacts.filter(a => a.type === 'MAINTENANCE' && a.subType === 'Retirement');
                }

                if (selectedSubType) {
                    if (selectedSubType === 'Component') {
                      phaseArtifacts = phaseArtifacts.filter(a => a.type === 'COMPONENT' && !a.subType);
                    } else {
                      phaseArtifacts = phaseArtifacts.filter(a => a.subType === selectedSubType);
                    }
                }

                if (!shouldShow(phaseArtifacts.length > 0)) return null;
                if (phaseArtifacts.length === 0 && selectedPhase !== phase.id && !selectedSubType) return null;

                return (
                    <section key={phase.id} className="mb-16">
                        <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">
                            {idx + 1}. {phase.title}
                        </h2>
                        {phaseArtifacts.length === 0 && (
                            <p className="italic text-white/40 text-xs p-8 bg-white/5 border border-dashed border-white/10 rounded text-center">
                                No active artifacts for this phase.
                            </p>
                        )}
                        <div className="space-y-4">
                            {phaseArtifacts.map((artifact) => (
                              <div key={artifact.id} id={artifact.id} className="mb-6 bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-emerald-500/50 hover:bg-white/[0.02] transition-colors relative group">
                                <h3 className="font-serif text-lg text-white flex items-center gap-4 flex-wrap mb-4">
                                  <button 
                                    onClick={() => setSelectedArtifact(artifact.id)}
                                    className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest transition-colors hover:border-emerald-500/50 ${selectedArtifactId === artifact.id ? 'text-emerald-400 border-emerald-500/50' : 'text-white/40'}`}
                                  >
                                      {artifact.id}
                                  </button>
                                  {artifact.subType && <span className="text-[10px] font-sans bg-white/5 text-white/60 px-2 py-1 border border-white/10 uppercase tracking-widest">{artifact.subType}</span>}
                                  {orphanArtifactIds.has(artifact.id) && (
                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
                                      <AlertCircle size={10} />
                                      Traceability Gap
                                    </span>
                                  )}
                                  <span>{artifact.title}</span>
                                  {artifact.version && <span className="ml-auto text-xs font-mono text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded">v{artifact.version}</span>}
                                </h3>
                                <OwnershipBadge artifact={artifact} />
                                <MarkdownRenderer content={artifact.description} />
                              </div>
                            ))}
                        </div>
                    </section>
                );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
