import React, { useState } from 'react';
import { BookOpen, Terminal, Layers, Link2, Globe, CheckCircle2, HelpCircle, ShieldCheck, GitBranch, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';

export const GuideView: React.FC = () => {
    const { settings } = useStore();
    const lang = settings.language || 'EN';
    const [activeTab, setActiveTab] = useState<'onboarding' | 'reference'>('onboarding');

    const t = {
        EN: {
            title: "Getting Started with OpenLAG",
            desc: "Welcome! If you are new to OpenLAG, this guide will answer your questions and teach you how to document and govern your architecture effectively.",
            langBtn: "Switch to Spanish",
            tabOnboarding: "101 Onboarding",
            tabReference: "Specification Reference",
            
            // Onboarding Section
            faqTitle: "1. What is OpenLAG and why do I need it?",
            faqDesc: "OpenLAG (Local Architecture Graph) is an 'Architecture as Code' tool.",
            faqQ1: "Why not just use Confluence or Notion?",
            faqA1: "Because traditional wikis get outdated and disconnected from reality. OpenLAG lives right in your repository (next to your code) as Markdown files. It parses these files to build a visual graph, runs a linter to detect missing documentation, and calculates the impact of your changes.",
            faqQ2: "Do I have to learn a new language?",
            faqA2: "No. You just write standard Markdown files. The only difference is that you add a YAML 'Frontmatter' (a header block) to your files to tell OpenLAG how they connect to each other.",

            conceptsTitle: "2. Core Concepts: Contracts vs Artifacts",
            conceptsDesc: "To master OpenLAG, you must understand the difference between the 'Rules' and the 'Content'.",
            contractsLabel: "Contracts (The Rules)",
            contractsDesc: "Stored in docs/contracts/. These are YAML files that define the types of documents you can create (like a REQUIREMENT or a DATABASE_ENTITY) and what fields they must have. Think of them as the blueprint or a database schema. You rarely edit these unless you are an Architect changing the rules.",
            artifactsLabel: "Artifacts (The Content)",
            artifactsDesc: "Stored in docs/. These are the actual Markdown documents you write every day. Each artifact declares its 'type' in the frontmatter, and OpenLAG verifies that it complies with its Contract.",

            cliTitle: "3. The CLI Toolbelt",
            cliDesc: "OpenLAG is driven by a powerful CLI. Here are the essential commands you will use daily:",
            cmdInit: "npx openlag init",
            cmdInitDesc: "Initializes a new project, creating the docs/ folder and the base contracts.",
            cmdCreate: "npx openlag create <type> <name>",
            cmdCreateDesc: "Generates a new file from a template. E.g., 'npx openlag create artifact my-feature' creates a new markdown file for you to fill in. 'npx openlag create relation AFFECTS' creates a new rule.",
            cmdDev: "npx openlag dev",
            cmdDevDesc: "Starts this web portal so you can visualize your architecture locally while you type.",
            cmdLint: "npx openlag lint",
            cmdLintDesc: "Validates all your markdown files against the contracts to find missing relations, orphans, or rule violations.",
            cmdImpact: "npx openlag impact",
            cmdImpactDesc: "Analyzes the blast radius of a change before you make it. Very useful before opening a Pull Request.",

            impactTitle: "4. Relationships & The Impact Engine",
            impactDesc: "Artifacts are connected through Relations (like IMPLEMENTS, DEPENDS_ON, or TESTS).",
            impactHow: "How Impact works:",
            impactExplanation: "If you change a Requirement, how do you know what Code to update? OpenLAG traverses your relations automatically using Impact Propagation rules. For example, if your Code 'IMPLEMENTS' a Requirement, the Impact Engine knows that changing the Requirement impacts the Code (Reverse propagation).",

            workflowTitle: "5. Your Daily Workflow (Tutorial)",
            workflowDesc: "Here is how you actually use OpenLAG in your day-to-day work when assigned a new task.",
            step1Label: "Step 1: Scaffold an Artifact",
            step1Desc: "Run 'npx openlag create artifact feat-login' to create a new markdown file in docs/.",
            step2Label: "Step 2: Fill the Frontmatter",
            step2Desc: "Open the file and set its title, ownership, and relations. Link your new code to the business requirement using 'IMPLEMENTS'.",
            step3Label: "Step 3: Write the Documentation",
            step3Desc: "Write the actual documentation (what the code does, architectural decisions) in standard markdown below the frontmatter.",
            step4Label: "Step 4: Verify & Push",
            step4Desc: "Run 'npm run check' or 'npx openlag lint' before pushing your code to ensure you didn't break any architectural rules or forget to link a test.",

            // Reference Section
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
            
            changeTypes: "Change Types",
            changeTypesDesc: "Defines the nature of an architectural change or modification:",
            error: { label: "ERROR", desc: "Fixes for bugs or critical technical debt." },
            feature: { label: "FEATURE", desc: "New capabilities impacting architecture." },
            evolution: { label: "EVOLUTION", desc: "Gradual improvements, security or compliance updates." },
            refactor: { label: "REFACTOR", desc: "Code restructurings without changing external behavior." },
            adaptation: { label: "ADAPTATION", desc: "Changes to adjust to new environmental/integration constraints." },
            
            frontmatter: "Official Markdown Format",
            frontmatterDesc: "Each artifact requires a YAML frontmatter. Mandatory: id, type, status, title. Specialized artifacts are modeled through contract-backed type values.",
            statusFlow: "Lifecycle Status Flow",
            statusFlowDesc: "Evolution of artifacts. The system tolerates missing relations in 'draft', but expects full traceability in 'closed'.",
        },
        ES: {
            title: "Primeros Pasos con OpenLAG",
            desc: "¡Bienvenido! Si eres nuevo en OpenLAG, esta guía responderá a tus preguntas y te enseñará cómo documentar y gobernar tu arquitectura de forma efectiva.",
            langBtn: "Cambiar a Inglés",
            tabOnboarding: "Tutorial de Inicio (101)",
            tabReference: "Referencia de la Especificación",
            
            // Onboarding Section
            faqTitle: "1. ¿Qué es OpenLAG y por qué lo necesito?",
            faqDesc: "OpenLAG (Local Architecture Graph) es una herramienta de 'Arquitectura como Código'.",
            faqQ1: "¿Por qué no usar simplemente Confluence o Notion?",
            faqA1: "Porque las wikis tradicionales se desactualizan y se desconectan de la realidad. OpenLAG vive directamente en tu repositorio (junto a tu código) como archivos Markdown. Analiza estos archivos para construir un grafo visual, ejecuta un linter para detectar documentación faltante y calcula el impacto de tus cambios.",
            faqQ2: "¿Tengo que aprender un lenguaje nuevo?",
            faqA2: "No. Solo escribes archivos Markdown estándar. La única diferencia es que añades un 'Frontmatter' YAML (un bloque de cabecera) a tus archivos para decirle a OpenLAG cómo se conectan entre sí.",

            conceptsTitle: "2. Conceptos Clave: Contratos vs Artefactos",
            conceptsDesc: "Para dominar OpenLAG, debes entender la diferencia entre las 'Reglas' y el 'Contenido'.",
            contractsLabel: "Contratos (Las Reglas)",
            contractsDesc: "Ubicados en docs/contracts/. Son archivos YAML que definen los tipos de documentos que puedes crear (como REQUIREMENT o DATABASE_ENTITY) y qué campos deben tener. Piensa en ellos como los planos o el esquema de base de datos. Rara vez los editas a menos que seas un Arquitecto cambiando las reglas.",
            artifactsLabel: "Artefactos (El Contenido)",
            artifactsDesc: "Ubicados en docs/. Son los documentos Markdown reales que escribes todos los días. Cada artefacto declara su 'tipo' en el frontmatter, y OpenLAG verifica que cumpla con su Contrato.",

            cliTitle: "3. Herramientas CLI",
            cliDesc: "OpenLAG se maneja a través de una potente CLI. Aquí están los comandos esenciales que usarás a diario:",
            cmdInit: "npx openlag init",
            cmdInitDesc: "Inicializa un nuevo proyecto, creando la carpeta docs/ y los contratos base.",
            cmdCreate: "npx openlag create <type> <name>",
            cmdCreateDesc: "Genera un archivo desde una plantilla. Ej: 'npx openlag create artifact mi-feature' crea un markdown listo para rellenar. 'npx openlag create relation AFFECTS' crea un nuevo contrato.",
            cmdDev: "npx openlag dev",
            cmdDevDesc: "Inicia este portal web para que puedas visualizar tu arquitectura en local mientras escribes.",
            cmdLint: "npx openlag lint",
            cmdLintDesc: "Valida todos tus markdowns contra los contratos para encontrar relaciones faltantes, huérfanos o violaciones de reglas.",
            cmdImpact: "npx openlag impact",
            cmdImpactDesc: "Analiza el radio de explosión de un cambio antes de hacerlo. Muy útil antes de abrir un Pull Request.",

            impactTitle: "4. Relaciones y el Motor de Impacto",
            impactDesc: "Los artefactos se conectan a través de Relaciones (como IMPLEMENTS, DEPENDS_ON o TESTS).",
            impactHow: "Cómo funciona el Impacto:",
            impactExplanation: "Si cambias un Requisito, ¿cómo sabes qué Código actualizar? OpenLAG navega por tus relaciones automáticamente usando reglas de propagación de impacto. Por ejemplo, si tu Código 'IMPLEMENTS' un Requisito, el Motor de Impacto sabe que cambiar el Requisito impacta al Código (Propagación inversa).",

            workflowTitle: "5. Tu Flujo de Trabajo Diario (Tutorial)",
            workflowDesc: "Así es como usas realmente OpenLAG en tu día a día cuando te asignan una nueva tarea.",
            step1Label: "Paso 1: Generar un Artefacto",
            step1Desc: "Ejecuta 'npx openlag create artifact feat-login' para crear un nuevo archivo markdown en docs/.",
            step2Label: "Paso 2: Rellenar el Frontmatter",
            step2Desc: "Abre el archivo y configura su título, propiedad y relaciones. Enlaza tu nuevo código al requisito de negocio usando 'IMPLEMENTS'.",
            step3Label: "Paso 3: Escribir la Documentación",
            step3Desc: "Escribe la documentación real (qué hace el código, decisiones de arquitectura) en markdown estándar debajo del frontmatter.",
            step4Label: "Paso 4: Verificar y Subir",
            step4Desc: "Ejecuta 'npm run check' o 'npx openlag lint' antes de subir tu código para asegurar que no rompiste reglas de arquitectura ni olvidaste enlazar un test.",

            // Reference Section
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
            
            changeTypes: "Tipos de Cambios (Change Types)",
            changeTypesDesc: "Naturaleza de una modificación arquitectónica:",
            error: { label: "ERROR", desc: "Corrección de fallos o deuda técnica crítica." },
            feature: { label: "FEATURE", desc: "Nuevas capacidades con impacto en la arquitectura." },
            evolution: { label: "EVOLUTION", desc: "Mejoras graduales, seguridad o actualizaciones de cumplimiento." },
            refactor: { label: "REFACTOR", desc: "Reestructuraciones sin alterar el comportamiento externo." },
            adaptation: { label: "ADAPTATION", desc: "Ajustes para nuevas integraciones o restricciones del entorno." },
            
            frontmatter: "Formato Oficial Markdown",
            frontmatterDesc: "Cada artefacto requiere un YAML frontmatter. Campos obligatorios: id, type, status, title. Los artefactos especializados se modelan mediante valores type respaldados por contratos.",
            statusFlow: "Estados y Ciclo de Vida",
            statusFlowDesc: "En estado 'draft' se permiten huérfanos, pero en 'closed' se exige trazabilidad completa.",
        }
    };

    const c = t[lang as keyof typeof t];

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
                <p className="text-xs text-white/40 max-w-2xl leading-relaxed mb-6">
                    {c.desc}
                </p>
                
                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('onboarding')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'onboarding' ? 'border-blue-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                    >
                        {c.tabOnboarding}
                    </button>
                    <button 
                        onClick={() => setActiveTab('reference')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'reference' ? 'border-amber-500 text-white' : 'border-transparent text-white/40 hover:text-white/80'}`}
                    >
                        {c.tabReference}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 lg:px-16 pb-20 custom-scrollbar">
                
                {activeTab === 'onboarding' && (
                    <div className="space-y-16">
                        {/* Section 1: FAQ */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-pink-500/10 rounded border border-pink-500/20">
                                    <HelpCircle size={18} className="text-pink-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.faqTitle}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                                {c.faqDesc}
                            </p>

                            <div className="space-y-4 max-w-4xl">
                                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded">
                                    <h4 className="text-sm font-bold text-white/80 mb-2">{c.faqQ1}</h4>
                                    <p className="text-[13px] text-white/60 leading-relaxed">{c.faqA1}</p>
                                </div>
                                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded">
                                    <h4 className="text-sm font-bold text-white/80 mb-2">{c.faqQ2}</h4>
                                    <p className="text-[13px] text-white/60 leading-relaxed">{c.faqA2}</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Concepts */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-500/10 rounded border border-amber-500/20">
                                    <Layers size={18} className="text-amber-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.conceptsTitle}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                                {c.conceptsDesc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck size={16} className="text-amber-500/70" />
                                        <h3 className="text-sm font-bold text-white/80 tracking-wide">{c.contractsLabel}</h3>
                                    </div>
                                    <p className="text-[13px] text-white/50 leading-relaxed mb-4">{c.contractsDesc}</p>
                                </div>
                                <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded relative overflow-hidden group">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BookOpen size={16} className="text-emerald-500/70" />
                                        <h3 className="text-sm font-bold text-white/80 tracking-wide">{c.artifactsLabel}</h3>
                                    </div>
                                    <p className="text-[13px] text-white/50 leading-relaxed mb-4">{c.artifactsDesc}</p>
                                </div>
                            </div>
                        </section>

                        {/* Section 3: CLI */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded border border-indigo-500/20">
                                    <Terminal size={18} className="text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.cliTitle}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                                {c.cliDesc}
                            </p>

                            <div className="space-y-4 max-w-4xl">
                                {[
                                    { cmd: c.cmdInit, desc: c.cmdInitDesc },
                                    { cmd: c.cmdCreate, desc: c.cmdCreateDesc },
                                    { cmd: c.cmdDev, desc: c.cmdDevDesc },
                                    { cmd: c.cmdLint, desc: c.cmdLintDesc },
                                    { cmd: c.cmdImpact, desc: c.cmdImpactDesc }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-[#0c0c0c] border border-white/5 p-5 rounded flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="md:w-1/3">
                                            <code className="text-[11px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded">
                                                {item.cmd}
                                            </code>
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-[13px] text-white/60 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 4: Relations & Impact */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                                    <Link2 size={18} className="text-purple-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.impactTitle}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-4 leading-relaxed max-w-3xl">
                                {c.impactDesc}
                            </p>
                            <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded max-w-4xl">
                                <h4 className="text-sm font-bold text-white/80 mb-2">{c.impactHow}</h4>
                                <p className="text-[13px] text-white/60 leading-relaxed mb-6">{c.impactExplanation}</p>
                                
                                <div className="flex items-center justify-center p-6 bg-black/40 rounded border border-white/5">
                                    <div className="flex flex-col items-center">
                                        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded">
                                            CODE-001 (Artifact)
                                        </div>
                                    </div>
                                    <div className="flex-1 max-w-[200px] flex flex-col items-center mx-4 relative">
                                        <div className="w-full h-px bg-purple-500/50 absolute top-1/2 -translate-y-1/2"></div>
                                        <div className="px-2 py-1 bg-[#0c0c0c] border border-purple-500/30 text-purple-400 text-[10px] font-mono rounded-full z-10">
                                            IMPLEMENTS
                                        </div>
                                        <div className="mt-4 text-[10px] text-purple-400/50">Impact Propagates &larr;</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded">
                                            REQ-001 (Artifact)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 5: Step-by-Step Tutorial */}
                        <section className="border-t border-white/5 pt-16">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                                    <CheckCircle2 size={18} className="text-blue-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.workflowTitle}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                                {c.workflowDesc}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                                {[
                                    { title: c.step1Label, desc: c.step1Desc },
                                    { title: c.step2Label, desc: c.step2Desc },
                                    { title: c.step3Label, desc: c.step3Desc },
                                    { title: c.step4Label, desc: c.step4Desc }
                                ].map((step, idx) => (
                                    <div key={idx} className="bg-[#0c0c0c] border border-white/5 p-6 rounded flex flex-col">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                                                {idx + 1}
                                            </div>
                                            <h4 className="text-sm font-bold text-white/80">{step.title}</h4>
                                        </div>
                                        <p className="text-[13px] text-white/50 leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'reference' && (
                    <div className="space-y-16">
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
                                        {['CODE_ENTITY', 'TEST_CASE', 'DATABASE_ENTITY', 'CHANGE', 'BUG', 'RISK'].map(t => (
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

                        {/* Section: Change Types */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                                    <AlertTriangle size={18} className="text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-medium tracking-tight">{c.changeTypes}</h2>
                            </div>
                            <p className="text-sm text-white/50 mb-8 leading-relaxed max-w-3xl">
                                {c.changeTypesDesc}
                            </p>

                            <div className="space-y-4">
                                <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                    <ul className="space-y-3">
                                        <li className="text-sm text-white/80 font-mono"><span className="text-rose-400 font-bold p-1 bg-rose-500/10 rounded mr-2">{c.error.label}</span> {c.error.desc}</li>
                                        <li className="text-sm text-white/80 font-mono"><span className="text-emerald-400 font-bold p-1 bg-emerald-500/10 rounded mr-2">{c.feature.label}</span> {c.feature.desc}</li>
                                        <li className="text-sm text-white/80 font-mono"><span className="text-blue-400 font-bold p-1 bg-blue-500/10 rounded mr-2">{c.evolution.label}</span> {c.evolution.desc}</li>
                                        <li className="text-sm text-white/80 font-mono"><span className="text-amber-400 font-bold p-1 bg-amber-500/10 rounded mr-2">{c.refactor.label}</span> {c.refactor.desc}</li>
                                        <li className="text-sm text-white/80 font-mono"><span className="text-purple-400 font-bold p-1 bg-purple-500/10 rounded mr-2">{c.adaptation.label}</span> {c.adaptation.desc}</li>
                                    </ul>
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
  - type: REFINES
    to: EPIC-001
    strength: MEDIUM
    category: TRACEABILITY
---

# Generar graph-data.json
...contenido descriptivo...`}
                                    </pre>
                                </div>
                            </div>
                        </section>

                    </div>
                )}
            </div>
        </div>
    );
};
