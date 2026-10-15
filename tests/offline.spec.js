import { test, expect } from '@playwright/test';
import { serveOfflineBuilds } from './support/offline-server.js';

async function updateWorker(page) {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const completed = new Promise(resolve => {
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated' || worker.state === 'redundant') resolve(worker.state);
        });
      }, { once: true });
    });
    await registration.update();
    return completed;
  });
}

test('legacy and current workers update safely, survive failed installs, and play offline', async ({ page }) => {
  test.skip(process.env.SMOKE_SERVER === 'dev', 'Worker upgrade requires the production build.');
  test.setTimeout(60_000);
  const fixture = await serveOfflineBuilds();
  const origin = new URL(fixture.url).origin;
  const legacyCache = `sw-precache-v2-sw-precache-${fixture.url}`;
  const unrelatedCaches = [
    `sw-precache-v2-sw-precache-${origin}/another-app/`,
    `another-app-precache-v2-${fixture.url}nested-app/`
  ];

  try {
    await page.goto(fixture.url);
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller) {
        await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
      }
    });
    await expect(page.getByRole('heading', { name: 'Legacy build' })).toBeVisible();
    expect(await page.evaluate(name => caches.has(name), legacyCache)).toBe(true);
    await page.evaluate(async names => {
      for (const name of names) {
        const cache = await caches.open(name);
        await cache.put('/another-app/keep', new Response('keep'));
      }
    }, unrelatedCaches);

    // A real Workbox install with a missing precache asset must not displace legacy.
    fixture.select('broken');
    expect(await updateWorker(page)).toBe('redundant');
    expect(await page.evaluate(name => caches.has(name), legacyCache)).toBe(true);
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Legacy build' })).toBeVisible();
    await page.context().setOffline(false);

    fixture.select('current');
    expect(await updateWorker(page)).toBe('activated');
    await expect.poll(() => page.evaluate(name => caches.has(name), legacyCache)).toBe(false);
    // Activation does not reload an already open page.
    await expect(page.getByRole('heading', { name: 'Legacy build' })).toBeVisible();
    for (const name of unrelatedCaches) {
      expect(await page.evaluate(name => caches.has(name), name)).toBe(true);
    }
    await page.reload();
    await expect(page.locator('.Home')).toBeVisible();
    expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).updateViaCache)).toBe('none');

    await page.context().setOffline(true);
    await page.reload();
    await expect(page.locator('.Home')).toBeVisible();
    await page.evaluate(() => { location.hash = '/zh/menu'; });
    await page.getByRole('link', { name: '防禦', exact: true }).first().click();
    await page.locator('.overlay').click();
    await page.locator('.optionItem').first().click();
    await expect(page.locator('.stemScores')).toHaveText(/分數: -?1$/);
    const scores = await page.locator('.stemScores').textContent();
    const gameURL = page.url();

    // A second actual build changes index.html's revision, exercising Workbox cleanup.
    await page.context().setOffline(false);
    fixture.select('next');
    expect(await updateWorker(page)).toBe('activated');
    await expect(page).toHaveURL(gameURL);
    await expect(page.locator('.stemScores')).toHaveText(scores);
    await expect(page.locator('html')).not.toHaveAttribute('data-build', 'next');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-build', 'next');
    await expect(page.locator('.overlay')).toBeVisible();
    await expect(page.locator('.stemScores')).toHaveText('分數: 0');
    await page.context().setOffline(true);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-build', 'next');
    await expect(page.locator('.overlay')).toBeVisible();
    for (const name of unrelatedCaches) {
      expect(await page.evaluate(name => caches.has(name), name)).toBe(true);
      expect(await page.evaluate(async name => {
        const cache = await caches.open(name);
        return (await cache.match('/another-app/keep')).text();
      }, name)).toBe('keep');
    }
    expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(1);
  } finally {
    await page.context().setOffline(false);
    await fixture.close();
  }
});
