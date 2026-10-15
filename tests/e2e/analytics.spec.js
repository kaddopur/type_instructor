import { test, expect } from '@playwright/test';

const deployedOrigin = 'https://kaddopur.github.io';

async function views(page) {
  return page.evaluate(() => (window.dataLayer || []).map(command => Array.from(command))
    .filter(command => command[0] === 'event' && command[1] === 'page_view').map(command => command[2]));
}

test('GA4 queues hash-route views once with updated titles even when Google is blocked', async ({ browser, baseURL }) => {
  test.skip(process.env.E2E_SERVER === 'dev', 'Requires a production build.');
  const context = await browser.newContext({ serviceWorkers: 'block' });
  const errors = [];
  const googleRequests = [];
  // Serve the local production build under the real hostname without contacting the deployed site.
  await context.route(`${deployedOrigin}/**`, async route => {
    const url = new URL(route.request().url());
    const local = new URL(baseURL);
    const response = await route.fetch({
      url: `${local.origin}${url.pathname}${url.search}`,
      headers: { ...route.request().headers(), host: local.host }
    });
    await route.fulfill({ response });
  });
  await context.route('https://www.googletagmanager.com/**', route => {
    googleRequests.push(route.request().url());
    return route.abort();
  });
  try {
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    const home = `${deployedOrigin}/type_instructor/#/en/`;
    await page.goto(home);
    await expect(page.locator('.Home')).toBeVisible();
    await expect.poll(async () => (await views(page)).length).toBe(1);
    expect((await views(page))[0]).toMatchObject({ page_location: home, page_title: await page.title() });
    await page.getByRole('link', { name: 'Start', exact: true }).click();
    await expect(page.locator('.Menu')).toBeVisible();
    const menu = page.url();
    await expect.poll(async () => (await views(page)).length).toBe(2);
    expect((await views(page))[1]).toMatchObject({ page_location: menu, page_referrer: home, page_title: await page.title() });
    await page.locator('.Menu section').first().getByRole('link', { name: 'Attack', exact: true }).click();
    await page.getByTestId('start-game').click();
    await expect.poll(async () => (await views(page)).length).toBe(3);
    const gameView = (await views(page))[2];
    expect(gameView).toMatchObject({ page_location: page.url(), page_referrer: menu, page_title: await page.title() });
    await page.goBack();
    await expect(page.locator('.Menu')).toBeVisible();
    await expect.poll(async () => (await views(page)).length).toBe(4);
    expect((await views(page))[3]).toMatchObject({ page_location: menu, page_referrer: gameView.page_location });
    const commands = await page.evaluate(() => window.dataLayer.map(command => Array.from(command)));
    expect(commands.filter(command => command[0] === 'config')).toEqual([['config', 'G-6H3DMT5TLL', { send_page_view: false }]]);
    expect(googleRequests).toEqual(['https://www.googletagmanager.com/gtag/js?id=G-6H3DMT5TLL']);
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});

test('local previews do not load analytics or retain the retired UA snippet', async ({ page }) => {
  const googleRequests = [];
  await page.route(/google-analytics\.com|googletagmanager\.com/, route => {
    googleRequests.push(route.request().url());
    return route.abort();
  });
  await page.goto('./#/zh/');
  await expect(page.locator('.Home')).toBeVisible();
  expect(await views(page)).toEqual([]);
  expect(googleRequests).toEqual([]);
  expect(await page.content()).not.toContain('UA-6593436-4');
});
