import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
}

function copyYamlFiles(srcDir: string, destDir: string): number {
  if (!fs.existsSync(srcDir)) return 0;
  ensureDir(destDir);
  let copied = 0;
  for (const file of fs.readdirSync(srcDir).filter((name) => name.endsWith('.yaml')).sort()) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    copied += 1;
  }
  return copied;
}

export function applyProfilePack(profile: string, projectRoot = process.cwd()): { copied: number; profileDir: string } {
  const profileDir = path.join(packageRoot(), 'profiles', profile);
  if (!fs.existsSync(profileDir)) {
    throw new Error(`Profile pack '${profile}' not found in ${profileDir}.`);
  }

  const contractsDir = path.join(projectRoot, 'docs', 'contracts');
  let copied = 0;
  copied += copyYamlFiles(path.join(profileDir, 'artifacts'), path.join(contractsDir, 'artifacts'));
  copied += copyYamlFiles(path.join(profileDir, 'relations'), path.join(contractsDir, 'relations'));
  copied += copyYamlFiles(path.join(profileDir, 'rules'), path.join(contractsDir, 'rules'));
  copied += copyYamlFiles(path.join(profileDir, 'contracts', 'rules'), path.join(contractsDir, 'rules'));
  copied += copyYamlFiles(path.join(profileDir, 'export-profiles'), path.join(contractsDir, 'export-profiles'));
  copied += copyYamlFiles(path.join(profileDir, 'templates'), path.join(projectRoot, 'templates'));

  return { copied, profileDir };
}

function validateProfilePack(profileDir: string): string[] {
  const errors: string[] = [];
  const manifestPath = path.join(profileDir, 'profile.yaml');
  if (fs.existsSync(manifestPath)) {
    const manifest = yaml.load(fs.readFileSync(manifestPath, 'utf-8')) as Record<string, unknown> | null;
    if (!manifest || typeof manifest !== 'object') errors.push('profile.yaml must be a YAML object.');
    if (manifest && !manifest.id && !manifest.name) errors.push('profile.yaml should define id or name.');
  }

  const knownDirs = ['artifacts', 'relations', 'rules', 'contracts', 'export-profiles', 'templates'];
  for (const entry of fs.readdirSync(profileDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !knownDirs.includes(entry.name)) {
      errors.push(`Unknown profile directory: ${entry.name}`);
    }
  }

  return errors;
}

