import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { correctSelector } from './support/matchups.js';
import AxeBuilder from '@axe-core/playwright';

const languages = {};
for (const [lang, file] of [['en', 'strings.json'], ['zh', 'strings_zh.json'], ['ja', 'strings_ja.json']]) {
  languages[lang] = JSON.parse(await readFile(new URL(`../../src/lang/${file}`, import.meta.url)));
}

async function tabTo(page, target) {
  for (let n = 0; n < 10; n++) {
    if (await target.evaluate(node => node === document.activeElement)) return;
    const backwards = await target.evaluate(node =>
      Boolean(document.activeElement.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_PRECEDING));
    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
  }
  await expect(target).toBeFocused();
}

for (const [lang, text] of Object.entries(languages)) {
  test(`${lang}: keyboard-only dialog, answers, completion and retry`, { tag: '@a11y' }, async ({ page }) => {
    await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
    await page.addInitScript(() => { Math.random = () => 0.5 / 18; });
    const mode = lang === 'en' ? 'speedrun' : 'basic';
    await page.goto(`./#/${lang}/`);
    await expect(page.getByRole('link', { name: text.START, exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    const firstMenuLink = page.locator('.Menu section').first().getByRole('link', { name: text.ATTACK, exact: true });
    await expect(firstMenuLink).toBeFocused();
    await tabTo(page, page.locator('.Menu section').nth(mode === 'basic' ? 0 : 1).getByRole('link', { name: text.ATTACK, exact: true }));
    await page.keyboard.press('Enter');
    const start = page.getByRole('button', { name: text.START, exact: true });
    await expect(start).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('dialog').getByRole('link', { name: text.MENU, exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    await expect(firstMenuLink).toBeFocused();
    await tabTo(page, page.locator('.Menu section').nth(mode === 'basic' ? 0 : 1)
      .getByRole('link', { name: text.ATTACK, exact: true }));
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('.optionItem').first()).toBeFocused();
    await expect(page.locator('.optionItem').first()).toHaveAccessibleDescription(new RegExp(text.ENEMY_ATTACK));

    const wrong = page.locator('.optionItem:not(.Bgc-fighting)').first();
    await tabTo(page, wrong);
    await page.keyboard.press('Enter');
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: -1`);
    if (mode === 'speedrun') await expect(page.getByRole('progressbar')).toHaveJSProperty('value', 0);
    else await expect(page.getByRole('progressbar')).toHaveCount(0);
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

    if (mode === 'speedrun') {
      for (let score = 1; score <= 20; score++) {
        await tabTo(page, page.locator(await correctSelector(page, 'attack')));
        await page.keyboard.press('Enter');
        await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: ${score}`);
        await expect(page.getByRole('progressbar')).toHaveJSProperty('value', score);
        await page.clock.runFor(500);
        if (score < 20) await expect(page.locator('.optionItem').first()).toBeFocused();
      }
    } else {
      await page.clock.runFor(59000);
    }
    await expect(page).toHaveURL(new RegExp(`/${mode}/attack/result/\\d+$`));
    await expect(page.getByRole('link', { name: text.RETRY, exact: true })).toBeFocused();
    await expect(page.getByRole('link', { name: text.RETRY, exact: true })).toHaveAccessibleDescription(new RegExp(mode === 'basic' ? text.YOUR_SCORES : text.YOUR_TIME));
    await tabTo(page, page.getByRole('link', { name: text.RETRY, exact: true }));
    await page.keyboard.press('Enter');
    await expect(start).toBeFocused();
    await expect(page.locator('.stemScores')).toHaveText(`${text.SCORES}: 0`);
    await page.clock.runFor(2000);
    await expect(page.locator('.stemTimer')).toHaveText(`${text.TIMER}: ${mode === 'basic' ? 60 : 0}`);
  });
}

async function audit(page) {
  await page.evaluate(() => document.fonts.ready);
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(violations).toEqual([]);
}

for (const [lang, text] of Object.entries(languages)) {
  test(`${lang}: accessibility scans of pages, dialogs and answer feedback`, { tag: '@a11y' }, async ({ page }) => {
    test.setTimeout(90000);
    await page.addInitScript(() => { Math.random = () => 0.5 / 18; });
    for (const path of ['/', '/menu', '/lang', '/quizzes/s/basic/attack/result/-1', '/quizzes/s/speedrun/defend/result/0']) {
      await page.goto(`./#/${lang}${path}`);
      await audit(page);
    }
    for (const mode of ['basic', 'speedrun']) {
      for (const kind of ['attack', 'defend']) {
        await page.goto(`./#/${lang}/quizzes/s/${mode}/${kind}`);
        await expect(page.getByRole('dialog')).toHaveAccessibleName(text.GOAL);
        await expect(page.getByRole('dialog')).toHaveAccessibleDescription(
          mode === 'basic' ? text.GOAL_BASIC : text.GOAL_SPEEDRUN.replace('{scoreTarget}', 20));
        await audit(page);
        await page.getByRole('button', { name: text.START, exact: true }).click();
        await audit(page);
        await page.locator(`.optionItem:not(.Bgc-${kind === 'attack' ? 'fighting' : 'ghost'})`).first().click();
        await expect(page.getByRole('status')).toContainText(text.INCORRECT);
        await expect(page.locator('.stemStatus')).toBeEmpty();
        await audit(page);
      }
    }
  });
}

test('all 18 generated type palettes and wrong answers have at least 4.5:1 text contrast', { tag: '@a11y' }, async ({ page }) => {
  const colors = new Set();
  const types = ['normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
    'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'];
  const luminance = rgb => rgb.match(/[\d.]+/g).slice(0, 3).map(value => Number(value) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
  const checkContrast = ({ color, backgroundColor }) => {
    const values = [luminance(color), luminance(backgroundColor)].sort((a, b) => b - a);
    expect((values[0] + .05) / (values[1] + .05), `${color} on ${backgroundColor}`).toBeGreaterThanOrEqual(4.5);
  };
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto('./#/en/quizzes/s/basic/attack');
  await page.getByTestId('start-game').click();
  const seenTypes = new Set();
  for (let index = 0; index < types.length; index++) {
    seenTypes.add(await page.locator('.stemContainer').evaluate(node =>
      [...node.classList].find(name => name.startsWith('Bgc-')).slice(4)));
    const palette = await page.locator('.stemContainer').evaluate(node => {
      const { color, backgroundColor } = getComputedStyle(node);
      return { color, backgroundColor };
    });
    colors.add(palette.backgroundColor);
    checkContrast(palette);
    for (const palette of await page.locator('.optionItem').evaluateAll(nodes => nodes.map(node => {
      const { color, backgroundColor } = getComputedStyle(node);
      return { color, backgroundColor };
    }))) checkContrast(palette);
    await page.locator(await correctSelector(page, 'attack')).click();
    await page.clock.runFor(500);
  }
  expect(seenTypes).toEqual(new Set(types));
  expect(colors.size).toBe(18);
  await page.addInitScript(() => { Math.random = () => .5 / 18; });
  await page.reload();
  await page.getByTestId('start-game').click();
  await page.locator('.optionItem:not(.Bgc-fighting)').first().click();
  checkContrast(await page.locator('.optionItem.Bgc-wrong').evaluate(node => {
    const { color, backgroundColor } = getComputedStyle(node);
    return { color, backgroundColor };
  }));
});
