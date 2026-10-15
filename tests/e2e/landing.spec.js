import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const copy = JSON.parse(await readFile(new URL('../../src/lang/landing.json', import.meta.url)));

async function checkImages(page, lang) {
  for (const image of await page.locator('.Landing img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toHaveJSProperty('naturalWidth', 390);
    await expect(image).toHaveJSProperty('naturalHeight', 844);
    const assetPath = process.env.E2E_SERVER === 'dev' ? 'src/images/landing' : 'assets';
    await expect(image).toHaveAttribute(
      'src',
      new RegExp(`/type_instructor/${assetPath}/${lang}-`),
    );
  }
}

for (const lang of ['en', 'zh', 'ja']) {
  test(`${lang}: landing fits mobile and desktop, explains play and returns to the game`, async ({
    page,
    browserName,
    isMobile,
  }) => {
    test.setTimeout(60000);
    for (const viewport of [
      { width: 320, height: 568 },
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 1280, height: 900 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto(`./#/${lang}/about/`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await expect(page.locator('h1')).toHaveText('Type Instructor');
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('.app-content')).toHaveCSS('overflow-y', 'auto');
      if (browserName === 'webkit' && isMobile) {
        // Playwright does not implement wheel input for mobile WebKit.
        await page.locator('.landing-brand').focus();
        await page.keyboard.press('PageDown');
      } else {
        await page.mouse.move(viewport.width / 2, viewport.height / 2);
        await page.mouse.wheel(0, 500);
      }
      await expect
        .poll(() => page.locator('.app-content').evaluate((node) => node.scrollTop))
        .toBeGreaterThan(0);
      const size = await page.locator('.app-content').evaluate((node) => ({
        width: node.clientWidth,
        scrollWidth: node.scrollWidth,
        height: node.clientHeight,
        scrollHeight: node.scrollHeight,
      }));
      expect(size.scrollWidth).toBeLessThanOrEqual(size.width);
      expect(size.scrollHeight).toBeGreaterThan(size.height);
      expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(
        viewport.height,
      );
      await page.getByRole('button', { name: copy[lang].howLink, exact: true }).click();
      await expect(page.locator('#how-title')).toBeInViewport();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/about/$`));
      await checkImages(page, lang);
      await page.locator('.landing-closing a').click();
      await expect(page.locator('.Menu')).toBeVisible();
      await expect(page.locator('.app-content')).toHaveCSS('overflow-y', 'hidden');
      await expect(page.locator('.app-content')).toHaveJSProperty('scrollTop', 0);
      await page.goto(`./#/${lang}/`);
      await expect(page.locator('.Home a[href^="https://github.com"]')).toHaveCount(0);
      await page.locator('.home-about').click();
      await expect(page).toHaveURL(new RegExp(`#/${lang}/about$`));
    }
  });
}

test('landing language navigation preserves the introduction route', async ({ page }) => {
  await page.goto('./#/en/about');
  for (const [lang, label] of [
    ['ja', '日本語'],
    ['zh', '中文'],
    ['en', 'English'],
  ]) {
    const link = page.getByRole('link', { name: label, exact: true });
    await link.click();
    await expect(link).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page).toHaveURL(new RegExp(`#/${lang}/about$`));
  }
  await page.goto('./#/unknown/about');
  await expect(page.locator('h1')).toHaveText('Type Instructor');
});

test('three-language landing accessibility scans', { tag: '@a11y' }, async ({ page }) => {
  test.setTimeout(60000);
  for (const lang of ['en', 'zh', 'ja']) {
    await page.goto(`./#/${lang}/about`);
    await page.evaluate(() => document.fonts.ready);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(violations).toEqual([]);
  }
});

test(
  'landing and all localized screenshots work offline after caching',
  { tag: '@offline' },
  async ({ page, context }) => {
    test.skip(process.env.E2E_SERVER === 'dev', 'Service worker requires the production build');
    test.setTimeout(60000);
    await page.goto('./#/en/about');
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
      if (!navigator.serviceWorker.controller)
        await new Promise((resolve) =>
          navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }),
        );
    });
    await context.setOffline(true);
    for (const lang of ['en', 'zh', 'ja']) {
      await page.goto(`./#/${lang}/about`);
      await page.reload();
      await expect(page.locator('h1')).toHaveText('Type Instructor');
      await checkImages(page, lang);
    }
  },
);
