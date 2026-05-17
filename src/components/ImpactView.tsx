import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../store';
import { Activity, ArrowRight, GitCommit, Search, ShieldAlert, Zap } from 'lucide-react';
import { Artifact } from '../types';

export const ImpactView: React.FC = () => {
  const { changes, versions, graph, systemVersions, globalFilters, setGlobalFilter } = useStore();
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | 'ALL'>('ALL');
  const [filterStrength, setFilterStrength] = useState<'ALL' | 'STRONG' | 'MEDIUM' | 'WEAK' | 'IGNORE_WEAK'>('ALL');
  
  const filterLayer = globalFilters.layer;
  const filterOwner = globalFilters.owner;
  const filterTeam = globalFilters.team;

  const setFilterLayer = (val: string) => setGlobalFilter('layer', val);
  const setFilterOwner = (val: string) => setGlobalFilter('owner', val);
  const setFilterTeam = (val: string) => setGlobalFilter('team', val);

  const filterOptions = useMemo(() => {
     if (!graph || !graph.artifacts) return { layers: [], owners: [], teams: [] };
     const layers = Array.from(new Set(graph.artifacts.map(a => a.layer).filter(Boolean))) as string[];
     const owners = Array.from(new Set(graph.artifacts.map(a => a.ownership?.owner).filter(Boolean))) as string[];
     const teams = Array.from(new Set(graph.artifacts.map(a => a.ownership?.team).filter(Boolean))) as string[];
     return { layers, owners, teams };
  }, [graph]);

  // Initialize selectedId if not set
  useEffect(() => {
    if (!selectedChangeId && (changes || []).length > 0) {
      setSelectedChangeId(changes[0].id);
    }
  }, [changes, selectedChangeId]);

  const filteredChanges = useMemo(() => {
    return (changes || []).filter(c => {
      const matchesSearch = (c.title || '').toLowerCase().includes((searchQuery || '').toLowerCase()) || 
                           (c.description || '').toLowerCase().includes((searchQuery || '').toLowerCase());
      const matchesType = filterType === 'ALL' || c.type === filterType;
      
      const affectedLayerTeamOwner = (c.affects || []).some(id => {
         const artifact = graph?.artifacts.find(a => a.id === id);
         if (!artifact) return false;
         const matchesLayer = filterLayer === 'ALL' || artifact.layer === filterLayer;
         const matchesOwner = filterOwner === 'ALL' || artifact.ownership?.owner === filterOwner;
         const matchesTeam = filterTeam === 'ALL' || artifact.ownership?.team === filterTeam;
         return matchesLayer && matchesOwner && matchesTeam;
      });

      const matchesFilters = (filterLayer === 'ALL' && filterOwner === 'ALL' && filterTeam === 'ALL') || affectedLayerTeamOwner;

      const matchesStrength = filterStrength === 'ALL' || (c.affects || []).some(id => {
         return graph?.relations.some(r => {
            if (r.from !== id && r.to !== id) return false;
            if (filterStrength === 'IGNORE_WEAK') return r.strength !== 'WEAK';
            return r.strength === filterStrength;
         });
      });

      return matchesSearch && matchesType && matchesFilters && matchesStrength;
    });
  }, [changes, searchQuery, filterType, filterLayer, filterOwner, filterTeam, filterStrength, graph]);

  const selectedChange = (changes || []).find(c => c.id === selectedChangeId);

  const affectedSystems = useMemo(() => {
    if (!selectedChange) return [];
    
    // Find systems affected directly or through artifacts
    const directlyAffected = (systemVersions || []).filter(sv => (selectedChange.affects || []).includes(sv.id));
    const indirectIds = (selectedChange.affects || []).map(id => graph?.artifacts.find(a => a.id === id)?.systemVersionId).filter(Boolean);
    const indirectlyAffected = (systemVersions || []).filter(sv => indirectIds.includes(sv.id));
    
    // Merge unique
    const all = [...directlyAffected, ...indirectlyAffected];
    return (all || []).filter(item => item !== undefined).reduce((acc, item) => {
        if (!acc.find(i => i.id === item.id)) {
            acc.push(item);
        }
        return acc;
    }, [] as typeof all);
  }, [selectedChange, systemVersions, graph]);

  const phaseImpact = useMemo(() => {
    if (!selectedChange || !graph || !graph.artifacts) return {};
    const affected = (selectedChange.affects || []).map(id => graph.artifacts.find(a => a.id === id)).filter(Boolean) as Artifact[];
    
    return affected.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [selectedChange, graph]);

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-[#e0e0e0] flex overflow-hidden">
      {/* Changes list sidebar */}
      <div className="w-80 bg-[#0c0c0c] border-r border-white/10 h-full overflow-y-auto shrink-0 z-10 flex flex-col">
        <div className="p-6 border-b border-white/10 bg-[#0a0a0a]">
          <div className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-3 mb-4">
            <Activity size={16} className="text-emerald-400" /> CHANGE TIMELINE
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text"
                placeholder="Search changes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-sm py-1.5 pl-8 pr-3 text-[10px] font-mono focus:border-emerald-500/50 outline-none transition-colors"
              />
            </div>
            
            <div className="flex gap-1">
                {['ALL', 'ERROR', 'FEATURE', 'EVOLUTION', 'REFACTOR', 'ADAPTATION'].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 text-[8px] font-bold py-1 border transition-all ${filterType === type ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-transparent border-white/5 text-white/30 hover:border-white/20'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="flex gap-1 pt-2 border-t border-white/5">
                {['ALL', 'STRONG', 'MEDIUM', 'WEAK', 'IGNORE_WEAK'].map(strength => (
                    <button
                        key={strength}
                        onClick={() => setFilterStrength(strength as any)}
                        className={`flex-1 text-[8px] font-bold py-1 border transition-all ${filterStrength === strength ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-transparent border-white/5 text-white/30 hover:border-white/20'}`}
                        title={`Filter by Relation Strength: ${strength}`}
                    >
                        {strength === 'IGNORE_WEAK' ? 'NO WEAK' : strength}
                    </button>
                ))}
            </div>

            <div className="flex gap-1 pt-2 border-t border-white/5">
                <select
                    value={filterLayer}
                    onChange={(e) => setFilterLayer(e.target.value)}
                    className={`bg-transparent py-1 px-1 text-[8px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border ${
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
                    className={`bg-transparent py-1 px-1 text-[8px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border ${
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
                    className={`bg-transparent py-1 px-1 text-[8px] focus:outline-none cursor-pointer uppercase tracking-wider flex-1 text-center transition-all border ${
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

        <div className="flex flex-col flex-1">
          {(filteredChanges || []).length > 0 ? (filteredChanges || []).map(change => {
            const vFrom = versions.find(v => v.id === change.versionFrom)?.name;
            const vTo = versions.find(v => v.id === change.versionTo)?.name;

            return (
              <button
                key={change.id}
                onClick={() => setSelectedChangeId(change.id)}
                className={`p-5 text-left border-b border-white/5 hover:bg-white/5 transition-all outline-none ${selectedChangeId === change.id ? 'bg-white/5 border-l-[3px] border-l-emerald-500 shadow-inner' : 'border-l-[3px] border-l-transparent'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[8px] font-bold px-2 py-0.5 border uppercase tracking-widest ${
                    change.type === 'ERROR' ? 'text-red-400 bg-red-400/10 border-red-500/20' : 
                    change.type === 'FEATURE' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' :
                    change.type === 'EVOLUTION' ? 'text-blue-400 bg-blue-400/10 border-blue-500/20' :
                    change.type === 'REFACTOR' ? 'text-amber-400 bg-amber-400/10 border-amber-500/20' :
                    change.type === 'ADAPTATION' ? 'text-purple-400 bg-purple-400/10 border-purple-500/20' :
                    'text-gray-400 bg-gray-400/10 border-gray-500/20'
                  }`}>
                    {change.type}
                  </span>
                  <span className="text-[9px] text-white/40 font-mono tracking-tighter truncate max-w-[80px]">{vFrom} <ArrowRight size={8} className="inline opacity-30 mx-0.5" /> {vTo}</span>
                </div>
                <div className="font-serif text-[#e0e0e0] mb-1 leading-snug text-sm tracking-tight">{change.title}</div>
              </button>
            )
          }) : (
            <div className="p-8 text-center text-[10px] text-white/20 font-mono italic">No changes found matching criteria</div>
          )}
          {(changes || []).length === 0 && <div className="p-6 text-xs text-white/40 italic text-center">No changes logged.</div>}
        </div>
      </div>

      {/* Impact details */}
      <div className="flex-1 overflow-y-auto bg-grid-white/[0.02]">
        {selectedChange ? (
          <div className="max-w-5xl mx-auto p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-emerald-500/50" />
                        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em]">Lifecycle Intervention</span>
                    </div>
                    <h2 className="text-4xl font-serif italic tracking-tight mb-4 text-white">
                        {selectedChange.title}
                    </h2>
                    <p className="text-sm leading-relaxed opacity-60 max-w-2xl font-sans">{selectedChange.description}</p>

                    {(affectedSystems || []).length > 0 && (
                        <div className="mt-8 flex flex-col gap-3">
                            <span className="text-[9px] uppercase tracking-widest text-white/20 font-bold">Related Systems</span>
                            <div className="flex gap-2 flex-wrap">
                                {(affectedSystems || []).map(sys => (
                                    <div key={sys.id} className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-sm">
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-white/80">{sys.component}</span>
                                            <span className="text-[9px] font-mono text-white/40">{sys.version}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="w-full md:w-64 bg-white/[0.02] border border-white/10 p-6 rounded-sm backdrop-blur-sm">
                    <div className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-4 flex items-center gap-2">
                        <Zap size={12} className="text-amber-400" /> Magnitude of Change
                    </div>
                    <div className="space-y-3">
                        {Object.entries(phaseImpact || {}).length > 0 ? Object.entries(phaseImpact || {}).map(([phase, count]) => (
                            <div key={phase} className="flex justify-between items-center bg-black/40 px-3 py-1.5 border border-white/5">
                                <span className="text-[9px] font-mono text-white/50">{phase}</span>
                                <span className="text-[10px] font-bold text-emerald-400">+{count}</span>
                            </div>
                        )) : <div className="text-[10px] text-white/20 italic">No nodes affected</div>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <section>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-8 flex items-center gap-4">
                        <span>Affected Node Inventory</span>
                        <div className="flex-1 h-[1px] bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {(selectedChange.affects || []).map(artifactId => {
                            const artifact = graph?.artifacts.find(a => a.id === artifactId);
                            // Also check if it's a direct system version
                            const sys = systemVersions.find(s => s.id === artifactId);
                            
                            if (!artifact && !sys) return (
                                <div key={artifactId} className="bg-[#0c0c0c] p-6 border border-white/5 flex items-center gap-3 text-red-400/40 opacity-50">
                                    <ShieldAlert size={16} />
                                    <span className="text-[11px] italic">Artifact {artifactId} (Not in current snapshot)</span>
                                </div>
                            );

                            return (
                                <div key={artifactId} className="bg-[#0c0c0c] p-6 border border-white/5 hover:border-emerald-500/30 transition-all flex items-start flex-col group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Search size={14} className="text-white/20" />
                                    </div>
                                    {artifact ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4 w-full">
                                                <span className="text-[8px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 uppercase tracking-widest text-[#888]">{artifact.type}</span>
                                                <span className="font-mono text-[9px] text-emerald-500/50">{artifact.id}</span>
                                            </div>
                                            <div className="font-serif text-[#f0f0f0] text-base mb-3 group-hover:text-emerald-400 transition-colors">{artifact.title}</div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2 items-center mb-1">
                                                    {artifact.layer && <span className="text-[8px] border border-emerald-500/20 text-emerald-500/60 font-mono px-1 rounded-sm uppercase">{artifact.layer}</span>}
                                                    {artifact.ownership?.owner && <span className="text-[8px] text-blue-400 border border-blue-400/20 bg-blue-400/5 font-mono px-1 rounded-sm">OWNER: {artifact.ownership.owner}</span>}
                                                    {artifact.ownership?.team && <span className="text-[8px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 font-mono px-1 rounded-sm">TEAM: {artifact.ownership.team}</span>}
                                                </div>
                                                <div className="text-[11px] text-[#e0e0e0]/40 leading-relaxed font-sans line-clamp-3">
                                                    {artifact.description}
                                                </div>
                                            </div>
                                        </>
                                    ) : sys && (
                                        <>
                                            <div className="flex items-center gap-3 mb-4 w-full">
                                                <span className="text-[8px] font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest text-emerald-400">SYSTEM ENTITY</span>
                                                <span className="font-mono text-[9px] text-emerald-500/50">{sys.id}</span>
                                            </div>
                                            <div className="font-serif text-[#f0f0f0] text-base mb-3 group-hover:text-emerald-400 transition-colors">{sys.component}</div>
                                            <div className="text-[11px] text-[#e0e0e0]/40 leading-relaxed font-sans">
                                                Core system component released on {new Date(sys.releaseDate).toLocaleDateString()}.
                                            </div>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                <section className="bg-emerald-500/[0.02] border-y border-white/5 p-12 -mx-12">
                    <div className="max-w-3xl">
                        <h4 className="text-[10px] uppercase tracking-widest text-emerald-500/60 font-bold mb-4">Architectural Integrity Report</h4>
                        <p className="text-xs text-white/40 leading-relaxed italic">
                        This intervention enabled the transition between <span className="text-white/60">{(versions || []).find(v => v.id === selectedChange.versionFrom)?.name}</span> and <span className="text-white/60">{(versions || []).find(v => v.id === selectedChange.versionTo)?.name}</span>. 
                        The impact is primarily concentrated at the <span className="text-white/60">
                            {Object.keys(phaseImpact || {}).join(', ') || 'Core'} layer
                        </span>, affecting critical systems such as <span className="text-white/60">
                            {(affectedSystems || []).map(s => s.component).join(', ') || 'Base Components'}
                        </span>. 
                        {(() => {
                            switch (selectedChange.type) {
                                case 'ERROR': return ' This change addresses technical debt or a previously identified operational failure.';
                                case 'FEATURE': return ' The implementation adds capabilities that expand the existing architecture.';
                                case 'EVOLUTION': return ' This change provides gradual improvements, security, or compliance updates.';
                                case 'REFACTOR': return ' This change focuses on code re-structuring without altering external behavior.';
                                case 'ADAPTATION': return ' This change adjusts the system to new environmental or integration constraints.';
                                default: return ' This change modifies the system architecture.';
                            }
                        })()}
                    </p>
                    </div>
                </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
            <GitCommit size={64} className="animate-pulse" />
            <div className="text-[10px] uppercase tracking-[0.5em] font-bold">Select a change for analysis</div>
          </div>
        )}
      </div>
    </div>
  );
};
