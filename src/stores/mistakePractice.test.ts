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

test('wrong stays on A until correct, then revisits A after B,C with clean attempts', () => {
  const questions = structuredClone([a, b, c]);
  const original = structuredClone(questions);
  const store = createMistakePracticeStore(questions);
  for (const index of [0, 2]) {
    store.getState().answer(index);
    expect(store.getState().phase).toMatchObject({
      kind: 'feedback',
      current: a,
      selectedIndex: index,
      correct: false,
    });
    store.getState().advance();
    expect(store.getState().phase).toEqual({
      kind: 'answering',
      current: a,
      pending: [b, c],
      wrongIndices: index === 0 ? [0] : [0, 2],
    });
    const answering = store.getState();
    answering.answer(index);
    expect(store.getState()).toBe(answering);
  }
  store.getState().answer(1);
  store.getState().advance();
  expect(store.getState().phase).toEqual({
    kind: 'answering',
    current: b,
    pending: [c, a],
    wrongIndices: [],
  });
  for (const [current, pending] of [
    [c, [a]],
    [a, []],
  ]) {
    store.getState().answer(1);
    store.getState().advance();
    expect(store.getState().phase).toEqual({
      kind: 'answering',
      current,
      pending,
      wrongIndices: [],
    });
  }
  store.getState().answer(1);
  store.getState().advance();
  expect(store.getState().phase).toEqual({ kind: 'complete' });
  expect(questions).toEqual(original);
  expect(createMistakePracticeStore(questions).getState().phase).toEqual({
    kind: 'answering',
    current: a,
    pending: [b, c],
    wrongIndices: [],
  });
});

test('sole question resets after wrong then correct and completes only on a clean visit', () => {
  const store = createMistakePracticeStore([a]);
  store.getState().answer(0);
  store.getState().advance();
  expect(store.getState().phase).toEqual({
    kind: 'answering',
    current: a,
    pending: [],
    wrongIndices: [0],
  });
  store.getState().answer(1);
  store.getState().advance();
  expect(store.getState().phase).toEqual({
    kind: 'answering',
    current: a,
    pending: [],
    wrongIndices: [],
  });
  store.getState().answer(1);
  store.getState().advance();
  expect(store.getState().phase).toEqual({ kind: 'complete' });
});

test('invalid answers, feedback input, and completed input leave state unchanged', () => {
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
  const answering = store.getState();
  answering.answer(0);
  answering.advance();
  expect(store.getState()).toBe(answering);
  store.getState().answer(1);
  store.getState().advance();
  store.getState().answer(1);
  store.getState().advance();
  const completed = store.getState();
  expect(completed.phase).toEqual({ kind: 'complete' });
  completed.answer(0);
  completed.advance();
  expect(store.getState()).toBe(completed);
  expect(createMistakePracticeStore([]).getState().phase).toEqual({ kind: 'complete' });
  expect(createMistakePracticeStore([a]).getState().phase).toEqual(initial.phase);
});
