import React, { useMemo, useState } from 'react';
import { useStore } from '../store';
import { ArtifactType } from '../types';
import { getArtifactLayer, getArtifactOwner, getArtifactTeam } from '../utils/artifactUtils';
import { AlertCircle, Search, Trash2, ChevronRight, FileText, ExternalLink, ShieldAlert, AlertTriangle, Info, Download } from 'lucide-react';
import { generateGapsReport, downloadTextFile } from '../lib/reportUtils';

export const OrphansView: React.FC = () => {
    const { fullGraph: graph, setView, selectedArtifactId, setSelectedArtifact, globalFilters, setGlobalFilter } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string | 'ALL'>('ALL');
    const [violationFilter, setViolationFilter] = useState<string | 'ALL'>('ALL');

    const filterLayer = globalFilters.layer;
    const filterOwner = globalFilters.owner;
    const filterTeam = globalFilters.team;

    const setFilterLayer = (val: string) => setGlobalFilter('layer', val);
    const setFilterOwner = (val: string) => setGlobalFilter('owner', val);
    const setFilterTeam = (val: string) => setGlobalFilter('team', val);

    const filterOptions = useMemo(() => {
        if (!graph || !graph.artifacts) return { layers: [], owners: [], teams: [] };

        const layers = new Set<string>();
        const owners = new Set<string>();
        const teams = new Set<string>();

        graph.artifacts.forEach(a => {
            if (a.layer) layers.add(a.layer);
            if (a.ownership?.owner) owners.add(a.ownership.owner);
            if (a.ownership?.team) teams.add(a.ownership.team);
        });

        return {
            layers: Array.from(layers).sort(),
            owners: Array.from(owners).sort(),
            teams: Array.from(teams).sort(),
        };
    }, [graph]);

    const gaps = useMemo(() => {
        if (!graph) return [];
        const linkedIds = new Set<string>();
        graph.relations.forEach(rel => {
            linkedIds.add(rel.from);
            linkedIds.add(rel.to);
        });

        const violations: { artifact: any, type: string, message: string, severity: 'HIGH' | 'MEDIUM' | 'LOW' }[] = [];

        graph.artifacts.forEach(art => {
            if (!linkedIds.has(art.id)) {
                violations.push({ artifact: art, type: 'ORPHAN', message: 'No relationships defined', severity: 'HIGH' });
            }
            if (!art.layer) {
                violations.push({ artifact: art, type: 'NO_LAYER', message: 'Missing layer classification', severity: 'MEDIUM' });
            }
            if (!art.ownership?.owner) {
                violations.push({ artifact: art, type: 'NO_OWNER', message: 'Missing ownership (owner)', severity: 'HIGH' });
            }
            if (!art.ownership?.team) {
                violations.push({ artifact: art, type: 'NO_TEAM', message: 'Missing organizational team', severity: 'LOW' });
            }
            if (!art.description || art.description.length < 5) {
                violations.push({ artifact: art, type: 'NO_DESCRIPTION', message: 'Description is too short or missing', severity: 'MEDIUM' });
            }
        });

        return violations;
    }, [graph]);

    const filteredGaps = useMemo(() => {
        return gaps.filter(gap => {
            const art = gap.artifact;
            const computedLayer = getArtifactLayer(art);
            const computedOwner = getArtifactOwner(art, graph);
            const computedTeam = getArtifactTeam(art, graph);

            if (filterLayer !== 'ALL' && computedLayer !== filterLayer) return false;
            if (filterOwner !== 'ALL' && computedOwner !== filterOwner) return false;
            if (filterTeam !== 'ALL' && computedTeam !== filterTeam) return false;

            if (selectedArtifactId && art.id !== selectedArtifactId) return false;

            const matchesSearch =
                art.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (art.description || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = typeFilter === 'ALL' || art.type === typeFilter;
            const matchesViolation = violationFilter === 'ALL' || gap.type === violationFilter;

            return matchesSearch && matchesType && matchesViolation;
        });
    }, [gaps, searchQuery, typeFilter, violationFilter, filterLayer, filterOwner, filterTeam, selectedArtifactId]);

    const artifactTypes = useMemo(() => {
        // Match the grouped keys in DocumentationView
        return [
            'REQUIREMENT', 'USE_CASE', 'DESIGN', 'COMPONENT',
            'CODE_ENTITY', 'TEST_CASE', 'DOCUMENTATION', 'INCIDENT',
            'INFRASTRUCTURE', 'DEPLOYMENT', 'MONITORING', 'MAINTENANCE'
        ];
    }, []);

    const violationTypes = useMemo(() => {
        return Array.from(new Set(gaps.map(g => g.type)));
    }, [gaps]);

    const goToDocs = (id: string) => {
        setSelectedArtifact(id);
        setView('docs');
    };

    const hasActiveFilters = searchQuery !== '' || typeFilter !== 'ALL' || violationFilter !== 'ALL' || filterLayer !== 'ALL' || filterOwner !== 'ALL' || filterTeam !== 'ALL' || selectedArtifactId !== null;

    const handleGenerateReport = () => {
        const reportContent = generateGapsReport(filteredGaps, hasActiveFilters);
        downloadTextFile('openlag-gaps-report.md', reportContent);
    };

    if (!graph) return <div className="p-8 text-white/50">Loading...</div>;

    const SeverityIcon = ({ severity }: { severity: string }) => {
        switch(severity) {
            case 'HIGH': return <ShieldAlert size={14} className="text-red-500/80" />;
            case 'MEDIUM': return <AlertTriangle size={14} className="text-amber-500/80" />;
            case 'LOW': return <Info size={14} className="text-blue-500/80" />;
            default: return <AlertCircle size={14} className="text-white/40" />;
        }
    };

    const severityColor = (severity: string) => {
        switch(severity) {
            case 'HIGH': return 'border-red-500/20 bg-red-500/5 hover:border-red-500/40 text-red-400';
            case 'MEDIUM': return 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40 text-amber-400';
            case 'LOW': return 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40 text-blue-400';
            default: return 'border-white/10 hover:border-white/30 text-white/60';
        }
    };

    return (
        <div className="h-full w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-8 lg:px-16 pt-12 shrink-0 border-b border-white/5 bg-[#0c0c0c]/30">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-serif italic tracking-tight">Traceability GAPs</h1>
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                                <AlertCircle size={12} />
                                {filteredGaps.length} Violations Found
                            </div>
                        </div>
                        <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
                            These artifacts have been flagged for structural or documentation violations such as missing links, absent ownership, or incomplete descriptions. Clean these up to improve the system's traceability.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                        {/* View Specific Filters */}
                        <div className="flex gap-2 p-0.5 bg-white/5 border border-white/10 rounded-md w-full">
                            <div className="relative flex items-center flex-1">
                                <Search className="absolute left-3 text-white/20" size={12} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none py-1.5 pl-8 pr-3 text-[10px] text-white focus:outline-none w-full placeholder:text-white/10"
                                />
                            </div>
                            <div className="w-px h-4 bg-white/10 self-center" />
                            <select
                                value={violationFilter}
                                onChange={(e) => setViolationFilter(e.target.value)}
                                className={`bg-transparent py-1.5 px-3 text-[10px] outline-none cursor-pointer uppercase tracking-widest transition-all border rounded-sm flex-1 ${
                                    violationFilter !== 'ALL'
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold'
                                        : 'border-transparent border-l-white/10 text-white/50 hover:border-white/20'
                                }`}
                            >
                                <option value="ALL" className="bg-[#0c0c0c] text-white font-normal">All Violations</option>
                                {violationTypes.map(type => (
                                    <option key={type} value={type} className="bg-[#0c0c0c] text-white font-normal">{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className={`bg-transparent py-1.5 px-3 text-[10px] outline-none cursor-pointer uppercase tracking-widest transition-all border rounded-sm flex-1 ${
                                    typeFilter !== 'ALL'
                                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 font-bold'
                                        : 'border-transparent border-l-white/10 text-white/50 hover:border-white/20'
                                }`}
                            >
                                <option value="ALL" className="bg-[#0c0c0c] text-white font-normal">All Types</option>
                                {artifactTypes.map(type => (
                                    <option key={type} value={type} className="bg-[#0c0c0c] text-white font-normal">{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            <select
                                value={selectedArtifactId || ''}
                                onChange={(e) => setSelectedArtifact(e.target.value || null)}
                                className={`bg-transparent py-1.5 px-3 text-[10px] outline-none cursor-pointer tracking-widest transition-all border rounded-sm flex-1 font-mono max-w-[150px] ${
                                    selectedArtifactId
                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold'
                                        : 'border-transparent border-l-white/10 text-white/50 hover:border-white/20'
                                }`}
                            >
                                <option value="" className="bg-[#0c0c0c] text-white font-sans uppercase">Artifact...</option>
                                {(graph?.artifacts || [])
                                    .filter(a => typeFilter === 'ALL' || a.type === typeFilter)
                                    .sort((a,b) => a.id.localeCompare(b.id))
                                    .map(a => (
                                        <option key={a.id} value={a.id} className="bg-[#0c0c0c] text-white">
                                            {a.id}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Global Filters */}
                        <div className="flex gap-1 w-full lg:w-auto items-center">
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

                            <button
                                onClick={handleGenerateReport}
                                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 font-mono text-[9px] uppercase tracking-widest px-3 py-1 flex items-center gap-1.5 rounded-sm transition-all h-full"
                                title="Download GAPs Report"
                            >
                                <Download size={12} />
                                Generar reporte
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:px-16 pb-12 custom-scrollbar">
                {filteredGaps.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-lg">
                        <Trash2 className="text-white/10 mb-4" size={48} strokeWidth={1} />
                        <p className="text-white/30 text-sm italic">No violations found matching filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredGaps.map((gap, idx) => {
                            const art = gap.artifact;
                            return (
                            <div key={`${art.id}-${gap.type}-${idx}`} className={`border p-5 rounded-sm transition-all group relative overflow-hidden flex flex-col ${severityColor(gap.severity)}`}>
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
                                   <div className={`p-2 rounded border bg-black/40 ${severityColor(gap.severity)}`}>
                                       <SeverityIcon severity={gap.severity} />
                                   </div>
                                   <div className="flex flex-col gap-1">
                                       <div className="flex items-center gap-2">
                                           <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{gap.type}</span>
                                           {art.layer && <span className="text-[8px] bg-white/5 text-white/50 px-1 rounded-sm uppercase tracking-widest">{art.layer}</span>}
                                       </div>
                                       <span className="text-[9px] font-mono text-white/20 mt-1 uppercase tracking-tighter italic leading-none">{art.id}</span>
                                   </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-[10px] font-mono text-white/60 mb-1 opacity-60">Message</div>
                                    <div className="font-serif text-sm leading-tight">{gap.message}</div>
                                </div>

                                <hr className="border-white/5 my-4" />

                                <h3 className="font-serif text-lg text-white mb-2 leading-tight">{art.title}</h3>
                                {(art.ownership?.owner || art.ownership?.team) && (
                                    <div className="flex gap-2 mb-2">
                                        {art.ownership.owner && <span className="text-[9px] text-blue-400 border border-blue-400/20 bg-blue-400/5 px-1 rounded-sm font-mono">OWNER: {art.ownership.owner}</span>}
                                        {art.ownership.team && <span className="text-[9px] text-emerald-400 border border-emerald-400/20 bg-emerald-400/5 px-1 rounded-sm font-mono">TEAM: {art.ownership.team}</span>}
                                    </div>
                                )}
                                <p className="text-xs text-white/40 leading-relaxed line-clamp-2 mb-6 flex-1 min-h-[36px]">
                                    {art.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] uppercase tracking-tighter text-white/20">Artifact Type</span>
                                            <span className="text-[10px] text-white/60 font-mono">{art.type}</span>
                                        </div>
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