export function registerAuthoringCommands(program: Command) {
  program
    .command('profiles')
    .description('List bundled OpenLAG profile packs')
    .addHelpText('after', `

Example:
  $ openlag profiles

Notes:
  Profile packs can be applied with openlag profile add <profile>.
`)
    .action(() => {
      const dir = path.join(packageRoot(), 'profiles');
      if (!fs.existsSync(dir)) {
        console.log('No bundled profiles directory found.');
        return;
      }
      const profiles = fs.readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));
      for (const profile of profiles) console.log(profile);
    });

  const profile = program
    .command('profile')
    .description('Manage OpenLAG profile packs')
    .addHelpText('after', `

Examples:
  $ openlag profile add governance
  $ openlag profile validate --profile governance
  $ openlag profile validate --file profiles/governance/profile.yaml
`);

  profile
    .command('add')
    .description('Add a bundled profile pack to the current project')
    .argument('<profile>', 'Name of the profile (e.g. core, governance, mvc, hexagonal, testing)')
    .addHelpText('after', `

Examples:
  $ openlag profile add core
  $ openlag profile add governance
  $ openlag profile add mvc

Notes:
  Copies YAML contracts and templates from the bundled profile into the current project.
`)
    .action((profileName) => {
      try {
        const result = applyProfilePack(profileName);
        console.log(`Applied profile '${profileName}' from ${result.profileDir}.`);
        console.log(`Copied ${result.copied} contract/template files.`);
      } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
      }
    });

  profile
    .command('validate')
    .description('Validate a bundled profile pack or a profile YAML file')
    .option('--profile <profile>', 'Bundled profile name')
    .option('--file <path>', 'Path to profile yaml')
    .addHelpText('after', `

Examples:
  $ openlag profile validate
  $ openlag profile validate --profile governance
  $ openlag profile validate --file profiles/governance/profile.yaml

Notes:
  Defaults to --profile core when neither --profile nor --file is provided.
`)
    .action((options) => {
      try {
        if (options.file) {
          const profilePath = path.resolve(process.cwd(), options.file);
          const parsed = yaml.load(fs.readFileSync(profilePath, 'utf-8')) as Record<string, unknown>;
          if (!parsed?.id && !parsed?.name) throw new Error('Profile must contain id or name fields.');
          console.log(`Valid profile file: ${parsed.id || parsed.name}`);
          return;
        }

        const profileName = options.profile || 'core';
        const profileDir = path.join(packageRoot(), 'profiles', profileName);
        if (!fs.existsSync(profileDir)) throw new Error(`Profile pack '${profileName}' not found.`);
        const errors = validateProfilePack(profileDir);
        if (errors.length > 0) throw new Error(errors.join('\n'));
        console.log(`Valid profile pack: ${profileName}`);
      } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
      }
    });

  program
    .command('profile-add')
    .description('Deprecated alias for `openlag profile add`')
    .argument('<profile>', 'Name of the profile')
    .addHelpText('after', `

Example:
  $ openlag profile-add governance

Notes:
  Deprecated. Prefer openlag profile add <profile>.
`)
    .action((profileName) => {
      try {
        const result = applyProfilePack(profileName);
        console.log(`Applied profile '${profileName}' from ${result.profileDir}.`);
        console.log('Command `profile-add` is deprecated; use `profile add`.');
        console.log(`Copied ${result.copied} contract/template files.`);
      } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
      }
    });

  program
    .command('scaffold')
    .description('Scaffold mass authoring templates and samples')
    .addHelpText('after', `

Example:
  $ openlag scaffold

Output:
  templates/artifacts/artifact-contract.template.yaml
  templates/relations/relation-contract.template.yaml
  templates/rules/rule-contract.template.yaml
  templates/markdown/artifact.template.md
`)
    .action(() => {
      const templatesDir = path.join(process.cwd(), 'templates');
      ensureDir(path.join(templatesDir, 'artifacts'));
      ensureDir(path.join(templatesDir, 'relations'));
      ensureDir(path.join(templatesDir, 'rules'));
      ensureDir(path.join(templatesDir, 'markdown'));

      writeIfMissing(path.join(templatesDir, 'artifacts', 'artifact-contract.template.yaml'), `type: CUSTOM_TYPE\nextends: CODE_ENTITY\nlayer: IMPLEMENTATION\nrequiredFields:\n  - id\n  - type\n  - title\n`);
      writeIfMissing(path.join(templatesDir, 'relations', 'relation-contract.template.yaml'), `relation: CUSTOM_REL\ndescription: "Auto-generated relation"\ncategory: SEMANTIC\nallowedFrom: [PROJECT]\nallowedTo: [PROJECT]\nmultiplicity:\n  from: many\n  to: many\nvalidation:\n  severity: warn\nimpact:\n  propagates: false\n  directions: [forward]\n  weight: 1\n`);
      writeIfMissing(path.join(templatesDir, 'rules', 'rule-contract.template.yaml'), `id: custom-rule\ndescription: "Auto-generated rule"\nmatchNode:\n  type: [CODE_ENTITY]\nconditions:\n  requiredFields:\n    - "ownership.owner"\nseverity: warning\n`);
      writeIfMissing(path.join(templatesDir, 'markdown', 'artifact.template.md'), `---\nid: sample-id\ntype: REQUIREMENT\ntitle: Sample Artifact\nownership:\n  owner: team-member\n  team: core\nrelations: []\n---\n\n# Sample\n`);
      console.log('Scaffolded templates/ for mass authoring.');
    });

  program
    .command('create')
    .description('Create an artifact contract, relation contract, rule contract, or artifact')
    .argument('<type>', 'Type of entity to create (artifact-contract, relation, rule, artifact)')
    .argument('<name>', 'Name or ID of the entity')
    .addHelpText('after', `

Examples:
  $ openlag create artifact-contract API_ROUTE
  $ openlag create relation TRACKS
  $ openlag create rule requirement-owner-required
  $ openlag create artifact REQ-AUTH-001

Output:
  artifact-contract -> docs/contracts/artifacts/<name>.yaml
  relation          -> docs/contracts/relations/<name>.yaml
  rule              -> docs/contracts/rules/<name>.yaml
  artifact          -> docs/<name>.md
`)
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
      } else if (type === 'artifact-contract') {
        content = `type: ${name.toUpperCase()}\nextends: CODE_ENTITY\nlayer: IMPLEMENTATION\nrequiredFields:\n  - id\n  - type\n  - title\n`;
      } else if (type === 'relation') {
        content = `relation: ${name.toUpperCase()}\ndescription: "Auto-generated relation"\ncategory: SEMANTIC\nallowedFrom: [PROJECT]\nallowedTo: [PROJECT]\nmultiplicity:\n  from: many\n  to: many\nvalidation:\n  severity: warn\nimpact:\n  propagates: false\n  directions: [forward]\n  weight: 1\n`;
      } else if (type === 'rule') {
        content = `id: ${name}\ndescription: "Auto-generated rule"\nmatchNode:\n  type: [CODE_ENTITY]\nconditions:\n  requiredFields:\n    - "ownership.owner"\nseverity: warning\n`;
      } else if (type === 'artifact') {
        content = `---\nid: ${name}\ntype: REQUIREMENT\ntitle: ${name}\nownership:\n  owner: team\n  team: core\nrelations: []\n---\n\n# ${name}\n`;
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
}
