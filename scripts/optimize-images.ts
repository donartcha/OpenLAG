import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

type WebpTask = {
  input: string;
  output: string;
  quality: number;
  resizeWidth?: number;
};

type PngTask = {
  input: string;
  output: string;
  size: number;
};

const projectRoot = process.cwd();

const webpTasks: WebpTask[] = [
  {
    input: 'src/assets/favicon.svg',
    output: 'src/assets/favicon.webp',
    quality: 82,
    resizeWidth: 256,
  },
  {
    input: 'OpenLAG-logo-t.png',
    output: 'OpenLAG-logo-t.webp',
    quality: 84,
    resizeWidth: 1200,
  },
  {
    input: 'OpenLAG-logo.png',
    output: 'OpenLAG-logo.webp',
    quality: 84,
    resizeWidth: 1200,
  },
];

const pngTasks: PngTask[] = [
  {
    input: 'src/assets/favicon.svg',
    output: 'src/assets/favicon-32.png',
    size: 32,
  },
  {
    input: 'src/assets/favicon.svg',
    output: 'src/assets/favicon-192.png',
    size: 192,
  },
];

function abs(filePath: string) {
  return path.join(projectRoot, filePath);
}

async function runWebpTask(task: WebpTask) {
  const inputPath = abs(task.input);
  const outputPath = abs(task.output);

  if (!fs.existsSync(inputPath)) {
    console.warn(`skip: ${task.input} (missing input)`);
    return;
  }

  let pipeline = sharp(inputPath, { failOn: 'none', limitInputPixels: false });
  if (task.resizeWidth) {
    pipeline = pipeline.resize({ width: task.resizeWidth, withoutEnlargement: true });
  }

  await pipeline.webp({ quality: task.quality }).toFile(outputPath);
}

async function runPngTask(task: PngTask) {
  const inputPath = abs(task.input);
  const outputPath = abs(task.output);

  if (!fs.existsSync(inputPath)) {
    console.warn(`skip: ${task.input} (missing input)`);
    return;
  }

  await sharp(inputPath, { failOn: 'none', limitInputPixels: false })
    .resize(task.size, task.size, { fit: 'cover' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(outputPath);
}

async function main() {
  for (const task of webpTasks) {
    await runWebpTask(task);
  }
  for (const task of pngTasks) {
    await runPngTask(task);
  }

  console.log('Image optimization complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
