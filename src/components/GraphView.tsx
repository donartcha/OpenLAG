import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Node, Edge, MarkerType, Handle, Position, Panel, ReactFlowProvider, useReactFlow } from '@xyflow/react';
import dagre from 'dagre';
import { Search, X, AlertCircle } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { useStore } from '../store';
import { ArtifactType } from '../types';

const typeColors: Record<ArtifactType, string> = {
  REQUIREMENT: 'text-blue-400 border-blue-400',
  USE_CASE: 'text-indigo-400 border-indigo-400',
  DESIGN: 'text-purple-400 border-purple-400',
  COMPONENT: 'text-amber-400 border-amber-400',
  CODE_ENTITY: 'text-emerald-400 border-emerald-400',
  TEST: 'text-rose-400 border-rose-400',
  DOCUMENTATION: 'text-slate-400 border-slate-400',
  INCIDENT: 'text-red-400 border-red-400',
  INFRASTRUCTURE: 'text-cyan-400 border-cyan-400',
  DEPLOYMENT: 'text-sky-400 border-sky-400',
  MONITORING: 'text-orange-400 border-orange-400',
  MAINTENANCE: 'text-violet-400 border-violet-400',
  PROJECT: 'text-stone-400 border-stone-400',
  EPIC: 'text-indigo-500 border-indigo-500',
  FEATURE: 'text-blue-500 border-blue-500',
  BUSINESS_RULE: 'text-teal-400 border-teal-400',
  DECISION: 'text-pink-400 border-pink-400',
  TEST_CASE: 'text-rose-500 border-rose-500',
  CHANGE: 'text-lime-400 border-lime-400',
  BUG: 'text-red-500 border-red-500',
  RISK: 'text-fuchsia-400 border-fuchsia-400',
  GLOSSARY_TERM: 'text-gray-400 border-gray-400',
  API: 'text-emerald-500 border-emerald-500',
  DATABASE_ENTITY: 'text-orange-500 border-orange-500',
};

const CustomNode = ({ data, selected }: any) => {
  const colorClass = typeColors[data.type as ArtifactType] || 'text-white/40 border-white/40';
  const isDimmed = data.dimmed;
  const isOrphan = data.isOrphan;

  return (
    <div className={`p-4 shadow-xl border bg-[#151515] w-[260px] cursor-pointer transition-all duration-300
      ${selected ? 'ring-1 ring-white/50 border-white/50 z-10' : 'border-white/10 hover:border-white/30'} 
      ${isDimmed ? 'opacity-30 grayscale saturate-0' : 'opacity-100'}
      ${isOrphan ? 'border-red-500/50' : 'border-white/10'}
      border-l-[3px]`}
      style={{ borderLeftColor: isOrphan ? '#ef4444' : 'currentColor' }}
    >
      <Handle type="target" position={Position.Top} id="t-top" className={`w-2 h-2 rounded-none ${isDimmed ? 'opacity-0' : 'bg-emerald-500/50 border-0'}`} style={{ left: '30%' }} />
      <Handle type="source" position={Position.Top} id="s-top" className={`w-2 h-2 rounded-none ${isDimmed ? 'opacity-0' : 'bg-blue-500/50 border-0'}`} style={{ left: '70%' }} />
      <div className={`flex justify-between items-start mb-3 ${colorClass}`}>
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-bold uppercase tracking-widest">{data.type}</span>
            {isOrphan && (
               <div className="text-red-500" title="Orphan Artifact (No relationships)">
                 <AlertCircle size={10} />
               </div>
            )}
          </div>
          {data.subType && <span className="text-[8px] font-sans uppercase tracking-wider opacity-60">{data.subType}</span>}
        </div>
        <span className="text-[10px] font-mono opacity-60 shrink-0 ml-2">{data.id}</span>
      </div>
      <div className="font-serif text-[#e0e0e0] text-sm mb-2">{data.title}</div>
      <div className="text-[11px] leading-relaxed opacity-60 h-8 overflow-hidden text-ellipsis line-clamp-2">{data.description}</div>
      <Handle type="target" position={Position.Bottom} id="t-bot" className={`w-2 h-2 rounded-none ${isDimmed ? 'opacity-0' : 'bg-emerald-500/50 border-0'}`} style={{ left: '70%' }} />
      <Handle type="source" position={Position.Bottom} id="s-bot" className={`w-2 h-2 rounded-none ${isDimmed ? 'opacity-0' : 'bg-blue-500/50 border-0'}`} style={{ left: '30%' }} />
    </div>
  );
};

