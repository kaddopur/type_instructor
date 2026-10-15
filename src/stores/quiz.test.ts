import { expect, test } from 'vitest';
import { createQuizStore } from './quiz.ts';
import getStatus from '../lib/getStatus.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';

test('new sessions start fresh in both modes and both question types', () => {
  for (const mode of ['basic', 'speedrun'] as const) {
    for (const kind of ['attack', 'defend'] as const) {
      const store = createQuizStore(mode, kind);
      const state = store.getState();
      expect(state.timer).toBe(mode === 'basic' ? 60 : 0);
      expect(state.scores).toBe(0);
      expect(state.status).toBe('');
      expect(state.freeze).toBe(false);
      expect(state.finish).toBe(false);
      expect(state.result).toBe(null);
      expect(state.overlay).toBe(true);
      expect(state.quiz.enemy.title).toBe(kind === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND');
    }
  }
});

test('start and timer ticks preserve score and question in both modes', () => {
  for (const mode of ['basic', 'speedrun'] as const) {
    const store = createQuizStore(mode, 'attack');
    const initial = store.getState();
    initial.tick();
    expect(store.getState()).toBe(initial);
    initial.start();
    expect(store.getState().overlay).toBe(false);
    store.getState().tick();
    const ticked = store.getState();
    expect(ticked.timer).toBe(mode === 'basic' ? 59 : 1);
    expect(ticked.scores).toBe(0);
    expect(ticked.quiz).toBe(initial.quiz);
    expect(initial.overlay).toBe(true);
    expect(initial.timer).toBe(mode === 'basic' ? 60 : 0);
  }
});

test('wrong answer deducts a point, allows negatives, and retains the question after feedback', () => {
  const store = createQuizStore('basic', 'defend');
  store.getState().start();
  const initial = store.getState();
  const index = initial.quiz.options.findIndex(option => option.type !== initial.quiz.answer);
  initial.answer(index);
  const wrong = store.getState();
  expect(wrong.scores).toBe(-1);
  expect(wrong.freeze).toBe(true);
  expect(wrong.finish).toBe(false);
  expect(wrong.status).toBe(getStatus(initial.quiz.options[index].damage));
  expect(wrong.quiz.options[index].clicked).toBe(true);
  expect(wrong.quiz.options[index].correct).toBe(false);
  expect(initial.quiz.options[index].clicked).toBe(undefined);
  wrong.advance();
  const resumed = store.getState();
  expect(resumed.freeze).toBe(false);
  expect(resumed.status).toBe('');
  expect(resumed.quiz).toBe(wrong.quiz);
  expect(resumed.scores).toBe(-1);
});

test('correct answer after a mistake adds one point and advances after feedback', () => {
  const store = createQuizStore('basic', 'attack');
  store.getState().start();
  const initial = store.getState();
  const wrongIndex = initial.quiz.options.findIndex(option => option.type !== initial.quiz.answer);
  initial.answer(wrongIndex);
  store.getState().advance();
  const resumed = store.getState();
  const rightIndex = resumed.quiz.options.findIndex(option => option.type === resumed.quiz.answer);
  resumed.answer(rightIndex);
  const right = store.getState();
  expect(right.scores).toBe(0);
  expect(right.freeze).toBe(true);
  expect(right.finish).toBe(true);
  expect(right.quiz.options[rightIndex].correct).toBe(true);
  expect(right.quiz.options[wrongIndex].clicked).toBe(true);
  right.advance();
  const next = store.getState();
  expect(next.freeze).toBe(false);
  expect(next.finish).toBe(false);
  expect(next.status).toBe('');
  expect(next.scores).toBe(0);
  expect(next.quiz).not.toBe(right.quiz);
  expect(next.quiz.options.every(option => !option.clicked)).toBeTruthy();
});

test('answer guards reject pre-start, invalid, frozen and previously selected inputs', () => {
  const store = createQuizStore('basic', 'attack');
  const initial = store.getState();
  initial.answer(0);
  initial.advance();
  expect(store.getState()).toBe(initial);
  initial.start();
  const started = store.getState();
  for (const index of [-1, 4, 0.5, '0', null, undefined]) {
    // @ts-expect-error JavaScript callers can bypass the numeric argument type.
    started.answer(index);
  }
  expect(store.getState()).toBe(started);
  const wrongIndex = started.quiz.options.findIndex(option => option.type !== started.quiz.answer);
  started.answer(wrongIndex);
  const wrong = store.getState();
  wrong.answer(wrongIndex);
  wrong.answer((wrongIndex + 1) % 4);
  expect(store.getState()).toBe(wrong);
  wrong.advance();
  const resumed = store.getState();
  resumed.answer(wrongIndex);
  expect(store.getState()).toBe(resumed);
});

test('basic completion captures score once and rejects late updates', () => {
  const store = createQuizStore('basic', 'attack');
  store.getState().start();
  store.setState({ timer: 1, scores: 7 });
  store.getState().tick();
  const completed = store.getState();
  expect(completed.timer).toBe(0);
  expect(completed.result).toBe(7);
  completed.tick();
  completed.answer(0);
  completed.advance();
  completed.start();
  expect(store.getState()).toBe(completed);
});

test('speedrun completion uses the configured goal and preserves answer-time seconds', () => {
  const store = createQuizStore('speedrun', 'defend');
  store.getState().start();
  store.setState({ scores: SCORE_TARGET - 1, timer: 7 });
  const before = store.getState();
  const rightIndex = before.quiz.options.findIndex(option => option.type === before.quiz.answer);
  before.answer(rightIndex);
  expect(store.getState().result).toBe(null);
  store.getState().tick();
  expect(store.getState().timer).toBe(8);
  store.getState().advance();
  const completed = store.getState();
  expect(completed.result).toBe(7);
  completed.tick();
  completed.answer(0);
  completed.advance();
  expect(store.getState()).toBe(completed);
});

test('speedrun continues at 19 and after deductions, finishing only at 20 in both question modes', () => {
  expect(SCORE_TARGET).toBe(20);
  for (const kind of ['attack', 'defend'] as const) {
    const store = createQuizStore('speedrun', kind);
    store.getState().start();
    store.setState({ scores: 18, timer: 5 });
    const answerCorrectly = () => {
      const state = store.getState();
      state.answer(state.quiz.options.findIndex(option => option.type === state.quiz.answer));
    };
    answerCorrectly();
    store.getState().advance();
    expect(store.getState().scores).toBe(19);
    expect(store.getState().result).toBe(null);
    store.getState().tick();
    expect(store.getState().timer).toBe(6);

    const state = store.getState();
    state.answer(state.quiz.options.findIndex(option => option.type !== state.quiz.answer));
    store.getState().advance();
    expect(store.getState().scores).toBe(18);
    expect(store.getState().result).toBe(null);
    answerCorrectly();
    store.getState().advance();
    expect(store.getState().scores).toBe(19);
    expect(store.getState().result).toBe(null);

    answerCorrectly();
    expect(store.getState().scores).toBe(20);
    expect(store.getState().result).toBe(null);
    store.getState().advance();
    expect(store.getState().result).toBe(6);
  }
});

test('sessions do not share state or pending actions', () => {
  const oldStore = createQuizStore('basic', 'attack');
  oldStore.getState().start();
  oldStore.getState().answer(0);
  const newStore = createQuizStore('speedrun', 'defend');
  const fresh = newStore.getState();
  oldStore.getState().advance();
  oldStore.getState().tick();
  expect(newStore.getState()).toBe(fresh);
  expect(fresh.scores).toBe(0);
  expect(fresh.timer).toBe(0);
  expect(fresh.overlay).toBe(true);
  expect(fresh.freeze).toBe(false);
  expect(fresh.quiz.options.every(option => !option.clicked)).toBeTruthy();
});

