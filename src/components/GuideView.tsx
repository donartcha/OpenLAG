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
        freezeDesc: 'Freeze builds a deterministic frozen document model from the local graph and an export profile. Markdown and JSON expose the model; HTML and PDF render the same model through offline documentary templates, not through portal printing.',
        profilesTitle: 'Profiles and Templates',
        profilesDesc: 'Profiles and templates are versioned package assets. Profile commands copy and validate reusable contract packs for local projects.',
        frontmatterTitle: 'Official Markdown Frontmatter',
        frontmatterDesc: 'Minimum fields are id, type and title. Lifecycle, ownership, version, description and relations are recommended. Keep relation metadata in contracts, not in the artifact frontmatter.'
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
        freezeDesc: 'Freeze construye un modelo documental congelado y determinista desde el grafo local y un perfil de exportacion. Markdown y JSON exponen el modelo; HTML y PDF renderizan el mismo modelo con plantillas documentales offline, no imprimiendo el portal.',
        profilesTitle: 'Perfiles y plantillas',
        profilesDesc: 'Perfiles y plantillas son assets versionados del paquete. Los comandos de perfil copian y validan packs reutilizables para proyectos locales.',
        frontmatterTitle: 'Frontmatter Markdown oficial',
        frontmatterDesc: 'Los campos minimos son id, type y title. status, version, description, ownership y relations son recomendados. La metadata de relaciones vive en contratos, no en el frontmatter.'
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
    'openlag freeze --profile architecture --format pdf',
    'openlag freeze --profile architecture --output exports/architecture',
    'openlag freeze --profile architecture --format html --template audit-dossier',
    'openlag freeze --profile architecture --dry-run'
];

const freezeTemplates = [
    ['freeze-template', 'Default professional documentation template.'],
    ['technical-manual', 'Dense developer and architecture manual.'],
    ['executive-brief', 'Metrics-first stakeholder brief.'],
    ['audit-dossier', 'Formal traceability dossier for governance review.'],
    ['knowledge-map', 'Navigation-first architecture exploration document.']
];

const exportProfileExample = `id: architecture
name: Architecture Documentation Freeze
defaultFormat: markdown
template:
  id: technical-manual
  path: templates/freeze/technical-manual.html
includeArtifactTypes:
  - PROJECT
  - REQUIREMENT
  - DECISION
includeRelations:
  - REFINES
  - IMPLEMENTS
sections:
  - id: requirements
    title: Requirements
    artifactTypes:
      - REQUIREMENT
rendering:
  includeTableOfContents: true
  includeRelationTables: true
  includeSourceMetadata: true`;

const dailyCommands = [
    ['openlag generate', 'Generate static graph and contract payloads.'],
    ['openlag check --profile develop', 'Validate local work with the development profile.'],
    ['openlag check --profile release --strict', 'Run strict release validation over the reference dataset.'],
    ['openlag impact --artifact REQ-LOGIN-001', 'Inspect propagated impact from one artifact.']
];

const starterCommands = [
    'npx @donartcha/openlag init --starter',
    'openlag check --profile develop',
    'openlag freeze --profile starter --format markdown'
];

const starterScope = [
    ['4 artifact types', 'REQUIREMENT, FEATURE, CODE_ENTITY, TEST_CASE'],
    ['4 relations', 'REFINES, IMPLEMENTS, TESTS, DEPENDS_ON'],
    ['1 export profile', 'starter (default markdown, lifecycle ordering)']
];

const markdownExample = `---
id: REQ-AUTH-001
type: REQUIREMENT
status: draft
title: Passwordless login
version: v-1
ownership:
  owner: Alex Rivera
  team: Platform Architecture
  maintainers:
    - Maya Chen
tags:
  - auth
  - onboarding
relations:
  - type: REFINES
    to: FEAT-AUTH-001
---

# Passwordless login

Users can sign in with a one-time link delivered through an approved identity provider.`;


const artifactFieldGroups = [
    {
        title: 'Minimum structural fields',
        tone: 'text-rose-300 border-rose-500/20 bg-rose-500/10',
        fields: [
            ['id', 'Unique, stable artifact identifier. Must not be reused.'],
            ['type', 'Concrete artifact contract type, resolved from docs/contracts/artifacts/*.yaml.'],
            ['title', 'Human-readable name shown in the portal and exports.']
        ]
    },
    {
        title: 'Recommended lifecycle fields',
        tone: 'text-amber-300 border-amber-500/20 bg-amber-500/10',
        fields: [
            ['status', 'draft, in_progress, ready, closed, or deprecated. Drives lint strictness.'],
            ['version', 'Timeline or system version id used for graph snapshots.'],
            ['description', 'Short summary used in cards, reports, and freeze outputs.'],
            ['ownership', 'owner, team, maintainers, reviewers, steward, or domain responsibility.'],
            ['relations', 'Typed graph edges using type and to.']
        ]
    },
    {
        title: 'Optional metadata fields',
        tone: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
        fields: [
            ['layer', 'Resolved from the artifact contract. Repeat only as a controlled override.'],
            ['tags', 'Search, grouping, and filtering labels.'],
            ['references', 'External URLs, specs, tickets, commits, or supporting documents.'],
            ['systemVersionId', 'Optional link to a SYSTEM_VERSION artifact when relevant.'],
            ['body', 'Free Markdown below frontmatter. Not a YAML field, but part of the artifact.']
        ]
    }
];

