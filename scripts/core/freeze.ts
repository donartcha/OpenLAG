import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

import { loadArtifactContracts } from './artifact-contracts.js';
import { parseOpenLagDocs, ParsedArtifact, ParsedRelation } from './parser.js';
import { loadRelationContracts } from './relation-contracts.js';

export interface ExportProfileSection {
  id: string;
  title: string;
  artifactTypes?: string[];
}

export interface ExportProfile {
  id: string;
  name: string;
  description?: string;
  defaultFormat?: string;
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
  markdown: string;
  artifactCount: number;
  relationCount: number;
  dryRun: boolean;
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

export function loadExportProfile(projectRoot: string, profileId = 'architecture'): ExportProfile {
  const profilePath = path.join(projectRoot, 'docs', 'export-profiles', `${profileId}.yaml`);

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
    defaultFormat: parsed.defaultFormat ? String(parsed.defaultFormat) : 'markdown',
    includeArtifactTypes: ensureArray(parsed.includeArtifactTypes),
    excludeArtifactTypes: ensureArray(parsed.excludeArtifactTypes),
    includeRelations: ensureArray(parsed.includeRelations),
    sections,
    ordering: parsed.ordering,
    rendering: parsed.rendering,
  };
}

function resolveOutputFile(projectRoot: string, profile: ExportProfile, output?: string): string {
  const defaultDir = path.join(projectRoot, 'dist', 'openlag', 'exports', profile.id);
  if (!output) return path.join(defaultDir, `openlag-${profile.id}.md`);

  const resolved = path.isAbsolute(output) ? output : path.join(projectRoot, output);
  return path.extname(resolved).toLowerCase() === '.md'
    ? resolved
    : path.join(resolved, `openlag-${profile.id}.md`);
}

function artifactSortKey(artifact: ParsedArtifact): string {
  return [
    artifact.type || '',
    artifact.title || '',
    artifact.id || '',
    artifact.file || '',
  ].join('\u0000').toLowerCase();
}

function sortArtifacts(artifacts: ParsedArtifact[]): ParsedArtifact[] {
  return [...artifacts].sort((a, b) => artifactSortKey(a).localeCompare(artifactSortKey(b)));
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

function displayFile(filePath: string): string {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/');
}

function renderArtifact(artifact: ParsedArtifact, relations: ParsedRelation[], includeSourceMetadata: boolean): string {
  const lines = [
    `### ${artifact.title || artifact.id}`,
    '',
    `- ID: \`${artifact.id}\``,
    `- Type: \`${artifact.type}\``,
  ];

  if (artifact.status) lines.push(`- Status: \`${artifact.status}\``);
  if (artifact.version) lines.push(`- Version: \`${artifact.version}\``);
  if (artifact.layer) lines.push(`- Layer: \`${artifact.layer}\``);
  if (artifact.ownership?.owner) lines.push(`- Owner: \`${artifact.ownership.owner}\``);
  if (artifact.ownership?.team) lines.push(`- Team: \`${artifact.ownership.team}\``);
  if (includeSourceMetadata) lines.push(`- Source: \`${displayFile(artifact.file)}\``);

  lines.push('', artifact.description || '_No description._', '');

  const outgoing = relations.filter((relation) => relation.from === artifact.id);
  if (outgoing.length > 0) {
    lines.push('| Relation | Target |', '| --- | --- |');
    for (const relation of sortRelations(outgoing)) {
      lines.push(`| \`${relation.type}\` | \`${relation.to}\` |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function renderMarkdownFreeze(profile: ExportProfile, artifacts: ParsedArtifact[], relations: ParsedRelation[]): string {
  const includeToc = profile.rendering?.includeTableOfContents !== false;
  const includeRelationTables = profile.rendering?.includeRelationTables !== false;
  const includeSourceMetadata = profile.rendering?.includeSourceMetadata === true;

  const lines = [
    '---',
    `id: FREEZE-${profile.id.toUpperCase()}`,
    'type: DOCUMENTATION_FREEZE',
    `profile: ${profile.id}`,
    'format: markdown',
    'status: GENERATED',
    '---',
    '',
    `# ${profile.name}`,
    '',
  ];

  if (profile.description) {
    lines.push(profile.description, '');
  }

  lines.push('> Generated by `openlag freeze` from the local OpenLAG graph model.', '');

  if (includeToc) {
    lines.push('## Table of Contents', '');
    for (const section of profile.sections) {
      lines.push(`- [${section.title}](#${slug(section.title)})`);
    }
    lines.push('');
  }

  for (const section of profile.sections) {
    const types = new Set(section.artifactTypes || []);
    const sectionArtifacts = sortArtifacts(
      artifacts.filter((artifact) => types.size === 0 || types.has(String(artifact.type)))
    );

    lines.push(`## ${section.title}`, '');

    if (sectionArtifacts.length === 0) {
      lines.push('_No artifacts matched this section._', '');
      continue;
    }

    for (const artifact of sectionArtifacts) {
      lines.push(renderArtifact(artifact, includeRelationTables ? relations : [], includeSourceMetadata));
    }
  }

  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

export function createDocumentationFreeze(options: FreezeOptions): FreezeResult {
  const projectRoot = path.resolve(options.projectRoot);
  const profile = loadExportProfile(projectRoot, options.profile || 'architecture');
  const format = options.format || profile.defaultFormat || 'markdown';

  if (format !== 'markdown') {
    throw new Error(`Unsupported freeze format "${format}". P1 implements markdown only; PDF belongs to P2.`);
  }

  const docsDir = path.join(projectRoot, 'docs');
  loadArtifactContracts(path.join(docsDir, 'artifacts'));
  loadRelationContracts(path.join(docsDir, 'relations'));

  const parsed = parseOpenLagDocs(docsDir);
  const artifacts = selectArtifacts(profile, parsed.artifacts);
  const relations = selectRelations(profile, parsed.relations, artifacts);
  const markdown = renderMarkdownFreeze(profile, sortArtifacts(artifacts), sortRelations(relations));
  const outputFile = resolveOutputFile(projectRoot, profile, options.output);

  if (!options.dryRun) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, markdown, 'utf-8');
  }

  return {
    profile,
    outputFile,
    markdown,
    artifactCount: artifacts.length,
    relationCount: relations.length,
    dryRun: Boolean(options.dryRun),
  };
}
