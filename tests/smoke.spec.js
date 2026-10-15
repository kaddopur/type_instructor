import { test, expect } from '@playwright/test';

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
      await page.locator('.overlay').click();
      await expect(page.locator('.overlay')).toHaveCount(0);
      await page.locator('.optionItem').first().click();
      await expect(page.locator('.optionDemage')).toHaveCount(1);
      await expect(page.locator('.stemStatus')).not.toBeEmpty();
      await expect(page.locator('.stemScores')).toHaveText(new RegExp(`${text.score}: -?1$`));

      // Deep-link result to check existing result URL, retry, and reset contracts.
      await page.goto(`./#/${lang}/quizzes/s/basic/${kind}/result/7`);
      await expect(page.locator('.Result h1')).toContainText('7');
      await page.getByRole('link', { name: text.retry, exact: true }).click();
      await expect(page.locator('.overlay')).toBeVisible();
      await expect(page.locator('.stemScores')).toHaveText(`${text.score}: 0`);
      await expect(page.locator('.optionDemage')).toHaveCount(0);
      await page.goto(`./#/${lang}/quizzes/s/basic/${kind}/result/7`);
      await page.getByRole('link', { name: text.menu, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/menu$`));
    }
  }
  expect(errors).toEqual([]);
});

test('timer starts once and basic mode reaches its result page', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
  await page.goto('./#/en/quizzes/s/basic/attack');
  await expect(page.locator('.overlay')).toBeVisible();
  await page.clock.runFor(2000);
  await expect(page.locator('.stemTimer')).toHaveText('timer: 60');
  await page.locator('.overlay').click();
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
