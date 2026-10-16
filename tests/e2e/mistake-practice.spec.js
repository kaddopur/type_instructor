import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { correctSelector } from './support/matchups.js';

const texts = Object.fromEntries(
  await Promise.all(
    [
      ['en', 'strings.json'],
      ['zh', 'strings_zh.json'],
      ['ja', 'strings_ja.json'],
    ].map(async ([lang, file]) => [
      lang,
      JSON.parse(await readFile(new URL(`../../src/lang/${file}`, import.meta.url))),
    ]),
  ),
);

async function start(page, lang = 'en') {
  await page.clock.install({ time: new Date('2026-10-16T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-16T00:00:10Z'));
  await page.addInitScript(() => {
    Math.random = () => 0.5 / 18;
  });
  await page.goto(`./#/${lang}/quizzes/s/basic/attack`);
  await page.getByTestId('start-game').click();
}

async function readQuestion(page) {
  return {
    enemy: await page.locator('.question-type').innerText(),
    options: await page.locator('.optionText').allTextContents(),
    colors: await page
      .locator('.optionItem')
      .evaluateAll((nodes) =>
        nodes.map((node) => [...node.classList].find((name) => name.startsWith('Bgc-'))),
      ),
  };
}

async function miss(page) {
  const correct = await correctSelector(page, 'attack');
  await page.locator(`.optionItem:not(${correct})`).first().click();
  return correct;
}

for (const lang of ['en', 'zh', 'ja']) {
  test(
    `${lang}: exact mistakes rotate, clear, reopen and remain untimed`,
    { tag: '@a11y' },
    async ({ page }, testInfo) => {
      const text = texts[lang];
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.setViewportSize({ width: 390, height: 844 });
      await start(page, lang);
      const first = await readQuestion(page);
      const firstCorrect = await miss(page);
      await page.clock.runFor(500);
      await page.locator(firstCorrect).click();
      await page.clock.runFor(500);
      const second = await readQuestion(page);
      const secondCorrect = await miss(page);
      await page.clock.runFor(60000);
      await expect(page.locator('.Result')).toBeVisible();
      await expect(page.getByRole('link', { name: text.RETRY, exact: true })).toBeFocused();
      const storage = await page.evaluate(() => JSON.stringify(localStorage));
      const historyState = await page.evaluate(() => window.history.state.usr);
      expect(Object.keys(historyState)).toEqual(['completedSessionId']);
      expect(typeof historyState.completedSessionId).toBe('string');
      const trigger = page.getByRole('button', { name: text.PRACTICE_TITLE, exact: true });
      await trigger.focus();
      await page.keyboard.press('Enter');
      const dialog = page.getByRole('dialog', { name: text.PRACTICE_TITLE });
      await expect(dialog).toHaveAccessibleDescription(text.PRACTICE_DESCRIPTION);
      expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
      await expect(dialog.locator('.stemTimer, .stemScores, .quiz-progress')).toHaveCount(0);
      await expect(dialog.locator('.practice-remaining')).toHaveText(
        text.PRACTICE_REMAINING.replace('{count}', 2),
      );
      expect(await readQuestion(page)).toEqual(first);
      await page.clock.runFor(120000);
      expect(await readQuestion(page)).toEqual(first);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: `/tmp/mistake-practice-${lang}-${testInfo.project.name}-390x844.png`,
      });
      await page.setViewportSize({ width: 844, height: 390 });
      for (const button of await dialog.getByRole('button').all()) {
        const box = await button.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.y).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(845);
        expect(box.y + box.height).toBeLessThanOrEqual(391);
      }
      await page.screenshot({
        path: `/tmp/mistake-practice-${lang}-${testInfo.project.name}-844x390.png`,
      });
      const wrong = page.locator(`.optionItem:not(${firstCorrect})`).first();
      await wrong.focus();
      await page.keyboard.press('Enter');
      await expect(dialog.getByRole('status')).toContainText(text.INCORRECT);
      await expect(dialog.getByRole('status')).not.toContainText(text.SCORES);
      await page.locator(firstCorrect).dispatchEvent('click');
      await page.clock.runFor(499);
      await expect(page.locator('.question-type')).toHaveText(first.enemy);
      await page.clock.runFor(1);
      expect(await readQuestion(page)).toEqual(second);
      await expect(page.locator('.optionDamage')).toHaveCount(0);
      await expect(page.locator('.optionItem').first()).toBeFocused();
      await expect(dialog.locator('.practice-remaining')).toHaveText(
        text.PRACTICE_REMAINING.replace('{count}', 2),
      );
      await page.locator(secondCorrect).focus();
      await page.keyboard.press('Space');
      await page.clock.runFor(500);
      expect(await readQuestion(page)).toEqual(first);
      await expect(dialog.locator('.practice-remaining')).toHaveText(
        text.PRACTICE_REMAINING.replace('{count}', 1),
      );
      await miss(page);
      await expect(dialog.getByRole('status')).toContainText(text.INCORRECT);
      await page.clock.runFor(500);
      expect(await readQuestion(page)).toEqual(first);
      await expect(page.locator('.optionDamage')).toHaveCount(0);
      await expect(dialog.getByRole('status')).toBeEmpty();
      await miss(page);
      await expect(dialog.getByRole('status')).toContainText(text.INCORRECT);
      await page.clock.runFor(500);
      await page.locator(firstCorrect).click();
      await page.clock.runFor(500);
      await expect(dialog.getByRole('status')).toHaveText(text.PRACTICE_COMPLETE);
      await expect(dialog.getByRole('button', { name: text.PRACTICE_RETURN })).toBeFocused();
      await expect(
        dialog.getByRole('button', { name: text.PRACTICE_RETURN }),
      ).toHaveAccessibleDescription(text.PRACTICE_COMPLETE);
      await dialog.getByRole('button', { name: text.PRACTICE_RETURN }).click();
      await page.clock.runFor(1);
      await expect(trigger).toBeFocused();
      await trigger.click();
      expect(await readQuestion(page)).toEqual(first);
      await expect(dialog.locator('.practice-remaining')).toHaveText(
        text.PRACTICE_REMAINING.replace('{count}', 2),
      );
      await miss(page);
      await page.keyboard.press('Escape');
      await page.clock.runFor(1000);
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
      expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(storage);
      expect(errors).toEqual([]);
    },
  );
}

