import React from 'react';
import { BookOpen, FileCode, GitBranch, Share2, Layers, AlertTriangle, CheckCircle2, Terminal, Info, Globe, Link2, Unlink } from 'lucide-react';

export const GuideView: React.FC = () => {
    return (
        <div className="h-full w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-8 lg:px-16 pt-12 shrink-0 border-b border-white/5 bg-[#0c0c0c]/30">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-serif italic tracking-tight">Management Guide</h1>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded uppercase tracking-widest">
                        <Globe size={12} />
                        English Version
                    </div>
                </div>
                <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
                    Instructions for maintaining the architectural graph, documenting artifacts, and managing the project lifecycle through the central manifest.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:px-16 pb-20 custom-scrollbar space-y-16">
                
                {/* Section: Project Manifest */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                            <BookOpen size={18} className="text-blue-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">Project Manifest (`docs/project-manifest.md`)</h2>
                    </div>
                    
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        The manifest is the source of truth for your architecture's lifecycle. It governs versions, system inventory, and recorded changes.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-widest">Versions</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                Define the timeline. Use `parentVersion` to create a lineage.
                            </p>
                            <pre className="text-[10px] bg-black/40 p-4 rounded font-mono text-emerald-400 border border-emerald-500/10 overflow-x-auto leading-relaxed">
{`## Versions
\`\`\`yaml
- id: v-1
  name: 1.0.0
  timestamp: "2024-01-01"
  parentVersion: null

- id: v-2
  name: 1.1.0-Patch
  parentVersion: v-1
\`\`\``}
                            </pre>
                        </div>

                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-widest">System Inventory</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                Track external components or infra stack versions.
                            </p>
                            <pre className="text-[10px] bg-black/40 p-4 rounded font-mono text-blue-400 border border-blue-500/10 overflow-x-auto leading-relaxed">
{`## System Versions
\`\`\`yaml
- id: sv-db-1
  component: PostgreSQL
  version: 15.4
\`\`\``}
                            </pre>
                        </div>

                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group h-fit">
                            <h3 className="text-sm font-bold text-white/80 mb-3 uppercase tracking-widest flex items-center gap-2">
                                Change Ledger
                                <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded tracking-tighter">IMPACT</span>
                            </h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">
                                Log interventions. `affects` maps to artifact IDs.
                            </p>
                            <pre className="text-[10px] bg-black/40 p-4 rounded font-mono text-amber-400 border border-amber-500/10 overflow-x-auto leading-relaxed">
{`## Changes
\`\`\`yaml
- id: ch-patch-01
  type: ERROR
  title: Fix leak
  affects: ["CORE-1"]
  versionFrom: v-1
  versionTo: v-2
\`\`\``}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Section: Full Manifest Example */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                            <Terminal size={18} className="text-purple-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">Full Manifest Structure (`docs/project-manifest.md`)</h2>
                    </div>
                    
                    <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden">
                        <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/40 italic">docs/project-manifest.md</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                <div className="w-2 h-2 rounded-full bg-amber-500/20" />
                                <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                            </div>
                        </div>
                        <div className="p-6 bg-black/40">
                            <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">
{`---
project: ArchGraph Standard
---

# Project Manifest
Central configuration for the system architecture.

## Versions
\`\`\`yaml
- id: v-1
  name: 1.0.0
  timestamp: "2024-01-01T12:00:00Z"
  parentVersion: null
- id: v-2
  name: 1.1.0
  timestamp: "2024-05-15T09:00:00Z"
  parentVersion: v-1
\`\`\`

## System Versions
\`\`\`yaml
- id: sys-auth-svc
  component: Auth-Microservice
  version: 2.3.4
- id: sys-db-main
  component: PostgreSQL-Cluster
  version: 15.4
\`\`\`

## Changes
\`\`\`yaml
- id: ch-security-patch
  type: ERROR
  title: Fix auth timeout
  affects: ["AUTH-REQ-01", "sys-auth-svc"]
  versionFrom: v-1
  versionTo: v-2
\`\`\``}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Section: Artifact Documentation Registry */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/10 rounded border border-pink-500/20">
                            <Layers size={18} className="text-pink-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">Artifact Documentation Handbook</h2>
                    </div>
                    
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        Reference for documenting artifacts. Each `.md` file in `/docs` is automatically scanned. You can include multiple artifacts in one file using the `---` separator.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Type & Subtype Registry */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col h-full">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Type Registry</h4>
                            </div>
                            <div className="p-6 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                                {[
                                    { t: 'REQUIREMENT', c: 'text-blue-400', s: 'Functional, Business, Security' },
                                    { t: 'USE_CASE', c: 'text-cyan-400', s: 'User Story, Persona' },
                                    { t: 'DESIGN', c: 'text-purple-400', s: 'Architecture, UI-UX' },
                                    { t: 'COMPONENT', c: 'text-indigo-400', s: 'Service, Library, API' },
                                    { t: 'CODE_ENTITY', c: 'text-emerald-400', s: 'Class, Function, File' },
                                    { t: 'TEST', c: 'text-pink-400', s: 'Unit, E2E, Load' },
                                    { t: 'INCIDENT', c: 'text-red-400', s: 'Bug, Outage' },
                                    { t: 'INFRASTRUCTURE', c: 'text-orange-400', s: 'DB, Cloud, Network' },
                                    { t: 'DEPLOYMENT', c: 'text-yellow-400', s: 'CI-CD, Environment' },
                                    { t: 'MONITORING', c: 'text-teal-400', s: 'Log, Metric, Alert' },
                                    { t: 'MAINTENANCE', c: 'text-amber-400', s: 'Refactor, Debt' },
                                    { t: 'DOCUMENTATION', c: 'text-gray-400', s: 'Guide, README' }
                                ].map(item => (
                                    <div key={item.t} className="flex flex-col border-b border-white/[0.02] pb-2 last:border-0">
                                        <span className={`text-[10px] font-bold tracking-tight ${item.c}`}>{item.t}</span>
                                        <span className="text-[9px] text-white/20 mt-0.5 italic">{item.s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Relation Type Glossary */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col h-full">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Relation Keywords</h4>
                                <Link2 size={12} className="text-white/20" />
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-emerald-400/80 block mb-1">IMPLEMENTS</span>
                                        <p className="text-[9px] text-white/40 italic">Link Code to Design or Requirement.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-400/80 block mb-1">DERIVES_FROM</span>
                                        <p className="text-[9px] text-white/40 italic">Requirement to Parent Req or Business Case.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-pink-400/80 block mb-1">TESTS</span>
                                        <p className="text-[9px] text-white/40 italic">Test to the Code or Requirement being verified.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-yellow-400/80 block mb-1">DEPLOYS</span>
                                        <p className="text-[9px] text-white/40 italic">Deployment config to Infrastructure/Component.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-teal-400/80 block mb-1">MONITORS</span>
                                        <p className="text-[9px] text-white/40 italic">Dashboard/Alert to a Component.</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-red-500/80 block mb-1">FIXES</span>
                                        <p className="text-[9px] text-white/40 italic">Code/Deployment to an Incident.</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-[9px] text-white/30 border-l-2 border-white/10 pl-2 leading-relaxed">
                                        The system also supports custom types if specific semantics are required for your project lineage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Snippet & Logic */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col h-full">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">YAML Snippet</h4>
                            </div>
                            <div className="p-6 bg-black/20 flex-1">
                                <pre className="text-[10px] font-mono leading-relaxed text-white/50 select-all">
{`---
id: AUTH-CTRL-01
type: CODE_ENTITY
subType: Controller
title: "AuthController.ts"
version: v-1
systemVersionId: sv-db-1
relations:
  - to: REQ-01
    type: IMPLEMENTS
---
Implementation specific documentation.
Supports full Markdown.
`}
                                </pre>
                                <div className="mt-6 flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/10 rounded">
                                    <Info size={12} className="text-blue-400 mt-0.5" />
                                    <p className="text-[9px] text-blue-300/40 leading-relaxed">
                                        Use `systemVersionId` to link to an entry in the System Inventory of the manifest.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Section: Relations & Versions */}
                <section>
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                       <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                    <GitBranch size={18} className="text-purple-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">Versioning Rules</h2>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-[#0c0c0c] border border-white/5 rounded">
                                    <h4 className="text-xs font-bold text-white mb-4">Semantic Lineage</h4>
                                    <p className="text-xs text-white/40 leading-relaxed mb-6">
                                        When you start a new major iteration, always create a new version in the manifest. Artifacts created for that phase should reference the new version ID.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/40 p-4 rounded border border-white/5">
                                            <span className="text-[8px] text-emerald-400 font-bold block mb-2 uppercase">v-1 (Stable)</span>
                                            <div className="text-[9px] text-white/30 font-mono">
                                                Artifacts: <br/>
                                                REQ-A, IMPL-A
                                            </div>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded border border-white/5">
                                            <span className="text-[8px] text-blue-400 font-bold block mb-2 uppercase">v-2 (Evolution)</span>
                                            <div className="text-[9px] text-white/30 font-mono">
                                                Artifacts: <br/>
                                                REQ-B (refines REQ-A)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       </div>

                       <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                                    <Share2 size={18} className="text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">Relationship Logic</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex gap-4 p-4 bg-[#0c0c0c] border border-white/5 rounded">
                                    <Link2 className="text-emerald-500 shrink-0" size={16} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white/80 mb-1">Implicit Direction</h4>
                                        <p className="text-xs text-white/40 leading-relaxed">
                                            Relations are uni-directional. Point from the <b>dependent</b> artifact to its <b>source</b> (e.g., Code &rarr; Design &rarr; Requirement).
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-4 bg-[#0c0c0c] border border-white/5 rounded">
                                    <Unlink className="text-red-400 shrink-0" size={16} />
                                    <div>
                                        <h4 className="text-sm font-bold text-white/80 mb-1">Orphan Detection</h4>
                                        <p className="text-xs text-white/40 leading-relaxed">
                                            Any artifact with an empty `Relations: []` array that isn't pointed to by any other artifact will be flagged as an orphan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                       </div>
                   </div>
                </section>

                {/* Section: Best Practices */}
                <section className="border-t border-white/5 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20">
                            <AlertTriangle size={18} className="text-amber-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">Strategy & Troubleshooting</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                                    <Globe size={14} className="text-blue-400" />
                                    Directory Strategy
                                </h4>
                                <p className="text-xs text-white/40 leading-relaxed mb-4">
                                    Organize your documentation by domain or artifact type within the `/docs` folder for easier maintenance.
                                </p>
                                <div className="space-y-2">
                                    <div className="text-[10px] p-2 bg-[#0c0c0c] border border-white/5 font-mono text-white/30 rounded">
                                        /docs/requirements/*.md <span className="text-blue-400/30 ml-2">// Business value</span>
                                    </div>
                                    <div className="text-[10px] p-2 bg-[#0c0c0c] border border-white/5 font-mono text-white/30 rounded">
                                        /docs/design/*.md <span className="text-purple-400/30 ml-2">// blueprints & ADRs</span>
                                    </div>
                                    <div className="text-[10px] p-2 bg-[#0c0c0c] border border-white/5 font-mono text-white/30 rounded">
                                        /docs/implementation/*.md <span className="text-emerald-400/30 ml-2">// technical details</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-white/80 mb-3">ID Namespace</h4>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    IDs must be unique project-wide. Use prefixes like <code className="text-blue-400 bg-blue-500/10 px-1 rounded">REQ-</code> or <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">IMPL-</code> to avoid collisions between functional and technical artifacts.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-8">
                             <div>
                                <h4 className="text-sm font-bold text-white/80 mb-3 flex items-center gap-2">
                                    <Info size={14} className="text-amber-400" />
                                    Common Pitfalls
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-1 bg-red-500/50 rounded-full shrink-0" />
                                        <div>
                                            <span className="text-[10px] font-bold text-white/70 block mb-1">Dangling Relations</span>
                                            <p className="text-[10px] text-white/30 leading-relaxed italic">
                                                Linking to an ID that doesn't exist will show a warning in the terminal. The graph will omit the connection.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-1 bg-amber-500/50 rounded-full shrink-0" />
                                        <div>
                                            <span className="text-[10px] font-bold text-white/70 block mb-1">Missing Version</span>
                                            <p className="text-[10px] text-white/30 leading-relaxed italic">
                                                If an artifact uses an ID not defined in the manifest, it defaults to the latest stable version found.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded">
                                <h4 className="text-xs font-bold text-emerald-400 mb-2">Pro-Tip: Markdown Links</h4>
                                <p className="text-[10px] text-white/30 leading-relaxed">
                                    You can use classic Markdown links <code className="text-emerald-300/30 font-mono">[Title](path/to/file.md)</code> within the description body to enable direct navigation between documentation files.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </div>
        </div>
    );
};
