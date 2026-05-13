import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store';
import { Artifact, ArtifactType } from '../types';
import { Layers, FileText, Server, FileCode2, ShieldCheck, Stethoscope, ChevronRight, Search, GitPullRequest, Repeat, Box, Rocket, Activity, Wrench, Trash2, AlertCircle, Printer } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface GroupedArtifacts {
  REQUIREMENT: Artifact[];
  USE_CASE: Artifact[];
  DESIGN: Artifact[];
  COMPONENT: Artifact[];
  CODE_ENTITY: Artifact[];
  TEST: Artifact[];
  DOCUMENTATION: Artifact[];
  INCIDENT: Artifact[];
  INFRASTRUCTURE: Artifact[];
  DEPLOYMENT: Artifact[];
  MONITORING: Artifact[];
  MAINTENANCE: Artifact[];
}

const PHASES = [
  { id: 'req', title: 'Requirements / Analysis', icon: FileText, types: ['REQUIREMENT', 'USE_CASE'] },
  { id: 'design', title: 'Technical Design', icon: Layers, types: ['DESIGN', 'COMPONENT'] },
  { id: 'dev', title: 'Development', icon: FileCode2, types: ['CODE_ENTITY'] },
  { id: 'review', title: 'Code Review', icon: GitPullRequest, types: ['CODE_ENTITY'] },
  { id: 'ci', title: 'Continuous Integration', icon: Repeat, types: ['INFRASTRUCTURE'] },
  { id: 'verif', title: 'Testing', icon: ShieldCheck, types: ['TEST'] },
  { id: 'build', title: 'Build / Packaging', icon: Box, types: ['INFRASTRUCTURE'] },
  { id: 'deploy', title: 'Deployment', icon: Rocket, types: ['DEPLOYMENT'] },
  { id: 'monitor', title: 'Monitoring', icon: Activity, types: ['MONITORING', 'INCIDENT'] },
  { id: 'maint', title: 'Maintenance / Refactoring', icon: Wrench, types: ['MAINTENANCE'] },
  { id: 'retire', title: 'Retirement / Replacement', icon: Trash2, types: ['MAINTENANCE'] },
];