test('perfect, direct and reloaded results hide practice', async ({ page }) => {
  await start(page);
  await page.clock.runFor(60000);
  await expect(page.locator('.Result')).toBeVisible();
  await expect(page.getByRole('button', { name: texts.en.PRACTICE_TITLE })).toHaveCount(0);
  await page.goto('./#/en/quizzes/s/basic/attack/result/-1');
  await expect(page.locator('.Result')).toBeVisible();
  await expect(page.getByRole('button', { name: texts.en.PRACTICE_TITLE })).toHaveCount(0);
  await page.getByRole('link', { name: texts.en.RETRY, exact: true }).click();
  await page.getByTestId('start-game').click();
  await miss(page);
  await page.clock.runFor(60000);
  await expect(page.getByRole('button', { name: texts.en.PRACTICE_TITLE })).toBeVisible();
  await page.reload();
  await expect(page.locator('.Result')).toBeVisible();
  await expect(page.getByRole('button', { name: texts.en.PRACTICE_TITLE })).toHaveCount(0);
});

test('new challenges invalidate prior results even when scores repeat', async ({ page }) => {
  await start(page);
  await miss(page);
  await page.clock.runFor(60000);
  const trigger = page.getByRole('button', { name: texts.en.PRACTICE_TITLE });
  await expect(trigger).toBeVisible();
  const firstToken = await page.evaluate(() => window.history.state.usr.completedSessionId);
  await page.goBack();
  await expect(page.locator('.overlay')).toBeVisible();
  await page.goForward();
  await expect(page.locator('.Result')).toBeVisible();
  await expect(trigger).toHaveCount(0);
  await page.getByRole('link', { name: texts.en.RETRY, exact: true }).click();
  await page.getByTestId('start-game').click();
  await miss(page);
  await page.clock.runFor(60000);
  await expect(trigger).toBeVisible();
  expect(await page.evaluate(() => window.history.state.usr.completedSessionId)).not.toBe(
    firstToken,
  );
  for (const path of [
    '/en/quizzes/s/basic/attack/result/-2',
    '/zh/quizzes/s/basic/attack/result/-1',
    '/en/quizzes/s/speedrun/attack/result/1',
  ]) {
    await page.evaluate((next) => {
      window.location.hash = next;
    }, path);
    await expect(page.locator('.Result')).toBeVisible();
    await expect(page.locator('.Result button')).toHaveCount(0);
  }
});
