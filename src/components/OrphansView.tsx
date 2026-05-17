import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { ArtifactType } from '../types';
import { AlertCircle, Search, Trash2, ChevronRight, FileText, ExternalLink } from 'lucide-react';

export const OrphansView: React.FC = () => {
    const { graph, setView, setSelectedArtifact } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | 'ALL'>('ALL');

    const orphans = useMemo(() => {
        if (!graph) return [];
        const linkedIds = new Set<string>();
        graph.relations.forEach(rel => {
            linkedIds.add(rel.from);
            linkedIds.add(rel.to);
        });

        return graph.artifacts.filter(art => !linkedIds.has(art.id));
    }, [graph]);

    const filteredOrphans = useMemo(() => {
        return orphans.filter(art => {
            const matchesSearch = 
                art.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (art.description || '').toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesType = typeFilter === 'ALL' || art.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [orphans, searchQuery, typeFilter]);

    const artifactTypes = useMemo(() => {
        return Array.from(new Set(orphans.map(a => a.type)));
    }, [orphans]);

    const goToDocs = (id: string) => {
        setSelectedArtifact(id);
        setView('docs');
    };

    if (!graph) return <div className="p-8 text-white/50">Loading...</div>;

    return (
        <div className="h-full w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-8 lg:px-16 pt-12 shrink-0 border-b border-white/5 bg-[#0c0c0c]/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-serif italic tracking-tight">Traceability Gaps</h1>
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                <AlertCircle size={12} />
                                {orphans.length} Orphan Artifacts Found
                            </div>
                        </div>
                        <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
                            These artifacts exist in the system documentation but have no established relationships in the architectural graph. This indicates potential gaps in documentation, missing implementation links, or dead entities.
                        </p>
                    </div>

                        <div className="flex gap-2 p-0.5 bg-white/5 border border-white/10 rounded-md shrink-0">
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 text-white/20" size={12} />
                                <input 
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none py-1.5 pl-8 pr-3 text-[10px] text-white focus:outline-none w-40 placeholder:text-white/10"
                                />
                            </div>
                            <div className="w-px h-4 bg-white/10 self-center" />
                            <select 
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-transparent border-none py-1.5 px-3 text-[10px] text-white/50 outline-none cursor-pointer appearance-none uppercase tracking-widest hover:text-white transition-colors"
                            >
                                <option value="ALL" className="bg-[#0c0c0c] text-white">All Types</option>
                                {artifactTypes.map(type => (
                                    <option key={type} value={type} className="bg-[#0c0c0c] text-white">{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:px-16 pb-12 custom-scrollbar">
                {filteredOrphans.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg">
                        <Trash2 className="text-white/10 mb-4" size={48} strokeWidth={1} />
                        <p className="text-white/30 text-sm italic">No orphan artifacts found matching filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredOrphans.map(art => (
                            <div key={art.id} className="bg-[#0c0c0c] border border-white/10 p-5 rounded-sm hover:border-red-500/30 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => goToDocs(art.id)}
                                        className="p-2 bg-white/5 hover:bg-emerald-500/20 text-white/40 hover:text-emerald-400 rounded transition-colors"
                                        title="View in Documentation"
                                    >
                                        <ExternalLink size={14} />
                                    </button>
                                </div>

                                 <div className="flex items-center gap-2 mb-4">
                                   <div className="p-2 bg-red-500/5 rounded border border-red-500/10">
                                       <AlertCircle size={14} className="text-red-500/60" />
                                   </div>
                                   <div className="flex flex-col gap-1">
                                       <div className="flex items-center gap-2">
                                           <span className="text-[10px] font-bold text-red-400/80 uppercase tracking-widest leading-none">{art.type}</span>
                                           {art.layer && <span className="text-[8px] bg-red-500/10 border border-red-500/20 text-red-400/60 px-1 rounded-sm uppercase tracking-widest">{art.layer}</span>}
                                       </div>
                                       <span className="text-[9px] font-mono text-white/20 mt-1 uppercase tracking-tighter italic leading-none">{art.id}</span>
                                   </div>
                                </div>

                                <h3 className="font-serif text-lg text-white mb-2 leading-tight">{art.title}</h3>
                                {(art.ownership?.owner || art.ownership?.team) && (
                                    <div className="flex gap-2 mb-2">
                                        {art.ownership.owner && <span className="text-[9px] text-blue-400 border border-blue-400/20 bg-blue-400/5 px-1 rounded-sm font-mono">OWNER: {art.ownership.owner}</span>}
                                        {art.ownership.team && <span className="text-[9px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-1 rounded-sm font-mono">TEAM: {art.ownership.team}</span>}
                                    </div>
                                )}
                                <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-6 min-h-[48px]">
                                    {art.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-tighter text-white/20">Version</span>
                                            <span className="text-[10px] text-white/60 font-mono">{art.version}</span>
                                        </div>
                                        {art.subType && (
                                            <div className="flex flex-col border-l border-white/10 pl-4">
                                                <span className="text-[8px] uppercase tracking-tighter text-white/20">Subtype</span>
                                                <span className="text-[10px] text-white/60 font-mono">{art.subType}</span>
                                            </div>
                                        )}
                                    </div>
                                    <button 
                                        onClick={() => goToDocs(art.id)}
                                        className="text-[10px] text-emerald-400/60 hover:text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                                    >
                                        Open Docs
                                        <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