const artifactContractFields = [
    ['type', 'Required', 'Concrete contract name, for example API_ROUTE.'],
    ['extends', 'Optional', 'Base contract to inherit from, for example API.'],
    ['layer', 'Required or inherited', 'Semantic layer used by lint, projection, impact, and portal grouping.'],
    ['description', 'Recommended', 'Explains the purpose of this contract.'],
    ['requiredFields', 'Required', 'Minimum YAML fields expected for artifacts of this type.'],
    ['impactSeverityDefault', 'Optional', 'Default impact severity when artifacts of this type are affected.'],
    ['impact.criticality', 'Optional', 'Additional governance/impact metadata if used by project rules.']
];

const relationContractFields = [
    ['type', 'Required', 'Relation id, for example IMPLEMENTS.'],
    ['description', 'Recommended', 'Human explanation of the semantic edge.'],
    ['category', 'Required', 'TRACEABILITY, STRUCTURAL, OPERATIONAL, or SEMANTIC.'],
    ['strength', 'Required', 'STRONG, MEDIUM, or WEAK.'],
    ['allowedFrom', 'Required', 'Artifact types allowed as relation source.'],
    ['allowedTo', 'Required', 'Artifact types allowed as relation target.'],
    ['multiplicity', 'Optional', 'Cardinality or usage constraints if defined by the relation.'],
    ['validation.severity', 'Recommended', 'Default lint severity for invalid use.'],
    ['impact.propagates', 'Optional', 'Whether this relation propagates impact.'],
    ['impact.directions', 'Optional', 'forward, reverse, or both.'],
    ['impact.weight', 'Optional', 'Impact propagation multiplier.']
];

const ruleContractFields = [
    ['id', 'Required', 'Stable rule identifier enabled by profiles.'],
    ['title', 'Recommended', 'Short human-readable rule name.'],
    ['description', 'Recommended', 'What the rule detects and why it matters.'],
    ['appliesTo', 'Required', 'Artifact types, layers, statuses, or selectors evaluated by the rule.'],
    ['checks', 'Required', 'Conditions to evaluate, for example incoming/outgoing relations.'],
    ['severity', 'Required', 'Profile-aware severity map: feature/develop/release.'],
    ['rationale', 'Optional', 'Why the project needs this rule.'],
    ['fixHint', 'Optional', 'Suggested remediation shown in diagnostics.']
];

const artifactContractExample = `type: API_ROUTE
extends: API
layer: ARCHITECTURE
description: "HTTP route exposed by an API contract."
requiredFields:
  - id
  - type
  - title
  - ownership
impactSeverityDefault: medium`;

const relationContractExample = `type: IMPLEMENTS
description: "Implementation satisfies a requirement, feature, bug, or API contract."
category: TRACEABILITY
strength: STRONG
allowedFrom:
  - CODE_ENTITY
  - COMPONENT
  - API
allowedTo:
  - REQUIREMENT
  - FEATURE
  - BUG
  - API
validation:
  severity: error
impact:
  propagates: true
  directions:
    - reverse
  weight: 1`;

const ruleContractExample = `id: requirement-must-have-test
title: "Ready requirements must have test coverage"
description: "Detects requirements that are ready or closed without TESTS coverage."
appliesTo:
  artifactTypes:
    - REQUIREMENT
  statuses:
    - ready
    - closed
checks:
  relations:
    incoming:
      - TESTS
severity:
  feature: warning
  develop: warning
  release: error`;

const profileContractExample = `id: release
name: Release Gate
enabledRules:
  - requirement-must-have-test
  - requirement-must-have-implementation
  - discouraged-relation-rationale-required
severityOverrides:
  discouragedRelation: error`;

const completeGraphSteps = [
    ['1', 'Choose a profile', 'Start from core, governance, mvc, or another profile pack. Profiles copy reusable contracts into docs/contracts/.'],
    ['2', 'Define or reuse artifact contracts', 'Create custom types only when the official taxonomy is not enough. Prefer extends over inventing isolated types.'],
    ['3', 'Create Markdown artifacts', 'Every artifact needs stable id, type, title, lifecycle fields, ownership, and a useful Markdown body.'],
    ['4', 'Connect artifacts with relations', 'Use relations[].type and relations[].to. Do not duplicate strength or category in frontmatter; they belong to relation contracts.'],
    ['5', 'Add relation contracts when needed', 'A new relation must define allowedFrom, allowedTo, category, strength, validation severity, and impact propagation.'],
    ['6', 'Add rule contracts for governance', 'Rules detect project-specific gaps or policy violations, but only run when enabled by the active profile.'],
    ['7', 'Generate and validate', 'Run generate, check develop, check release --strict, impact, and freeze to prove the graph is complete.']
];