export const DocumentationView: React.FC = () => {
  const { graph, currentVersionId, versions, systemVersions, selectedArtifactId, setSelectedArtifact, settings } = useStore();
  
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [graphFilterType, setGraphFilterType] = useState<string | 'ALL'>('ALL');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHeaderMinified, setIsHeaderMinified] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isImpactFocusMode, setIsImpactFocusMode] = useState(settings.defaultDocsFocusMode);

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
    const groups: GroupedArtifacts = {
      REQUIREMENT: [], USE_CASE: [], DESIGN: [], COMPONENT: [],
      CODE_ENTITY: [], TEST: [], DOCUMENTATION: [], INCIDENT: [],
      INFRASTRUCTURE: [], DEPLOYMENT: [], MONITORING: [], MAINTENANCE: []
    };
    if (graph && graph.artifacts) {
      graph.artifacts.forEach(a => {
        const type = a.type as keyof GroupedArtifacts;
        if (groups[type]) {
          groups[type].push(a);
        }
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

    const applyFilters = (list: Artifact[] = []) => filterByGraph(filterBySearch(list));
    
    return {
      REQUIREMENT: applyFilters(grouped.REQUIREMENT),
      USE_CASE: applyFilters(grouped.USE_CASE),
      DESIGN: applyFilters(grouped.DESIGN),
      COMPONENT: applyFilters(grouped.COMPONENT),
      CODE_ENTITY: applyFilters(grouped.CODE_ENTITY),
      TEST: applyFilters(grouped.TEST),
      DOCUMENTATION: applyFilters(grouped.DOCUMENTATION),
      INCIDENT: applyFilters(grouped.INCIDENT),
      INFRASTRUCTURE: applyFilters(grouped.INFRASTRUCTURE),
      DEPLOYMENT: applyFilters(grouped.DEPLOYMENT),
      MONITORING: applyFilters(grouped.MONITORING),
      MAINTENANCE: applyFilters(grouped.MAINTENANCE),
    };
  }, [grouped, searchQuery, selectedArtifactId, reachableArtifactIds, isImpactFocusMode]);

  const phasesData = useMemo(() => {
    return PHASES.map(phase => {
      let filteredArtifactsInPhase = phase.types.flatMap(type => 
        (filteredGroups[type as keyof typeof filteredGroups] || [])
      );

      if (phase.id === 'dev') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType !== 'Review');
      } else if (phase.id === 'review') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType === 'Review');
      } else if (phase.id === 'ci') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType?.includes('CI') || a.subType === 'Pipeline');
      } else if (phase.id === 'build') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType === 'Build' || a.subType === 'Package');
      } else if (phase.id === 'maint') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType !== 'Retirement');
      } else if (phase.id === 'retire') {
        filteredArtifactsInPhase = filteredArtifactsInPhase.filter(a => a.subType === 'Retirement');
      }
      
      const subTypes = Array.from(new Set(filteredArtifactsInPhase.map(a => a.subType).filter(Boolean))) as string[];
      // We will also synthesize "COMPONENT" as a pseudo subtype for Design since we grouped DESIGN and COMPONENT together in phase 2,
      // but only if there are COMPONENT artifacts and they don't already have subTypes.
      if (phase.id === 'design' && (filteredGroups.COMPONENT || []).length > 0) {
          const compSubTypes = Array.from(new Set((filteredGroups.COMPONENT || []).map(a => a.subType).filter(Boolean))) as string[];
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

  const getRelations = (artifactId: string, type: 'to' | 'from') => {
    return graph.relations.filter(r => type === 'to' ? r.to === artifactId : r.from === artifactId)
      .map(r => {
        const relatedId = type === 'to' ? r.from : r.to;
        const relatedArt = graph.artifacts.find(a => a.id === relatedId);
        return { relation: r, artifact: relatedArt };
      }).filter(r => r.artifact !== undefined);
  };

  const handlePhaseClick = (phaseId: string) => {
      if (selectedPhase === phaseId && !selectedSubType) {
          setSelectedPhase(null); // toggle off
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

  const hasReqs = (filteredGroups.REQUIREMENT?.length || 0) + (filteredGroups.USE_CASE?.length || 0) > 0;
  const hasDesign = (filteredGroups.DESIGN?.length || 0) + (filteredGroups.COMPONENT?.length || 0) > 0;
  const hasDev = (filteredGroups.CODE_ENTITY || []).filter(c => c.subType !== 'Review').length > 0;
  const hasReview = (filteredGroups.CODE_ENTITY || []).filter(c => c.subType === 'Review').length > 0;
  const hasCI = (filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType?.includes('CI') || i.subType === 'Pipeline').length > 0;
  const hasTest = (filteredGroups.TEST?.length || 0) > 0;
  const hasBuild = (filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType === 'Build' || i.subType === 'Package').length > 0;
  const hasDeploy = (filteredGroups.DEPLOYMENT?.length || 0) > 0;
  const hasMonit = (filteredGroups.MONITORING?.length || 0) + (filteredGroups.INCIDENT?.length || 0) > 0;
  const hasMaint = (filteredGroups.MAINTENANCE || []).filter(m => m.subType !== 'Retirement').length > 0;
  const hasRet = (filteredGroups.MAINTENANCE || []).filter(m => m.subType === 'Retirement').length > 0;

  const shouldShow = (hasItems: boolean) => !(isImpactFocusMode && selectedArtifactId && !hasItems);

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex overflow-hidden">
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
                
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
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
                    <div className="flex gap-1 border border-white/10 p-0.5 rounded-md bg-[#0a0a0a]">
                        <select
                            value={graphFilterType}
                            onChange={(e) => setGraphFilterType(e.target.value)}
                            className="bg-transparent border-none py-1 px-2 text-[9px] text-white/50 focus:outline-none cursor-pointer appearance-none uppercase tracking-wider"
                        >
                            <option value="ALL">All Types</option>
                            {Object.keys(grouped).map(type => (
                                <option key={type} value={type} className="bg-[#0c0c0c]">{type.replace('_', ' ')}</option>
                            ))}
                        </select>
                        <div className="h-3 w-px bg-white/10 self-center mx-0.5"></div>
                        <select
                            value={selectedArtifactId || ''}
                            onChange={(e) => setSelectedArtifact(e.target.value || null)}
                            className="bg-transparent border-none py-1 px-2 text-[9px] text-emerald-400 focus:outline-none cursor-pointer appearance-none font-mono max-w-[120px]"
                        >
                            <option value="" className="text-white">Artifact...</option>
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
                        className="flex items-center justify-center p-1.5 ml-2 hover:bg-white/10 rounded transition-colors text-white/40 hover:text-white"
                        title="Export Document as PDF"
                    >
                        <Printer size={16} />
                    </button>
                </div>
            </div>
          </div>
          
          <div className="px-8 lg:px-16 pt-4 shrink-0">
            {(!isHeaderMinified || true) && (
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
                          {(showInventory || true) && (
                            <div className="flex gap-2 flex-wrap animate-in fade-in slide-in-from-left-2 duration-300">
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
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 lg:px-16 pb-12 custom-scrollbar">
        {/* 1. Requirements */}
        {(!selectedPhase || selectedPhase === 'req') && shouldShow(hasReqs) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">1. Requirements / Analysis</h2>
                {(filteredGroups.REQUIREMENT?.length === 0 && filteredGroups.USE_CASE?.length === 0) && <p className="italic text-white/40 text-xs">No requirements found in this version.</p>}
                {[...(filteredGroups.REQUIREMENT || []), ...(filteredGroups.USE_CASE || [])]
                    .filter(req => !selectedSubType || req.subType === selectedSubType)
                    .map(req => (
                  <div key={req.id} id={req.id} className="mb-6 bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-blue-500/50 hover:bg-white-[0.02] transition-colors relative group">
                    <h3 className="font-serif text-lg text-white flex items-center gap-4 flex-wrap mb-4">
                      <button 
                        onClick={() => setSelectedArtifact(req.id)}
                        className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-blue-500/50 transition-colors ${selectedArtifactId === req.id ? 'text-blue-400 border-blue-500/50' : 'text-white/40'}`}
                      >
                          {req.id}
                      </button>
                      {req.subType && <span className="text-[10px] font-sans bg-blue-500/10 text-blue-300 px-2 py-1 border border-blue-500/20 uppercase tracking-widest">{req.subType}</span>}
                      {orphanArtifactIds.has(req.id) && (
                        <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
                          <AlertCircle size={10} />
                          Traceability Gap
                        </span>
                      )}
                      {req.title}
                    </h3>
                    <MarkdownRenderer content={req.description} />
                  </div>
                ))}
            </section>
        )}

        {/* 2. Technical Design */}
        {(!selectedPhase || selectedPhase === 'design') && shouldShow(hasDesign) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">2. Technical Design</h2>
                {(filteredGroups.DESIGN?.length === 0 && (filteredGroups.COMPONENT?.length || 0) === 0) && <p className="italic text-white/40 text-xs text-center p-12 bg-white/5 border border-dashed border-white/10 rounded">No architectural design for this phase.</p>}
                {(filteredGroups.DESIGN || [])
                    .filter(des => !selectedSubType || des.subType === selectedSubType)
                    .map(des => (
                  <div key={des.id} id={des.id} className="mb-6 bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-purple-500/50 hover:bg-white-[0.02] transition-colors">
                    <h3 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
                        <button 
                            onClick={() => setSelectedArtifact(des.id)}
                            className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-purple-500/50 transition-colors ${selectedArtifactId === des.id ? 'text-purple-400 border-purple-500/50' : 'text-white/40'}`}
                        >
                            {des.id}
                        </button>
                        {orphanArtifactIds.has(des.id) && (
                            <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 border border-red-500/20 uppercase font-mono tracking-tighter flex items-center gap-1">
                                <AlertCircle size={10} />
                                Orphan
                            </span>
                        )}
                        {des.title}
                    </h3>
                    <MarkdownRenderer content={des.description} />
                  </div>
                ))}
            </section>
        )}

        {/* 3. Development */}
        {(!selectedPhase || selectedPhase === 'dev') && shouldShow(hasDev) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">3. Development</h2>
                <div className="overflow-x-auto rounded border border-white/10">
                <table className="min-w-full border-collapse text-xs">
                    <thead className="bg-[#0c0c0c] border-b border-white/10 text-white/40 uppercase tracking-[0.2em] text-[8px] font-bold">
                    <tr>
                        <th className="p-4 text-left">Code Entity</th>
                        <th className="p-4 text-left border-l border-white/5">Mapping</th>
                        <th className="p-4 text-left border-l border-white/5 w-1/2">Logic Summary</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {(filteredGroups.CODE_ENTITY || [])
                        .filter(code => code.subType !== 'Review')
                        .filter(code => !selectedSubType || code.subType === selectedSubType)
                        .map(code => (
                        <tr key={code.id} id={code.id} className="bg-transparent hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4 font-mono">
                                <button 
                                    onClick={() => setSelectedArtifact(code.id)}
                                    className={`text-left hover:text-emerald-300 transition-colors ${selectedArtifactId === code.id ? 'text-emerald-400' : 'text-emerald-500/70'}`}
                                >
                                    {code.title}
                                </button>
                                {orphanArtifactIds.has(code.id) && (
                                    <div className="flex items-center gap-1 text-[8px] text-red-400 mt-0.5 font-bold uppercase tracking-tighter">
                                        <AlertCircle size={8} />
                                        Unlinked Entity
                                    </div>
                                )}
                                <div className="text-[8px] text-white/20 mt-1 uppercase tracking-tighter">{code.id}</div>
                            </td>
                            <td className="p-4 border-l border-white/5 text-amber-400/80">{code.subType || '-'}</td>
                            <td className="p-4 border-l border-white/5 text-white/60"><MarkdownRenderer content={code.description} /></td>
                        </tr>
                    ))}
                    {((filteredGroups.CODE_ENTITY || []).filter(c => c.subType !== 'Review').length === 0) && (
                        <tr>
                            <td colSpan={3} className="p-12 text-center text-white/20 italic">No code entities documented for this version.</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </section>
        )}

        {/* 4. Code Review */}
        {(!selectedPhase || selectedPhase === 'review') && shouldShow(hasReview) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">4. Code Review</h2>
                {((filteredGroups.CODE_ENTITY || []).filter(c => c.subType === 'Review').length === 0) && <p className="italic text-white/40 text-xs text-center p-8 bg-white/5 border border-dashed border-white/10 rounded">No active reviews for this version.</p>}
                <div className="grid grid-cols-1 gap-4">
                    {(filteredGroups.CODE_ENTITY || []).filter(c => c.subType === 'Review').map(rev => (
                        <div key={rev.id} id={rev.id} className="bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-emerald-500/50">
                            <h3 className="font-serif text-lg text-white mb-2 flex items-center gap-3">
                                <button 
                                    onClick={() => setSelectedArtifact(rev.id)}
                                    className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-emerald-500/50 transition-colors ${selectedArtifactId === rev.id ? 'text-emerald-400 border-emerald-500/50' : 'text-white/40'}`}
                                >
                                    {rev.id}
                                </button>
                                {rev.title}
                            </h3>
                            <MarkdownRenderer content={rev.description} />
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* 5. Continuous Integration */}
        {(!selectedPhase || selectedPhase === 'ci') && shouldShow(hasCI) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">5. Continuous Integration (CI)</h2>
                {((filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType?.includes('CI') || i.subType === 'Pipeline').length === 0) && <p className="italic text-white/40 text-xs p-12 bg-white/5 border border-dashed border-white/10 rounded text-center">No CI pipelines defined.</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType?.includes('CI') || i.subType === 'Pipeline').map(ci => (
                        <div key={ci.id} id={ci.id} className="bg-[#0c0c0c] border border-white/10 p-5 hover:bg-white/[0.03] transition-all">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Repeat size={14} className="text-emerald-400" />
                                {ci.title}
                            </h4>
                            <MarkdownRenderer content={ci.description} />
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* 6. Testing */}
        {(!selectedPhase || selectedPhase === 'verif') && shouldShow(hasTest) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">6. Verification & Quality</h2>
                <div className="space-y-4">
                {(filteredGroups.TEST || []).map(test => (
                    <div key={test.id} id={test.id} className="bg-[#0c0c0c] border border-white/10 p-5 border-l-[3px] border-l-rose-500/50">
                        <h3 className="font-serif text-[#e0e0e0] mb-2 flex items-center gap-3">
                            <button 
                                onClick={() => setSelectedArtifact(test.id)}
                                className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-rose-500/50 transition-colors ${selectedArtifactId === test.id ? 'text-rose-400 border-rose-500/50' : 'text-white/40'}`}
                            >
                                {test.id}
                            </button>
                            {orphanArtifactIds.has(test.id) && (
                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    Gap
                                </span>
                            )}
                            {test.title}
                        </h3>
                        <MarkdownRenderer content={test.description} />
                    </div>
                ))}
                {(filteredGroups.TEST || []).length === 0 && <p className="italic text-white/40 text-xs">No verification artifacts recorded.</p>}
                </div>
            </section>
        )}

        {/* 7. Build */}
        {(!selectedPhase || selectedPhase === 'build') && shouldShow(hasBuild) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">7. Build & Packaging</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType === 'Build' || i.subType === 'Package').map(b => (
                        <div key={b.id} id={b.id} className="bg-[#0c0c0c] border border-white/10 p-5 border-l-[3px] border-l-amber-500/50">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Box size={14} className="text-amber-400" />
                                {b.title}
                            </h4>
                            <MarkdownRenderer content={b.description} />
                        </div>
                    ))}
                    {((filteredGroups.INFRASTRUCTURE || []).filter(i => i.subType === 'Build' || i.subType === 'Package').length === 0) && <p className="italic text-white/40 text-xs col-span-2">Build configurations are handled externally.</p>}
                </div>
            </section>
        )}

        {/* 8. Deployment */}
        {(!selectedPhase || selectedPhase === 'deploy') && shouldShow(hasDeploy) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">8. Deployment</h2>
                <div className="space-y-6">
                    {(filteredGroups.DEPLOYMENT || []).map(d => (
                        <div key={d.id} id={d.id} className="bg-[#0c0c0c] border border-white/10 p-6 rounded-sm border-l-[3px] border-l-sky-500/50">
                            <h3 className="text-xl font-serif italic text-white mb-4 flex items-center gap-3">
                                <Rocket size={20} className="text-sky-400" />
                                <button 
                                    onClick={() => setSelectedArtifact(d.id)}
                                    className={`text-[10px] font-mono bg-black px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-sky-500/50 transition-colors ${selectedArtifactId === d.id ? 'text-sky-400 border-sky-500/50' : 'text-white/40'}`}
                                >
                                    {d.id}
                                </button>
                                {orphanArtifactIds.has(d.id) && (
                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
                                        <AlertCircle size={10} />
                                        Unlinked
                                    </span>
                                )}
                                {d.title}
                            </h3>
                            <MarkdownRenderer content={d.description} />
                        </div>
                    ))}
                    {(filteredGroups.DEPLOYMENT || []).length === 0 && <p className="italic text-white/40 text-xs">No deployment records found.</p>}
                </div>
            </section>
        )}

        {/* 9. Monitoring */}
        {(!selectedPhase || selectedPhase === 'monitor') && shouldShow(hasMonit) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">9. Monitoring & Observability</h2>
                <div className="grid grid-cols-1 gap-6">
                    {(filteredGroups.MONITORING || []).map(m => (
                        <div key={m.id} id={m.id} className="bg-black/40 border border-white/10 p-6 rounded relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Activity size={80} />
                            </div>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Activity size={16} className="text-red-400" />
                                <button 
                                    onClick={() => setSelectedArtifact(m.id)}
                                    className={`text-[10px] font-mono bg-black/40 px-2 py-1 border border-white/5 uppercase tracking-widest hover:border-red-400/50 transition-colors ${selectedArtifactId === m.id ? 'text-red-400 border-red-500/50' : 'text-white/40'}`}
                                >
                                    {m.id}
                                </button>
                                {orphanArtifactIds.has(m.id) && (
                                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 border border-red-500/20 uppercase tracking-widest flex items-center gap-1">
                                        <AlertCircle size={10} />
                                        Unlinked
                                    </span>
                                )}
                                {m.title}
                            </h3>
                            <MarkdownRenderer content={m.description} />
                        </div>
                    ))}
                    {(filteredGroups.INCIDENT || []).length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-[10px] uppercase tracking-widest text-red-500/60 font-bold mb-4">Historical Incidents (Feedback Loop)</h4>
                            <div className="space-y-3">
                                {filteredGroups.INCIDENT.map(inc => (
                                    <div key={inc.id} id={inc.id} className="bg-red-500/5 border border-red-500/10 p-4 rounded text-xs">
                                        <span className="font-bold text-red-400 mr-2">[{inc.id}]</span>
                                        <span className="text-white/80">{inc.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        )}

        {/* 10. Maintenance */}
        {(!selectedPhase || selectedPhase === 'maint') && shouldShow(hasMaint) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">10. Maintenance / Refactoring</h2>
                <div className="space-y-4">
                    {(filteredGroups.MAINTENANCE || []).filter(m => m.subType !== 'Retirement').map(m => (
                        <div key={m.id} id={m.id} className="bg-[#0c0c0c] border border-white/10 p-5 border-l-[3px] border-l-indigo-500/50">
                            <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                <Wrench size={14} className="text-indigo-400" />
                                {m.title}
                            </h3>
                            <MarkdownRenderer content={m.description} />
                        </div>
                    ))}
                    {((filteredGroups.MAINTENANCE || []).filter(m => m.subType !== 'Retirement').length === 0) && <p className="italic text-white/40 text-xs">System is in active health. No maintenance tasks scheduled.</p>}
                </div>
            </section>
        )}

        {/* 11. Retirement */}
        {(!selectedPhase || selectedPhase === 'retire') && shouldShow(hasRet) && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">11. Retirement / Replacement</h2>
                <div className="space-y-4">
                    {(filteredGroups.MAINTENANCE || []).filter(m => m.subType === 'Retirement').map(m => (
                        <div key={m.id} id={m.id} className="bg-[#1a0a0a] border border-red-900/30 p-5 border-l-[3px] border-l-red-900">
                            <h3 className="text-white/60 font-bold mb-2 flex items-center gap-2">
                                <Trash2 size={14} className="text-red-900" />
                                {m.title}
                            </h3>
                            <MarkdownRenderer content={m.description} />
                        </div>
                    ))}
                    {((filteredGroups.MAINTENANCE || []).filter(m => m.subType === 'Retirement').length === 0) && <p className="italic text-white/40 text-xs">No retired components for this version.</p>}
                </div>
            </section>
        )}
        </div>
      </div>
    </div>
  );
};

