import React, { useState } from 'react';
import {
    AlertTriangle,
    BookOpen,
    CheckCircle2,
    FileCode2,
    GitBranch,
    Globe,
    Layers,
    Link2,
    PackageCheck,
    ShieldCheck,
    Snowflake,
    Terminal
} from 'lucide-react';
import { useStore } from '../store';
import openLagLogo from '../../OpenLAG-logo-t.png';

type GuideCopy = {
    title: string;
    desc: string;
    tabOnboarding: string;
    tabReference: string;
    language: string;
    whatTitle: string;
    whatDesc: string;
    contractTitle: string;
    contractDesc: string;
    cliTitle: string;
    cliDesc: string;
    impactTitle: string;
    impactDesc: string;
    workflowTitle: string;
    workflowDesc: string;
    layersTitle: string;
    layersDesc: string;
    relationsTitle: string;
    relationsDesc: string;
    rulesTitle: string;
    rulesDesc: string;
    freezeTitle: string;
    freezeDesc: string;
    profilesTitle: string;
    profilesDesc: string;
    frontmatterTitle: string;
    frontmatterDesc: string;
};

const copies: Record<'EN' | 'ES', GuideCopy> = {
    EN: {
        title: 'Getting Started with OpenLAG 0.5.0',
        desc: 'A short operational guide for the contract-driven, filesystem-first OpenLAG 0.5.0 model.',
        tabOnboarding: '101 Onboarding',
        tabReference: '0.5.0 Reference',
        language: 'English',
        whatTitle: '1. What OpenLAG Does',
        whatDesc: 'OpenLAG reads Markdown artifacts plus YAML contracts, builds a deterministic traceability graph, validates governance rules through active profiles, and can freeze documentation into portable outputs.',
        contractTitle: '2. Contract-Driven Model',
        contractDesc: 'The repository owns its model as files: artifact contracts define artifact types, relation contracts define valid links, rule contracts define executable governance, profile packs copy reusable contract sets, and export profiles drive documentation freezes.',
        cliTitle: '3. Daily CLI Flow',
        cliDesc: 'Use the CLI to scaffold profiles, generate static graph data, validate the dataset, inspect impact, and freeze documentation.',
        impactTitle: '4. Relations and Impact',
        impactDesc: 'Relations use a typed edge with a destination id. Impact analysis traverses those edges deterministically, so a changed requirement can point to the implementation, verification, operation, or governance artifacts that may need attention.',
        workflowTitle: '5. A Practical Loop',
        workflowDesc: 'Create the artifact, fill official frontmatter, connect it with relations, write the Markdown body, and run the project checks before merging.',
        layersTitle: 'Semantic Layers',
        layersDesc: 'OpenLAG 0.5.0 resolves layer semantics from artifact contracts. The frontmatter may repeat layer only as a controlled override when a project explicitly needs it.',
        relationsTitle: 'Relation Contracts',
        relationsDesc: 'Relation contracts live beside artifact contracts and define which typed edges are valid between artifacts.',
        rulesTitle: 'Rule Contracts',
        rulesDesc: 'Rule contracts are MVP runtime behavior in 0.5.0. They live in the project contracts folder and affect validation only when the active profile enables the rule id.',
        freezeTitle: 'Freeze and Export',
        freezeDesc: 'Freeze builds a frozen document model from profile, graph, artifacts, and ordering rules. HTML is a standalone documentation page; PDF is generated from the frozen model, not from portal printing.',
        profilesTitle: 'Profiles and Templates',
        profilesDesc: 'Profiles and templates are versioned package assets. Profile commands copy and validate reusable contract packs for local projects.',
        frontmatterTitle: 'Official Markdown Frontmatter',
        frontmatterDesc: 'Use relations[].type and relations[].to. Keep relation metadata in contracts, not in the artifact frontmatter.'
    },
    ES: {
        title: 'Primeros pasos con OpenLAG 0.5.0',
        desc: 'Guia operativa breve para el modelo OpenLAG 0.5.0: contratos, Markdown, filesystem y validacion determinista.',
        tabOnboarding: 'Inicio 101',
        tabReference: 'Referencia 0.5.0',
        language: 'Espanol',
        whatTitle: '1. Que hace OpenLAG',
        whatDesc: 'OpenLAG lee artefactos Markdown y contratos YAML, construye un grafo de trazabilidad determinista, valida reglas de governance mediante perfiles activos y congela documentacion en formatos portables.',
        contractTitle: '2. Modelo dirigido por contratos',
        contractDesc: 'El repositorio contiene su modelo como archivos: contratos de artefactos para tipos, contratos de relaciones para enlaces validos, contratos de reglas para governance ejecutable, packs de perfil para reutilizacion y perfiles de export para freezes.',
        cliTitle: '3. Flujo CLI diario',
        cliDesc: 'Usa la CLI para inicializar perfiles, generar datos estaticos del grafo, validar el dataset, inspeccionar impacto y congelar documentacion.',
        impactTitle: '4. Relaciones e impacto',
        impactDesc: 'Las relaciones usan una arista tipada con id destino. El motor de impacto recorre esas aristas de forma determinista para saber que implementacion, verificacion, operacion o governance puede requerir atencion.',
        workflowTitle: '5. Bucle practico',
        workflowDesc: 'Crea el artefacto, completa el frontmatter oficial, conectalo con relaciones, escribe el cuerpo Markdown y ejecuta las comprobaciones del proyecto antes de integrar.',
        layersTitle: 'Capas semanticas',
        layersDesc: 'OpenLAG 0.5.0 resuelve la capa desde los contratos de artefactos. El frontmatter puede repetir layer solo como override controlado cuando el proyecto lo necesita explicitamente.',
        relationsTitle: 'Contratos de relaciones',
        relationsDesc: 'Los contratos de relaciones viven junto a los contratos de artefactos y definen que aristas tipadas son validas entre artefactos.',
        rulesTitle: 'Contratos de reglas',
        rulesDesc: 'Los contratos de reglas son comportamiento MVP ejecutable en 0.5.0. Viven en la carpeta de contratos del proyecto y solo afectan a la validacion cuando el perfil activo habilita el id de regla.',
        freezeTitle: 'Freeze y export',
        freezeDesc: 'Freeze construye un modelo documental congelado desde perfil, grafo, artefactos y ordenacion. HTML es una pagina independiente; PDF se genera desde el modelo congelado, no desde imprimir el portal.',
        profilesTitle: 'Perfiles y plantillas',
        profilesDesc: 'Perfiles y plantillas son assets versionados del paquete. Los comandos de perfil copian y validan packs reutilizables para proyectos locales.',
        frontmatterTitle: 'Frontmatter Markdown oficial',
        frontmatterDesc: 'Usa relations[].type y relations[].to. La metadata de relaciones vive en contratos, no en el frontmatter del artefacto.'
    }
};

