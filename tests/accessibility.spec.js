import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const languages = {};
for (const [lang, file] of [['en', 'strings.json'], ['zh', 'strings_zh.json'], ['ja', 'strings_ja.json']]) {
  languages[lang] = JSON.parse(await readFile(new URL(`../src/lang/${file}`, import.meta.url)));
}

async function tabTo(page, target) {
  for (let n = 0; n < 10; n++) {
    if (await target.evaluate(node => node === document.activeElement)) return;
    await page.keyboard.press('Tab');
  }
  await expect(target).toBeFocused();
}

for (const [lang, text] of Object.entries(languages)) {
  test(`${lang}: keyboard-only dialog, answers, completion and retry`, async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
    await page.addInitScript(() => { Math.random = () => 0.5 / 18; });
    const mode = lang === 'en' ? 'speedrun' : 'basic';
    await page.goto(`./#/${lang}/quizzes/s/${mode}/attack`);
    const start = page.getByRole('button', { name: text.START, exact: true });
    await expect(start).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('dialog').getByRole('link', { name: text.MENU, exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
    await tabTo(page, page.locator('.Menu section').nth(mode === 'basic' ? 0 : 1)
      .getByRole('link', { name: text.ATTACK, exact: true }));
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

    const wrong = page.locator('.optionItem:not(.Bgc-fighting)').first();
    await tabTo(page, wrong);
    await page.keyboard.press('Enter');
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
    await expect(page.getByRole('status')).toContainText(text.INCORRECT);
    await expect(wrong).toBeFocused();
    await page.keyboard.press('Space');
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
    await page.clock.runFor(500);
    await expect(page.getByRole('status')).toContainText(text.INCORRECT);
    const correct = page.getByRole('button', { name: text.FIGHTING, exact: true });
    await tabTo(page, correct);
    await page.keyboard.press('Space');
    await expect(page.getByRole('status')).toContainText(text.CORRECT);
    await page.clock.runFor(500);
    await expect(page.getByRole('heading', { level: 1 })).toBeFocused();

    if (mode === 'speedrun') {
      for (let score = 1; score <= 20; score++) {
        await tabTo(page, correct);
        await page.keyboard.press('Enter');
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: ${score}`);
        await page.clock.runFor(500);
      }
    } else {
      await page.clock.runFor(59000);
    }
    await expect(page).toHaveURL(new RegExp(`/${mode}/attack/result/\\d+$`));
    await expect(page.locator('.Result h1')).toBeFocused();
    await tabTo(page, page.getByRole('link', { name: text.RETRY, exact: true }));
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: ${mode === 'basic' ? 60 : 0}`);
  });
}
