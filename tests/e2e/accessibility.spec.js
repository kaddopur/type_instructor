import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { correctSelector } from './support/matchups.js';

const lang = 'zh';
const text = {
  label: '中文',
  ...JSON.parse(await readFile(new URL('../../src/lang/strings_zh.json', import.meta.url))),
};

async function tabTo(page, target) {
  for (let n = 0; n < 10; n++) {
    if (await target.evaluate((node) => node === document.activeElement)) return;
    const backwards = await target.evaluate((node) =>
      Boolean(
        document.activeElement.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING,
      ),
    );
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
  }
  await expect(target).toBeFocused();
}

test.describe('answer focus follows the input method', () => {
  test.use({ hasTouch: true });

  for (const input of ['click', 'tap']) {
    test(
      `${input}: Tab enters the first answer after a question change`,
      { tag: '@a11y' },
      async ({ page }) => {
        await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
        await page.goto('./#/zh/quizzes/s/basic/attack');
        await page.getByTestId('start-game')[input]();
        const answers = page.locator('.optionItem');
        await page.locator(await correctSelector(page, 'attack'))[input]();
        await page.clock.runFor(500);
        await page.keyboard.press('Tab');
        await expect(answers.nth(0)).toBeFocused();
        expect(await answers.nth(0).evaluate((node) => node.matches(':focus-visible'))).toBe(true);
        await page.keyboard.press('Tab');
        await expect(answers.nth(1)).toBeFocused();

        const correct = page.locator(await correctSelector(page, 'attack'));
        await tabTo(page, correct);
        await page.keyboard.press('Enter');
        await page.clock.runFor(500);
        await expect(answers.nth(0)).toBeFocused();
        expect(await answers.nth(0).evaluate((node) => node.matches(':focus-visible'))).toBe(true);
      },
    );
  }
});

test(
  `${lang}: keyboard-only dialog, answers, completion and retry`,
  { tag: '@a11y' },
  async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
    await page.addInitScript(() => {
      Math.random = () => 0.5 / 18;
    });
    const mode = 'basic';
    await page.goto(`./#/${lang}/`);
    await expect(page.getByRole('link', { name: text.START, exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    const firstMenuLink = page
      .locator('.Menu section')
      .first()
      .getByRole('link', { name: text.ATTACK, exact: true });
    await expect(firstMenuLink).toBeFocused();
    await tabTo(
      page,
      page.locator('.Menu section').first().getByRole('link', { name: text.ATTACK, exact: true }),
    );
    await page.keyboard.press('Enter');
    const start = page.getByRole('button', { name: text.START, exact: true });
    await expect(start).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(
      page.getByRole('dialog').getByRole('link', { name: text.MENU, exact: true }),
    ).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    await expect(firstMenuLink).toBeFocused();
    await tabTo(
      page,
      page.locator('.Menu section').first().getByRole('link', { name: text.ATTACK, exact: true }),
    );
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.optionItem').first()).toBeFocused();
    await expect(page.locator('.optionItem').first()).toHaveAccessibleDescription(
      new RegExp(text.ENEMY_ATTACK),
    );

    const wrong = page.locator('.optionItem:not(.Bgc-fighting)').first();
    await tabTo(page, wrong);
    await page.keyboard.press('Enter');
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
    await expect(page.getByRole('progressbar')).toHaveCount(0);
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
    await expect(page.locator('.optionItem').first()).toBeFocused();

    await page.clock.runFor(59000);
    await expect(page).toHaveURL(new RegExp(`/${mode}/attack/result/\\d+$`));
    await expect(page.getByRole('link', { name: text.RETRY, exact: true })).toBeFocused();
    await expect(
      page.getByRole('link', { name: text.RETRY, exact: true }),
    ).toHaveAccessibleDescription(new RegExp(text.YOUR_SCORES));
    await tabTo(page, page.getByRole('link', { name: text.RETRY, exact: true }));
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: 60`);
  },
);