const layers = [
    {
        name: 'BUSINESS',
        desc: 'Goals, requirements, domain rules, and planning intent.',
        artifacts: ['PROJECT', 'EPIC', 'FEATURE', 'REQUIREMENT', 'BUSINESS_RULE', 'USE_CASE']
    },
    {
        name: 'ARCHITECTURE',
        desc: 'Design decisions, components, interfaces, constraints, and system shape.',
        artifacts: ['DESIGN', 'DECISION', 'COMPONENT', 'API', 'REVIEW']
    },
    {
        name: 'IMPLEMENTATION',
        desc: 'Code, data, libraries, changes, bugs, and implementation details.',
        artifacts: ['CODE_ENTITY', 'DATABASE_ENTITY', 'LIBRARY', 'CHANGE', 'BUG']
    },
    {
        name: 'VERIFICATION',
        desc: 'Checks, evidence, validation notes, and quality signals.',
        artifacts: ['CHECK', 'REVIEW', 'EVIDENCE']
    },
    {
        name: 'OPERATIONS',
        desc: 'Runtime, delivery, environments, incidents, and observability.',
        artifacts: ['PROCESS', 'PIPELINE', 'ENVIRONMENT', 'DEPLOYMENT', 'MONITORING', 'OBSERVATION']
    },
    {
        name: 'GOVERNANCE',
        desc: 'Findings, policy signals, accepted debt, and compliance work.',
        artifacts: ['GAP', 'VIOLATION', 'DEBT', 'RISK', 'GOVERNANCE_ARTIFACT']
    },
    {
        name: 'DOCUMENTATION',
        desc: 'Narrative knowledge, glossaries, freezes, and reference material.',
        artifacts: ['DOCUMENTATION', 'DOCUMENTATION_FREEZE', 'GLOSSARY_TERM']
    }
];

const contractItems = [
    ['Artifact contracts', 'docs/contracts/artifacts/*.yaml'],
    ['Relation contracts', 'docs/contracts/relations/*.yaml'],
    ['Rule contracts', 'docs/contracts/rules/*.yaml'],
    ['Export profiles', 'docs/contracts/export-profiles/*.yaml'],
    ['Profile packs', 'profiles/']
];

const profileCommands = [
    'openlag init --profile core',
    'openlag init --profile governance',
    'openlag profile add testing',
    'openlag profile validate'
];

const freezeCommands = [
    'openlag freeze --profile architecture --format markdown',
    'openlag freeze --profile architecture --format json',
    'openlag freeze --profile architecture --format html',
    'openlag freeze --profile architecture --format pdf'
];

