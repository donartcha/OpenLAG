import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

test('generate deterministic documentation screenshots', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1440, height: 900 });

  const outputDir = path.resolve(process.cwd(), 'test-results/docs/screenshots/generated');
  fs.mkdirSync(outputDir, { recursive: true });

  const shellPath = path.join(outputDir, 'portal-shell.png');
  await page.screenshot({ path: shellPath, fullPage: true });
  expect(fs.existsSync(shellPath)).toBeTruthy();

  await page.getByTestId('nav-docs').click();
  const docsPath = path.join(outputDir, 'portal-docs-view.png');
  await page.screenshot({ path: docsPath, fullPage: true });
  expect(fs.existsSync(docsPath)).toBeTruthy();
});
