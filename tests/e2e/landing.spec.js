import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const translations = JSON.parse(
  await readFile(new URL('../../src/lang/landing.json', import.meta.url)),
);
const copy = translations.zh;

test('players can read the introduction, change language and enter the game', async ({ page }) => {
  await page.goto('./#/zh/');
  await page.locator('.home-about').click();
  await expect(page).toHaveURL(/#\/zh\/about$/);
  await expect(page.getByRole('heading', { name: 'Type Instructor', exact: true })).toBeVisible();
  await page.getByRole('button', { name: copy.howLink, exact: true }).click();
  await expect(page.locator('#how-title')).toBeInViewport();
  for (const [lang, label] of [
    ['zh', '中文'],
    ['ja', '日本語'],
    ['en', 'English'],
  ]) {
    await page
      .locator('.landing-languages')
      .getByRole('link', { name: label, exact: true })
      .click();
    await expect(page.locator('#practice-title')).toHaveText(translations[lang].practiceTitle);
    await expect(page.getByText(translations[lang].practiceRule, { exact: true })).toBeVisible();
    await expect(page.getByText(translations[lang].practiceReset, { exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#practice-title').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
    await page.screenshot({ path: `/tmp/practice-landing-${lang}.png` });
  }

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
