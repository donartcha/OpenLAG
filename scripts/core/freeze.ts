import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import yaml from 'js-yaml';

import { loadArtifactContracts } from './artifact-contracts.js';
import { parseOpenLagDocs, ParsedArtifact, ParsedRelation } from './parser.js';
import { loadRelationContracts } from './relation-contracts.js';

export type FreezeFormat = 'markdown' | 'json' | 'html' | 'pdf';

export interface ExportProfileSection {
  id: string;
  title: string;
  artifactTypes?: string[];
}

export interface ExportProfile {
  id: string;
  name: string;
  description?: string;
  defaultFormat?: FreezeFormat;
  includeArtifactTypes?: string[];
  excludeArtifactTypes?: string[];
  includeRelations?: string[];
  sections: ExportProfileSection[];
  ordering?: {
    strategy?: string;
    fallback?: string;
  };
  template?: {
    id?: string;
    path?: string;
  };
  branding?: {
    logo?: string;
    productName?: string;
    subtitle?: string;
  };
  document?: {
    language?: string;
    title?: string;
    eyebrow?: string;
    description?: string;
  };
  executiveSummary?: {
    title?: string;
    purposeTitle?: string;
    purpose?: string;
    scopeTitle?: string;
    scope?: string;
    audienceTitle?: string;
    audience?: string;
  };
  footer?: {
    left?: string;
    right?: string;
  };
  rendering?: {
    includeTableOfContents?: boolean;
    includeRelationTables?: boolean;
    includeSourceMetadata?: boolean;
    includeTechnicalMetadata?: boolean;
    includeCover?: boolean;
    includeExecutiveSummary?: boolean;
    includeFooter?: boolean;
  };
}

export interface FrozenArtifact {
  id: string;
  type: string;
  title: string;
  status?: string;
  layer?: string;
  ownership?: ParsedArtifact['ownership'];
  description?: string;
  markdownBody?: string;
  metadata: Record<string, unknown>;
  source?: string;
  relations: {
    outgoing: FrozenRelation[];
    incoming: FrozenRelation[];
  };
}

export interface FrozenRelation {
  id: string;
  type: string;
  from: string;
  to: string;
  category?: string;
  strength?: string;
}

export interface FrozenSection {
  id: string;
  title: string;
  artifactTypes: string[];
  artifacts: FrozenArtifact[];
}

export interface FrozenDocument {
  id: string;
  profile: {
    id: string;
    name: string;
    description?: string;
    ordering?: ExportProfile['ordering'];
    rendering?: ExportProfile['rendering'];
    template?: ExportProfile['template'];
    branding?: ExportProfile['branding'];
    document?: ExportProfile['document'];
    executiveSummary?: ExportProfile['executiveSummary'];
    footer?: ExportProfile['footer'];
  };
  generatedAt: string;
  formatVersion: 'openlag.freeze.v1';
  version?: string;
  summary: {
    artifactCount: number;
    relationCount: number;
    sectionCount: number;
  };
  sections: FrozenSection[];
}

export interface FreezeOptions {
  projectRoot: string;
  profile?: string;
  format?: string;
  template?: string;
  output?: string;
  version?: string;
  dryRun?: boolean;
  generatedAt?: string;
}

export interface FreezeResult {
  profile: ExportProfile;
  outputFile: string;
  content: string | Buffer;
  markdown: string;
  document: FrozenDocument;
  artifactCount: number;
  relationCount: number;
  dryRun: boolean;
  format: FreezeFormat;
}

export const REQUIRED_TEMPLATE_PLACEHOLDERS = [
  'branding.productName',
  'branding.subtitle',
  'cover.eyebrow',
  'cover.title',
  'cover.description',
  'summary.artifactCount',
  'summary.relationCount',
  'summary.sectionCount',
  'profile.id',
  'profile.name',
  'profile.description',
  'document.language',
  'document.title',
  'document.generatedAt',
  'document.formatVersion',
  'executiveSummary.title',
  'executiveSummary.purposeTitle',
  'executiveSummary.purpose',
  'executiveSummary.scopeTitle',
  'executiveSummary.scope',
  'executiveSummary.audienceTitle',
  'executiveSummary.audience',
  'footer.left',
  'footer.right',
];

export const REQUIRED_TEMPLATE_ASSET_PLACEHOLDERS = ['branding.logo'];

export const REQUIRED_TEMPLATE_SLOTS = [
  'openlag.tableOfContents',
  'openlag.sidebarNavigation',
  'openlag.sections',
  'openlag.artifacts',
  'openlag.relations',
  'openlag.technicalMetadata',
];

export interface FreezeTemplateContext {
  branding: {
    logo?: string;
    productName: string;
    subtitle: string;
  };
  document: {
    language: string;
    title: string;
    generatedAt: string;
    formatVersion: string;
  };
  cover: {
    eyebrow: string;
    title: string;
    description: string;
  };
  profile: {
    id: string;
    name: string;
    description: string;
  };
  summary: FrozenDocument['summary'];
  executiveSummary: {
    title: string;
    purposeTitle: string;
    purpose: string;
    scopeTitle: string;
    scope: string;
    audienceTitle: string;
    audience: string;
  };
  rendering: NonNullable<ExportProfile['rendering']>;
  sections: FrozenSection[];
  footer: {
    left: string;
    right: string;
  };
}

function ensureArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/'/g, '&#39;');
}

function normalizeFormat(value: string | undefined, fallback: FreezeFormat): FreezeFormat {
  const format = (value || fallback).toLowerCase();
  if (format === 'markdown' || format === 'json' || format === 'html' || format === 'pdf') return format;
  throw new Error(`Unsupported freeze format "${value}". Supported formats are: markdown, json, html, pdf.`);
}

