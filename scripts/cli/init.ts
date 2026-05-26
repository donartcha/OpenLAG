import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { applyProfilePack } from './authoring.js';

/**
 * OpenLAG Project Initializer
 * Purpose: Configures the OpenLAG portal for a specific project.
 */

export async function initProject(projectName?: string, projectDesc?: string, includeAllRelations?: boolean, profile?: string) {
  const name = projectName || process.env.PROJECT_NAME || 'My OpenLAG Project';
  const desc = projectDesc || process.env.PROJECT_DESCRIPTION || 'Living Architecture documentation for my system.';

  let ROOT_DIR = process.cwd();
  if (projectName) {
    ROOT_DIR = path.join(process.cwd(), projectName);
    if (!fs.existsSync(ROOT_DIR)) {
      fs.mkdirSync(ROOT_DIR, { recursive: true });
      console.log(chalk.green(`✅ Created project directory: ${projectName}`));
    }
  }

  console.log(chalk.blue(`🛠️  Initializing OpenLAG for: `) + chalk.bold(name));

  // 1. Update or Create metadata.json
  const metadataPath = path.join(ROOT_DIR, 'metadata.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    metadata.name = name;
    metadata.description = desc;
    if (!metadata.typeColors) metadata.typeColors = {};
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(chalk.green('✅ Updated metadata.json'));
  } else {
    const metadata = {
      name: name,
      description: desc,
      typeColors: {
        "DAO": "text-emerald-400 border-emerald-500",
        "DTO": "text-emerald-400 border-emerald-500"
      }
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(chalk.green('✅ Created metadata.json'));
  }

  // 2. Update index.html title if exists
  const htmlPath = path.join(ROOT_DIR, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/<title>.*?<\/title>/, `<title>${name} | OpenLAG</title>`);
    
    const descMetaRegex = /<meta name="description" content=".*?"\s*\/?>/;
    if (descMetaRegex.test(html)) {
      html = html.replace(descMetaRegex, `<meta name="description" content="${desc}" />`);
    } else {
      html = html.replace(/<\/title>/, `</title>\n    <meta name="description" content="${desc}" />`);
    }
    
    fs.writeFileSync(htmlPath, html);
    console.log(chalk.green('✅ Updated index.html title and description'));
  }

  // 3. Initialize /docs/contracts
  const docsContractsDir = path.join(ROOT_DIR, 'docs', 'contracts');
  if (!fs.existsSync(docsContractsDir)) {
    fs.mkdirSync(docsContractsDir, { recursive: true });
    console.log(chalk.green('✅ Created /docs/contracts directory'));
  }

  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

  // Copy Core Profile
  const coreProfileDir = path.join(packageRoot, 'profiles', 'core');
  if (fs.existsSync(coreProfileDir)) {
    console.log(chalk.blue(`📦 Applying Core Profile...`));
    applyProfilePack('core', ROOT_DIR);
    console.log(chalk.green('✅ Core Contracts initialized'));
  } else {
    console.warn(chalk.yellow(`⚠️  Core profile not found at ${coreProfileDir}`));
  }

  // Apply extra profile if provided
  if (profile) {
    const profileDir = path.join(packageRoot, 'profiles', profile);
    
    if (!fs.existsSync(profileDir)) {
      console.warn(chalk.yellow(`⚠️  Profile pack '${profile}' not found in ${profileDir}. Skipping profile application.`));
    } else {
      console.log(chalk.blue(`📦 Applying extra profile pack: ${profile}...`));
      applyProfilePack(profile, ROOT_DIR);
      console.log(chalk.green(`✅ Successfully added profile: ${profile}`));
    }
  }

  // package.json scripts check
  const pkgPath = path.join(ROOT_DIR, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    let updated = false;
    if (!pkg.scripts) pkg.scripts = {};
    if (!pkg.scripts['lag:freeze']) {
      pkg.scripts['lag:freeze'] = "npx openlag freeze";
      updated = true;
    }
    if (!pkg.scripts['lag:lint']) {
      pkg.scripts['lag:lint'] = "npx openlag lint";
      updated = true;
    }
    if (!pkg.scripts['lag:impact']) {
      pkg.scripts['lag:impact'] = "npx openlag impact";
      updated = true;
    }
    if (updated) {
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
      console.log(chalk.green('✅ Added openlag scripts to package.json'));
    }
  }

  console.log(chalk.green(`\n✨ OpenLAG initialized for ${name}!`));
  console.log(`\nNext steps:`);
  console.log(`  1. Define artifacts in ./docs/contracts/artifacts`);
  console.log(`  2. Add relations in ./docs/contracts/relations`);
  console.log(`  3. Start the viewer: npm run dev`);
  console.log(`  4. Freeze documentation: npm run lag:freeze`);
}
