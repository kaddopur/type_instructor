import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
import { preview } from 'vite';
import { correctSelector } from '../tests/e2e/support/matchups.js';

// Run after a production build so the marketing page always shows the real game.
const directory = new URL('../src/images/landing/', import.meta.url);
const resultsOnly = process.argv.includes('--results-only');
const sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const sourceWorktreeDirty = Boolean(
  execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim(),
);
await mkdir(directory, { recursive: true });
const server = await preview({
  preview: { host: '127.0.0.1', port: 4175, strictPort: true, open: false },
});
let browser;
try {
  browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {},
  );
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:01Z'));
  await page.addInitScript(() => {
    Math.random = () => 3.5 / 18;
  });
  const base = `http://127.0.0.1:4175${server.config.base}`;
  for (const lang of ['en', 'zh', 'ja']) {
    if (!resultsOnly) {
      await page.goto(`${base}#/${lang}/menu`);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('heading', { level: 1 }).click();
      await page.clock.runFor(100);
      await page.screenshot({ path: new URL(`${lang}-menu.png`, directory).pathname });
      for (const kind of ['attack', 'defend']) {
        await page.goto(`${base}#/${lang}/quizzes/s/basic/${kind}`);
        await page.getByTestId('start-game').click();
        await page.evaluate(() => document.fonts.ready);
        await page.locator('.quiz-instruction').click();
        await page.clock.runFor(100);
        await page.screenshot({ path: new URL(`${lang}-${kind}.png`, directory).pathname });
      }
    }
    await page.goto(`${base}#/${lang}/quizzes/s/basic/attack`);
    await page.getByTestId('start-game').click();
    const correct = await correctSelector(page, 'attack');
    await page.locator(`.optionItem:not(${correct})`).first().click();
    await page.clock.runFor(60000);
    await expect(page.locator('.Result .resultItem')).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.result-summary').click();
    const clip = await page.locator('.Result .resultItem').evaluateAll((nodes) => {
      const boxes = nodes.map((node) => node.getBoundingClientRect());
      const x = Math.floor(Math.min(...boxes.map((box) => box.left))) - 12;
      const y = Math.floor(Math.min(...boxes.map((box) => box.top))) - 12;
      return {
        x,
        y,
        width: Math.ceil(Math.max(...boxes.map((box) => box.right))) - x + 12,
        height: Math.ceil(Math.max(...boxes.map((box) => box.bottom))) - y + 12,
      };
    });
    await page.screenshot({
      path: new URL(`${lang}-result-actions.png`, directory).pathname,
      clip,
    });
  }
  await writeFile(
    new URL(resultsOnly ? 'capture-results.json' : 'capture.json', directory),
    JSON.stringify(
      {
        sourceRevision,
        sourceWorktreeDirty,
        viewport: { width: 390, height: 844 },
        engine: 'Chromium',
        channel: process.env.PLAYWRIGHT_CHANNEL ?? 'chromium',
        languages: ['en', 'zh', 'ja'],
        routes: resultsOnly
          ? ['quizzes/s/basic/attack/result/-1']
          : [
              'menu',
              'quizzes/s/basic/attack',
              'quizzes/s/basic/defend',
              'quizzes/s/basic/attack/result/-1',
            ],
        resultActions:
          'Capture only the three result actions with 12px padding after a real missed answer and timeout.',
        note: 'Unmodified browser screenshots of the built game; fixed randomness and clock for reproducibility.',
      },
      null,
      2,
    ) + '\n',
  );
  if (!resultsOnly) {
    await copyFile(new URL('capture.json', directory), new URL('capture-results.json', directory));
  }
} finally {
  await browser?.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
