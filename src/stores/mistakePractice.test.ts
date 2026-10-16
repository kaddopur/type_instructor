import { expect, test } from 'vitest';
import { createMistakePracticeStore } from './mistakePractice.ts';
import type { Quiz } from '../lib/types.ts';

const a: Quiz = {
  enemy: { title: 'ENEMY_ATTACK', type: 'normal' },
  options: [
    { type: 'normal', damage: 1 },
    { type: 'fighting', damage: 2 },
    { type: 'ghost', damage: 0 },
    { type: 'rock', damage: 1 },
  ],
  answer: 'fighting',
};
const b: Quiz = { ...a, enemy: { title: 'ENEMY_ATTACK', type: 'steel' } };
const c: Quiz = { ...a, enemy: { title: 'ENEMY_ATTACK', type: 'ice' } };

test('wrong rotates A to B,C,A and correct removes each question without changing source', () => {
  const questions = structuredClone([a, b, c]);
  const store = createMistakePracticeStore(questions);
  store.getState().answer(0);
  expect(store.getState().phase).toMatchObject({
    kind: 'feedback',
    current: a,
    selectedIndex: 0,
    correct: false,
  });
  store.getState().advance();
  expect(store.getState().phase).toEqual({ kind: 'answering', current: b, pending: [c, a] });
  for (const [current, pending] of [
    [c, [a]],
    [a, []],
  ]) {
    store.getState().answer(1);
    store.getState().advance();
    expect(store.getState().phase).toEqual({ kind: 'answering', current, pending });
  }
  store.getState().answer(1);
  store.getState().advance();
  expect(store.getState().phase).toEqual({ kind: 'complete' });
  expect(questions).toEqual([a, b, c]);
});

test('sole wrong question returns with no feedback marks and all phase guards reject input', () => {
  const store = createMistakePracticeStore([a]);
  const initial = store.getState();
  initial.advance();
  for (const index of [-1, 4, 0.5, NaN, Infinity]) initial.answer(index);
  expect(store.getState()).toBe(initial);
  initial.answer(0);
  const feedback = store.getState();
  feedback.answer(1);
  feedback.answer(0);
  expect(store.getState()).toBe(feedback);
  feedback.advance();
  expect(store.getState().phase).toEqual({ kind: 'answering', current: a, pending: [] });
  store.getState().answer(0);
  expect(store.getState().phase.kind).toBe('feedback');
  store.getState().advance();
  store.getState().answer(1);
  store.getState().advance();
  const completed = store.getState();
  completed.answer(0);
  completed.advance();
  expect(store.getState()).toBe(completed);
  expect(createMistakePracticeStore([]).getState().phase).toEqual({ kind: 'complete' });
  expect(createMistakePracticeStore([a]).getState().phase).toEqual(initial.phase);
});
