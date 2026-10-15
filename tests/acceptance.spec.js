import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const languages = {};
for (const [lang, file, label] of [
  ['en', 'strings.json', 'English'],
  ['zh', 'strings_zh.json', '中文'],
  ['ja', 'strings_ja.json', '日本語']
]) {
  languages[lang] = { label, ...JSON.parse(await readFile(new URL(`../src/lang/${file}`, import.meta.url))) };
}

for (const [lang, text] of Object.entries(languages)) {
  for (const mode of ['basic', 'speedrun']) {
    for (const kind of ['attack', 'defend']) {
      test(`${lang}/${mode}/${kind}: complete, retry, and navigate`, async ({ page }) => {
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
        await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
        // Normal target: fighting is the unique attack answer; ghost is immune in defense.
        await page.addInitScript(() => { Math.random = () => 0.5 / 18; });
        await page.goto('./');
        await expect(page.getByRole('heading', { name: 'Type Instructor of Pokémon' })).toBeVisible();
        await page.getByRole('link', { name: 'change language' }).click();
        await page.getByRole('link', { name: text.label, exact: true }).click();
        await page.locator('footer a').click();
        await page.getByRole('link', { name: text.START, exact: true }).click();
        await page.locator('.Menu section').nth(mode === 'basic' ? 0 : 1)
          .getByRole('link', { name: text[kind.toUpperCase()], exact: true }).click();

        const path = `/${lang}/quizzes/s/${mode}/${kind}`;
        await expect(page).toHaveURL(new RegExp(`#${path}$`));
        await page.reload(); // Direct hash reload must preserve the selected route.
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await expect(page.locator('.stemEnemyText')).toContainText(text[kind === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND']);
        await expect(page.locator('.overlay span')).toHaveText(mode === 'basic' ? text.GOAL_BASIC : text.GOAL_SPEEDRUN.replace('{scoreTarget}', 20));
        await page.clock.runFor(2000);
        await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: ${mode === 'basic' ? 60 : 0}`);
        await page.getByTestId('start-game').evaluate(node => { node.click(); node.click(); });

        const boxes = await page.locator('.optionItem').evaluateAll(nodes => nodes.map(node => {
          const rect = node.getBoundingClientRect();
          return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right };
        }));
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
        await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: ${mode === 'basic' ? 59 : 1}`);

        const correct = `.optionItem.Bgc-${kind === 'attack' ? 'fighting' : 'ghost'}`;
        await page.locator(`.optionItem:not(${correct})`).first().evaluate(node => { node.click(); node.click(); });
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
        const damage = Number(await page.locator('.optionDamage').textContent());
        const status = { 0: 'EFFECTIVE_0', 0.5: 'EFFECTIVE_1_2', 1: 'EFFECTIVE_1', 2: 'EFFECTIVE_2' }[damage];
        await expect(page.locator('.stemStatus')).toHaveText(text[status]);
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
          await page.locator(correct).click();
          await page.clock.runFor(500);
          await page.clock.runFor(57000); // Timer is now 1; feedback ends exactly at expiry.
          await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: 1`);
          await page.locator(correct).click();
          await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 2`);
          await page.clock.runFor(499);
          await expect(page).toHaveURL(new RegExp(`#${path}$`));
          await page.clock.runFor(1);
          result = '2';
        } else {
          for (let score = 1; score <= 20; score++) {
            if (score === 20) result = (await page.locator('.stemTimer').textContent()).split(': ').at(-1);
            await page.locator(correct).click();
            await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: ${score}`);
            await page.clock.runFor(score === 20 ? 499 : 500);
            await expect(page).toHaveURL(new RegExp(`#${path}$`));
            if (score === 20) await page.clock.runFor(1);
            else await expect(page.locator('.optionDamage')).toHaveCount(0);
          }
        }

        await expect(page).toHaveURL(new RegExp(`#${path}/result/${result}$`));
        await expect(page.locator('.Result h1')).toContainText(mode === 'basic' ? text.YOUR_SCORES : text.YOUR_TIME);
        await expect(page.locator('.Result h1')).toContainText(mode === 'basic' ? result : `${result}s`);
        await page.clock.runFor(2000); // No late callback may replace the final result.
        await expect(page).toHaveURL(new RegExp(`#${path}/result/${result}$`));
        await page.getByRole('link', { name: text.RETRY, exact: true }).click();
        await expect(page.locator('.overlay')).toBeVisible();
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
        await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: ${mode === 'basic' ? 60 : 0}`);
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
      });
    }
  }
}
