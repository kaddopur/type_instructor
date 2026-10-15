import { expect, test } from 'vitest';
import getStatus from './getStatus.ts';

test('damage feedback maps all single-type multipliers', () => {
  for (const [value, status] of [[0, 'EFFECTIVE_0'], [0.5, 'EFFECTIVE_1_2'], [1, 'EFFECTIVE_1'], [2, 'EFFECTIVE_2']] as const) {
    expect(getStatus(value)).toBe(status);
  }
});
