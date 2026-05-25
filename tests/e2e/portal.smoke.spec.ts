import { expect, test } from '@playwright/test';

test('portal shell loads and navigation is stable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header')).toContainText('OpenLAG');
  await expect(page.getByTestId('view-graph')).toBeVisible();

  await page.getByTestId('nav-docs').click();
  await expect(page.getByTestId('view-docs')).toBeVisible();

  await page.getByTestId('nav-impact').click();
  await expect(page.getByTestId('view-impact')).toBeVisible();

  await page.getByTestId('nav-orphans').click();
  await expect(page.getByTestId('view-orphans')).toBeVisible();

  await page.getByTestId('nav-guide').click();
  await expect(page.getByTestId('view-guide')).toBeVisible();

  await page.getByTestId('nav-settings').click();
  await expect(page.getByTestId('view-settings')).toBeVisible();
});
