import { expect, test } from 'vitest';
import { isGameRoute, normalizeLanguage } from './routes.ts';

test('known languages are preserved and unknown values fall back to English', () => {
  for (const lang of ['en', 'zh', 'ja'] as const) expect(normalizeLanguage(lang)).toBe(lang);
  for (const lang of [undefined, '', 'unknown', '__proto__']) expect(normalizeLanguage(lang)).toBe('en');
});

test('game routes accept supported combinations, negative basic scores and zero elapsed seconds', () => {
  for (const gameType of ['basic', 'speedrun']) {
    for (const quizType of ['attack', 'defend']) {
      expect(isGameRoute({ category: 's', gameType, quizType })).toBe(true);
      expect(isGameRoute({ category: 's', gameType, quizType, value: '0' })).toBe(true);
    }
  }
  expect(isGameRoute({ category: 's', gameType: 'basic', quizType: 'attack', value: '-1' })).toBe(true);
});

test('invalid categories, modes, question types and result values are rejected', () => {
  const valid = { category: 's', gameType: 'basic', quizType: 'attack' };
  expect(isGameRoute({})).toBe(false);
  for (const invalid of [
    { category: 'd' }, { gameType: 'unknown' }, { quizType: 'unknown' },
    ...['', 'NaN', 'Infinity', '1.5', '1e2', '9007199254740992'].map(value => ({ value })),
    { gameType: 'speedrun', value: '-1' }
  ]) {
    expect(isGameRoute({ ...valid, ...invalid })).toBe(false);
  }
});
