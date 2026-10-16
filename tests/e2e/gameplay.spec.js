import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { correctSelector } from './support/matchups.js';

const lang = 'zh';
const text = {
  label: '中文',
  ...JSON.parse(await readFile(new URL('../../src/lang/strings_zh.json', import.meta.url))),
};

for (const mode of ['basic', 'speedrun']) {
  for (const kind of ['attack', 'defend']) {
    test(
      `${lang}/${mode}/${kind}: complete, retry, and navigate`,
      { tag: ['@gameplay', '@smoke'] },
      async ({ page }) => {
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
        // Normal target: fighting is the unique attack answer; ghost is immune in defense.
        await page.addInitScript(() => {
          Math.random = () => 0.5 / 18;
        });
        await page.goto('./');
        await expect(
          page.getByRole('heading', { name: 'Type Instructor', exact: true }),
        ).toBeVisible();
        await page.getByRole('link', { name: /change language/i }).click();
        await page.getByRole('link', { name: text.label, exact: true }).click();
        await expect(page.locator('.Home .start a')).toBeFocused();
        await page.getByRole('link', { name: text.START, exact: true }).click();
        await page
          .locator('.Menu section')
          .nth(mode === 'basic' ? 0 : 1)
          .getByRole('link', { name: text[kind.toUpperCase()], exact: true })
          .click();

        const path = `/${lang}/quizzes/s/${mode}/${kind}`;
        await expect(page).toHaveURL(new RegExp(`#${path}$`));
        await page.reload(); // Direct hash reload must preserve the selected route.
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('.stemEnemyText')).toContainText(
          text[kind === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND'],
        );
        await expect(page.locator('#quiz-question')).toHaveText(
          text[kind === 'attack' ? 'ATTACK_QUESTION' : 'DEFEND_QUESTION'],
        );
        await expect(page.locator('.question-type')).toHaveText(text.NORMAL);
        await expect(page.locator('.optionContainer')).toHaveAccessibleDescription(
          new RegExp(
            text[kind === 'attack' ? 'ATTACK_QUESTION' : 'DEFEND_QUESTION'].replace(/\s+/g, ' '),
          ),
        );
        await expect(page.locator('.overlay span')).toHaveText(
          mode === 'basic' ? text.GOAL_BASIC : text.GOAL_SPEEDRUN.replace('{scoreTarget}', 20),
        );
        await page.clock.runFor(2000);
        await expect(page.locator('.stemTimer')).toHaveText(
          `${text.TIMER}: ${mode === 'basic' ? 60 : 0}`,
        );
        await page.getByTestId('start-game').evaluate((node) => {
          node.click();
          node.click();
        });

        await page.evaluate(() => document.fonts.ready);
        await page.clock.runFor(1000);
        await expect(page.locator('.stemTimer')).toHaveText(
          `${text.TIMER}: ${mode === 'basic' ? 59 : 1}`,
        );

        const correct = await correctSelector(page, kind);
        await page
          .locator(`.optionItem:not(${correct})`)
          .first()
          .evaluate((node) => {
            node.click();
            node.click();
          });
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
        const damage = Number(await page.locator('.optionDamage').textContent());
        const status = {
          0: 'EFFECTIVE_0',
          0.5: 'EFFECTIVE_1_2',
          1: 'EFFECTIVE_1',
          2: 'EFFECTIVE_2',
        }[damage];
        await expect(page.locator('.stemStatus')).toContainText(text[status]);
        await page.locator(correct).dispatchEvent('click'); // Even synthetic inputs are rejected during feedback.
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
        await page.clock.runFor(500);
        await page.locator('.optionItem.Bgc-wrong').dispatchEvent('click'); // Rejected after feedback too.
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
        await page.locator(correct).click();
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
        await page.clock.runFor(500);
        await expect(page.locator('.optionDamage')).toHaveCount(0);

        let result;
        if (mode === 'basic') {
          await page.locator(await correctSelector(page, kind)).click();
          await page.clock.runFor(60000);
          result = '1';
        } else {
          for (let score = 1; score <= 20; score++) {
            if (score === 20)
              result = (await page.locator('.stemTimer').textContent()).split(': ').at(-1);
            await page.locator(await correctSelector(page, kind)).click();
            await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: ${score}`);
            await expect(page.getByRole('progressbar')).toHaveJSProperty('value', score);
            await page.clock.runFor(500);
            if (score < 20) await expect(page.locator('.optionDamage')).toHaveCount(0);
          }
        }

        await expect(page).toHaveURL(new RegExp(`#${path}/result/${result}$`));
        await expect(page.locator('.Result h1')).toContainText(
          mode === 'basic' ? text.YOUR_SCORES : text.YOUR_TIME,
        );
        await expect(page.locator('.Result h1')).toContainText(
          mode === 'basic' ? result : `${result}s`,
        );
        await page.getByRole('link', { name: text.RETRY, exact: true }).click();
        await expect(page.locator('.overlay')).toBeVisible();
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
        await expect(page.locator('.stemTimer')).toHaveText(
          `${text.TIMER}: ${mode === 'basic' ? 60 : 0}`,
        );
        await expect(page.locator('.optionDamage')).toHaveCount(0);
        await page.goBack();
        await expect(page.locator('.Result')).toBeVisible();
        await page.goForward();
        await expect(page.locator('.overlay')).toBeVisible();
        await page.goBack();
        await page.getByRole('link', { name: text.MENU, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
        await page.locator('footer a').click();
        await expect(page).toHaveURL(new RegExp(`#/${lang}/$`));
        await expect(page.locator('.Home')).toBeVisible();
        expect(errors).toEqual([]);
      },
    );
  }
}

async function pauseClock(page) {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
}

test(
  'rapid answers and route changes keep game sessions isolated',
  { tag: '@smoke' },
  async ({ page }) => {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await pauseClock(page);
    // Pin the attacking enemy to electric: ground is the unique immune answer.
    await page.addInitScript(() => {
      Math.random = () => 12.5 / 18;
    });
    await page.goto('./#/en/quizzes/s/basic/defend');
    await expect(page.locator('.stemContainer')).toHaveClass(/Bgc-electric/);
    await page.locator('.optionItem.Bgc-ground').dispatchEvent('click');
    await expect(page.locator('.stemScores')).toHaveText('scores: 0');
    await page.getByTestId('start-game').click();

    await page
      .locator('.optionItem:not(.Bgc-ground)')
      .first()
      .evaluate((node) => {
        node.click();
        node.click();
      });
    await expect(page.locator('.stemScores')).toHaveText('scores: -1');
    await page.locator('.optionItem.Bgc-ground').dispatchEvent('click');
    await expect(page.locator('.stemScores')).toHaveText('scores: -1');
    await page.clock.runFor(499);
    await expect(page.locator('.stemStatus')).not.toBeEmpty();
    await page.clock.runFor(1);
    await expect(page.locator('.stemStatus')).toBeEmpty();
    await page.locator('.optionItem.Bgc-wrong').dispatchEvent('click');
    await expect(page.locator('.stemScores')).toHaveText('scores: -1');
    await page.locator('.optionItem.Bgc-ground').click();
    await expect(page.locator('.stemScores')).toHaveText('scores: 0');

    // A same-document mode change must replace the store and cancel feedback.
    await page.evaluate(() => {
      window.location.hash = '/en/quizzes/s/speedrun/defend';
    });
    await expect(page.locator('.overlay')).toBeVisible();
    await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
    await page.clock.runFor(2000);
    await expect(page.locator('.stemScores')).toHaveText('scores: 0');
    await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
    await expect(page.locator('.optionDamage')).toHaveCount(0);
    await page.getByTestId('start-game').click();
    await page.clock.runFor(1000);
    await expect(page.locator('.stemTimer')).toHaveText('timer: 1');
    await page.evaluate(() => {
      window.location.hash = '/en/menu';
    });
    await expect(page.locator('.Menu')).toBeVisible();
    await page.clock.runFor(60000);
    await expect(page).toHaveURL(/#\/en\/menu$/);
    expect(errors).toEqual([]);
  },
);

for (const mode of ['basic', 'speedrun']) {
  test(`${lang}/${mode}: exit confirmation preserves play or returns to menu`, async ({ page }) => {
    await pauseClock(page);
    await page.goto(`./#/${lang}/quizzes/s/${mode}/attack`);
    await page.getByTestId('start-game').click();
    const exit = page.getByRole('button', { name: text.EXIT_GAME, exact: true });
    await exit.click();
    const dialog = page.getByRole('dialog', { name: text.EXIT_CONFIRM_TITLE });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('button', { name: text.CONTINUE_GAME })).toBeFocused();
    await page.locator('.optionItem').first().dispatchEvent('click');
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText(
      `${text.TIMER}: ${mode === 'basic' ? 58 : 2}`,
    );
    await dialog.getByRole('button', { name: text.CONTINUE_GAME }).click();
    await expect(dialog).toHaveCount(0);
    await page.clock.runFor(1); // Radix restores focus after the dialog unmounts.
    await expect(exit).toBeFocused();
    await page.locator(await correctSelector(page, 'attack')).click();
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 1`);
    await exit.click();
    await page.clock.runFor(500);
    await expect(dialog.getByRole('button', { name: text.CONTINUE_GAME })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await page.clock.runFor(1);
    await expect(exit).toBeFocused();
    await exit.click();
    await dialog.getByRole('link', { name: text.RETURN_TO_MENU, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    await page.clock.runFor(61000);
    await expect(page.locator('.Menu')).toBeVisible();
    await page.goto(`./#/${lang}/quizzes/s/${mode}/attack`);
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
    await expect(page.locator('.stemTimer')).toHaveText(
      `${text.TIMER}: ${mode === 'basic' ? 60 : 0}`,
    );
  });
}

test('basic game finishes when time expires during exit confirmation', async ({ page }) => {
  await pauseClock(page);
  await page.goto('./#/zh/quizzes/s/basic/attack');
  await page.getByTestId('start-game').click();
  await page.getByRole('button', { name: text.EXIT_GAME, exact: true }).click();
  await page.clock.runFor(60000);
  await expect(page).toHaveURL(/\/result\/0$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