const validationCommands = [
    'openlag generate',
    'openlag check --profile develop',
    'openlag check --profile release --strict',
    'openlag impact --artifact REQ-AUTH-001',
    'openlag freeze --profile architecture --format markdown',
    'openlag freeze --profile architecture --format json',
    'openlag freeze --profile architecture --format html',
    'openlag freeze --profile architecture --format pdf',
    'openlag freeze --profile architecture --format html --template technical-manual'
];

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


const FieldTable: React.FC<{
    rows: string[][];
    columns?: [string, string, string];
}> = ({ rows, columns = ['Field', 'Status', 'Meaning'] }) => (
    <div className="overflow-hidden rounded border border-white/5 bg-black/30">
        <div className="grid grid-cols-[1fr_0.75fr_2fr] bg-white/[0.03] border-b border-white/5">
            {columns.map((col) => (
                <div key={col} className="px-4 py-3 text-[10px] uppercase tracking-widest text-white/40 font-mono">
                    {col}
                </div>
            ))}
        </div>
        {rows.map(([field, status, meaning]) => (
            <div key={`${field}-${status}`} className="grid grid-cols-[1fr_0.75fr_2fr] border-b border-white/5 last:border-b-0">
                <code className="px-4 py-3 text-[11px] text-cyan-300 font-mono">{field}</code>
                <div className="px-4 py-3 text-[11px] text-white/55">{status}</div>
                <div className="px-4 py-3 text-[11px] text-white/45 leading-relaxed">{meaning}</div>
            </div>
        ))}
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
                                icon={<GitBranch size={18} className="text-cyan-400" />}
                                title="4. Build and validate a complete graph"
                                desc="A complete OpenLAG graph is not created by writing Markdown only. It emerges from contracts, artifacts, relations, active rules, validation profiles, impact traversal, and freeze outputs."
                                tone="bg-cyan-500/10 border-cyan-500/20"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 max-w-7xl">
                                {completeGraphSteps.map(([number, title, desc]) => (
                                    <div key={number} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold mb-4">
                                            {number}
                                        </div>
                                        <div className="text-sm text-white/80 font-medium mb-2">{title}</div>
                                        <p className="text-[11px] text-white/45 leading-relaxed">{desc}</p>
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
                                icon={<CheckCircle2 size={18} className="text-emerald-400" />}
                                title="OpenLAG Lite Happy Path (Starter)"
                                desc="For first-time users, small teams, or ADR-first workflows, start with the minimum contract set and grow later."
                                tone="bg-emerald-500/10 border-emerald-500/20"
                            />

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-6xl">
                                <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                        <span className="text-[10px] font-mono text-white/40 italic">starter onboarding commands</span>
                                    </div>
                                    <div className="p-6">
                                        <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{starterCommands.join('\n')}</pre>
                                    </div>
                                </div>
                                <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                    <h3 className="text-sm font-bold text-white/80 mb-4">What starter scaffolds</h3>
                                    <div className="space-y-3">
                                        {starterScope.map(([label, value]) => (
                                            <div key={label} className="border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
                                                <div className="text-[11px] text-emerald-300 font-mono">{label}</div>
                                                <p className="text-[11px] text-white/45 leading-relaxed mt-1">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-white/45 leading-relaxed mt-5">
                                        Recommended path: start with starter, stabilize traceability habits, then expand with `openlag profile add governance` or `openlag profile add mvc`.
                                    </p>
                                </div>
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
                                icon={<PackageCheck size={18} className="text-blue-400" />}
                                title="Artifact Contract Example"
                                desc="Artifact contracts are YAML files that define concrete artifact types, inheritance, semantic layer, required fields, and impact defaults. They live in docs/contracts/artifacts/*.yaml."
                                tone="bg-blue-500/10 border-blue-500/20"
                            />

                            <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-w-5xl">
                                <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                    <span className="text-[10px] font-mono text-white/40 italic">docs/contracts/artifacts/API_ROUTE.yaml</span>
                                </div>
                                <div className="p-6">
                                    <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{artifactContractExample}</pre>
                                </div>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<Link2 size={18} className="text-purple-400" />}
                                title="Relation Contract Example"
                                desc="Relation contracts define which artifact types may connect, the semantic category, strength, validation severity, and impact traversal behavior. They live in docs/contracts/relations/*.yaml."
                                tone="bg-purple-500/10 border-purple-500/20"
                            />

                            <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-w-5xl">
                                <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                    <span className="text-[10px] font-mono text-white/40 italic">docs/contracts/relations/IMPLEMENTS.yaml</span>
                                </div>
                                <div className="p-6">
                                    <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{relationContractExample}</pre>
                                </div>
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<ShieldCheck size={18} className="text-emerald-400" />}
                                title={c.rulesTitle}
                                desc={c.rulesDesc}
                                tone="bg-emerald-500/10 border-emerald-500/20"
                            />

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-6xl">
                                <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                        <span className="text-[10px] font-mono text-white/40 italic">docs/contracts/rules/requirement-must-have-test.yaml</span>
                                    </div>
                                    <div className="p-6">
                                        <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{ruleContractExample}</pre>
                                    </div>
                                </div>
                                <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                        <span className="text-[10px] font-mono text-white/40 italic">profile activation example</span>
                                    </div>
                                    <div className="p-6">
                                        <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{profileContractExample}</pre>
                                        <p className="text-[12px] text-white/45 leading-relaxed mt-4">
                                            A discovered rule contract is not automatically blocking. The active profile decides whether that rule participates in validation and with which severity.
                                        </p>
                                    </div>
                                </div>
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

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 max-w-6xl mt-4">
                                <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden">
                                    <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                        <span className="text-[10px] font-mono text-white/40 italic">docs/contracts/export-profiles/architecture.yaml</span>
                                    </div>
                                    <div className="p-6">
                                        <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{exportProfileExample}</pre>
                                    </div>
                                </div>
                                <div className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                    <h3 className="text-sm font-bold text-white/80 mb-4">Bundled freeze templates</h3>
                                    <div className="space-y-3">
                                        {freezeTemplates.map(([template, desc]) => (
                                            <div key={template} className="border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
                                                <code className="text-[11px] text-cyan-300 font-mono">{template}</code>
                                                <p className="text-[11px] text-white/45 leading-relaxed mt-1">{desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[12px] text-white/45 leading-relaxed mt-5">
                                        Templates control presentation only. Artifact selection, relation selection, sections, ordering, and rendering flags belong to the export profile.
                                    </p>
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
                                icon={<FileCode2 size={18} className="text-cyan-400" />}
                                title="Artifact fields: required, recommended, and optional"
                                desc="OpenLAG keeps the minimum artifact format small, but contracts and profiles may require more fields depending on type and validation context."
                                tone="bg-cyan-500/10 border-cyan-500/20"
                            />

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 max-w-7xl">
                                {artifactFieldGroups.map((group) => (
                                    <div key={group.title} className="bg-[#0c0c0c] border border-white/5 p-5 rounded">
                                        <div className={`text-xs font-bold mb-4 px-2 py-1 rounded border w-fit ${group.tone}`}>{group.title}</div>
                                        <div className="space-y-3">
                                            {group.fields.map(([field, desc]) => (
                                                <div key={field} className="border-b border-white/5 last:border-b-0 pb-3 last:pb-0">
                                                    <code className="text-[11px] text-cyan-300 font-mono">{field}</code>
                                                    <p className="text-[11px] text-white/45 leading-relaxed mt-1">{desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader
                                icon={<PackageCheck size={18} className="text-emerald-400" />}
                                title="Contract fields reference"
                                desc="Use these tables when creating artifact, relation, or rule contracts. They make explicit which fields are mandatory and which are optional or recommended."
                                tone="bg-emerald-500/10 border-emerald-500/20"
                            />

                            <div className="space-y-6 max-w-7xl">
                                <div>
                                    <h3 className="text-sm text-white/80 font-bold mb-3">Artifact contract fields</h3>
                                    <FieldTable rows={artifactContractFields} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-white/80 font-bold mb-3">Relation contract fields</h3>
                                    <FieldTable rows={relationContractFields} />
                                </div>
                                <div>
                                    <h3 className="text-sm text-white/80 font-bold mb-3">Rule contract fields</h3>
                                    <FieldTable rows={ruleContractFields} />
                                </div>
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
                                icon={<CheckCircle2 size={18} className="text-lime-400" />}
                                title="Validation flow for a complete graph"
                                desc="Use this sequence to prove that contracts, artifacts, relations, rule activation, impact propagation, and freeze outputs are coherent."
                                tone="bg-lime-500/10 border-lime-500/20"
                            />

                            <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-w-5xl">
                                <div className="p-4 bg-white/[0.03] border-b border-white/5">
                                    <span className="text-[10px] font-mono text-white/40 italic">recommended validation sequence</span>
                                </div>
                                <div className="p-6">
                                    <pre className="text-[11px] font-mono leading-relaxed text-white/60 select-all">{validationCommands.join('\n')}</pre>
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