const nodeTypes = {
  artifact: CustomNode,
};

const NODE_WIDTH = 260;
const NODE_HEIGHT = 140;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Aumentar la separación para reducir cruces y dar espacio a las etiquetas
  dagreGraph.setGraph({ rankdir: direction, align: 'UL', edgesep: 120, ranksep: 160, nodesep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const GraphFlow: React.FC = () => {
  const { graph, selectedArtifactId, setSelectedArtifact, setView, settings } = useStore();
  const { setCenter } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const orphanIds = useMemo(() => {
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

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredArtifacts = useMemo(() => {
    if (!graph) return [];
    if (!searchTerm) return graph.artifacts;
    const term = searchTerm.toLowerCase();
    return graph.artifacts.filter(a => 
      a.title.toLowerCase().includes(term) || 
      a.type.toLowerCase().includes(term) ||
      (a.subType && a.subType.toLowerCase().includes(term)) ||
      a.id.toLowerCase().includes(term)
    );
  }, [graph, searchTerm]);

  useEffect(() => {
    if (selectedArtifactId && nodes.length > 0) {
      const selectedNode = nodes.find(n => n.id === selectedArtifactId);
      if (selectedNode) {
        setCenter(selectedNode.position.x + NODE_WIDTH / 2, selectedNode.position.y + NODE_HEIGHT / 2, { zoom: 1, duration: 800 });
      }
    }
  }, [selectedArtifactId, nodes, setCenter]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!graph) return;

    let connectedNodes = new Set<string>();
    let connectedEdges = new Set<string>();

    if (selectedArtifactId) {
      connectedNodes.add(selectedArtifactId);
      
      let currentLevelNodes = new Set<string>([selectedArtifactId]);
      
      const maxDepth = settings.graphFocusDepth === 0 ? Infinity : settings.graphFocusDepth;
      
      for (let depth = 0; depth < maxDepth; depth++) {
        let nextLevelNodes = new Set<string>();
        let edgesToAdd = new Set<string>();
        
        graph.relations.forEach(r => {
          if (currentLevelNodes.has(r.from) || currentLevelNodes.has(r.to)) {
            edgesToAdd.add(r.id);
            if (!connectedNodes.has(r.from)) nextLevelNodes.add(r.from);
            if (!connectedNodes.has(r.to)) nextLevelNodes.add(r.to);
          }
        });
        
        if (nextLevelNodes.size === 0) break; // Optimization: stop if no new nodes
        
        nextLevelNodes.forEach(n => connectedNodes.add(n));
        edgesToAdd.forEach(e => connectedEdges.add(e));
        currentLevelNodes = nextLevelNodes;
      }
    }

    let initialNodes: Node[] = graph.artifacts.map((a) => {
      // Find connections for dimming logic
      const isSelected = selectedArtifactId === a.id;
      let isConnectedToSelected = false;

      if (selectedArtifactId) {
        isConnectedToSelected = connectedNodes.has(a.id);
      }

      const isDimmed = selectedArtifactId !== null && !isSelected && !isConnectedToSelected;
      const isOrphan = orphanIds.has(a.id);

      return {
        id: a.id,
        type: 'artifact',
        position: { x: 0, y: 0 },
        data: { ...a, dimmed: isDimmed, isOrphan }
      };
    });

    let initialEdges: Edge[] = graph.relations.map((r) => {
      const isConnectedToSelected = selectedArtifactId 
        ? connectedEdges.has(r.id)
        : true;
      
      const isDimmed = selectedArtifactId !== null && !isConnectedToSelected;

      // Handle placement logic based on dagre TB layout
      return {
        id: r.id,
        source: r.from,
        target: r.to,
        sourceHandle: 's-bot',
        targetHandle: 't-top',
        label: r.type,
        type: 'default',
        animated: selectedArtifactId !== null && isConnectedToSelected,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isDimmed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)'
        },
        style: { 
          stroke: isDimmed ? 'rgba(255,255,255,0.05)' : (isConnectedToSelected && selectedArtifactId ? '#34d399' : 'rgba(255,255,255,0.4)'), 
          strokeWidth: isDimmed ? 1 : (isConnectedToSelected && selectedArtifactId ? 2 : 1.5), 
          strokeDasharray: '4',
          transition: 'all 0.3s ease'
        },
        labelStyle: { 
          fill: isDimmed ? 'transparent' : 'rgba(255,255,255,0.8)', 
          fontSize: 9, 
          fontWeight: 700, 
          letterSpacing: '1px' 
        },
        labelBgStyle: { 
          fill: isDimmed ? 'transparent' : '#111111', 
          opacity: isDimmed ? 0 : 1, 
          stroke: isDimmed ? 'transparent' : 'rgba(255,255,255,0.1)', 
          strokeWidth: 1 
        },
        labelBgBorderRadius: 4,
        labelBgPadding: [8, 4],
      };
    });

    const layouted = getLayoutedElements(initialNodes, initialEdges, 'TB');
    
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [graph, selectedArtifactId, settings.graphFocusDepth, setNodes, setEdges, orphanIds]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedArtifact(node.id);
    setIsDropdownOpen(false);
  }, [setSelectedArtifact]);

  const onPaneClick = useCallback(() => {
    setSelectedArtifact(null);
    setIsDropdownOpen(false);
  }, [setSelectedArtifact]);

  if (!graph) return <div className="p-8 text-white/50">Loading graph...</div>;

  return (
    <div className="h-full w-full bg-[#0a0a0a] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        minZoom={0.2}
        elevateNodesOnSelect={true}
      >
        <Panel position="top-left" className="m-4 z-50">
          <div className="bg-[#0c0c0c] border border-white/10 p-3 shadow-2xl w-80 flex flex-col gap-2 rounded-md transition-all">
            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
              <Search size={16} className="text-white/40 shrink-0" />
              <input
                type="text"
                placeholder="Search by Type, Title or ID..."
                className="bg-transparent border-none text-xs text-white outline-none w-full placeholder:text-white/20 font-sans"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
                onFocus={() => setIsDropdownOpen(true)}
              />
              {selectedArtifactId && (
                <button 
                  onClick={() => { setSelectedArtifact(null); setSearchTerm(''); setIsDropdownOpen(false); }} 
                  className="text-white/40 hover:text-emerald-400 transition-colors shrink-0 p-1"
                  title="Clear Selection"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {isDropdownOpen && (
              <div className="max-h-[50vh] overflow-y-auto flex flex-col mt-1 space-y-1 pr-1" style={{ scrollbarWidth: 'thin' }}>
                {orphanIds.size > 0 && !searchTerm && (
                   <button 
                    onClick={() => setView('orphans')}
                    className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded mb-2 hover:bg-red-500/20 transition-all uppercase tracking-widest font-bold"
                   >
                     <AlertCircle size={14} />
                     {orphanIds.size} Orphan Artifacts Found
                   </button>
                )}
                {filteredArtifacts.length === 0 ? (
                  <div className="text-xs text-white/40 p-2 italic">No artifacts found.</div>
                ) : (
                  filteredArtifacts.map(a => (
                    <button
                      key={a.id}
                      className={`text-left text-xs p-2 hover:bg-white/10 border-l-[3px] transition-colors flex flex-col gap-1 rounded-r-md
                        ${selectedArtifactId === a.id ? `${typeColors[a.type]?.split(' ')[1] || 'border-emerald-500'} bg-white/5` : 'border-transparent hover:border-white/30'}`}
                      onClick={() => {
                          setSelectedArtifact(a.id);
                          setIsDropdownOpen(false);
                      }}
                    >
                      <div className="text-[9px] uppercase tracking-widest text-[#e0e0e0] opacity-50 font-bold flex justify-between">
                        <div className="flex flex-col gap-0.5">
                           <span>{a.type}</span>
                           {a.subType && <span className="text-[8px] opacity-70">{a.subType}</span>}
                        </div>
                        <span className="font-mono">{a.id}</span>
                      </div>
                      <div className={`truncate font-serif text-sm ${typeColors[a.type]?.split(' ')[0] || 'text-emerald-400'}`}>{a.title}</div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </Panel>

        <MiniMap 
          style={{ backgroundColor: '#0c0c0c', border: '1px solid rgba(255,255,255,0.1)' }} 
          maskColor="rgba(0,0,0,0.5)" 
          nodeColor="#333" 
        />
        <Controls 
          style={{ backgroundColor: '#151515', border: '1px solid rgba(255,255,255,0.1)', fill: '#fff' }} 
        />
        <Background color="#ffffff" gap={20} size={1} style={{ opacity: 0.03 }} />
      </ReactFlow>
    </div>
  );
};

export const GraphView: React.FC = () => {
  return (
    <ReactFlowProvider>
      <GraphFlow />
    </ReactFlowProvider>
  );
};

