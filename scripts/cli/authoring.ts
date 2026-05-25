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
    .description('List export profiles from docs/export-profiles')
    .action(() => {
      const dir = path.join(process.cwd(), 'docs', 'export-profiles');
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
      ensureDir(path.join(templatesDir, 'markdown'));

      writeIfMissing(path.join(templatesDir, 'artifacts', 'artifact-contract.template.yaml'), `type: CUSTOM_TYPE\nextends: CODE_ENTITY\nlayer: IMPLEMENTATION\nrequiredFields:\n  - id\n  - type\n  - title\n`);
      writeIfMissing(path.join(templatesDir, 'relations', 'relation-contract.template.yaml'), `type: RELATES_TO\ncategory: SEMANTIC\nallowedFrom: [PROJECT]\nallowedTo: [PROJECT]\n`);
      writeIfMissing(path.join(templatesDir, 'markdown', 'artifact.template.md'), `---\nid: sample-id\ntype: REQUIREMENT\ntitle: Sample Artifact\nownership:\n  owner: team-member\n  team: core\nrelations: []\n---\n\n# Sample\n`);
      console.log('Scaffolded templates/ for mass authoring.');
    });
}

