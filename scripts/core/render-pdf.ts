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
  await page.waitForFunction(() => {
    const state = document.documentElement.dataset.mermaid;
    return state === 'ready' || state === 'unavailable' || state === 'error';
  }, { timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(100);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    // Preserve navigable document structure as real PDF outline/bookmarks
    // when the HTML template provides semantic hierarchy.
    outline: true,
    tagged: true,
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
