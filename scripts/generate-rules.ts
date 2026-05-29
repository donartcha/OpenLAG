import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const rulesDir = path.join(process.cwd(), 'docs/contracts/rules');
const outputFile = path.join(process.cwd(), 'src/core/generated/rule-definitions.ts');
const publicOutputFile = path.join(process.cwd(), 'public/rule-definitions.json');

let files: string[] = [];
if (fs.existsSync(rulesDir)) {
  files = fs.readdirSync(rulesDir);
}

const rules: any[] = [];

if (files.filter(file => file.endsWith('.yaml')).length === 0 && fs.existsSync(outputFile)) {
  console.log('No rule contracts found in docs/contracts/rules; keeping existing generated rule definitions.');
  process.exit(0);
}

for (const file of files) {
  if (file.endsWith('.yaml')) {
    const filePath = path.join(rulesDir, file);
    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const data = yaml.load(fileContents) as any;
      if (data && data.id) {
        rules.push(data);
      } else {
        console.warn(`Warning: Rule ${file} is missing 'id' attribute.`);
      }
    } catch (e) {
      console.error(`Error reading ${file}:`, e);
    }
  }
}

if (!fs.existsSync(path.dirname(publicOutputFile))) {
    fs.mkdirSync(path.dirname(publicOutputFile), { recursive: true });
}

const fileContent = `// AUTO-GENERATED FILE. DO NOT EDIT.
// Run 'npm run generate-rules' to update this file based on docs/contracts/rules/*.yaml

export interface RuleContract {
  id: string;
  description: string;
  severity: "error" | "warn" | "warning" | "info";
  matchNode?: {
    type?: string | string[];
    layer?: string | string[];
  };
  conditions?: {
    requiredRelations?: {
      type: string;
      direction?: "outgoing" | "incoming" | "both";
      toType?: string | string[];
      toLayer?: string | string[];
      message?: string;
    }[];
    forbiddenRelations?: {
      type: string;
      direction?: "outgoing" | "incoming" | "both";
      toType?: string | string[];
      toLayer?: string | string[];
      message?: string;
    }[];
    allowedLayers?: string[];
    requiredFields?: string[];
  };
}

export const generatedRules: RuleContract[] = ${JSON.stringify(rules, null, 2)};
`;

fs.writeFileSync(outputFile, fileContent);
console.log(`✅ Successfully generated ${rules.length} rule definitions at ${outputFile}`);

fs.writeFileSync(publicOutputFile, JSON.stringify(rules, null, 2));
console.log(`✅ Successfully generated ${rules.length} public rule definitions at ${publicOutputFile}`);