const dailyCommands = [
    ['openlag generate', 'Generate static graph and contract payloads.'],
    ['openlag check --profile develop', 'Validate local work with the development profile.'],
    ['openlag check --profile release --strict', 'Run strict release validation over the reference dataset.'],
    ['openlag impact --artifact REQ-LOGIN-001', 'Inspect propagated impact from one artifact.']
];

const markdownExample = `---
id: REQ-AUTH-001
type: REQUIREMENT
status: draft
title: Passwordless login
ownership:
  owner: Alex Rivera
  team: Platform Architecture
  maintainers:
    - Maya Chen
tags:
  - auth
  - onboarding
relations:
  - type: IMPLEMENTS
    to: COMP-AUTH-PORTAL
  - type: VALIDATES
    to: CHECK-AUTH-FLOW
---

# Passwordless login

Users can sign in with a one-time link delivered through an approved identity provider.`;

const Chip: React.FC<{ children: React.ReactNode; tone?: string }> = ({ children, tone = 'bg-white/5 text-white/60' }) => (
    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${tone}`}>{children}</span>
);

const SectionHeader: React.FC<{
    icon: React.ReactNode;
    title: string;
    desc?: string;
    tone: string;
}> = ({ icon, title, desc, tone }) => (
    <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded border ${tone}`}>{icon}</div>
            <h2 className="text-xl font-medium tracking-tight">{title}</h2>
        </div>
        {desc && <p className="text-sm text-white/50 leading-relaxed max-w-3xl">{desc}</p>}
    </div>
);

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded">
        <h3 className="text-sm font-bold text-white/80 mb-3">{title}</h3>
        <div className="text-[13px] text-white/60 leading-relaxed">{children}</div>
    </div>
);

