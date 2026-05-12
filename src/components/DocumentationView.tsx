import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Artifact, ArtifactType } from '../types';
import { Layers, FileText, Server, FileCode2, ShieldCheck, Stethoscope, ChevronRight, Search } from 'lucide-react';
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
}

const PHASES = [
  { id: 'req', title: 'Requirements & Specs', icon: FileText, types: ['REQUIREMENT'] },
  { id: 'design', title: 'Design & Architecture', icon: Layers, types: ['DESIGN', 'COMPONENT'] },
  { id: 'impl', title: 'Implementation', icon: FileCode2, types: ['CODE_ENTITY'] },
  { id: 'verif', title: 'Verification & Testing', icon: ShieldCheck, types: ['TEST'] },
  { id: 'docs', title: 'Docs & Evidences', icon: FileText, types: ['DOCUMENTATION'] },
  { id: 'ops', title: 'Operations & Incidents', icon: Stethoscope, types: ['INCIDENT'] },
];

export const DocumentationView: React.FC = () => {
  const { graph, currentVersionId, versions } = useStore();
  
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const grouped = useMemo(() => {
    const groups = {
      REQUIREMENT: [] as Artifact[], USE_CASE: [] as Artifact[], DESIGN: [] as Artifact[], COMPONENT: [] as Artifact[],
      CODE_ENTITY: [] as Artifact[], TEST: [] as Artifact[], DOCUMENTATION: [] as Artifact[], INCIDENT: [] as Artifact[]
    };
    if (graph) {
      graph.artifacts.forEach(a => {
        if (groups[a.type as keyof typeof groups]) {
          groups[a.type as keyof typeof groups].push(a);
        }
      });
    }
    return groups;
  }, [graph]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return grouped;
    const term = searchQuery.toLowerCase();
    
    const filterList = (list: Artifact[]) => 
       list.filter(a => 
           a.title.toLowerCase().includes(term) || 
           a.description.toLowerCase().includes(term) ||
           a.id.toLowerCase().includes(term) ||
           (a.subType && a.subType.toLowerCase().includes(term))
       );

    return {
      REQUIREMENT: filterList(grouped.REQUIREMENT),
      USE_CASE: filterList(grouped.USE_CASE),
      DESIGN: filterList(grouped.DESIGN),
      COMPONENT: filterList(grouped.COMPONENT),
      CODE_ENTITY: filterList(grouped.CODE_ENTITY),
      TEST: filterList(grouped.TEST),
      DOCUMENTATION: filterList(grouped.DOCUMENTATION),
      INCIDENT: filterList(grouped.INCIDENT),
    };
  }, [grouped, searchQuery]);

  const phasesData = useMemo(() => {
    return PHASES.map(phase => {
      const artifactsInPhase = graph?.artifacts.filter(a => phase.types.includes(a.type as string)) || [];
      const subTypes = Array.from(new Set(artifactsInPhase.map(a => a.subType).filter(Boolean))) as string[];
      // We will also synthesize "COMPONENT" as a pseudo subtype for Design since we grouped DESIGN and COMPONENT together in phase 2,
      // but only if there are COMPONENT artifacts and they don't already have subTypes.
      if (phase.id === 'design' && filteredGroups.COMPONENT.length > 0) {
          const compSubTypes = Array.from(new Set(filteredGroups.COMPONENT.map(a => a.subType).filter(Boolean))) as string[];
          for (const s of compSubTypes) {
              if (!subTypes.includes(s)) subTypes.push(s);
          }
          if (compSubTypes.length === 0 && !subTypes.includes('Component')) {
              subTypes.push('Component');
          }
      }
      return {
         ...phase,
         count: artifactsInPhase.length,
         subTypes,
      }
    });
  }, [graph, grouped]);

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

  return (
    <div className="h-full w-full bg-[#0a0a0a] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 shrink-0 bg-[#0c0c0c] border-r border-white/5 overflow-y-auto flex flex-col hidden md:flex">
         <div className="p-6 pb-4 border-b border-white/5 sticky top-0 bg-[#0c0c0c]/90 backdrop-blur z-10">
           <div className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold mb-1">Lifecycle Phases</div>
           <div className="text-xs text-white/40 font-mono">v {currentVersion?.name}</div>
         </div>
         <div className="p-4 space-y-1">
            <button 
                className={`w-full text-left px-4 py-2 text-xs font-semibold uppercase tracking-widest rounded transition-colors ${!selectedPhase ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/80'}`}
                onClick={() => { setSelectedPhase(null); setSelectedSubType(null); }}
            >
                All Documentation
            </button>
            <div className="my-2 border-b border-white/5" />
            
            {phasesData.map((phase, idx) => {
                const Icon = phase.icon;
                const isPhaseSelected = selectedPhase === phase.id;
                
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

      <div className="flex-1 overflow-y-auto relative flex flex-col">
          <div className="p-8 pb-4 lg:px-16 lg:pt-12 shrink-0">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2 pb-4 border-b border-white/10">
                <h1 className="text-3xl font-serif italic tracking-tight">
                {selectedSubType ? `${selectedSubType} Documentation` : selectedPhase ? phasesData.find(p => p.id === selectedPhase)?.title : 'System Documentation'}
                </h1>
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={14} className="text-white/40" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-md py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                    />
                </div>
            </div>
            
            {(!selectedPhase || !selectedSubType) && (
                <div className="text-xs font-mono text-white/40 mb-8 mt-2">
                    GENERATED FOR VERSION: <span className="text-emerald-400">{currentVersion?.name} ({currentVersionId})</span><br/>
                    TIMESTAMP: {new Date().toISOString().split('T')[0]}
                </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto px-8 lg:px-16 pb-12">
        {/* 1. Requirements */}
        {(!selectedPhase || selectedPhase === 'req') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">1. Requirements & Specifications</h2>
                {filteredGroups.REQUIREMENT.length === 0 && <p className="italic text-white/40 text-xs">No requirements found in this version.</p>}
                {filteredGroups.REQUIREMENT
                    .filter(req => !selectedSubType || req.subType === selectedSubType)
                    .map(req => (
                  <div key={req.id} className="mb-6 bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-blue-500/50 hover:bg-white-[0.02] transition-colors">
                    <h3 className="font-serif text-lg text-white flex items-center gap-4 flex-wrap mb-4">
                      <span className="text-[10px] font-mono bg-black text-blue-400 px-2 py-1 border border-white/5 uppercase tracking-widest">{req.id}</span>
                      {req.subType && <span className="text-[10px] font-sans bg-blue-500/10 text-blue-300 px-2 py-1 border border-blue-500/20 uppercase tracking-widest">{req.subType}</span>}
                      {req.title}
                    </h3>
                    <MarkdownRenderer content={req.description} />
                  </div>
                ))}
            </section>
        )}

        {/* 2. Design & Architecture */}
        {(!selectedPhase || selectedPhase === 'design') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">2. Design & Architecture</h2>
                {filteredGroups.DESIGN.length === 0 && filteredGroups.COMPONENT.length === 0 && <p className="italic text-white/40 text-xs">No design artifacts found.</p>}
                
                {filteredGroups.DESIGN
                    .filter(des => !selectedSubType || des.subType === selectedSubType)
                    .map(des => {
                  const implementsIds = getRelations(des.id, 'to').filter(r => r.relation.type === 'DERIVES_FROM').map(r => r.artifact?.id);
                  return (
                    <div key={des.id} className="mb-6 bg-[#0c0c0c] border border-white/10 p-5 pl-6 border-l-[3px] border-l-purple-500/50 hover:bg-white-[0.02] transition-colors">
                      <h3 className="font-serif text-lg text-white flex gap-3 items-center mb-4">
                        {des.title}
                        {des.subType && <span className="text-[9px] font-sans bg-purple-500/10 text-purple-300 px-2 py-0.5 border border-purple-500/20 uppercase tracking-widest">{des.subType}</span>}
                      </h3>
                      <MarkdownRenderer content={des.description} />
                      {implementsIds.length > 0 && (
                        <div className="mt-4 text-[10px] uppercase tracking-widest text-white/40 bg-black/50 p-2 border border-white/5 inline-block">
                          <span className="font-semibold text-purple-400">Derives from:</span> <span className="font-mono ml-2 uppercase text-white/60">{implementsIds.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {(!selectedSubType || selectedSubType === 'Component') && filteredGroups.COMPONENT.length > 0 && (
                    <>
                        <h3 className="text-xs uppercase tracking-widest text-white/40 mt-12 mb-4 ml-1">Components</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredGroups.COMPONENT
                            .filter(comp => !selectedSubType || selectedSubType === 'Component' || comp.subType === selectedSubType)
                            .map(comp => (
                            <div key={comp.id} className="bg-[#0c0c0c] border border-white/10 p-5 hover:bg-white/[0.03] transition-colors border-l-[3px] border-l-amber-500/50">
                            <h4 className="font-serif text-[#e0e0e0] flex items-center gap-2 mb-3">
                                {comp.title}
                                {comp.subType && <span className="text-[8px] font-sans bg-amber-500/10 text-amber-300 px-1.5 py-0.5 border border-amber-500/20 uppercase tracking-widest">{comp.subType}</span>}
                            </h4>
                            <MarkdownRenderer content={comp.description} />
                            </div>
                        ))}
                        </div>
                    </>
                )}
            </section>
        )}

        {/* 3. Implementation */}
        {(!selectedPhase || selectedPhase === 'impl') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">3. Implementation Traceability</h2>
                <div className="overflow-x-auto rounded border border-white/10">
                <table className="min-w-full border-collapse text-xs">
                    <thead className="bg-[#0c0c0c] border-b border-white/10">
                    <tr>
                        <th className="p-3 text-left font-semibold text-white/60 uppercase tracking-widest text-[9px]">Code Entity</th>
                        <th className="p-3 text-left font-semibold text-white/60 uppercase tracking-widest text-[9px] border-l border-white/5">Implements Component</th>
                        <th className="p-3 text-left font-semibold text-white/60 uppercase tracking-widest text-[9px] border-l border-white/5">Description</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {filteredGroups.CODE_ENTITY
                        .filter(code => !selectedSubType || code.subType === selectedSubType)
                        .map(code => {
                        const comps = getRelations(code.id, 'from').filter(r => r.relation.type === 'IMPLEMENTS').map(r => r.artifact?.title).join(', ');
                        return (
                        <tr key={code.id} className="bg-transparent hover:bg-white/5 transition-colors">
                            <td className="p-3 font-mono text-emerald-400">
                            {code.title}
                            {code.subType && <div className="text-[8px] font-sans text-emerald-500/50 uppercase tracking-widest mt-1">{code.subType}</div>}
                            </td>
                            <td className="p-3 border-l border-white/5 text-amber-400/80 font-serif">{comps || '-'}</td>
                            <td className="p-3 border-l border-white/5 text-[#e0e0e0]/60 leading-relaxed">
                                <MarkdownRenderer content={code.description} />
                            </td>
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
                </div>
            </section>
        )}

        {/* 4. Verification */}
        {(!selectedPhase || selectedPhase === 'verif') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">4. Verification & Testing</h2>
                <div className="space-y-4">
                {filteredGroups.TEST
                    .filter(test => !selectedSubType || test.subType === selectedSubType)
                    .map(test => {
                    const validates = getRelations(test.id, 'from').filter(r => r.relation.type === 'VALIDATES').map(r => r.artifact?.title).join(', ');
                    return (
                    <div key={test.id} className="bg-[#0c0c0c] border border-white/10 p-5 border-l-[3px] border-l-rose-500/50 hover:bg-white/[0.02] transition-colors">
                        <h3 className="font-serif text-[#e0e0e0] flex items-center gap-3 mb-3">
                        {test.title}
                        {test.subType && <span className="text-[9px] font-sans bg-rose-500/10 text-rose-300 px-2 py-0.5 border border-rose-500/20 uppercase tracking-widest">{test.subType}</span>}
                        </h3>
                        <MarkdownRenderer content={test.description} />
                        <div className="mt-4 text-[10px] uppercase tracking-widest text-white/40 bg-black/50 p-2 border border-white/5 inline-block">
                        <span className="font-semibold text-rose-400">Validates:</span> <span className="font-serif capitalize text-white/60 ml-2">{validates || 'Unknown'}</span>
                        </div>
                    </div>
                    );
                })}
                </div>
            </section>
        )}

        {/* 5. Documentation */}
        {(!selectedPhase || selectedPhase === 'docs') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">5. Documentation & Evidences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGroups.DOCUMENTATION.length === 0 && <p className="italic text-white/40 text-xs col-span-2">No documentation artifacts found.</p>}
                {filteredGroups.DOCUMENTATION
                    .filter(doc => !selectedSubType || doc.subType === selectedSubType)
                    .map(doc => (
                    <div key={doc.id} className="bg-[#0c0c0c] border border-white/10 p-5 hover:bg-white/[0.03] transition-colors border-l-[3px] border-l-slate-500/50">
                    <h4 className="font-serif text-[#e0e0e0] flex items-center gap-2 mb-3">
                        {doc.title}
                        {doc.subType && <span className="text-[8px] font-sans bg-slate-500/10 text-slate-300 px-1.5 py-0.5 border border-slate-500/20 uppercase tracking-widest">{doc.subType}</span>}
                    </h4>
                    <MarkdownRenderer content={doc.description} />
                    </div>
                ))}
                </div>
            </section>
        )}

        {/* 6. Operations */}
        {(!selectedPhase || selectedPhase === 'ops') && (
            <section className="mb-16">
                <h2 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 bg-white/5 p-3 border-l-2 border-white/20">6. Operations & Incidents</h2>
                <div className="space-y-4">
                {filteredGroups.INCIDENT.length === 0 && <p className="italic text-white/40 text-xs">No incidents found.</p>}
                {filteredGroups.INCIDENT
                    .filter(inc => !selectedSubType || inc.subType === selectedSubType)
                    .map(inc => {
                    const affected = getRelations(inc.id, 'from').filter(r => r.relation.type === 'BREAKS').map(r => r.artifact?.title).join(', ');
                    const fixedBy = getRelations(inc.id, 'to').filter(r => r.relation.type === 'FIXES').map(r => r.artifact?.title).join(', ');
                    return (
                    <div key={inc.id} className="bg-[#1a0a0a] border border-red-500/20 p-5 border-l-[3px] border-l-red-500/50 hover:bg-red-900/10 transition-colors">
                        <h3 className="font-serif text-[#e0e0e0] flex items-center gap-3 mb-3">
                        <span className="text-red-400">⚠️ {inc.title}</span>
                        {inc.subType && <span className="text-[9px] font-sans bg-red-500/10 text-red-300 px-2 py-0.5 border border-red-500/20 uppercase tracking-widest">{inc.subType}</span>}
                        </h3>
                        <MarkdownRenderer content={inc.description} />
                        <div className="flex gap-4 mt-4">
                        {affected && (
                            <div className="text-[10px] uppercase tracking-widest text-red-400/60 bg-red-950/30 p-2 border border-red-500/10 inline-block">
                            <span className="font-semibold text-red-400">Breaks:</span> <span className="font-serif capitalize text-red-200/60 ml-2">{affected}</span>
                            </div>
                        )}
                        {fixedBy && (
                            <div className="text-[10px] uppercase tracking-widest text-emerald-400/60 bg-emerald-950/30 p-2 border border-emerald-500/10 inline-block">
                            <span className="font-semibold text-emerald-400">Fixed By:</span> <span className="font-serif capitalize text-emerald-200/60 ml-2">{fixedBy}</span>
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
                </div>
            </section>
        )}
        </div>
      </div>
    </div>
  );
};

