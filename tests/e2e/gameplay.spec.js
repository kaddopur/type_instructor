import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { correctSelector } from './support/matchups.js';
import { SCORE_TARGET } from '../../src/lib/gameRules.ts';

const languages = {};
for (const [lang, file, label] of [
  ['en', 'strings.json', 'English'],
  ['zh', 'strings_zh.json', '中文'],
  ['ja', 'strings_ja.json', '日本語'],
]) {
  languages[lang] = {
    label,
    ...JSON.parse(await readFile(new URL(`../../src/lang/${file}`, import.meta.url))),
  };
}

for (const [lang, text] of Object.entries(languages)) {
  for (const mode of ['basic', 'speedrun']) {
    for (const kind of ['attack', 'defend']) {
      test(
        `${lang}/${mode}/${kind}: complete, retry, and navigate`,
        { tag: '@gameplay' },
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

          const boxes = await page.locator('.optionItem').evaluateAll((nodes) =>
            nodes.map((node) => {
              const rect = node.getBoundingClientRect();
              return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
            }),
          );
          const viewport = page.viewportSize();
          expect(boxes).toHaveLength(4);
          for (const box of boxes) {
            expect(box.top).toBeGreaterThanOrEqual(0);
            expect(box.bottom).toBeLessThanOrEqual(viewport.height + 1);
            expect(box.left).toBeGreaterThanOrEqual(0);
            expect(box.right).toBeLessThanOrEqual(viewport.width + 1);
          }
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
          await page.clock.runFor(499);
          await expect(page.locator('.stemStatus')).not.toBeEmpty();
          await page.clock.runFor(1);
          await page.locator('.optionItem.Bgc-wrong').dispatchEvent('click'); // Rejected after feedback too.
          await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
          await page.locator(correct).click();
          await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
          await page.clock.runFor(500);
          await expect(page.locator('.optionDamage')).toHaveCount(0);

          let result;
          if (mode === 'basic') {
            await page.locator(await correctSelector(page, kind)).click();
            await page.clock.runFor(500);
            await page.clock.runFor(57000); // Timer is now 1; feedback ends exactly at expiry.
            await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: 1`);
            await page.locator(await correctSelector(page, kind)).click();
            await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 2`);
            await page.clock.runFor(499);
            await expect(page).toHaveURL(new RegExp(`#${path}$`));
            await page.clock.runFor(1);
            result = '2';
          } else {
            for (let score = 1; score <= 20; score++) {
              if (score === 20)
                result = (await page.locator('.stemTimer').textContent()).split(': ').at(-1);
              await page.locator(await correctSelector(page, kind)).click();
              await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: ${score}`);
              await page.clock.runFor(score === 20 ? 499 : 500);
              await expect(page).toHaveURL(new RegExp(`#${path}$`));
              if (score === 20) await page.clock.runFor(1);
              else await expect(page.locator('.optionDamage')).toHaveCount(0);
            }
          }

          await expect(page).toHaveURL(new RegExp(`#${path}/result/${result}$`));
          await expect(page.locator('.Result h1')).toContainText(
            mode === 'basic' ? text.YOUR_SCORES : text.YOUR_TIME,
          );
          await expect(page.locator('.Result h1')).toContainText(
            mode === 'basic' ? result : `${result}s`,
          );
          await page.clock.runFor(2000); // No late callback may replace the final result.
          await expect(page).toHaveURL(new RegExp(`#${path}/result/${result}$`));
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
}

async function pauseClock(page) {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
}

test(
  'timer starts once and basic mode reaches its result page',
  { tag: '@smoke' },
  async ({ page }) => {
    await pauseClock(page);
    await page.goto('./#/en/quizzes/s/basic/attack');
    await expect(page.locator('.overlay')).toBeVisible();
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText('timer: 60');
    await page.getByTestId('start-game').click();
    await page.clock.runFor(1000);
    await expect(page.locator('.stemTimer')).toHaveText('timer: 59');
    await page.clock.runFor(59000);
    await expect(page).toHaveURL(/#\/en\/quizzes\/s\/basic\/attack\/result\/0$/);
    await expect(page.locator('.Result h1')).toContainText('0');
    await page.getByRole('link', { name: 'Retry', exact: true }).click();
    await expect(page.locator('.overlay')).toBeVisible();
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText('timer: 60');
  },
);

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

test(
  'speedrun continues at 19, finishes at 20 after feedback, and retries cleanly',
  { tag: '@smoke' },
  async ({ page }) => {
    await pauseClock(page);
    await page.addInitScript(() => {
      Math.random = () => 12.5 / 18;
    });
    await page.goto('./#/en/menu');
    await page
      .locator('.Menu section')
      .nth(1)
      .getByRole('link', { name: 'Defend', exact: true })
      .click();
    await expect(page).toHaveURL(/#\/en\/quizzes\/s\/speedrun\/defend$/);
    await expect(page.locator('.overlay span')).toHaveText('score 20');
    await page.getByTestId('start-game').click();
    for (let score = 1; score <= SCORE_TARGET; score++) {
      await page.locator(await correctSelector(page, 'defend')).click();
      await expect(page.locator('.stemScores')).toHaveText(`scores: ${score}`);
      if (score === SCORE_TARGET) {
        await page.clock.runFor(499);
        await expect(page).toHaveURL(/#\/en\/quizzes\/s\/speedrun\/defend$/);
        await page.clock.runFor(1);
      } else {
        await page.clock.runFor(500);
        if (score === 19) await expect(page).toHaveURL(/#\/en\/quizzes\/s\/speedrun\/defend$/);
      }
      if (score < SCORE_TARGET) await expect(page.locator('.optionDamage')).toHaveCount(0);
    }
    await expect(page).toHaveURL(
      new RegExp(`#/en/quizzes/s/speedrun/defend/result/${Math.floor((SCORE_TARGET - 1) / 2)}$`),
    );
    await page.getByRole('link', { name: 'Retry', exact: true }).click();
    await expect(page.locator('.overlay')).toBeVisible();
    await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
    await expect(page.locator('.stemScores')).toHaveText('scores: 0');

    // Leave a fresh answer pending: its timeout must not affect the menu.
    await page.getByTestId('start-game').click();
    await page.locator('.optionItem.Bgc-ground').click();
    await page.evaluate(() => {
      window.location.hash = '/en/menu';
    });
    await expect(page.locator('.Menu')).toBeVisible();
    await page.clock.runFor(2000);
    await expect(page).toHaveURL(/#\/en\/menu$/);
  },
);

test(
  'all languages select correct speedrun modes and show the shared 20-point goal',
  { tag: '@smoke' },
  async ({ page }) => {
    const labels = {
      en: {
        attack: 'Attack',
        defend: 'Defend',
        goal: 'score 20',
        attackStem: 'Enemy type',
        defendStem: 'Enemy attack type',
      },
      zh: {
        attack: '攻擊',
        defend: '防禦',
        goal: '達到 20 分',
        attackStem: '敵方屬性',
        defendStem: '敵方攻擊屬性',
      },
      ja: {
        attack: '攻撃',
        defend: '防御',
        goal: '目指せ 20 点',
        attackStem: '敵のタイプ',
        defendStem: '敵の攻撃タイプ',
      },
    };
    for (const [lang, text] of Object.entries(labels)) {
      for (const kind of ['attack', 'defend']) {
        await page.goto(`./#/${lang}/menu`);
        await page
          .locator('.Menu section')
          .nth(1)
          .getByRole('link', { name: text[kind], exact: true })
          .click();
        await expect(page).toHaveURL(new RegExp(`#/${lang}/quizzes/s/speedrun/${kind}$`));
        await expect(page.locator('.stemEnemyText')).toContainText(text[`${kind}Stem`]);
        await expect(page.locator('.overlay span')).toHaveText(text.goal);
        await expect(page.locator('.stemTimer')).toContainText('0');
      }
    }
  },
);

for (const [lang, text] of Object.entries(languages)) {
  for (const mode of ['basic', 'speedrun']) {
    test(`${lang}/${mode}: exit confirmation preserves play or returns to menu`, async ({
      page,
    }) => {
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
}

test('basic game finishes when time expires during exit confirmation', async ({ page }) => {
  await pauseClock(page);
  await page.goto('./#/zh/quizzes/s/basic/attack');
  await page.getByTestId('start-game').click();
  await page.getByRole('button', { name: languages.zh.EXIT_GAME, exact: true }).click();
  await page.clock.runFor(60000);
  await expect(page).toHaveURL(/\/result\/0$/);
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

for (const kind of ['attack', 'defend']) {
  test(
    `${kind}: two bags cover all types and defense practices resistance in round two`,
    { tag: '@gameplay' },
    async ({ page }) => {
      await pauseClock(page);
      await page.goto(`./#/en/quizzes/s/basic/${kind}`);
      await page.getByTestId('start-game').click();
      const immuneAttacks = new Set([
        'normal',
        'fighting',
        'poison',
        'ground',
        'ghost',
        'electric',
        'psychic',
        'dragon',
      ]);
      let previous;
      for (let round = 0; round < 2; round++) {
        const seen = new Set();
        for (let index = 0; index < 18; index++) {
          const enemy = await page
            .locator('.stemContainer')
            .evaluate((node) =>
              [...node.classList].find((name) => name.startsWith('Bgc-')).slice(4),
            );
          expect(enemy).not.toBe(previous);
          seen.add(enemy);
          previous = enemy;
          await page.locator(await correctSelector(page, kind)).click();
          const expected =
            kind === 'attack' ? 2 : round === 0 && immuneAttacks.has(enemy) ? 0 : 0.5;
          await expect(page.locator('.optionDamage')).toHaveText(String(expected));
          await expect(page.locator('.stemScores')).toHaveText(`scores: ${round * 18 + index + 1}`);
          await page.clock.runFor(500);
        }
        expect(seen.size).toBe(18);
      }
    },
  );
}
