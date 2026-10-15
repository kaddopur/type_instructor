import { test, expect } from '@playwright/test';
import { SCORE_TARGET } from '../src/lib/gameRules.ts';

async function pauseClock(page) {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
}

test('unknown languages and invalid game URLs recover without crashing or leaving timers', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await pauseClock(page);
  await page.goto('./#/unknown/menu');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { name: 'Basic', exact: true })).toBeVisible();
  await expect(page.locator('.Menu a').first()).toHaveAttribute('href', '#/en/quizzes/s/basic/attack');

  await page.goto('./#/unknown/quizzes/s/basic/attack');
  await expect(page.locator('.overlay span')).toHaveText('answer in 60 sec');
  await page.getByTestId('start-game').click();
  await page.clock.runFor(1000);
  await expect(page.locator('.stemTimer')).toHaveText('timer: 59');

  for (const path of [
    '/zh/quizzes/d/basic/attack',
    '/ja/quizzes/s/unknown/attack',
    '/en/quizzes/s/basic/unknown',
    '/zh/quizzes/s/basic/attack/result/NaN',
    '/ja/quizzes/s/speedrun/defend/result/-1',
    '/en/quizzes/s/basic/attack/result/9007199254740992',
    '/zh/quizzes/s/basic/attack/result/1.5',
    '/unknown/quizzes/s/basic/attack/result/1e2'
  ]) {
    await page.evaluate(path => { window.location.hash = path; }, path);
    const lang = path.split('/')[1];
    await expect(page).toHaveURL(new RegExp(`#/${lang === 'unknown' ? 'en' : lang}/menu$`));
    await expect(page.locator('.Menu')).toBeVisible();
    await page.clock.runFor(61000);
    await expect(page.locator('.Menu')).toBeVisible();
  }

  // Negative basic scores and zero-second speedrun results remain valid links.
  for (const [mode, value] of [['basic', '-1'], ['speedrun', '0']]) {
    await page.goto(`./#/en/quizzes/s/${mode}/attack/result/${value}`);
    await expect(page.locator('.Result h1')).toContainText(value);
    await page.getByRole('link', { name: 'Retry', exact: true }).click();
    await expect(page.locator('.overlay')).toBeVisible();
  }

  await page.goto('./#/en/does-not-exist');
  await expect(page).toHaveURL(/#\/en\/$/);
  await expect(page.getByRole('heading', { name: 'Type Instructor of Pokémon' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('three languages navigate, render games, show feedback, and retry', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const labels = {
    en: { start: 'Start', language: 'English', attack: 'Attack', defend: 'Defend', retry: 'Retry', menu: 'Menu', score: 'scores', font: '100%' },
    zh: { start: '開始', language: '中文', attack: '攻擊', defend: '防禦', retry: '重玩', menu: '目錄', score: '分數', font: '125%' },
    ja: { start: 'スタート', language: '日本語', attack: '攻撃', defend: '防御', retry: 'やり直し', menu: 'メニューに戻る', score: 'スゴア', font: '125%' }
  };

  for (const [lang, text] of Object.entries(labels)) {
    await page.setViewportSize(lang === 'zh' ? { width: 390, height: 844 } : { width: 1280, height: 900 });
    await page.goto('./');
    await expect(page.getByRole('heading', { name: 'Type Instructor of Pokémon' })).toBeVisible();
    await page.getByRole('link', { name: 'change language' }).click();
    await page.getByRole('link', { name: text.language, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#/${lang}/lang$`));
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect.poll(() => page.locator('html').evaluate(node => node.style.fontSize)).toBe(text.font);
    // Return through the language page's home link.
    await page.locator('footer a').click();
    await page.getByRole('link', { name: text.start, exact: true }).click();

    for (const kind of ['attack', 'defend']) {
      await page.getByRole('link', { name: text[kind], exact: true }).first().click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/quizzes/s/basic/${kind}$`));
      await expect(page.locator('.overlay')).toBeVisible();
      await expect(page.locator('.stemTimer')).toContainText('60');
      await expect(page.locator('.optionItem')).toHaveCount(4);
      await page.getByTestId('start-game').click();
      await expect(page.locator('.overlay')).toHaveCount(0);
      await page.locator('.optionItem').first().click();
      await expect(page.locator('.optionDamage')).toHaveCount(1);
      await expect(page.locator('.stemStatus')).not.toBeEmpty();
      await expect(page.locator('.stemScores')).toHaveText(new RegExp(`${text.score}: -?1$`));

      // Deep-link result to check existing result URL, retry, and reset contracts.
      await page.goto(`./#/${lang}/quizzes/s/basic/${kind}/result/7`);
      await expect(page.locator('.Result h1')).toContainText('7');
      await page.getByRole('link', { name: text.retry, exact: true }).click();
      await expect(page.locator('.overlay')).toBeVisible();
      await expect(page.locator('.stemScores')).toHaveText(`${text.score}: 0`);
      await expect(page.locator('.optionDamage')).toHaveCount(0);
      await page.goto(`./#/${lang}/quizzes/s/basic/${kind}/result/7`);
      await page.getByRole('link', { name: text.menu, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    }
  }
  expect(errors).toEqual([]);
});

test('timer starts once and basic mode reaches its result page', async ({ page }) => {
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
});

test('rapid answers and route changes keep game sessions isolated', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await pauseClock(page);
  // Pin the attacking enemy to electric: ground is the unique immune answer.
  await page.addInitScript(() => { Math.random = () => 12.5 / 18; });
  await page.goto('./#/en/quizzes/s/basic/defend');
  await expect(page.locator('.stemContainer')).toHaveClass(/Bgc-electric/);
  await page.locator('.optionItem.Bgc-ground').dispatchEvent('click');
  await expect(page.locator('.stemScores')).toHaveText('scores: 0');
  await page.getByTestId('start-game').click();

  await page.locator('.optionItem:not(.Bgc-ground)').first().evaluate(node => {
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
  await page.evaluate(() => { window.location.hash = '/en/quizzes/s/speedrun/defend'; });
  await expect(page.locator('.overlay')).toBeVisible();
  await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
  await page.clock.runFor(2000);
  await expect(page.locator('.stemScores')).toHaveText('scores: 0');
  await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
  await expect(page.locator('.optionDamage')).toHaveCount(0);
  await page.getByTestId('start-game').click();
  await page.clock.runFor(1000);
  await expect(page.locator('.stemTimer')).toHaveText('timer: 1');
  await page.evaluate(() => { window.location.hash = '/en/menu'; });
  await expect(page.locator('.Menu')).toBeVisible();
  await page.clock.runFor(60000);
  await expect(page).toHaveURL(/#\/en\/menu$/);
  expect(errors).toEqual([]);
});

test('speedrun continues at 19, finishes at 20 after feedback, and retries cleanly', async ({ page }) => {
  await pauseClock(page);
  await page.addInitScript(() => { Math.random = () => 12.5 / 18; });
  await page.goto('./#/en/menu');
  await page.locator('.Menu section').nth(1).getByRole('link', { name: 'Defend', exact: true }).click();
  await expect(page).toHaveURL(/#\/en\/quizzes\/s\/speedrun\/defend$/);
  await expect(page.locator('.overlay span')).toHaveText('score 20');
  await page.getByTestId('start-game').click();
  for (let score = 1; score <= SCORE_TARGET; score++) {
    await page.locator('.optionItem.Bgc-ground').click();
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
  await expect(page).toHaveURL(new RegExp(`#/en/quizzes/s/speedrun/defend/result/${Math.floor((SCORE_TARGET - 1) / 2)}$`));
  await page.getByRole('link', { name: 'Retry', exact: true }).click();
  await expect(page.locator('.overlay')).toBeVisible();
  await expect(page.locator('.stemTimer')).toHaveText('timer: 0');
  await expect(page.locator('.stemScores')).toHaveText('scores: 0');

  // Leave a fresh answer pending: its timeout must not affect the menu.
  await page.getByTestId('start-game').click();
  await page.locator('.optionItem.Bgc-ground').click();
  await page.evaluate(() => { window.location.hash = '/en/menu'; });
  await expect(page.locator('.Menu')).toBeVisible();
  await page.clock.runFor(2000);
  await expect(page).toHaveURL(/#\/en\/menu$/);
});

test('all languages select correct speedrun modes and show the shared 20-point goal', async ({ page }) => {
  const labels = {
    en: { attack: 'Attack', defend: 'Defend', goal: 'score 20', attackStem: 'attack enemy', defendStem: 'defend against enemy' },
    zh: { attack: '攻擊', defend: '防禦', goal: '達到 20 分', attackStem: '攻擊敵人', defendStem: '防禦來自敵人的攻擊' },
    ja: { attack: '攻撃', defend: '防御', goal: '目指せ 20 点', attackStem: '敵を攻撃する', defendStem: '敵の攻撃を防御する' }
  };
  for (const [lang, text] of Object.entries(labels)) {
    for (const kind of ['attack', 'defend']) {
      await page.goto(`./#/${lang}/menu`);
      await page.locator('.Menu section').nth(1).getByRole('link', { name: text[kind], exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/quizzes/s/speedrun/${kind}$`));
      await expect(page.locator('.stemEnemyText')).toContainText(text[`${kind}Stem`]);
      await expect(page.locator('.overlay span')).toHaveText(text.goal);
      await expect(page.locator('.stemTimer')).toContainText('0');
    }
  }
});

test('static resources resolve under the configured Pages base', async ({ page, request }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  await page.goto('./');
  await expect(page.locator('.Home')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const manifestURL = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(manifestURL).toBe('/type_instructor/manifest.json');
  const response = await request.get(manifestURL);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  const icon = await request.get(new URL(manifest.icons[0].src, response.url()).href);
  expect(icon.headers()['content-type']).toContain('image/png');
  for (const href of await page.locator('link[rel="apple-touch-icon"]').evaluateAll(nodes => nodes.map(node => node.href))) {
    expect((await request.get(href)).headers()['content-type']).toContain('image/png');
  }
  if (process.env.SMOKE_SERVER !== 'dev') {
    const registration = await page.evaluate(async () => {
      const worker = await navigator.serviceWorker.ready;
      return { scope: worker.scope, script: worker.active.scriptURL };
    });
    expect(registration.scope).toBe('http://127.0.0.1:4173/type_instructor/');
    expect(registration.script).toBe('http://127.0.0.1:4173/type_instructor/service-worker.js');
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.locator('.Home')).toBeVisible();
  } else {
    expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  }
  expect(errors).toEqual([]);
});
