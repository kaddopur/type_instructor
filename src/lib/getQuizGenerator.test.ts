import { expect, test, vi } from 'vitest';
import { createQuizGenerator } from './getQuiz.ts';

vi.mock('lodash/shuffle.js', () => {
  let bags = 0;
  return { default: <T>(items: readonly T[]) => {
    const result = [...items];
    // Force the next bag's first target to equal the previous bag's last.
    return items.length === 18 && ++bags % 2 === 0 ? result.reverse() : result;
  } };
});

test('forced boundary collisions terminate, preserve coverage and keep generators independent', () => {
  const random = vi.spyOn(Math, 'random').mockReturnValue(0);
  try {
    const next = createQuizGenerator('attack');
    const first = Array.from({ length: 18 }, () => next().enemy.type);
    const second = Array.from({ length: 18 }, () => next().enemy.type);
    expect(first[17]).toBe('fairy');
    expect(second[0]).toBe('dark'); // fairy moved to the second position.
    expect(second[1]).toBe('fairy');
    expect(new Set(second)).toEqual(new Set(first));
    const independent = createQuizGenerator('defend');
    const other = Array.from({ length: 18 }, () => independent().enemy.type);
    expect(new Set(other)).toEqual(new Set(first));
    const third = Array.from({ length: 18 }, () => next().enemy.type);
    expect(new Set(third)).toEqual(new Set(first));
    expect(third[0]).not.toBe(second[17]);
  } finally {
    random.mockRestore();
  }
});
