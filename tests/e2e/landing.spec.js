import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const copy = JSON.parse(await readFile(new URL('../../src/lang/landing.json', import.meta.url))).zh;

test('players can read the introduction, change language and enter the game', async ({ page }) => {
  await page.goto('./#/zh/');
  await page.locator('.home-about').click();
  await expect(page).toHaveURL(/#\/zh\/about$/);
  await expect(page.getByRole('heading', { name: 'Type Instructor', exact: true })).toBeVisible();
  await page.getByRole('button', { name: copy.howLink, exact: true }).click();
  await expect(page.locator('#how-title')).toBeInViewport();

  await page
    .locator('.landing-languages')
    .getByRole('link', { name: 'English', exact: true })
    .click();
  await expect(page).toHaveURL(/#\/en\/about$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('.landing-actions a').click();
  await expect(page).toHaveURL(/#\/en\/menu$/);
  await page.locator('.Menu footer a').click();
  await expect(page.locator('.Home .start a')).toBeFocused();
});
