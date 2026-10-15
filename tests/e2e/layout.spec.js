import { test, expect } from '@playwright/test';

test('app shell keeps routes and quiz controls inside the usable mobile viewport', { tag: '@layout' }, async ({ page }) => {
  for (const viewport of [{ width: 390, height: 600 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await page.goto('./#/en/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    const titleSize = await page.locator('.Home h1').evaluate(node => getComputedStyle(node).fontSize);
    let menuGeometry;
    for (const lang of ['en', 'zh', 'ja']) {
      for (const route of ['', 'menu', 'lang', 'quizzes/s/basic/attack/result/7']) {
        await page.goto(`./#/${lang}/${route}`);
        // Emulate nonzero safe-area space; desktop WebKit does not show Safari chrome.
        await page.addStyleTag({ content: '.app-shell { padding: 24px 20px 34px; }' });
        await page.evaluate(() => document.fonts.ready);
        if (!route) {
          await expect(page.locator('.Home h1')).toHaveCSS('font-size', titleSize);
          await expect(page.locator('.Home .start a')).toHaveCSS('font-size', '24px');
          await expect(page.locator('.Home .start a')).toHaveCSS('width', '240px');
          await expect(page.locator('.Home footer a')).toHaveCSS('font-size', '14px');
        }
        if (route === 'menu') {
          const geometry = await page.locator('.Menu .menuItem a').evaluateAll(nodes => nodes.map(node => {
            const { x, y, width, height } = node.getBoundingClientRect();
            return { x, y, width, height };
          }));
          menuGeometry ??= geometry;
          geometry.forEach((bounds, index) => {
            for (const key of ['x', 'y', 'width', 'height']) {
              expect(Math.abs(bounds[key] - menuGeometry[index][key]), `${lang} menu ${index}: ${key}`).toBeLessThanOrEqual(1);
            }
          });
        }
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
      await page.evaluate(() => document.fonts.ready);
      const menuLink = page.getByRole('dialog').getByRole('link');
      const textLines = await menuLink.evaluate(node => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return range.getClientRects().length;
      });
      expect(textLines).toBe(1);
      const menuBounds = await menuLink.boundingBox();
      const dialogBounds = await page.getByRole('dialog').boundingBox();
      const startBounds = await page.getByTestId('start-game').boundingBox();
      expect(Math.abs(menuBounds.width - startBounds.width)).toBeLessThanOrEqual(1);
      for (const action of [menuLink, page.getByTestId('start-game')]) {
        for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
          await expect(action).toHaveCSS(`border-${corner}-radius`, '24px');
        }
      }
      expect(menuBounds.x).toBeGreaterThanOrEqual(dialogBounds.x);
      expect(menuBounds.x + menuBounds.width).toBeLessThanOrEqual(dialogBounds.x + dialogBounds.width);
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

test('all routes preserve layout geometry across languages', { tag: '@layout' }, async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => { Math.random = () => 0.5 / 18; });
  async function geometry(selector) {
    return page.locator(selector).evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return { center: rect.x + rect.width / 2, top: rect.y, height: rect.height,
        width: node.matches('footer a') ? 0 : rect.width,
        radius: style.borderTopLeftRadius, fontSize: style.fontSize };
    }));
  }
  function compare(actual, expected, label) {
    expect(actual.length, label).toBe(expected.length);
    actual.forEach((box, index) => {
      for (const key of ['center', 'top', 'width', 'height']) {
        expect(Math.abs(box[key] - expected[index][key]), `${label} ${index} ${key}`).toBeLessThanOrEqual(1);
      }
      expect(box.radius, label).toBe(expected[index].radius);
      expect(box.fontSize, label).toBe(expected[index].fontSize);
    });
  }
  for (const viewport of [{ width: 390, height: 600 }, { width: 844, height: 390 }, { width: 1280, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const [route, selector] of [
      ['', '.Home h1, .Home .start a, .Home .lang a, footer a'],
      ['menu', '.menuItem a, footer a'],
      ['lang', '.langItem a, footer a'],
      ['quizzes/s/basic/attack/result/7', '.resultItem a, footer a'],
      ['quizzes/s/speedrun/defend/result/7', '.resultItem a, footer a'],
      ...['basic', 'speedrun'].flatMap(mode => ['attack', 'defend'].map(kind =>
        [`quizzes/s/${mode}/${kind}`, '[role="dialog"], [role="dialog"] button, [role="dialog"] a']))
    ]) {
      const expected = {};
      for (const lang of ['en', 'zh', 'ja']) {
        await page.goto(`./#/${lang}/${route}`);
        await expect(page.locator('html')).toHaveAttribute('lang', lang);
        await page.evaluate(() => document.fonts.ready);
        const intro = await geometry(selector);
        expected.intro ??= intro;
        compare(intro, expected.intro, `${lang}/${route} intro`);
        if (!route.endsWith('attack') && !route.endsWith('defend')) continue;
        await page.getByTestId('start-game').click();
        const quizSelector = '.stemContainer, .quiz-instruction, .stemHeader, .stemStatus, .optionItem';
        const playing = await geometry(quizSelector);
        expected.playing ??= playing;
        compare(playing, expected.playing, `${lang}/${route} playing`);
        await page.locator('.optionItem').first().click();
        const answered = await geometry(quizSelector);
        expected.answered ??= answered;
        compare(answered, expected.answered, `${lang}/${route} feedback`);
      }
    }
  }
});
