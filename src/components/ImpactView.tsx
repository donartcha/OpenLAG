import React, { useState } from 'react';
import { useStore } from '../store';
import { Activity, ArrowRight, GitCommit } from 'lucide-react';

export const ImpactView: React.FC = () => {
  const { changes, versions, graph } = useStore();
  const [selectedChangeId, setSelectedChangeId] = useState<string | null>(changes.length > 0 ? changes[0].id : null);

  const selectedChange = changes.find(c => c.id === selectedChangeId);

  return (
    <div className="h-full w-full bg-[#0a0a0a] text-[#e0e0e0] flex">
      {/* Changes list sidebar */}
      <div className="w-80 bg-[#0c0c0c] border-r border-white/10 h-full overflow-y-auto shrink-0 z-10">
        <div className="p-6 border-b border-white/10 text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-3 bg-[#0a0a0a]">
          <Activity size={16} className="text-emerald-400" /> API CHANGELOG & IMPACT
        </div>
        <div className="flex flex-col">
          {changes.map(change => {
            const vFrom = versions.find(v => v.id === change.versionFrom)?.name;
            const vTo = versions.find(v => v.id === change.versionTo)?.name;

            return (
              <button
                key={change.id}
                onClick={() => setSelectedChangeId(change.id)}
                className={`p-5 text-left border-b border-white/5 hover:bg-white/5 transition-all ${selectedChangeId === change.id ? 'bg-white/5 border-l-[3px] border-l-emerald-500 shadow-inner' : 'border-l-[3px] border-l-transparent'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20">{change.type}</span>
                  <span className="text-[10px] text-white/40 font-mono tracking-tighter">{vFrom} <ArrowRight size={10} className="inline opacity-50 mx-0.5" /> {vTo}</span>
                </div>
                <div className="font-serif text-[#e0e0e0] mb-1 leading-snug">{change.title}</div>
              </button>
            )
          })}
          {changes.length === 0 && <div className="p-6 text-xs text-white/40 italic text-center">No changes logged.</div>}
        </div>
      </div>

      {/* Impact details */}
      <div className="flex-1 p-12 overflow-y-auto">
        {selectedChange ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif italic tracking-tight mb-4 flex items-center gap-3 text-white">
              <GitCommit className="text-emerald-500 shrink-0" size={28} />
              {selectedChange.title}
            </h2>
            <p className="text-sm leading-relaxed opacity-70 mb-12 border-l-2 border-white/10 pl-4">{selectedChange.description}</p>

            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 border-b border-white/10 pb-3">Directly Affected Artifacts</h3>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {selectedChange.affects.map(artifactId => {
                const artifact = graph?.artifacts.find(a => a.id === artifactId);
                return (
                  <div key={artifactId} className="bg-[#151515] p-5 border border-white/10 hover:border-white/20 transition-colors flex items-start flex-col">
                     {artifact ? (
                       <>
                         <div className="flex items-center gap-3 mb-3 w-full border-b border-white/5 pb-3">
                           <span className="text-[9px] font-bold px-2 py-1 bg-black border border-white/10 uppercase tracking-widest text-blue-400">{artifact.type}</span>
                           <span className="font-mono text-[10px] text-white/40 ml-auto">{artifact.id}</span>
                         </div>
                         <div className="font-serif text-white text-[15px] mb-2">{artifact.title}</div>
                         <div className="text-xs text-[#e0e0e0]/60 leading-relaxed font-sans">{artifact.description}</div>
                       </>
                     ) : (
                       <span className="text-white/40 text-xs italic">Artifact {artifactId} (Not present in current snapshot)</span>
                     )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-white/30 flex items-center justify-center h-full text-xs uppercase tracking-widest font-semibold font-mono">Select a change to view its impact.</div>
        )}
      </div>
    </div>
  );
};
