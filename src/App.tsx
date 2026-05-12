import React, { useEffect } from 'react';
import { useStore } from './store';
import { GraphView } from './components/GraphView';
import { DocumentationView } from './components/DocumentationView';
import { ImpactView } from './components/ImpactView';
import { Network, FileText, GitPullRequest, Settings, Database } from 'lucide-react';

export default function App() {
  const { 
    fetchVersions, 
    versions, 
    currentVersionId, 
    setVersion,
    activeView,
    setView,
    isLoading
  } = useStore();

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

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
            ArchGraph <span className="text-xs font-mono opacity-50 ml-2 not-italic">| Lifecycle Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] opacity-40 uppercase tracking-widest">System Version</span>
            </div>
            <select 
              value={currentVersionId || ''} 
              onChange={(e) => setVersion(e.target.value)}
              className="bg-[#0c0c0c] border border-white/20 text-xs font-mono text-emerald-400 rounded-sm px-2 py-1 outline-none cursor-pointer hover:bg-white/5 transition-colors focus:border-emerald-400"
            >
              {versions.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({new Date(v.timestamp).toLocaleDateString()})</option>
              ))}
            </select>
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
        </main>
      </div>
    </div>
  );
}
