import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { getPersonalBest, savePersonalBest } from './personalBests.ts';

beforeEach(() => {
  const entries = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
  });
});
afterEach(() => vi.unstubAllGlobals());

test('keeps the highest basic score, including a first negative score, separately for attack and defense', () => {
  expect(getPersonalBest('basic', 'attack')).toBeNull();
  savePersonalBest('basic', 'attack', -3);
  expect(getPersonalBest('basic', 'attack')).toBe(-3);
  for (const score of [0, 8, 2, 8]) savePersonalBest('basic', 'attack', score);
  expect(getPersonalBest('basic', 'attack')).toBe(8);
  expect(getPersonalBest('basic', 'defend')).toBeNull();
  expect(getPersonalBest('speedrun', 'attack')).toBeNull();
});

test('keeps the shortest speedrun, including zero seconds', () => {
  for (const seconds of [30, 40, 20, 20]) savePersonalBest('speedrun', 'defend', seconds);
  expect(getPersonalBest('speedrun', 'defend')).toBe(20);
  savePersonalBest('speedrun', 'defend', 0);
  savePersonalBest('speedrun', 'defend', 12);
  expect(getPersonalBest('speedrun', 'defend')).toBe(0);
});

test('ignores invalid stored data and invalid results', () => {
  for (const data of ['broken', 'null', '"10"', '{}', '-1', '1.5', '9007199254740992']) {
    localStorage.setItem('type-instructor:best:speedrun:attack', data);
    expect(getPersonalBest('speedrun', 'attack')).toBeNull();
  }
  for (const value of [NaN, Infinity, -1, 1.5]) savePersonalBest('speedrun', 'defend', value);
  expect(getPersonalBest('speedrun', 'defend')).toBeNull();
});

test('storage failures do not interrupt play or the menu', () => {
  vi.stubGlobal('localStorage', {
    getItem: () => {
      throw new Error('Storage unavailable');
    },
    setItem: () => {
      throw new Error('Storage unavailable');
    },
  });
  expect(getPersonalBest('basic', 'attack')).toBeNull();
  expect(() => savePersonalBest('basic', 'attack', 5)).not.toThrow();
});
