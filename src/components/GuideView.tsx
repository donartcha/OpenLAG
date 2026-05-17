import React from 'react';
import { BookOpen, FileCode, GitBranch, Share2, Layers, AlertTriangle, CheckCircle2, Terminal, Info, Globe, Link2, Unlink } from 'lucide-react';
import { useStore } from '../store';

export const GuideView: React.FC = () => {
    const { settings } = useStore();
    const lang = settings.language || 'EN';

    const t = {
        EN: {
            title: "Management Guide",
            desc: "Instructions for maintaining the architectural graph, documenting artifacts, and managing the project lifecycle according to OpenLAG v0.1 Specification.",
            langBtn: "Switch to Spanish",
            layerTaxonomy: "Layer Taxonomy & Artifacts",
            layerTaxonomyDesc: "OpenLAG classifies artifacts into semantic layers to understand their abstraction level and valid relations.",
            businessLayer: "Business Layer",
            businessLayerDesc: "Defines what to build and why. Align business goals without dictating implementation.",
            architectureLayer: "Architecture Layer",
            architectureLayerDesc: "Defines technical design and constraints of the system.",
            implementationLayer: "Implementation Layer",
            implementationLayerDesc: "Models code, tests, databases and its traceability.",
            operationsLayer: "Operations Layer",
            operationsLayerDesc: "Models infrastructure, deployment, and runtime health observability.",
            docsLayer: "Documentation Layer",
            docsLayerDesc: "Cross-cutting knowledge context.",
            relations: "Relationship Semantics & Strength",
            relationsDesc: "Relations define a semantic weight (Strength) and category purpose between artifacts.",
            strongRelations: "Strong",
            strongRelationsDesc: "Direct coupling: IMPLEMENTS, TESTS, DEPENDS_ON, BLOCKS, BREAKS, DEFINES, VALIDATES, REPLACES",
            mediumRelations: "Medium",
            mediumRelationsDesc: "Descriptive/Flow: DERIVES_FROM, USES, IMPACTS, JUSTIFIES, REFINES, MONITORS, DEPLOYS",
            weakRelations: "Weak",
            weakRelationsDesc: "Semantic/Loose: RELATES_TO, DOCUMENTS",
            frontmatter: "Official Markdown Format",
            frontmatterDesc: "Each artifact requires a YAML frontmatter. Mandatory fields: id, type, status, title.",
            statusFlow: "Lifecycle Status Flow",
            statusFlowDesc: "Evolution of artifacts. The system tolerates missing relations in 'draft', but expects full traceability in 'closed'.",
            manifest: "Project Manifest",
            manifestDesc: "The docs/project-manifest.md file controls the global timeline (Versions), external system dependencies (System Versions), and major changes.",
            bestPractices: "Best Practices & ID Conventions",
            bestPracticesDesc: "IDs must be unique and stable (e.g. REQ-001, CODE-023). Prefix defines the logical type.",
            tutorialTitle: "Step-by-Step Tutorial",
            tutorialDesc: "Follow these steps to structure a complete project using the OpenLAG specification.",
            step1Title: "Step 1: The Project Manifest",
            step1Desc: "Always start by creating the docs/project-manifest.md file to define versions, external system dependencies, and tracked changes.",
            step2Title: "Step 2: Business Requirements",
            step2Desc: "Create the Business Layer artifacts (e.g., REQ-001) defining what needs to be built.",
            step3Title: "Step 3: Architecture & Design",
            step3Desc: "Define the Architecture Layer (e.g., DESIGN-001) and link it to the Business requirement.",
            step4Title: "Step 4: Implementation & Operations",
            step4Desc: "Finally, define Code and Infra (e.g., CODE-001, INFRA-001) linking them back up the chain.",
        },
        ES: {
            title: "Guía de Gestión",
            desc: "Instrucciones para mantener el grafo arquitectónico, documentar artefactos y gestionar el ciclo de vida según la Especificación OpenLAG v0.1.",
            langBtn: "Cambiar a Inglés",
            layerTaxonomy: "Taxonomía de Capas y Artefactos",
            layerTaxonomyDesc: "OpenLAG clasifica los artefactos en capas semánticas para entender su nivel de abstracción y relaciones válidas.",
            businessLayer: "Business Layer",
            businessLayerDesc: "Define qué construir y por qué. Alinea negocio sin dictar implementación.",
            architectureLayer: "Architecture Layer",
            architectureLayerDesc: "Define el diseño y los límites técnicos del sistema.",
            implementationLayer: "Implementation Layer",
            implementationLayerDesc: "Modela código, tests, bases de datos y su trazabilidad.",
            operationsLayer: "Operations Layer",
            operationsLayerDesc: "Modela infraestructura, despliegue y estado de ejecución/observabilidad.",
            docsLayer: "Documentation Layer",
            docsLayerDesc: "Contexto y conocimiento transversal.",
            relations: "Semántica y Peso de Relaciones",
            relationsDesc: "Las relaciones definen un peso semántico (Strength) y categoría entre los artefactos.",
            strongRelations: "Fuerte (Strong)",
            strongRelationsDesc: "Acoplamiento directo: IMPLEMENTS, TESTS, DEPENDS_ON, BLOCKS, BREAKS, DEFINES, VALIDATES, REPLACES",
            mediumRelations: "Media (Medium)",
            mediumRelationsDesc: "Descriptivas o de flujo: DERIVES_FROM, USES, IMPACTS, JUSTIFIES, REFINES, MONITORS, DEPLOYS",
            weakRelations: "Débil (Weak)",
            weakRelationsDesc: "Semánticas y laxas: RELATES_TO, DOCUMENTS",
            frontmatter: "Formato Oficial Markdown",
            frontmatterDesc: "Cada artefacto requiere un YAML frontmatter. Campos obligatorios: id, type, status, title.",
            statusFlow: "Estados y Ciclo de Vida",
            statusFlowDesc: "En estado 'draft' se permiten huérfanos, pero en 'closed' se exige trazabilidad completa.",
            manifest: "Manifiesto del Proyecto",
            manifestDesc: "El archivo docs/project-manifest.md define versiones temporales, dependencias externas y control de cambios.",
            bestPractices: "Buenas Prácticas y Convención de IDs",
            bestPracticesDesc: "Los IDs deben ser únicos y estables (Ej: REQ-001). El prefijo define su tipo lógico de forma clara.",
            tutorialTitle: "Tutorial Paso a Paso",
            tutorialDesc: "Sigue estos pasos para estructurar un proyecto completo usando la especificación OpenLAG.",
            step1Title: "Paso 1: Manifiesto del Proyecto",
            step1Desc: "Comienza siempre creando el archivo docs/project-manifest.md para definir versiones, dependencias externas de sistemas y registro de cambios.",
            step2Title: "Paso 2: Requisitos de Negocio",
            step2Desc: "Crea los artefactos de la Capa de Negocio (Ej. REQ-001) para definir qué se debe construir.",
            step3Title: "Paso 3: Arquitectura y Diseño",
            step3Desc: "Define la Capa de Arquitectura (Ej. DESIGN-001) y enlaza con los requisitos de negocio.",
            step4Title: "Paso 4: Implementación y Operaciones",
            step4Desc: "Finalmente, documenta Código e Infra (Ej. CODE-001, INFRA-001) trazando los enlaces hacia arriba.",
        }
    };

    const c = t[lang];

    return (
        <div className="h-full w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-8 lg:px-16 pt-12 shrink-0 border-b border-white/5 bg-[#0c0c0c]/30">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif italic tracking-tight">{c.title}</h1>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded uppercase tracking-widest">
                            <Globe size={12} />
                            {lang === 'EN' ? 'English' : 'Español'}
                        </div>
                    </div>
                </div>
                <p className="text-xs text-white/40 max-w-2xl leading-relaxed">
                    {c.desc}
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:px-16 pb-20 custom-scrollbar space-y-16">
                
                {/* Section: Layers & Artifacts */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-500/10 rounded border border-pink-500/20">
                            <Layers size={18} className="text-pink-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.layerTaxonomy}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.layerTaxonomyDesc}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{c.businessLayer}</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">{c.businessLayerDesc}</p>
                            <div className="flex flex-wrap gap-2">
                                {['PROJECT', 'EPIC', 'FEATURE', 'REQUIREMENT', 'BUSINESS_RULE', 'USE_CASE'].map(t => (
                                    <span key={t} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{c.architectureLayer}</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">{c.architectureLayerDesc}</p>
                            <div className="flex flex-wrap gap-2">
                                {['DESIGN', 'DECISION', 'COMPONENT', 'API'].map(t => (
                                    <span key={t} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{c.implementationLayer}</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">{c.implementationLayerDesc}</p>
                            <div className="flex flex-wrap gap-2">
                                {['CODE_ENTITY', 'TEST_CASE', 'DATABASE_ENTITY', 'CHANGE', 'BUG', 'RISK', 'TEST'].map(t => (
                                    <span key={t} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{c.operationsLayer}</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">{c.operationsLayerDesc}</p>
                            <div className="flex flex-wrap gap-2">
                                {['INFRASTRUCTURE', 'DEPLOYMENT', 'MONITORING', 'INCIDENT', 'MAINTENANCE'].map(t => (
                                    <span key={t} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                            <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{c.docsLayer}</h3>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-4">{c.docsLayerDesc}</p>
                            <div className="flex flex-wrap gap-2">
                                {['GLOSSARY_TERM', 'DOCUMENTATION'].map(t => (
                                    <span key={t} className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-white/60">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Relations */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                            <Link2 size={18} className="text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.relations}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.relationsDesc}
                    </p>

                    <div className="space-y-4">
                        <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{c.strongRelations}</h4>
                                <p className="text-xs text-white/60 font-mono leading-relaxed">{c.strongRelationsDesc}</p>
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{c.mediumRelations}</h4>
                                <p className="text-xs text-white/60 font-mono leading-relaxed">{c.mediumRelationsDesc}</p>
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded flex items-start gap-4">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">{c.weakRelations}</h4>
                                <p className="text-xs text-white/60 font-mono leading-relaxed">{c.weakRelationsDesc}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section: Lifecycle Status */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                            <GitBranch size={18} className="text-emerald-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.statusFlow}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.statusFlowDesc}
                    </p>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {['draft', 'in_progress', 'ready', 'closed', 'deprecated'].map((status, index) => (
                            <React.Fragment key={status}>
                                <div className="bg-[#0c0c0c] border border-white/10 px-4 py-2 rounded text-xs font-mono text-white/80">
                                    {status}
                                </div>
                                {index < 4 && <div className="h-4 w-px md:h-px md:w-8 md:flex-1 bg-white/20" />}
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* Section: YAML Frontmatter */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                            <Terminal size={18} className="text-purple-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.frontmatter}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.frontmatterDesc}
                    </p>
                    
                    <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                        <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/40 italic">docs/requirements/REQ-001.md</span>
                        </div>
                        <div className="p-6">
                            <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">
{`---
id: REQ-001
type: REQUIREMENT
status: draft
layer: BUSINESS
title: Generar graph-data.json
version: v1
ownership:
  owner: dony
  team: architecture
  maintainers:
    - backend-team
tags:
  - parser
  - graph
relations:
  - type: IMPLEMENTS
    target: CODE-001
    strength: STRONG
    category: TRACEABILITY
---

# Generar graph-data.json
...contenido descriptivo...`}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Section: Best Practices */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20">
                            <AlertTriangle size={18} className="text-amber-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.bestPractices}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.bestPracticesDesc}
                    </p>
                </section>

                {/* Section: Step-by-Step Tutorial */}
                <section className="border-t border-white/5 pt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                            <CheckCircle2 size={18} className="text-blue-400" />
                        </div>
                        <h2 className="text-xl font-medium tracking-tight">{c.tutorialTitle}</h2>
                    </div>
                    <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                        {c.tutorialDesc}
                    </p>

                    <div className="space-y-8">
                        {/* Step 1 */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white/80">{c.step1Title}</h4>
                                <span className="text-[10px] font-mono text-white/40 italic">docs/project-manifest.md</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-white/50 mb-4">{c.step1Desc}</p>
                                <pre className="text-[11px] font-mono leading-relaxed text-white/60 bg-black/40 p-4 rounded border border-white/5 overflow-x-auto">
{`# Project Manifest

## Versions
\`\`\`yaml
- id: v1
  name: 1.0.0
  timestamp: "2024-01-01"
  parentVersion: null
\`\`\`

## System Versions
\`\`\`yaml
- id: sv-db-pg-15
  component: PostgreSQL Engine
  version: 15.4
\`\`\`

## Changes
\`\`\`yaml
- id: ch-auth-pool
  type: ERROR
  title: Timeouts en Auth API
  affects: ["impl-dao-user", "sv-db-pg-15"]
  versionFrom: "v1"
  versionTo: "v2"
\`\`\``}
                                </pre>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white/80">{c.step2Title}</h4>
                                <span className="text-[10px] font-mono text-white/40 italic">docs/requirements/REQ-001.md</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-white/50 mb-4">{c.step2Desc}</p>
                                <pre className="text-[11px] font-mono leading-relaxed text-blue-400/80 bg-black/40 p-4 rounded border border-white/5 overflow-x-auto">
{`---
id: REQ-001
type: REQUIREMENT
status: ready
layer: BUSINESS
title: User Authentication
version: v1
---

# Authentication Requirement
The system must allow users to log in securely.`}
                                </pre>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white/80">{c.step3Title}</h4>
                                <span className="text-[10px] font-mono text-white/40 italic">docs/architecture/DESIGN-auth.md</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-white/50 mb-4">{c.step3Desc}</p>
                                <pre className="text-[11px] font-mono leading-relaxed text-purple-400/80 bg-black/40 p-4 rounded border border-white/5 overflow-x-auto">
{`---
id: DESIGN-auth
type: DESIGN
status: ready
layer: ARCHITECTURE
title: Auth Architecture
version: v1
relations:
  - type: IMPLEMENTS
    target: REQ-001
    strength: STRONG
    category: TRACEABILITY
---

# Auth Design
We will use JWT tokens for authentication...`}
                                </pre>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-[#0c0c0c] border border-white/5 rounded-lg overflow-hidden flex flex-col">
                            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white/80">{c.step4Title}</h4>
                                <span className="text-[10px] font-mono text-white/40 italic">docs/implementation/CODE-auth-service.md</span>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-white/50 mb-4">{c.step4Desc}</p>
                                <pre className="text-[11px] font-mono leading-relaxed text-emerald-400/80 bg-black/40 p-4 rounded border border-white/5 overflow-x-auto">
{`---
id: CODE-auth-service
type: CODE_ENTITY
status: in_progress
layer: IMPLEMENTATION
title: AuthService.ts
version: v1
relations:
  - type: IMPLEMENTS
    target: DESIGN-auth
    strength: STRONG
    category: TRACEABILITY
---

# AuthService
Implementation of the login endpoint...`}
                                </pre>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

