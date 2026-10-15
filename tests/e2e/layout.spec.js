import { test, expect } from '@playwright/test';

test('app shell keeps routes and quiz controls inside the usable mobile viewport', { tag: '@layout' }, async ({ page }) => {
  for (const viewport of [{ width: 390, height: 600 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    for (const lang of ['en', 'zh', 'ja']) {
      for (const route of ['', 'menu', 'lang', 'quizzes/s/basic/attack/result/7']) {
        await page.goto(`./#/${lang}/${route}`);
        // Emulate nonzero safe-area space; desktop WebKit does not show Safari chrome.
        await page.addStyleTag({ content: '.app-shell { padding: 24px 20px 34px; }' });
        await page.evaluate(() => document.fonts.ready);
        const footer = page.locator('footer a');
        for (const action of await page.locator('.app-content a').all()) {
          const bounds = await action.boundingBox();
          expect(bounds.y).toBeGreaterThanOrEqual(24);
          expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height - 34 + 1);
        }
        const contentSize = await page.locator('.app-content').evaluate(node => ({
          scroll: node.scrollHeight, visible: node.clientHeight
        }));
        expect(contentSize.scroll, `${lang}/${route} at ${viewport.width}x${viewport.height}`).toBe(contentSize.visible);
        expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(viewport.height);
        if (route) {
          await footer.click();
          await expect(page.locator('.Home')).toBeVisible();
          await expect(page.locator('.app-content')).toHaveJSProperty('scrollTop', 0);
          await expect(page.locator('.Home .start a')).toBeInViewport();
        }
      }
      await page.goto(`./#/${lang}/quizzes/s/basic/attack`);
      await page.addStyleTag({ content: '.app-shell { padding: 24px 20px 34px; }' });
      await page.getByTestId('start-game').click();
      for (const answer of await page.locator('.optionItem').all()) {
        const bounds = await answer.boundingBox();
        expect(bounds.y).toBeGreaterThanOrEqual(24);
        expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height - 34 + 1);
        expect(bounds.x).toBeGreaterThanOrEqual(20);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width - 20 + 1);
      }
    }
  }
});

test('language buttons keep their size and position when the language changes', { tag: '@layout' }, async ({ page }) => {
  for (const viewport of [{ width: 390, height: 600 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto('./#/en/lang');
    await page.evaluate(() => document.fonts.ready);
    const buttons = page.locator('.langItem a');
    const original = await buttons.evaluateAll(nodes => nodes.map(node => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y, width, height };
    }));
    for (const [lang, label] of [['ja', '日本語'], ['zh', '中文'], ['en', 'English']]) {
      await page.getByRole('link', { name: label, exact: true }).click();
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await page.evaluate(() => document.fonts.ready);
      for (let index = 0; index < original.length; index++) {
        const bounds = await buttons.nth(index).boundingBox();
        for (const key of ['x', 'y', 'width', 'height']) {
          expect(Math.abs(bounds[key] - original[index][key]), `${lang} button ${index}: ${key}`).toBeLessThanOrEqual(1);
        }
      }
      for (const button of await buttons.all()) {
        for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
          await expect(button).toHaveCSS(`border-${corner}-radius`, '24px');
        }
      }
      await expect(page.getByRole('link', { name: label, exact: true })).toHaveAttribute('aria-current', 'page');
    }
  }
});