export function loadExportProfile(projectRoot: string, profileId = 'architecture'): ExportProfile {
  const profilePath = path.join(projectRoot, 'docs', 'contracts', 'export-profiles', `${profileId}.yaml`);

  if (!fs.existsSync(profilePath)) {
    throw new Error(`Export profile not found: ${profilePath}`);
  }

  const parsed = yaml.load(fs.readFileSync(profilePath, 'utf-8')) as Partial<ExportProfile> | null;
  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`Export profile ${profileId} is empty or invalid.`);
  }

  const id = String(parsed.id || profileId);
  const name = String(parsed.name || id);
  const sections = Array.isArray(parsed.sections)
    ? parsed.sections.map((section, index) => ({
        id: String(section.id || `section-${index + 1}`),
        title: String(section.title || section.id || `Section ${index + 1}`),
        artifactTypes: ensureArray(section.artifactTypes),
      }))
    : [];

  if (sections.length === 0) {
    throw new Error(`Export profile ${profileId} must define at least one section.`);
  }

  return {
    id,
    name,
    description: parsed.description ? String(parsed.description).trim() : undefined,
    defaultFormat: normalizeFormat(parsed.defaultFormat as string | undefined, 'markdown'),
    includeArtifactTypes: ensureArray(parsed.includeArtifactTypes),
    excludeArtifactTypes: ensureArray(parsed.excludeArtifactTypes),
    includeRelations: ensureArray(parsed.includeRelations),
    sections,
    ordering: parsed.ordering,
    template: parsed.template,
    branding: parsed.branding,
    document: parsed.document,
    executiveSummary: parsed.executiveSummary,
    footer: parsed.footer,
    rendering: parsed.rendering,
  };
}

function resolveOutputFile(projectRoot: string, profile: ExportProfile, format: FreezeFormat, output?: string): string {
  const extensionByFormat: Record<FreezeFormat, string> = {
    markdown: '.md',
    json: '.json',
    html: '.html',
    pdf: '.pdf',
  };
  const ext = extensionByFormat[format];
  const templateId = profile.template?.id;
  const suffix = templateId && templateId !== 'professional-document-v1' ? `-${slug(templateId)}` : '';
  const defaultFileName = `openlag-${profile.id}${suffix}${ext}`;
  if (!output) {
    return path.join(projectRoot, defaultFileName);
  }

  const resolved = path.isAbsolute(output) ? output : path.join(projectRoot, output);
  return path.extname(resolved) ? resolved : path.join(resolved, defaultFileName);
}

function resolveTemplateOverride(template: string): ExportProfile['template'] {
  const pathLike = template.endsWith('.html') || template.includes('/') || template.includes('\\');
  const templatePath = pathLike ? template : `templates/freeze/${template}.html`;
  return {
    id: slug(path.basename(template, '.html')),
    path: templatePath,
  };
}

function applyTemplateOverride(profile: ExportProfile, template?: string): ExportProfile {
  if (!template) return profile;
  return {
    ...profile,
    template: resolveTemplateOverride(template),
  };
}

