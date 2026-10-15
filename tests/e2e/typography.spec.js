import { test, expect } from '@playwright/test';

test('every page keeps text sizes and rendered font metrics consistent across languages', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 600 },
    { width: 844, height: 390 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [route, selector] of [
      ['', '.Home h1, .home-hero p, .home-actions a, .home-notice'],
      [
        'menu',
        '.page-title, .mode-card h2, .mode-card p, .menuItem a, .personal-best, .page-footer',
      ],
      ['lang', '.page-title, .language-choice, .page-footer'],
      ['about', '.Landing h1, .Landing h2, .Landing h3, .Landing p, .Landing button, .Landing a'],
      [
        'quizzes/s/basic/attack/result/24',
        '.result-summary span, .result-summary strong, .result-action, .page-footer',
      ],
      [
        'quizzes/s/speedrun/defend/result/18',
        '.result-summary span, .result-summary strong, .result-action, .page-footer',
      ],
      ['quizzes/s/basic/attack', '.dialog-panel h2, .dialog-goal, .dialog-action, .mode-label'],
    ]) {
      const expected = {};
      async function compareText(selector, state) {
        await page.evaluate(() => document.fonts.ready);
        const actual = await page.locator(selector).evaluateAll((nodes) => {
          const ctx = document.createElement('canvas').getContext('2d');
          return nodes.map((node) => {
            const style = getComputedStyle(node);
            ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            const text = ctx.measureText('Attack 012');
            return {
              size: style.fontSize,
              lineHeight: style.lineHeight,
              width: text.width,
              height: text.actualBoundingBoxAscent + text.actualBoundingBoxDescent,
            };
          });
        });
        expected[state] ??= actual;
        expect(actual.length).toBe(expected[state].length);
        actual.forEach((text, index) => {
          const baseline = expected[state][index];
          expect(text.size, `${route} ${state} ${index}`).toBe(baseline.size);
          expect(text.lineHeight).toBe(baseline.lineHeight);
          expect(Math.abs(text.width - baseline.width)).toBeLessThanOrEqual(1);
          expect(Math.abs(text.height - baseline.height)).toBeLessThanOrEqual(1);
        });
      }
      for (const lang of ['en', 'zh', 'ja']) {
        await page.goto(`./#/${lang}/${route}`);
        await compareText(selector, 'page');
        if (route !== 'quizzes/s/basic/attack') continue;
        await page.getByTestId('start-game').click();
        await compareText(
          '.stemHeader, .quiz-exit, .quiz-instruction, .question-prompt, .question-type, .optionItem',
          'playing',
        );
        await page.locator('.quiz-exit').click();
        await compareText('.exit-dialog h2, .exit-dialog p, .exit-dialog .exit-action', 'exit');
      }
    }
  }
});

test('pixel UI uses compact Latin glyphs rather than full-width Latin fallbacks', async ({
  page,
}) => {
  await page.goto('./#/en/menu');
  await page.evaluate(() => document.fonts.ready);
  const ratio = await page
    .locator('.mode-card h2')
    .first()
    .evaluate((node) => {
      const style = getComputedStyle(node);
      const ctx = document.createElement('canvas').getContext('2d');
      ctx.font = `${style.fontSize} ${style.fontFamily}`;
      return ctx.measureText('Aa').width / ctx.measureText('中').width;
    });
  expect(ratio).toBeLessThan(1.25);
});