export const GuideView: React.FC = () => {
    const { settings } = useStore();
    const lang = settings.language === 'ES' ? 'ES' : 'EN';
    const [activeTab, setActiveTab] = useState<'onboarding' | 'reference'>('onboarding');
    const c = copies[lang];

    return (
        <div className="h-full w-full bg-[#0a0a0a] flex flex-col overflow-hidden">
            <div className="p-8 lg:px-16 pt-12 shrink-0 border-b border-white/5 bg-[#0c0c0c]/30">
                <div className="flex flex-wrap items-center gap-6 mb-4">
                    <img src={openLagLogo} alt="OpenLAG" className="h-24 w-24 shrink-0 object-contain" />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-serif italic tracking-tight">{c.title}</h1>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono rounded uppercase tracking-widest">
                                <Globe size={12} />
                                {c.language}
                            </div>
                        </div>
                        <p className="text-xs text-white/40 max-w-3xl leading-relaxed mt-4">{c.desc}</p>
                    </div>
                </div>

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
                        <section>
                            <SectionHeader
                                icon={<BookOpen size={18} className="text-pink-400" />}
                                title={c.whatTitle}
                                desc={c.whatDesc}
                                tone="bg-pink-500/10 border-pink-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                                <InfoCard title="Filesystem-first">
                                    Documentation stays in the repository as Markdown and YAML. The portal is generated from local files.
                                </InfoCard>
                                <InfoCard title="Backend-optional">
                                    OpenLAG 0.5.0 works as a static-first toolchain: generate graph data, build the portal, and inspect locally.
                                </InfoCard>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<PackageCheck size={18} className="text-emerald-400" />}
                                title={c.contractTitle}
                                desc={c.contractDesc}
                                tone="bg-emerald-500/10 border-emerald-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-6xl">
                                {contractItems.map(([label, path]) => (
                                    <div key={path} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <div className="text-sm text-white/80 mb-2">{label}</div>
                                        <code className="text-[11px] text-emerald-300 font-mono">{path}</code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<Terminal size={18} className="text-indigo-400" />}
                                title={c.cliTitle}
                                desc={c.cliDesc}
                                tone="bg-indigo-500/10 border-indigo-500/20"
                            />

                            <div className="space-y-4 max-w-5xl">
                                {dailyCommands.map(([cmd, desc]) => (
                                    <div key={cmd} className="bg-[#0c0c0c] border border-white/5 p-5 rounded flex flex-col md:flex-row md:items-center gap-4">
                                        <code className="md:w-1/3 text-[11px] font-mono bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded w-fit">{cmd}</code>
                                        <p className="md:w-2/3 text-[13px] text-white/60 leading-relaxed">{desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<Link2 size={18} className="text-purple-400" />}
                                title={c.impactTitle}
                                desc={c.impactDesc}
                                tone="bg-purple-500/10 border-purple-500/20"
                            />

                            <div className="flex items-center justify-center p-6 bg-black/40 rounded border border-white/5 max-w-5xl">
                                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono rounded">
                                    REQ-AUTH-001
                                </div>
                                <div className="flex-1 max-w-[220px] flex flex-col items-center mx-4 relative">
                                    <div className="w-full h-px bg-purple-500/50 absolute top-1/2 -translate-y-1/2" />
                                    <div className="px-2 py-1 bg-[#0c0c0c] border border-purple-500/30 text-purple-400 text-[10px] font-mono rounded-full z-10">
                                        IMPLEMENTS
                                    </div>
                                    <div className="mt-4 text-[10px] text-purple-400/50">deterministic traversal</div>
                                </div>
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded">
                                    COMP-AUTH-PORTAL
                                </div>
                            </div>
                        </section>

                        <section className="border-t border-white/5 pt-16">
                            <SectionHeader
                                icon={<CheckCircle2 size={18} className="text-blue-400" />}
                                title={c.workflowTitle}
                                desc={c.workflowDesc}
                                tone="bg-blue-500/10 border-blue-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl">
                                {['Create artifact', 'Fill frontmatter', 'Connect relations', 'Run checks'].map((step, idx) => (
                                    <div key={step} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mb-4">
                                            {idx + 1}
                                        </div>
                                        <div className="text-sm text-white/80 font-medium">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {activeTab === 'reference' && (
                    <div className="space-y-16">
                        <section>
                            <SectionHeader
                                icon={<Layers size={18} className="text-pink-400" />}
                                title={c.layersTitle}
                                desc={c.layersDesc}
                                tone="bg-pink-500/10 border-pink-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {layers.map((layer) => (
                                    <div key={layer.name} className="bg-[#0c0c0c] border border-white/5 p-6 rounded">
                                        <h3 className="text-sm font-bold text-white/80 mb-2 uppercase tracking-widest">{layer.name}</h3>
                                        <p className="text-[11px] text-white/40 leading-relaxed mb-4">{layer.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {layer.artifacts.map((artifact) => (
                                                <Chip key={artifact}>{artifact}</Chip>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<Link2 size={18} className="text-indigo-400" />}
                                title={c.relationsTitle}
                                desc={c.relationsDesc}
                                tone="bg-indigo-500/10 border-indigo-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl">
                                {['IMPLEMENTS', 'VALIDATES', 'DEPENDS_ON', 'DOCUMENTS', 'REFINES', 'MONITORS'].map((relation) => (
                                    <div key={relation} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <code className="text-xs text-indigo-300 font-mono">{relation}</code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<ShieldCheck size={18} className="text-emerald-400" />}
                                title={c.rulesTitle}
                                desc={c.rulesDesc}
                                tone="bg-emerald-500/10 border-emerald-500/20"
                            />

                            <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded max-w-5xl">
                                <code className="text-[11px] text-emerald-300 font-mono">docs/contracts/rules/*.yaml</code>
                                <p className="text-[13px] text-white/60 leading-relaxed mt-4">
                                    A discovered rule contract is not automatically blocking. The active profile decides whether that rule participates in validation and with which severity.
                                </p>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<Snowflake size={18} className="text-cyan-400" />}
                                title={c.freezeTitle}
                                desc={c.freezeDesc}
                                tone="bg-cyan-500/10 border-cyan-500/20"
                            />

                            <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-w-5xl">
                                <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                    <span className="text-[10px] font-mono text-white/40 italic">official freeze outputs</span>
                                </div>
                                <div className="p-6">
                                    <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">
{freezeCommands.join('\n')}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<GitBranch size={18} className="text-amber-400" />}
                                title={c.profilesTitle}
                                desc={c.profilesDesc}
                                tone="bg-amber-500/10 border-amber-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                                {profileCommands.map((cmd) => (
                                    <div key={cmd} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <code className="text-[11px] text-amber-300 font-mono">{cmd}</code>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<FileCode2 size={18} className="text-purple-400" />}
                                title={c.frontmatterTitle}
                                desc={c.frontmatterDesc}
                                tone="bg-purple-500/10 border-purple-500/20"
                            />

                            <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-w-5xl">
                                <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-mono text-white/40 italic">docs/requirements/REQ-AUTH-001.md</span>
                                </div>
                                <div className="p-6">
                                    <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">
{markdownExample}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<AlertTriangle size={18} className="text-rose-400" />}
                                title="0.5.0 compatibility notes"
                                tone="bg-rose-500/10 border-rose-500/20"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
                                <InfoCard title="Canonical paths">
                                    Use the `docs/contracts/*` contract layout and keep generated portal data derived from those files.
                                </InfoCard>
                                <InfoCard title="Layer ownership">
                                    Prefer contract-defined layers. Repeat `layer` in an artifact only when the project has an explicit override policy.
                                </InfoCard>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
};
