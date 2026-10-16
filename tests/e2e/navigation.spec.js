import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

async function pauseClock(page) {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
}

test(
  'invalid links recover to usable pages without keeping an active game',
  { tag: '@smoke' },
  async ({ page }) => {
    await pauseClock(page);
    await page.goto('./#/unknown/menu');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: 'Basic', exact: true })).toBeVisible();

    await page.goto('./#/en/quizzes/s/basic/attack');
    await page.getByTestId('start-game').click();
    await page.evaluate(() => {
      window.location.hash = '/en/quizzes/s/unknown/attack';
    });
    await expect(page).toHaveURL(/#\/en\/menu$/);
    await page.clock.runFor(61000);
    await expect(page.locator('.Menu')).toBeVisible();

    await page.goto('./#/en/does-not-exist');
    await expect(page).toHaveURL(/#\/en\/$/);
    await expect(page.locator('.Home .start a')).toBeFocused();
  },
);

const languages = [
  ['en', 'English', 'strings.json'],
  ['zh', '中文', 'strings_zh.json'],
  ['ja', '日本語', 'strings_ja.json'],
];

test(
  'players can switch language, start, answer and leave in all three languages',
  { tag: '@smoke' },
  async ({ page }) => {
    await pauseClock(page);
    for (const [lang, label, file] of languages) {
      const text = JSON.parse(await readFile(new URL(`../../src/lang/${file}`, import.meta.url)));
      await page.goto('./');
      await page.getByRole('link', { name: /change language/i }).click();
      await page.getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/$`));
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const start = page.getByRole('link', { name: text.START, exact: true });
      await expect(start).toBeFocused();
      await start.click();

      const kind = lang === 'zh' ? 'defend' : 'attack';
      await page
        .locator('.mode-basic')
        .getByRole('link', { name: text[kind.toUpperCase()], exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/quizzes/s/basic/${kind}$`));
      await page.getByTestId('start-game').click();
      await page.locator('.optionItem').first().click();
      await expect(page.locator('.stemStatus')).not.toBeEmpty();
      await expect(page.locator('.stemScores')).toHaveText(new RegExp(`${text.SCORES}: -?1$`));

      await page.getByRole('button', { name: text.EXIT_GAME, exact: true }).click();
      const dialog = page.getByRole('dialog', { name: text.EXIT_CONFIRM_TITLE });
      await dialog.getByRole('link', { name: text.RETURN_TO_MENU, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    }
  },
);
