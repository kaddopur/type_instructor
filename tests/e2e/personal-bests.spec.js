import { test, expect } from '@playwright/test';
import { correctSelector } from './support/matchups.js';

test('completed scores persist across reloads and languages; unfinished games and result URLs do not count', async ({
  page,
}) => {
  await page.clock.install({ time: new Date('2026-10-15T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-10-15T00:00:10Z'));
  await page.goto('./#/zh/menu');
  await expect(page.locator('#record-basic-attack')).toHaveText('最高分：—');
  await page.locator('.mode-basic').getByRole('link', { name: '攻擊', exact: true }).click();
  await page.getByTestId('start-game').click();
  await page.locator(await correctSelector(page, 'attack')).click();
  await page.clock.runFor(60000);
  await expect(page).toHaveURL(/\/result\/1$/);
  await page.getByRole('link', { name: '目錄', exact: true }).click();
  await expect(page.locator('#record-basic-attack')).toHaveText('最高分：1');
  await expect(page.locator('#record-basic-defend')).toHaveText('最高分：—');
  await page.reload();
  await expect(page.locator('#record-basic-attack')).toHaveText('最高分：1');

  await page.goto('./#/en/quizzes/s/basic/attack/result/999');
  await page.getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page.locator('#record-basic-attack')).toHaveText('Best: 1');

  await page.locator('.mode-speedrun').getByRole('link', { name: 'Attack', exact: true }).click();
  await page.getByTestId('start-game').click();
  await page.locator(await correctSelector(page, 'attack')).click();
  await page.getByRole('button', { name: 'Exit', exact: true }).click();
  await page.getByRole('link', { name: 'Return to menu', exact: true }).click();
  await expect(page.locator('#record-speedrun-attack')).toHaveText('Fastest: —');

  await page.locator('.mode-speedrun').getByRole('link', { name: 'Attack', exact: true }).click();
  await page.getByTestId('start-game').click();
  for (let score = 0; score < 20; score++) {
    await page.locator(await correctSelector(page, 'attack')).click();
    await page.clock.runFor(500);
  }
  await expect(page).toHaveURL(/\/result\/9$/);
  await page.getByRole('link', { name: 'Menu', exact: true }).click();
  await expect(page.locator('#record-speedrun-attack')).toHaveText('Fastest: 9s');
  await expect(page.locator('#record-speedrun-defend')).toHaveText('Fastest: —');
});
