import React, { useEffect } from 'react';
import { useStore } from './store';
import { GraphView } from './components/GraphView';
import { DocumentationView } from './components/DocumentationView';
import { ImpactView } from './components/ImpactView';
import { OrphansView } from './components/OrphansView';
import { GuideView } from './components/GuideView';
import { Network, FileText, GitPullRequest, Settings, Database, AlertCircle, BookOpen } from 'lucide-react';

export default function App() {
  const { 
    initializeStore, 
    versions, 
    currentVersionId, 
    setVersion,
    activeView,
    setView,
    isLoading,
    systemVersions
  } = useStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0a] text-[#e0e0e0] font-sans selection:bg-emerald-500/30">
      {/* Sidebar Nav */}
      <nav className="w-16 flex flex-col items-center py-6 bg-[#0c0c0c] text-white/40 border-r border-white/10 shrink-0">
        <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm mb-8">
          <div className="w-4 h-4 border-2 border-black rotate-45"></div>
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center">
          <button 
            onClick={() => setView('graph')}
            className={`transition-all hover:text-white hover:opacity-100 ${activeView === 'graph' ? 'text-white opacity-100' : 'opacity-40'}`}
            title="Graph View"
          >
            <Network size={20} strokeWidth={1.5} />
          </button>
          <button 
             onClick={() => setView('docs')}
             className={`transition-all hover:text-white hover:opacity-100 ${activeView === 'docs' ? 'text-white opacity-100' : 'opacity-40'}`}
             title="Documentation Engine"
          >
            <FileText size={20} strokeWidth={1.5} />
          </button>
          <button 
             onClick={() => setView('impact')}
             className={`transition-all hover:text-white hover:opacity-100 ${activeView === 'impact' ? 'text-white opacity-100' : 'opacity-40'}`}
             title="Impact Analysis"
          >
            <GitPullRequest size={20} strokeWidth={1.5} />
          </button>
          <button 
             onClick={() => setView('orphans')}
             className={`transition-all hover:text-white hover:opacity-100 ${activeView === 'orphans' ? 'text-red-400 opacity-100' : 'opacity-40'}`}
             title="Traceability Gaps (Orphans)"
          >
            <AlertCircle size={20} strokeWidth={1.5} />
          </button>
          <button 
             onClick={() => setView('guide')}
             className={`transition-all hover:text-white hover:opacity-100 ${activeView === 'guide' ? 'text-amber-400 opacity-100' : 'opacity-40'}`}
             title="Usage Guide"
          >
            <BookOpen size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto">
          <button className="opacity-40 hover:text-white hover:opacity-100 transition-all">
            <Settings size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-[#0f0f0f] border-b border-white/10 flex items-center px-8 justify-between shrink-0 z-10">
          <div className="font-serif text-xl italic tracking-tight flex items-center gap-2">
            OpenLAG <span className="text-xs font-mono opacity-50 ml-2 not-italic">| Lifecycle Engine</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] opacity-40 uppercase tracking-widest">Doc Snapshot</span>
              </div>
              <select 
                value={currentVersionId || ''} 
                onChange={(e) => setVersion(e.target.value)}
                className="bg-[#0c0c0c] border border-white/20 text-xs font-mono text-emerald-400 rounded-sm px-3 py-1.5 outline-none cursor-pointer hover:bg-white/5 transition-colors focus:border-emerald-400"
              >
                {versions.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({new Date(v.timestamp).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            <div className="h-6 w-[1px] bg-white/10" />

            <div className="flex items-center gap-3 group relative">
              <div className="p-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <Database size={14} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] opacity-40 uppercase tracking-widest leading-none">System State</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-white/80 font-bold tracking-tight">
                    {systemVersions.length} Components Active
                  </span>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#0f0f0f] border border-white/10 p-4 rounded-sm shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                <div className="text-[9px] uppercase tracking-widest text-[#888] font-bold mb-3 border-b border-white/5 pb-2">Active Inventory</div>
                <div className="space-y-2">
                  {systemVersions.map(sv => (
                    <div key={sv.id} className="flex justify-between items-center text-[10px]">
                      <span className="text-white/60">{sv.component}</span>
                      <span className="font-mono text-emerald-500/60">{sv.version}</span>
                    </div>
                  ))}
                  {systemVersions.length === 0 && (
                    <div className="text-white/20 italic">No system components logged.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* View Renderer */}
        <main className="flex-1 relative overflow-hidden">
          {isLoading && !currentVersionId ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : null}

          {activeView === 'graph' && <GraphView />}
          {activeView === 'docs' && <DocumentationView />}
          {activeView === 'impact' && <ImpactView />}
          {activeView === 'orphans' && <OrphansView />}
          {activeView === 'guide' && <GuideView />}
        </main>
      </div>
    </div>
  );
}
