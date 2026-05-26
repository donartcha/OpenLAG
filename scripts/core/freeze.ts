import fs from 'fs';
import path from 'path';
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
  rendering?: {
    includeTableOfContents?: boolean;
    includeRelationTables?: boolean;
    includeSourceMetadata?: boolean;
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
  };
  generatedAt: string;
  formatVersion: 'openlag.freeze.v1';
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
  output?: string;
  dryRun?: boolean;
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
  const defaultDir = path.join(projectRoot, 'dist', 'openlag', 'exports', profile.id);
  if (!output) return path.join(defaultDir, `openlag-${profile.id}${ext}`);

  const resolved = path.isAbsolute(output) ? output : path.join(projectRoot, output);
  return path.extname(resolved) ? resolved : path.join(resolved, `openlag-${profile.id}${ext}`);
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

export function createFrozenDocument(profile: ExportProfile, artifacts: ParsedArtifact[], relations: ParsedRelation[]): FrozenDocument {
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
    },
    generatedAt: '1970-01-01T00:00:00.000Z',
    formatVersion: 'openlag.freeze.v1',
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

export function renderHtmlFreeze(document: FrozenDocument): string {
  const markdown = renderMarkdownFreeze(document);
  const body = markdown
    .split('\n')
    .map((line) => {
      if (line.startsWith('# ')) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith('## ')) return `<h2 id="${slug(line.slice(3))}">${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith('### ')) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith('#### ')) return `<h4>${escapeHtml(line.slice(5))}</h4>`;
      if (line.startsWith('- ')) return `<p class="item">${escapeHtml(line)}</p>`;
      if (line.startsWith('|')) return `<pre class="table">${escapeHtml(line)}</pre>`;
      if (line.trim() === '') return '';
      return `<p>${escapeHtml(line)}</p>`;
    })
    .join('\n');

  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${escapeHtml(document.profile.name)}</title>`,
    '<style>body{font-family:Arial,sans-serif;line-height:1.55;margin:40px;max-width:980px;color:#202124}code{background:#f1f3f4;padding:2px 4px;border-radius:3px}.item{margin:.25rem 0}.table{background:#f8f9fa;padding:4px 8px;margin:0;white-space:pre-wrap}</style>',
    '</head>',
    '<body>',
    body,
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

function pdfEscape(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

export function renderPdfFreeze(document: FrozenDocument): Buffer {
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

function renderFreeze(document: FrozenDocument, format: FreezeFormat): string | Buffer {
  if (format === 'json') return renderJsonFreeze(document);
  if (format === 'html') return renderHtmlFreeze(document);
  if (format === 'pdf') return renderPdfFreeze(document);
  return renderMarkdownFreeze(document);
}

export function createDocumentationFreeze(options: FreezeOptions): FreezeResult {
  const projectRoot = path.resolve(options.projectRoot);
  const profile = loadExportProfile(projectRoot, options.profile || 'architecture');
  const format = normalizeFormat(options.format, profile.defaultFormat || 'markdown');

  const docsDir = path.join(projectRoot, 'docs');
  loadArtifactContracts(path.join(docsDir, 'contracts', 'artifacts'));
  loadRelationContracts(path.join(docsDir, 'contracts', 'relations'));

  const parsed = parseOpenLagDocs(docsDir);
  const document = createFrozenDocument(profile, parsed.artifacts, parsed.relations);
  const content = renderFreeze(document, format);
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
