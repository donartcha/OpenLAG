import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

import { chromium } from '@playwright/test';

const [, , htmlPath, pdfPath] = process.argv;

if (!htmlPath || !pdfPath) {
  throw new Error('Usage: render-pdf <htmlPath> <pdfPath>');
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(path.resolve(htmlPath)).toString(), { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm',
    },
  });
} finally {
  await browser.close();
}

if (!fs.existsSync(pdfPath)) {
  throw new Error(`PDF was not created: ${pdfPath}`);
}
