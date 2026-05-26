import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import yaml from 'js-yaml';

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeIfMissing(filePath: string, content: string) {
  if (fs.existsSync(filePath)) return false;
  fs.writeFileSync(filePath, content, 'utf-8');
  return true;
}

export function registerAuthoringCommands(program: Command) {
  program
    .command('profiles')
    .description('List export profiles from docs/contracts/export-profiles')
    .action(() => {
      const dir = path.join(process.cwd(), 'docs', 'contracts', 'export-profiles');
      if (!fs.existsSync(dir)) {
        console.log('No profiles directory found.');
        return;
      }
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort((a, b) => a.localeCompare(b));
      for (const file of files) console.log(file);
    });

  program
    .command('profile-validate')
    .description('Validate a profile YAML exists and has id/name')
    .requiredOption('--file <path>', 'Path to profile yaml')
    .action((options) => {
      const profilePath = path.resolve(process.cwd(), options.file);
      const raw = fs.readFileSync(profilePath, 'utf-8');
      const parsed = yaml.load(raw) as Record<string, unknown>;
      if (!parsed?.id || !parsed?.name) {
        throw new Error('Profile must contain id and name fields.');
      }
      console.log(`Valid profile: ${parsed.id}`);
    });

  program
    .command('scaffold')
    .description('Scaffold mass authoring templates and samples')
    .action(() => {
      const templatesDir = path.join(process.cwd(), 'templates');
      ensureDir(path.join(templatesDir, 'artifacts'));
      ensureDir(path.join(templatesDir, 'relations'));
      ensureDir(path.join(templatesDir, 'rules'));
      ensureDir(path.join(templatesDir, 'markdown'));

      writeIfMissing(path.join(templatesDir, 'artifacts', 'artifact-contract.template.yaml'), `type: CUSTOM_TYPE\nextends: CODE_ENTITY\nlayer: IMPLEMENTATION\nrequiredFields:\n  - id\n  - type\n  - title\n`);
      writeIfMissing(path.join(templatesDir, 'relations', 'relation-contract.template.yaml'), `relation: CUSTOM_REL\ndescription: "Auto-generated relation"\ncategory: SEMANTIC\nallowedFrom: [PROJECT]\nallowedTo: [PROJECT]\nmultiplicity:\n  from: many\n  to: many\nvalidation:\n  severity: warn\nimpact:\n  propagates: false\n  directions: [forward]\n  weight: 1\n`);
      writeIfMissing(path.join(templatesDir, 'rules', 'rule-contract.template.yaml'), `id: custom-rule\ndescription: "Auto-generated rule"\nmatchNode:\n  type: [CODE_ENTITY]\nrule:\n  requiresField:\n    - "ownership.owner"\nseverity: error\n`);
      writeIfMissing(path.join(templatesDir, 'markdown', 'artifact.template.md'), `---\nid: sample-id\ntype: REQUIREMENT\ntitle: Sample Artifact\nownership:\n  owner: team-member\n  team: core\nrelations: []\n---\n\n# Sample\n`);
      console.log('Scaffolded templates/ for mass authoring.');
    });
  program
    .command('create')
    .description('Create an artifact contract, relation contract, rule contract, or artifact')
    .argument('<type>', 'Type of entity to create (artifact-contract, relation, rule, artifact)')
    .argument('<name>', 'Name or ID of the entity')
    .action((type, name) => {
      const contractsDir = path.join(process.cwd(), 'docs', 'contracts');
      const templatesDir = path.join(process.cwd(), 'templates');
      const templatePath = path.join(templatesDir, type === 'artifact-contract' ? 'artifacts/artifact-contract.template.yaml' 
        : type === 'relation' ? 'relations/relation-contract.template.yaml'
        : type === 'rule' ? 'rules/rule-contract.template.yaml'
        : 'markdown/artifact.template.md');
      
      let content = '';
      if (fs.existsSync(templatePath)) {
        content = fs.readFileSync(templatePath, 'utf-8').replace(/sample-id/g, name).replace(/Sample Artifact/g, name);
      } else {
        // Fallbacks if scaffold hasn't run
        if (type === 'artifact-contract') content = `type: ${name.toUpperCase()}\nextends: CODE_ENTITY\nlayer: IMPLEMENTATION\nrequiredFields:\n  - id\n  - type\n  - title\n`;
        else if (type === 'relation') content = `relation: ${name.toUpperCase()}\ndescription: "Auto-generated relation"\ncategory: SEMANTIC\nallowedFrom: [PROJECT]\nallowedTo: [PROJECT]\nmultiplicity:\n  from: many\n  to: many\nvalidation:\n  severity: warn\nimpact:\n  propagates: false\n  directions: [forward]\n  weight: 1\n`;
        else if (type === 'rule') content = `id: ${name}\ndescription: "Auto-generated rule"\nmatchNode:\n  type: [CODE_ENTITY]\nrule:\n  requiresField:\n    - "ownership.owner"\nseverity: error\n`;
        else if (type === 'artifact') content = `---\nid: ${name}\ntype: REQUIREMENT\ntitle: ${name}\nownership:\n  owner: team\n  team: core\nrelations: []\n---\n\n# ${name}\n`;
      }
      
      let targetPath = '';
      if (type === 'artifact-contract') targetPath = path.join(contractsDir, 'artifacts', `${name}.yaml`);
      else if (type === 'relation') targetPath = path.join(contractsDir, 'relations', `${name}.yaml`);
      else if (type === 'rule') targetPath = path.join(contractsDir, 'rules', `${name}.yaml`);
      else if (type === 'artifact') targetPath = path.join(process.cwd(), 'docs', `${name}.md`);
      else {
        console.error(`Unknown type: ${type}. Use artifact-contract, relation, rule, or artifact.`);
        process.exit(1);
      }

      ensureDir(path.dirname(targetPath));
      if (writeIfMissing(targetPath, content)) {
        console.log(`Created ${targetPath}`);
      } else {
        console.error(`File already exists: ${targetPath}`);
      }
    });

  program
    .command('profile-add')
    .description('Add a profile pack to the current project')
    .argument('<profile>', 'Name of the profile (e.g., mvc, hexagonal)')
    .action((profile) => {
      const packageRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
      const profileDir = path.join(packageRoot, 'profiles', profile);
      const targetContractsDir = path.join(process.cwd(), 'docs', 'contracts');

      if (!fs.existsSync(profileDir)) {
        console.error(`Profile pack '${profile}' not found in ${profileDir}.`);
        process.exit(1);
      }

      console.log(`Applying profile pack: ${profile}...`);
      // Copy files from profileDir to docs/
      const copyRecursiveSync = (src: string, dest: string) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats && stats.isDirectory();
        if (isDirectory) {
          ensureDir(dest);
          fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
          });
        } else {
          fs.copyFileSync(src, dest);
          console.log(`Copied ${path.basename(dest)}`);
        }
      };
      
      copyRecursiveSync(profileDir, targetContractsDir);
      console.log(`Successfully added profile: ${profile}`);
    });
}

