import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const artifactsDir = path.join(process.cwd(), 'docs/artifacts');
const outputFile = path.join(process.cwd(), 'src/core/generated/artifact-definitions.ts');
const publicOutputFile = path.join(process.cwd(), 'public/artifact-definitions.json');

const files = fs.existsSync(artifactsDir) ? fs.readdirSync(artifactsDir) : [];
const artifacts: any[] = [];

if (files.filter(file => file.endsWith('.yaml')).length === 0 && fs.existsSync(outputFile)) {
  console.log('No artifact contracts found in docs/artifacts; keeping existing generated artifact definitions.');
  process.exit(0);
}

files.forEach(file => {
  if (file.endsWith('.yaml')) {
    const content = fs.readFileSync(path.join(artifactsDir, file), 'utf-8');
    const parsed = yaml.load(content) as any;
    artifacts.push({
      type: parsed.type,
      extends: parsed.extends,
      layer: parsed.layer,
      description: parsed.description,
      requiredFields: parsed.requiredFields || [],
      impactSeverityDefault: parsed.impactSeverityDefault,
      impact: parsed.impact || {}
    });
  }
});

if (!fs.existsSync(path.dirname(publicOutputFile))) {
    fs.mkdirSync(path.dirname(publicOutputFile), { recursive: true });
}

fs.writeFileSync(publicOutputFile, JSON.stringify(artifacts, null, 2));
console.log('Artifact definitions JSON generated.');

const fileContent = `
// GENERATED FILE - DO NOT EDIT MANUALLY

export interface ArtifactContract {
  type: string;
  extends?: string;
  layer?: string;
  description?: string;
  requiredFields: string[];
  impactSeverityDefault?: string;
  impact?: {
    criticality?: string;
  };
}

export const GENERATED_ARTIFACTS: ArtifactContract[] = ${JSON.stringify(artifacts, null, 2)};
`;

const packageJsonPath = path.join(process.cwd(), 'package.json');
let isOpenLagSourcePackage = false;
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    isOpenLagSourcePackage = packageJson.name === '@donartcha/openlag';
  } catch {
    isOpenLagSourcePackage = false;
  }
}

const shouldWriteGeneratedTs = isOpenLagSourcePackage || fs.existsSync(outputFile);

if (shouldWriteGeneratedTs && !fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
}

if (shouldWriteGeneratedTs) {
  fs.writeFileSync(outputFile, fileContent);
  console.log('Artifact definitions TypeScript generated.');
}