function displayFile(filePath: string): string {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

function lifecycleRank(status?: string): number {
  const ranks: Record<string, number> = {
    draft: 10,
    in_progress: 20,
    ready: 30,
    closed: 40,
    deprecated: 50,
  };
  return ranks[status || ''] || 99;
}

function artifactSortKey(profile: ExportProfile, artifact: ParsedArtifact): string {
  const strategy = profile.ordering?.strategy || 'lifecycle';
  const fallback = profile.ordering?.fallback || 'title';
  const fallbackValue = fallback === 'id' ? artifact.id : artifact.title || artifact.id;
  const strategyValue = strategy === 'lifecycle'
    ? String(lifecycleRank(artifact.status)).padStart(3, '0')
    : strategy === 'architecture'
      ? artifact.layer || ''
      : artifact.type || '';

  return [strategyValue, artifact.type || '', fallbackValue || '', artifact.id || '', artifact.file || '']
    .join('\u0000')
    .toLowerCase();
}

function sortArtifacts(profile: ExportProfile, artifacts: ParsedArtifact[]): ParsedArtifact[] {
  return [...artifacts].sort((a, b) => artifactSortKey(profile, a).localeCompare(artifactSortKey(profile, b)));
}

function relationSortKey(relation: ParsedRelation): string {
  return [relation.type || '', relation.from || '', relation.to || '', relation.id || ''].join('\u0000').toLowerCase();
}

function sortRelations(relations: ParsedRelation[]): ParsedRelation[] {
  return [...relations].sort((a, b) => relationSortKey(a).localeCompare(relationSortKey(b)));
}

function isDescendantVersion(currentVersionId: string, artifactVersionId: string, versions: { id: string; parentVersion?: string | null }[]): boolean {
  let current = versions.find((version) => version.id === currentVersionId);
  let depth = 0;

  while (current && current.parentVersion && current.parentVersion !== 'none') {
    depth += 1;
    if (depth > 50) return false;
    if (current.parentVersion === artifactVersionId) return true;
    current = versions.find((version) => version.id === current!.parentVersion);
  }

  return false;
}

function artifactVersion(artifact: ParsedArtifact): string {
  return String((artifact as any).version || artifact.raw?.version || '');
}

function filterArtifactsByVersion(
  artifacts: ParsedArtifact[],
  relations: ParsedRelation[],
  versions: { id: string; parentVersion?: string | null }[],
  versionId?: string
): { artifacts: ParsedArtifact[]; relations: ParsedRelation[] } {
  if (!versionId) return { artifacts, relations };

  if (versions.length > 0 && !versions.some((version) => version.id === versionId)) {
    throw new Error(`Version not found for freeze: ${versionId}`);
  }

  const selectedArtifacts = artifacts.filter((artifact) => {
    if (artifact.type === 'VERSION' || artifact.type === 'SYSTEM_VERSION') return true;
    const version = artifactVersion(artifact);
    return version === versionId || Boolean(version && isDescendantVersion(versionId, version, versions));
  });
  const selectedIds = new Set(selectedArtifacts.map((artifact) => artifact.id));
  const selectedRelations = relations.filter((relation) => selectedIds.has(relation.from) && selectedIds.has(relation.to));

  return { artifacts: selectedArtifacts, relations: selectedRelations };
}

function selectArtifacts(profile: ExportProfile, artifacts: ParsedArtifact[]): ParsedArtifact[] {
  const included = new Set(profile.includeArtifactTypes || []);
  const excluded = new Set(profile.excludeArtifactTypes || []);

  return artifacts.filter((artifact) => {
    if (excluded.has(String(artifact.type))) return false;
    if (included.size === 0) return true;
    return included.has(String(artifact.type));
  });
}

function selectRelations(profile: ExportProfile, relations: ParsedRelation[], artifacts: ParsedArtifact[]): ParsedRelation[] {
  const artifactIds = new Set(artifacts.map((artifact) => artifact.id));
  const includedRelations = new Set(profile.includeRelations || []);

  return relations.filter((relation) => {
    if (!artifactIds.has(relation.from) || !artifactIds.has(relation.to)) return false;
    if (includedRelations.size === 0) return true;
    return includedRelations.has(String(relation.type));
  });
}

function freezeRelation(relation: ParsedRelation): FrozenRelation {
  return {
    id: relation.id,
    type: relation.type,
    from: relation.from,
    to: relation.to,
    category: relation.category,
    strength: relation.strength,
  };
}

function freezeArtifact(artifact: ParsedArtifact, relations: ParsedRelation[], includeSourceMetadata: boolean): FrozenArtifact {
  const outgoing = sortRelations(relations.filter((relation) => relation.from === artifact.id)).map(freezeRelation);
  const incoming = sortRelations(relations.filter((relation) => relation.to === artifact.id)).map(freezeRelation);

  const metadata = { ...((artifact.raw || {}) as Record<string, unknown>) };
  delete metadata.relations;

  return {
    id: artifact.id,
    type: artifact.type,
    title: artifact.title || artifact.id,
    status: artifact.status,
    layer: artifact.layer,
    ownership: artifact.ownership,
    description: artifact.description,
    markdownBody: artifact.markdownBody,
    metadata,
    source: includeSourceMetadata ? displayFile(artifact.file) : undefined,
    relations: { outgoing, incoming },
  };
}

export function createFrozenDocument(
  profile: ExportProfile,
  artifacts: ParsedArtifact[],
  relations: ParsedRelation[],
  generatedAt = new Date().toISOString(),
  version?: string
): FrozenDocument {
  const selectedArtifacts = sortArtifacts(profile, selectArtifacts(profile, artifacts));
  const selectedRelations = sortRelations(selectRelations(profile, relations, selectedArtifacts));
  const includeSourceMetadata = profile.rendering?.includeSourceMetadata === true;
  const usedArtifactIds = new Set<string>();

  const sections = profile.sections.map((section) => {
    const types = new Set(section.artifactTypes || []);
    const sectionArtifacts = selectedArtifacts
      .filter((artifact) => !usedArtifactIds.has(artifact.id))
      .filter((artifact) => types.size === 0 || types.has(String(artifact.type)));

    for (const artifact of sectionArtifacts) usedArtifactIds.add(artifact.id);

    return {
      id: section.id,
      title: section.title,
      artifactTypes: section.artifactTypes || [],
      artifacts: sectionArtifacts.map((artifact) => freezeArtifact(artifact, selectedRelations, includeSourceMetadata)),
    };
  });

  const includedArtifactCount = sections.reduce((total, section) => total + section.artifacts.length, 0);

  return {
    id: `FREEZE-${profile.id.toUpperCase()}`,
    profile: {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      ordering: profile.ordering,
      rendering: profile.rendering,
      template: profile.template,
      branding: profile.branding,
      document: profile.document,
      executiveSummary: profile.executiveSummary,
      footer: profile.footer,
    },
    generatedAt,
    formatVersion: 'openlag.freeze.v1',
    version,
    summary: {
      artifactCount: includedArtifactCount,
      relationCount: selectedRelations.length,
      sectionCount: sections.length,
    },
    sections,
  };
}

function renderRelationTables(artifact: FrozenArtifact): string[] {
  const lines: string[] = [];
  if (artifact.relations.outgoing.length > 0) {
    lines.push('| Direction | Relation | Artifact |', '| --- | --- | --- |');
    for (const relation of artifact.relations.outgoing) {
      lines.push(`| outgoing | \`${relation.type}\` | \`${relation.to}\` |`);
    }
  }
  if (artifact.relations.incoming.length > 0) {
    if (lines.length === 0) lines.push('| Direction | Relation | Artifact |', '| --- | --- | --- |');
    for (const relation of artifact.relations.incoming) {
      lines.push(`| incoming | \`${relation.type}\` | \`${relation.from}\` |`);
    }
  }
  if (lines.length > 0) lines.push('');
  return lines;
}

export function renderMarkdownFreeze(document: FrozenDocument): string {
  const includeToc = document.profile.rendering?.includeTableOfContents !== false;
  const includeRelationTables = document.profile.rendering?.includeRelationTables !== false;
  const lines = [
    '---',
    `id: ${document.id}`,
    'type: DOCUMENTATION_FREEZE',
    `profile: ${document.profile.id}`,
    ...(document.version ? [`version: ${document.version}`] : []),
    'format: markdown',
    'status: GENERATED',
    '---',
    '',
    `# ${document.profile.name}`,
    '',
  ];

  if (document.profile.description) lines.push(document.profile.description, '');

  lines.push('> Generated by `openlag freeze` from the local OpenLAG frozen document model.', '');
  lines.push(`Artifacts: ${document.summary.artifactCount} | Relations: ${document.summary.relationCount}`, '');

  if (includeToc) {
    lines.push('## Table of Contents', '');
    for (const section of document.sections) lines.push(`- [${section.title}](#${slug(section.title)})`);
    lines.push('');
  }

  for (const section of document.sections) {
    lines.push(`## ${section.title}`, '');
    if (section.artifacts.length === 0) {
      lines.push('_No artifacts matched this section._', '');
      continue;
    }

    for (const artifact of section.artifacts) {
      lines.push(`### ${artifact.title}`, '');
      lines.push(`- ID: \`${artifact.id}\``);
      lines.push(`- Type: \`${artifact.type}\``);
      if (artifact.status) lines.push(`- Status: \`${artifact.status}\``);
      if (artifact.layer) lines.push(`- Layer: \`${artifact.layer}\``);
      if (artifact.ownership?.owner) lines.push(`- Owner: \`${artifact.ownership.owner}\``);
      if (artifact.ownership?.team) lines.push(`- Team: \`${artifact.ownership.team}\``);
      if (artifact.source) lines.push(`- Source: \`${artifact.source}\``);
      lines.push('', artifact.description || '_No description._', '');
      if (artifact.markdownBody && artifact.markdownBody !== artifact.description) {
        lines.push('#### Body', '', artifact.markdownBody, '');
      }
      if (includeRelationTables) lines.push(...renderRelationTables(artifact));
    }
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

export function renderJsonFreeze(document: FrozenDocument): string {
  return `${JSON.stringify(document, null, 2)}\n`;
}

function normalizeTemplatePath(projectRoot: string, template?: ExportProfile['template']): string {
  const defaultTemplate = path.join(projectRoot, 'templates', 'freeze', 'freeze-template.html');
  const templatePath = template?.path || (template?.id ? `templates/freeze/${template.id}.html` : undefined);
  if (!templatePath) return defaultTemplate;
  return path.isAbsolute(templatePath) ? templatePath : path.join(projectRoot, templatePath);
}

function loadDocumentaryTemplate(projectRoot: string, profile: ExportProfile | FrozenDocument['profile']): string {
  const templatePath = normalizeTemplatePath(projectRoot, profile.template);
  if (fs.existsSync(templatePath)) return fs.readFileSync(templatePath, 'utf-8');

  if (profile.template?.path) {
    throw new Error(`Freeze template not found: ${templatePath}`);
  }

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<title>OpenLAG Freeze</title>',
    '<style>body{margin:0;background:#eef3f8;color:#182230;font-family:Arial,sans-serif}.app-shell{max-width:1180px;margin:0 auto;padding:28px}.document{background:#fff;border-radius:20px;overflow:hidden}.cover{padding:48px;background:#0f172a;color:white}.content{padding:38px}.artifact-card{border:1px solid #d9e2ec;border-radius:16px;margin:18px 0;overflow:hidden}.artifact-head,.artifact-body{padding:18px}.metadata-grid,.relations{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.badge{display:inline-block;border-radius:999px;padding:4px 8px;background:#eef2f7;margin-right:6px}.footer{padding:20px 38px;background:#f8fafc}</style>',
    '</head>',
    '<body><div class="app-shell"><main class="document"><div class="content"></div></main></div></body>',
    '</html>',
  ].join('\n');
}

function resolveNodeModuleVendor(projectRoot: string, segments: string[]): string | undefined {
  const candidates = [
    path.join(projectRoot, 'node_modules', ...segments),
    path.join(process.cwd(), 'node_modules', ...segments),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function readClassicVendorBundle(projectRoot: string, label: string, segments: string[]): string {
  const vendorPath = resolveNodeModuleVendor(projectRoot, segments);
  if (!vendorPath) {
    throw new Error(`Missing ${label} browser bundle. Run npm install before exporting offline freeze HTML/PDF.`);
  }

  const bundle = fs.readFileSync(vendorPath, 'utf-8').trim();
  if (/^\s*(import|export)\s/m.test(bundle)) {
    throw new Error(`${label} bundle must be a classic browser script, not ESM: ${vendorPath}`);
  }

  return [
    `/* OpenLAG inline vendor: ${label}`,
    ` * Source: ${path.relative(projectRoot, vendorPath).replace(/\\/g, '/')}`,
    ' * Injected in memory during freeze export.',
    ' */',
    bundle.replace(/<\/script/gi, '<\\/script'),
  ].join('\n');
}

export function inlineOfflineTemplateVendors(template: string, projectRoot: string): string {
  if (!template.includes('__OPENLAG_INLINE_MARKED_BUNDLE__') && !template.includes('__OPENLAG_INLINE_MERMAID_BUNDLE__')) {
    return template;
  }

  return template
    .replace(
      '/* __OPENLAG_INLINE_MARKED_BUNDLE__ */',
      () => readClassicVendorBundle(projectRoot, 'marked', ['marked', 'lib', 'marked.umd.js'])
    )
    .replace(
      '/* __OPENLAG_INLINE_MERMAID_BUNDLE__ */',
      () => readClassicVendorBundle(projectRoot, 'mermaid', ['mermaid', 'dist', 'mermaid.min.js'])
    );
}

function extractTemplateStyle(template: string): string {
  return template.match(/<style[^>]*>[\s\S]*?<\/style>/i)?.[0] || '';
}

function extractTemplateScripts(template: string): string {
  return (template.match(/<script\b(?![^>]*\btype=["']module["'])[\s\S]*?<\/script>/gi) || []).join('\n');
}

function resolveLogoDataUri(projectRoot: string, logoPath?: string): string | undefined {
  const logo = logoPath || 'OpenLAG-logo-t.png';
  const resolved = path.isAbsolute(logo) ? logo : path.join(projectRoot, logo);
  if (!fs.existsSync(resolved)) return undefined;
  const ext = path.extname(resolved).toLowerCase();
  const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(resolved).toString('base64')}`;
}

function markdownToHtml(markdown?: string): string {
  if (!markdown?.trim()) return '<p><em>No body content.</em></p>';

  const lines = markdown.trim().split(/\r?\n/);
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  const codeLines: string[] = [];

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
        codeLines.length = 0;
        inCode = false;
      } else {
        closeList();
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      closeList();
      continue;
    }
    if (trimmed.startsWith('### ')) {
      closeList();
      html.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }
    if (trimmed.startsWith('## ')) {
      closeList();
      html.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith('# ')) {
      closeList();
      html.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      continue;
    }
    if (trimmed.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
      continue;
    }
    closeList();
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }
  closeList();
  if (inCode) html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);

  return html.join('\n');
}

function relationTargetLabel(relation: FrozenRelation, direction: 'outgoing' | 'incoming'): string {
  return direction === 'outgoing' ? relation.to : relation.from;
}

function relationArrow(direction: 'outgoing' | 'incoming'): string {
  return direction === 'outgoing' ? '→' : '←';
}

function renderRelationList(relations: FrozenRelation[], direction: 'outgoing' | 'incoming', anchors: Set<string>): string {
  if (relations.length === 0) return '<li><span>No relations</span></li>';
  return relations.map((relation) => {
    const target = relationTargetLabel(relation, direction);
    const targetHtml = anchors.has(target)
      ? `<a href="#artifact-${escapeAttribute(slug(target))}">${escapeHtml(target)}</a>`
      : escapeHtml(target);
    return `<li><span><strong>${escapeHtml(relation.type)}</strong> ${relationArrow(direction)} ${targetHtml}</span></li>`;
  }).join('\n');
}

function renderArtifactCard(artifact: FrozenArtifact, anchors: Set<string>, document: FrozenDocument): string {
  const includeTechnicalMetadata = document.profile.rendering?.includeTechnicalMetadata === true;
  const includeRelations = document.profile.rendering?.includeRelationTables !== false;
  const owner = artifact.ownership?.owner || 'Unassigned';
  const team = artifact.ownership?.team || 'Unassigned';
  const statusClass = artifact.status ? slug(artifact.status) : '';

  return [
    `<article class="artifact-card" id="artifact-${escapeAttribute(slug(artifact.id))}">`,
    '<div class="artifact-head">',
    '<h3 class="artifact-title">',
    `<span>${escapeHtml(artifact.title)}</span>`,
    `<span class="artifact-id">${escapeHtml(artifact.id)}</span>`,
    '</h3>',
    '<div class="badges">',
    `<span class="badge type">${escapeHtml(artifact.type)}</span>`,
    artifact.status ? `<span class="badge status ${escapeAttribute(statusClass)}">${escapeHtml(artifact.status)}</span>` : '',
    artifact.layer ? `<span class="badge layer">${escapeHtml(artifact.layer)}</span>` : '',
    '</div>',
    '</div>',
    '<div class="artifact-body">',
    '<div class="metadata-grid">',
    `<div class="metadata-item"><span>Owner</span><strong>${escapeHtml(owner)}</strong></div>`,
    `<div class="metadata-item"><span>Team</span><strong>${escapeHtml(team)}</strong></div>`,
    artifact.source ? `<div class="metadata-item"><span>Source</span><strong>${escapeHtml(artifact.source)}</strong></div>` : '',
    '</div>',
    artifact.description ? `<p>${escapeHtml(artifact.description)}</p>` : '',
    `<div class="markdown" data-openlag-markdown-body>${escapeHtml(artifact.markdownBody?.trim() || 'No body content.')}</div>`,
    `<noscript><div class="markdown">${markdownToHtml(artifact.markdownBody)}</div></noscript>`,
    includeRelations ? [
      '<div class="relations">',
      '<div class="relation-box">',
      '<h4>Outgoing relations</h4>',
      `<ul class="relation-list">${renderRelationList(artifact.relations.outgoing, 'outgoing', anchors)}</ul>`,
      '</div>',
      '<div class="relation-box">',
      '<h4>Incoming relations</h4>',
      `<ul class="relation-list">${renderRelationList(artifact.relations.incoming, 'incoming', anchors)}</ul>`,
      '</div>',
      '</div>',
    ].join('\n') : '',
    includeTechnicalMetadata ? [
      '<details>',
      '<summary>Technical metadata</summary>',
      `<pre class="json-block">${escapeHtml(JSON.stringify(artifact.metadata, null, 2))}</pre>`,
      '</details>',
    ].join('\n') : '',
    '</div>',
    '</article>',
  ].filter(Boolean).join('\n');
}

function renderSection(section: FrozenSection, index: number, anchors: Set<string>, document: FrozenDocument): string {
  const artifacts = section.artifacts.length > 0
    ? section.artifacts.map((artifact) => renderArtifactCard(artifact, anchors, document)).join('\n')
    : '<div class="panel"><p>No artifacts matched this section.</p></div>';

  return [
    `<section id="section-${escapeAttribute(slug(section.id))}" class="section">`,
    '<div class="section-header">',
    '<div>',
    `<p class="section-kicker">${String(index + 3).padStart(2, '0')} · Section</p>`,
    `<h2>${escapeHtml(section.title)}</h2>`,
    '</div>',
    `<span class="section-count">${section.artifacts.length} artifacts</span>`,
    '</div>',
    artifacts,
    '</section>',
  ].join('\n');
}

function renderToc(document: FrozenDocument): string {
  return [
    '<ul class="toc">',
    ...document.sections.map((section, index) => (
      `<li><a href="#section-${escapeAttribute(slug(section.id))}"><span class="toc-number">${String(index + 1).padStart(2, '0')}</span> ${escapeHtml(section.title)}</a></li>`
    )),
    '</ul>',
  ].join('\n');
}

function renderSidebar(document: FrozenDocument, logoDataUri?: string): string {
  const brand = document.profile.branding || {};
  return [
    '<aside class="sidebar">',
    '<div class="brand">',
    logoDataUri ? `<img class="brand-logo" src="${logoDataUri}" alt="OpenLAG logo" />` : '',
    '<div>',
    `<p class="brand-title">${escapeHtml(brand.productName || 'OpenLAG')}</p>`,
    `<p class="brand-subtitle">${escapeHtml(brand.subtitle || 'Documentation Freeze')}</p>`,
    '</div>',
    '</div>',
    '<p class="nav-title">Document</p>',
    document.profile.rendering?.includeCover === false ? '' : '<a class="nav-link" href="#cover">Cover</a>',
    document.profile.rendering?.includeExecutiveSummary === false ? '' : '<a class="nav-link" href="#executive-summary">Executive Summary</a>',
    document.profile.rendering?.includeTableOfContents === false ? '' : '<a class="nav-link" href="#toc">Table of Contents</a>',
    '<p class="nav-title">Sections</p>',
    ...document.sections.map((section) => `<a class="nav-link" href="#section-${escapeAttribute(slug(section.id))}">${escapeHtml(section.title)}</a>`),
    '</aside>',
  ].filter(Boolean).join('\n');
}

export function renderDocumentaryHtml(document: FrozenDocument, projectRoot: string): string {
  const template = inlineOfflineTemplateVendors(loadDocumentaryTemplate(projectRoot, document.profile), projectRoot);
  const style = extractTemplateStyle(template);
  const scripts = extractTemplateScripts(template);
  const branding = document.profile.branding || {};
  const doc = document.profile.document || {};
  const executiveSummary = document.profile.executiveSummary || {};
  const footer = document.profile.footer || {};
  const rendering = document.profile.rendering || {};
  const logoDataUri = resolveLogoDataUri(projectRoot, branding.logo);
  const language = doc.language || 'en';
  const title = doc.title || document.profile.name;
  const anchors = new Set(document.sections.flatMap((section) => section.artifacts.map((artifact) => artifact.id)));

  const cover = rendering.includeCover === false ? '' : [
    '<header id="cover" class="cover">',
    '<div class="cover-content">',
    logoDataUri ? `<img class="cover-logo" src="${logoDataUri}" alt="OpenLAG logo" />` : '',
    `<span class="eyebrow">${escapeHtml(doc.eyebrow || 'Generated Architecture Snapshot')}</span>`,
    `<h1>${escapeHtml(title)}</h1>`,
    `<p class="cover-description">${escapeHtml(doc.description || document.profile.description || 'Deterministic architecture documentation generated from the current OpenLAG graph.')}</p>`,
    '<div class="cover-grid">',
    `<div class="cover-stat"><strong>${document.summary.artifactCount}</strong><span>Artifacts</span></div>`,
    `<div class="cover-stat"><strong>${document.summary.relationCount}</strong><span>Relations</span></div>`,
    `<div class="cover-stat"><strong>${document.summary.sectionCount}</strong><span>Sections</span></div>`,
    `<div class="cover-stat"><strong>${escapeHtml(document.profile.id)}</strong><span>Profile</span></div>`,
    '</div>',
    '</div>',
    '</header>',
  ].join('\n');

  const summary = rendering.includeExecutiveSummary === false ? '' : [
    '<section id="executive-summary" class="section">',
    '<div class="section-header">',
    '<div>',
    '<p class="section-kicker">01 · Overview</p>',
    `<h2>${escapeHtml(executiveSummary.title || 'Executive Summary')}</h2>`,
    '</div>',
    `<span class="section-count">${escapeHtml(branding.subtitle || 'Documentation Freeze')}</span>`,
    '</div>',
    '<div class="summary-grid">',
    '<div class="panel">',
    `<h3>${escapeHtml(executiveSummary.purposeTitle || 'Document purpose')}</h3>`,
    `<p>${escapeHtml(executiveSummary.purpose || document.profile.description || 'This document provides a stable, reviewable snapshot of the architecture knowledge captured by OpenLAG.')}</p>`,
    `<h3>${escapeHtml(executiveSummary.scopeTitle || 'Scope')}</h3>`,
    `<p>${escapeHtml(executiveSummary.scope || 'The content is selected by the active export profile.')}</p>`,
    '</div>',
    '<div class="panel">',
    `<h3>${escapeHtml(executiveSummary.audienceTitle || 'Intended audience')}</h3>`,
    `<p>${escapeHtml(executiveSummary.audience || 'Architecture, governance and engineering teams.')}</p>`,
    '</div>',
    '</div>',
    '</section>',
  ].join('\n');

  const toc = rendering.includeTableOfContents === false ? '' : [
    '<section id="toc" class="section">',
    '<div class="section-header">',
    '<div>',
    '<p class="section-kicker">02 · Navigation</p>',
    '<h2>Table of Contents</h2>',
    '</div>',
    `<span class="section-count">${document.summary.sectionCount} sections</span>`,
    '</div>',
    renderToc(document),
    '</section>',
  ].join('\n');

  const sections = document.sections.map((section, index) => renderSection(section, index, anchors, document)).join('\n');
  const footerHtml = rendering.includeFooter === false ? '' : [
    '<footer class="footer">',
    `<span>${escapeHtml(footer.left || 'Generated by OpenLAG freeze')}</span>`,
    `<span>${escapeHtml(footer.right || `Document template ${document.profile.template?.id || 'professional-document-v1'}`)}</span>`,
    '</footer>',
  ].join('\n');

  const html = [
    '<!doctype html>',
    `<html lang="${escapeAttribute(language)}">`,
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${escapeHtml(title)}</title>`,
    style,
    scripts,
    '</head>',
    '<body>',
    '<div class="app-shell">',
    renderSidebar(document, logoDataUri),
    '<main class="document">',
    cover,
    '<div class="content">',
    summary,
    toc,
    sections,
    '</div>',
    footerHtml,
    '</main>',
    '</div>',
    '</body>',
    '</html>',
    '',
  ].join('\n');

  return html.replace(/\sdata-template="[^"]*"/g, '');
}

export interface FreezeTemplateValidationResult {
  valid: boolean;
  issues: string[];
}

export function validateFreezeTemplateSource(template: string): FreezeTemplateValidationResult {
  const issues: string[] = [];
  for (const placeholder of REQUIRED_TEMPLATE_PLACEHOLDERS) {
    if (!template.includes(`data-template="${placeholder}"`)) issues.push(`Missing placeholder: ${placeholder}`);
  }
  for (const placeholder of REQUIRED_TEMPLATE_ASSET_PLACEHOLDERS) {
    if (!template.includes(`data-template-src="${placeholder}"`)) issues.push(`Missing asset placeholder: ${placeholder}`);
  }
  for (const slot of REQUIRED_TEMPLATE_SLOTS) {
    if (!template.includes(`data-slot="${slot}"`)) issues.push(`Missing slot: ${slot}`);
  }
  if (!/<!doctype html>/i.test(template) || !/<html\b/i.test(template) || !/<head\b/i.test(template) || !/<body\b/i.test(template)) {
    issues.push('Template must contain doctype, html, head, and body structure.');
  }
  if (!/<meta[^>]+charset=["']?utf-8/i.test(template)) issues.push('Template must declare UTF-8 charset.');
  if (/https?:\/\//i.test(template) || /\b(cdn|unpkg|jsdelivr)\b/i.test(template)) issues.push('Template must not contain internet/CDN dependencies.');
  if (/OpenLAG inline vendor|marked v\d|__esbuild_esm_mermaid|mermaid\.version/i.test(template)) issues.push('Source template must not contain embedded vendor bundles.');
  if (!/@media\s+print/i.test(template)) issues.push('Template must define print CSS.');
  if (!/break-inside\s*:\s*avoid/i.test(template)) issues.push('Template must avoid card breaks in print.');
  if (!/page-break-inside\s*:\s*avoid/i.test(template)) issues.push('Template must avoid legacy page breaks in print.');
  if (/fake artifact|demo artifact|template title|template purpose/i.test(template)) issues.push('Template must not contain fake demo artifacts.');
  return { valid: issues.length === 0, issues };
}

function getContextValue(context: FreezeTemplateContext, pathExpression: string): string {
  const value = pathExpression.split('.').reduce<unknown>((current, key) => (
    current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined
  ), context);
  return value === undefined || value === null ? '' : String(value);
}

export function buildFreezeTemplateContext(document: FrozenDocument, projectRoot: string): FreezeTemplateContext {
  const branding = document.profile.branding || {};
  const doc = document.profile.document || {};
  const executiveSummary = document.profile.executiveSummary || {};
  const footer = document.profile.footer || {};
  return {
    branding: {
      logo: resolveLogoDataUri(projectRoot, branding.logo),
      productName: branding.productName || 'OpenLAG',
      subtitle: branding.subtitle || 'Documentation Freeze',
    },
    document: {
      language: doc.language || 'en',
      title: doc.title || document.profile.name,
      generatedAt: document.generatedAt,
      formatVersion: document.formatVersion,
    },
    cover: {
      eyebrow: doc.eyebrow || 'Generated Architecture Snapshot',
      title: doc.title || document.profile.name,
      description: doc.description || document.profile.description || 'Deterministic architecture documentation generated from the current OpenLAG graph.',
    },
    profile: {
      id: document.profile.id,
      name: document.profile.name,
      description: document.profile.description || '',
    },
    summary: document.summary,
    executiveSummary: {
      title: executiveSummary.title || 'Executive Summary',
      purposeTitle: executiveSummary.purposeTitle || 'Document purpose',
      purpose: executiveSummary.purpose || document.profile.description || 'This document provides a stable, reviewable snapshot of the architecture knowledge captured by OpenLAG.',
      scopeTitle: executiveSummary.scopeTitle || 'Scope',
      scope: executiveSummary.scope || 'The content is selected by the active export profile.',
      audienceTitle: executiveSummary.audienceTitle || 'Intended audience',
      audience: executiveSummary.audience || 'Architecture, governance and engineering teams.',
    },
    rendering: document.profile.rendering || {},
    sections: document.sections,
    footer: {
      left: footer.left || 'Generated by OpenLAG freeze',
      right: footer.right || `Document template ${document.profile.template?.id || 'professional-document-v1'}`,
    },
  };
}

export function renderSidebarNavigation(context: FreezeTemplateContext): string {
  return [
    '<p class="nav-title">Document</p>',
    context.rendering.includeCover === false ? '' : '<a class="nav-link" href="#cover">Cover</a>',
    context.rendering.includeExecutiveSummary === false ? '' : '<a class="nav-link" href="#executive-summary">Executive Summary</a>',
    context.rendering.includeTableOfContents === false ? '' : '<a class="nav-link" href="#toc">Table of Contents</a>',
    '<p class="nav-title">Sections</p>',
    ...context.sections.map((section) => `<a class="nav-link" href="#section-${escapeAttribute(slug(section.id))}">${escapeHtml(section.title)}</a>`),
  ].filter(Boolean).join('\n');
}

export function renderTableOfContents(context: FreezeTemplateContext): string {
  if (context.rendering.includeTableOfContents === false) return '';
  return [
    '<ul class="toc">',
    ...context.sections.map((section, index) => (
      `<li><a href="#section-${escapeAttribute(slug(section.id))}"><span class="toc-number">${String(index + 1).padStart(2, '0')}</span> ${escapeHtml(section.title)}</a></li>`
    )),
    '</ul>',
  ].join('\n');
}

export function renderRelations(context: FreezeTemplateContext): string {
  if (context.rendering.includeRelationTables === false) return '';
  const relations = context.sections.flatMap((section) => section.artifacts.flatMap((artifact) => artifact.relations.outgoing));
  if (relations.length === 0) return '<p class="empty-state">No relations matched this export profile.</p>';
  return [
    '<table class="relation-matrix">',
    '<thead><tr><th>From</th><th>Relation</th><th>To</th></tr></thead>',
    '<tbody>',
    ...relations.map((relation) => `<tr><td>${escapeHtml(relation.from)}</td><td>${escapeHtml(relation.type)}</td><td>${escapeHtml(relation.to)}</td></tr>`),
    '</tbody>',
    '</table>',
  ].join('\n');
}

export function renderTechnicalMetadata(context: FreezeTemplateContext): string {
  if (context.rendering.includeTechnicalMetadata !== true) return '';
  return `<pre class="json-block">${escapeHtml(JSON.stringify({
    profile: context.profile,
    summary: context.summary,
    generatedAt: context.document.generatedAt,
    formatVersion: context.document.formatVersion,
  }, null, 2))}</pre>`;
}

function documentFromContext(context: FreezeTemplateContext): FrozenDocument {
  return {
    id: 'TEMPLATE-CONTEXT',
    generatedAt: context.document.generatedAt,
    formatVersion: 'openlag.freeze.v1',
    profile: {
      id: context.profile.id,
      name: context.profile.name,
      description: context.profile.description,
      rendering: context.rendering,
    },
    summary: context.summary,
    sections: context.sections,
  };
}

export function renderArtifactCards(context: FreezeTemplateContext): string {
  const anchors = new Set(context.sections.flatMap((section) => section.artifacts.map((artifact) => artifact.id)));
  const doc = documentFromContext(context);
  return context.sections.flatMap((section) => section.artifacts).map((artifact) => renderArtifactCard(artifact, anchors, doc)).join('\n');
}

export function renderSections(context: FreezeTemplateContext): string {
  const anchors = new Set(context.sections.flatMap((section) => section.artifacts.map((artifact) => artifact.id)));
  const doc = documentFromContext(context);
  return context.sections.map((section, index) => renderSection(section, index, anchors, doc)).join('\n');
}

function renderExecutiveSummary(context: FreezeTemplateContext): string {
  if (context.rendering.includeExecutiveSummary === false) return '';
  return [
    '<div class="summary-grid">',
    '<div class="panel">',
    `<h3>${escapeHtml(context.executiveSummary.purposeTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.purpose)}</p>`,
    `<h3>${escapeHtml(context.executiveSummary.scopeTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.scope)}</p>`,
    '</div>',
    '<div class="panel">',
    `<h3>${escapeHtml(context.executiveSummary.audienceTitle)}</h3>`,
    `<p>${escapeHtml(context.executiveSummary.audience)}</p>`,
    '</div>',
    '</div>',
  ].join('\n');
}

function replaceElementContent(html: string, attribute: string, values: Record<string, string>): string {
  let rendered = html;
  for (const [name, value] of Object.entries(values)) {
    const pattern = new RegExp(`(<([a-zA-Z][\\w:-]*)\\b[^>]*\\s${attribute}="${name}"[^>]*>)([\\s\\S]*?)(<\\/\\2>)`, 'g');
    rendered = rendered.replace(pattern, (_match, openTag: string, _tag: string, _content: string, closeTag: string) => (
      `${openTag.replace(new RegExp(`\\s${attribute}="${name}"`), '')}${value}${closeTag}`
    ));
  }
  return rendered;
}

function replaceAssetPlaceholders(html: string, context: FreezeTemplateContext): string {
  return html.replace(/<([a-zA-Z][\w:-]*)\b([^>]*?)\sdata-template-src="([^"]+)"([^>]*)>/g, (_match, tag: string, before: string, pathExpression: string, after: string) => {
    const value = getContextValue(context, pathExpression);
    const attributes = `${before}${after}`.replace(/\ssrc="[^"]*"/, '');
    return `<${tag}${attributes} src="${escapeAttribute(value)}">`;
  });
}

function applyTemplateContext(template: string, context: FreezeTemplateContext): string {
  const placeholders = Object.fromEntries(REQUIRED_TEMPLATE_PLACEHOLDERS.map((name) => [name, escapeHtml(getContextValue(context, name))]));
  const slots: Record<string, string> = {
    'openlag.tableOfContents': renderTableOfContents(context),
    'openlag.sidebarNavigation': renderSidebarNavigation(context),
    'openlag.sections': renderSections(context),
    'openlag.artifacts': renderArtifactCards(context),
    'openlag.relations': renderRelations(context),
    'openlag.technicalMetadata': renderTechnicalMetadata(context),
  };
  let html = template.replace(/<html\b([^>]*)>/i, (_match, attributes: string) => (
    `<html${attributes.replace(/\slang="[^"]*"/i, '')} lang="${escapeAttribute(context.document.language)}">`
  ));
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(context.document.title)}</title>`);
  html = replaceAssetPlaceholders(html, context);
  html = replaceElementContent(html, 'data-template', placeholders);
  html = replaceElementContent(html, 'data-slot', slots);
  html = replaceElementContent(html, 'data-openlag-executive-summary', { summary: renderExecutiveSummary(context) });
  if (context.rendering.includeCover === false) html = html.replace(/<header\b[^>]*id="cover"[\s\S]*?<\/header>/i, '');
  if (context.rendering.includeExecutiveSummary === false) html = html.replace(/<section\b[^>]*id="executive-summary"[\s\S]*?<\/section>/i, '');
  if (context.rendering.includeFooter === false) html = html.replace(/<footer\b[\s\S]*?<\/footer>/i, '');
  return html;
}

function renderTemplateDocumentaryHtml(document: FrozenDocument, projectRoot: string): string {
  const sourceTemplate = loadDocumentaryTemplate(projectRoot, document.profile);
  const validation = validateFreezeTemplateSource(sourceTemplate);
  if (!validation.valid) {
    throw new Error(`Invalid freeze template ${document.profile.template?.path || document.profile.template?.id || 'freeze-template'}:\n- ${validation.issues.join('\n- ')}`);
  }
  const context = buildFreezeTemplateContext(document, projectRoot);
  return `${inlineOfflineTemplateVendors(applyTemplateContext(sourceTemplate, context), projectRoot)}\n`;
}

export function renderHtmlFreeze(document: FrozenDocument, projectRoot = process.cwd()): string {
  return renderTemplateDocumentaryHtml(document, projectRoot);
}

function pdfEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function renderPlainPdfFreeze(document: FrozenDocument): Buffer {
  const textLines = renderMarkdownFreeze(document)
    .split('\n')
    .filter((line) => !line.startsWith('---'))
    .map((line) => line.replace(/`/g, ''));

  const pages: string[] = [];
  const linesPerPage = 46;
  for (let index = 0; index < textLines.length; index += linesPerPage) {
    const chunk = textLines.slice(index, index + linesPerPage);
    const commands = ['BT', '/F1 10 Tf', '50 790 Td'];
    chunk.forEach((line, lineIndex) => {
      if (lineIndex > 0) commands.push('0 -16 Td');
      commands.push(`(${pdfEscape(line.slice(0, 110))}) Tj`);
    });
    commands.push('ET');
    pages.push(commands.join('\n'));
  }

  const objects: string[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  const pageObjectNumbers = pages.map((_, index) => 4 + index * 2);
  objects.push(`<< /Type /Pages /Kids [${pageObjectNumbers.map((num) => `${num} 0 R`).join(' ')}] /Count ${pages.length} >>`);
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  pages.forEach((content, index) => {
    const pageNum = pageObjectNumbers[index];
    const contentNum = pageNum + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 3 0 R >> >> /MediaBox [0 0 595 842] /Contents ${contentNum} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(content, 'utf-8')} >>\nstream\n${content}\nendstream`);
  });

  const chunks = ['%PDF-1.4\n'];
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join(''), 'utf-8'));
    chunks.push(`${index + 1} 0 obj\n${object}\nendobj\n`);
  });
  const xrefOffset = Buffer.byteLength(chunks.join(''), 'utf-8');
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i < offsets.length; i += 1) {
    chunks.push(`${String(offsets[i]).padStart(10, '0')} 00000 n \n`);
  }
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return Buffer.from(chunks.join(''), 'utf-8');
}

export function renderPdfFreeze(document: FrozenDocument, projectRoot = process.cwd()): Buffer {
  const html = renderTemplateDocumentaryHtml(document, projectRoot);
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'openlag-freeze-pdf-'));
  const htmlPath = path.join(tempDir, 'freeze.html');
  const pdfPath = path.join(tempDir, 'freeze.pdf');
  fs.writeFileSync(htmlPath, html, 'utf-8');

  try {
    execFileSync(process.execPath, [
      '--import',
      'tsx',
      path.join(projectRoot, 'scripts', 'core', 'render-pdf.ts'),
      htmlPath,
      pdfPath,
    ], {
      cwd: projectRoot,
      stdio: 'pipe',
    });
    return fs.readFileSync(pdfPath);
  } catch {
    return renderPlainPdfFreeze(document);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function renderFreeze(document: FrozenDocument, format: FreezeFormat, projectRoot: string): string | Buffer {
  if (format === 'json') return renderJsonFreeze(document);
  if (format === 'html') return renderHtmlFreeze(document, projectRoot);
  if (format === 'pdf') return renderPdfFreeze(document, projectRoot);
  return renderMarkdownFreeze(document);
}

export function createDocumentationFreeze(options: FreezeOptions): FreezeResult {
  const projectRoot = path.resolve(options.projectRoot);
  const profile = applyTemplateOverride(loadExportProfile(projectRoot, options.profile || 'architecture'), options.template);
  const format = normalizeFormat(options.format, profile.defaultFormat || 'markdown');

  const docsDir = path.join(projectRoot, 'docs');
  loadArtifactContracts(path.join(docsDir, 'contracts', 'artifacts'));
  loadRelationContracts(path.join(docsDir, 'contracts', 'relations'));

  const parsed = parseOpenLagDocs(docsDir);
  const versionedData = filterArtifactsByVersion(parsed.artifacts, parsed.relations, parsed.versions, options.version);
  const document = createFrozenDocument(profile, versionedData.artifacts, versionedData.relations, options.generatedAt, options.version);
  const content = renderFreeze(document, format, projectRoot);
  const markdown = renderMarkdownFreeze(document);
  const outputFile = resolveOutputFile(projectRoot, profile, format, options.output);

  if (!options.dryRun) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, content);
  }

  return {
    profile,
    outputFile,
    content,
    markdown,
    document,
    artifactCount: document.summary.artifactCount,
    relationCount: document.summary.relationCount,
    dryRun: Boolean(options.dryRun),
    format,
  };
}
