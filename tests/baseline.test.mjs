import assert from 'node:assert/strict';
import { test } from 'node:test';

const { default: getQuiz } = await import('../src/lib/getQuiz.js');
const { default: getStatus } = await import('../src/lib/getStatus.js');
import { createQuizStore } from '../src/stores/quiz.js';
import { SCORE_TARGET } from '../src/lib/gameRules.js';

const types = [
  'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug',
  'ghost', 'steel', 'fire', 'water', 'grass', 'electric', 'psychic',
  'ice', 'dragon', 'dark', 'fairy'
];

function question(mode, enemyIndex) {
  const original = Math.random;
  // Only pin enemy selection. Lodash still samples and shuffles real options.
  Math.random = () => (enemyIndex + 0.5) / types.length;
  try {
    return getQuiz(mode);
  } finally {
    Math.random = original;
  }
}

test('all 18 attack and defense targets have four unique options and one best answer', () => {
  const immuneAttacks = new Set(['normal', 'fighting', 'poison', 'ground', 'ghost', 'electric', 'psychic', 'dragon']);
  for (const mode of ['attack', 'defend']) {
    for (const [enemyIndex, enemy] of types.entries()) {
      const quiz = question(mode, enemyIndex);
      const label = `${mode}/${enemy}`;
      assert.equal(quiz.emeny.type, enemy, label);
      assert.equal(quiz.emeny.title, mode === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND');
      assert.equal(quiz.options.length, 4, label);
      assert.equal(new Set(quiz.options.map(option => option.type)).size, 4, label);
      assert.ok(quiz.options.every(option => types.includes(option.type)), label);
      const answer = quiz.options.find(option => option.type === quiz.answer);
      assert.ok(answer, label);
      const expected = mode === 'attack' ? 2 : (immuneAttacks.has(enemy) ? 0 : 0.5);
      assert.equal(answer.demage, expected, label);
      for (const option of quiz.options) {
        assert.ok([0, 0.5, 1, 2].includes(option.demage), label);
        if (option !== answer) {
          assert.ok(mode === 'attack' ? option.demage < answer.demage : option.demage > answer.demage, label);
        }
      }
    }
  }
});

test('representative matchups preserve attack/defense matrix orientation', () => {
  const attackNormal = question('attack', types.indexOf('normal'));
  assert.equal(attackNormal.answer, 'fighting');
  const defenseElectric = question('defend', types.indexOf('electric'));
  assert.equal(defenseElectric.answer, 'ground');
  const defenseDragon = question('defend', types.indexOf('dragon'));
  assert.equal(defenseDragon.answer, 'fairy');
});

test('new sessions start fresh in both modes and both question types', () => {
  for (const mode of ['basic', 'speedrun']) {
    for (const kind of ['attack', 'defend']) {
      const store = createQuizStore(mode, kind);
      const state = store.getState();
      assert.equal(state.timer, mode === 'basic' ? 60 : 0);
      assert.equal(state.scores, 0);
      assert.equal(state.status, '');
      assert.equal(state.freeze, false);
      assert.equal(state.finish, false);
      assert.equal(state.result, null);
      assert.equal(state.overlay, true);
      assert.equal(state.quiz.emeny.title, kind === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND');
    }
  }
});

test('start and timer ticks preserve score and question in both modes', () => {
  for (const mode of ['basic', 'speedrun']) {
    const store = createQuizStore(mode, 'attack');
    const initial = store.getState();
    initial.tick();
    assert.equal(store.getState(), initial);
    initial.start();
    assert.equal(store.getState().overlay, false);
    store.getState().tick();
    const ticked = store.getState();
    assert.equal(ticked.timer, mode === 'basic' ? 59 : 1);
    assert.equal(ticked.scores, 0);
    assert.equal(ticked.quiz, initial.quiz);
    assert.equal(initial.overlay, true);
    assert.equal(initial.timer, mode === 'basic' ? 60 : 0);
  }
});

test('wrong answer deducts a point, allows negatives, and retains the question after feedback', () => {
  const store = createQuizStore('basic', 'defend');
  store.getState().start();
  const initial = store.getState();
  const index = initial.quiz.options.findIndex(option => option.type !== initial.quiz.answer);
  initial.answer(index);
  const wrong = store.getState();
  assert.equal(wrong.scores, -1);
  assert.equal(wrong.freeze, true);
  assert.equal(wrong.finish, false);
  assert.equal(wrong.status, getStatus(initial.quiz.options[index].demage));
  assert.equal(wrong.quiz.options[index].clicked, true);
  assert.equal(wrong.quiz.options[index].correct, false);
  assert.equal(initial.quiz.options[index].clicked, undefined);
  wrong.advance();
  const resumed = store.getState();
  assert.equal(resumed.freeze, false);
  assert.equal(resumed.status, '');
  assert.equal(resumed.quiz, wrong.quiz);
  assert.equal(resumed.scores, -1);
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
  assert.equal(right.scores, 0);
  assert.equal(right.freeze, true);
  assert.equal(right.finish, true);
  assert.equal(right.quiz.options[rightIndex].correct, true);
  assert.equal(right.quiz.options[wrongIndex].clicked, true);
  right.advance();
  const next = store.getState();
  assert.equal(next.freeze, false);
  assert.equal(next.finish, false);
  assert.equal(next.status, '');
  assert.equal(next.scores, 0);
  assert.notEqual(next.quiz, right.quiz);
  assert.ok(next.quiz.options.every(option => !option.clicked));
});

test('answer guards reject pre-start, invalid, frozen and previously selected inputs', () => {
  const store = createQuizStore('basic', 'attack');
  const initial = store.getState();
  initial.answer(0);
  initial.advance();
  assert.equal(store.getState(), initial);
  initial.start();
  const started = store.getState();
  for (const index of [-1, 4, 0.5, '0', null, undefined]) started.answer(index);
  assert.equal(store.getState(), started);
  const wrongIndex = started.quiz.options.findIndex(option => option.type !== started.quiz.answer);
  started.answer(wrongIndex);
  const wrong = store.getState();
  wrong.answer(wrongIndex);
  wrong.answer((wrongIndex + 1) % 4);
  assert.equal(store.getState(), wrong);
  wrong.advance();
  const resumed = store.getState();
  resumed.answer(wrongIndex);
  assert.equal(store.getState(), resumed);
});

test('basic completion captures score once and rejects late updates', () => {
  const store = createQuizStore('basic', 'attack');
  store.getState().start();
  store.setState({ timer: 1, scores: 7 });
  store.getState().tick();
  const completed = store.getState();
  assert.equal(completed.timer, 0);
  assert.equal(completed.result, 7);
  completed.tick();
  completed.answer(0);
  completed.advance();
  completed.start();
  assert.equal(store.getState(), completed);
});

test('speedrun completion uses the configured goal and preserves answer-time seconds', () => {
  const store = createQuizStore('speedrun', 'defend');
  store.getState().start();
  store.setState({ scores: SCORE_TARGET - 1, timer: 7 });
  const before = store.getState();
  const rightIndex = before.quiz.options.findIndex(option => option.type === before.quiz.answer);
  before.answer(rightIndex);
  assert.equal(store.getState().result, null);
  store.getState().tick();
  assert.equal(store.getState().timer, 8);
  store.getState().advance();
  const completed = store.getState();
  assert.equal(completed.result, 7);
  completed.tick();
  completed.answer(0);
  completed.advance();
  assert.equal(store.getState(), completed);
});

test('speedrun continues at 19 and after deductions, finishing only at 20 in both question modes', () => {
  assert.equal(SCORE_TARGET, 20);
  for (const kind of ['attack', 'defend']) {
    const store = createQuizStore('speedrun', kind);
    store.getState().start();
    store.setState({ scores: 18, timer: 5 });
    const answerCorrectly = () => {
      const state = store.getState();
      state.answer(state.quiz.options.findIndex(option => option.type === state.quiz.answer));
    };
    answerCorrectly();
    store.getState().advance();
    assert.equal(store.getState().scores, 19);
    assert.equal(store.getState().result, null);
    store.getState().tick();
    assert.equal(store.getState().timer, 6);

    const state = store.getState();
    state.answer(state.quiz.options.findIndex(option => option.type !== state.quiz.answer));
    store.getState().advance();
    assert.equal(store.getState().scores, 18);
    assert.equal(store.getState().result, null);
    answerCorrectly();
    store.getState().advance();
    assert.equal(store.getState().scores, 19);
    assert.equal(store.getState().result, null);

    answerCorrectly();
    assert.equal(store.getState().scores, 20);
    assert.equal(store.getState().result, null);
    store.getState().advance();
    assert.equal(store.getState().result, 6);
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
  assert.equal(newStore.getState(), fresh);
  assert.equal(fresh.scores, 0);
  assert.equal(fresh.timer, 0);
  assert.equal(fresh.overlay, true);
  assert.equal(fresh.freeze, false);
  assert.ok(fresh.quiz.options.every(option => !option.clicked));
});

test('damage feedback maps all single-type multipliers', () => {
  for (const [value, status] of [[0, 'EFFECTIVE_0'], [0.5, 'EFFECTIVE_1_2'], [1, 'EFFECTIVE_1'], [2, 'EFFECTIVE_2']]) {
    assert.equal(getStatus(value), status);
  }
});
