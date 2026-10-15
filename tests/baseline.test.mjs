import assert from 'node:assert/strict';
import { test } from 'node:test';

const { default: getQuiz } = await import('../src/lib/getQuiz.js');
const { default: getStatus } = await import('../src/lib/getStatus.js');
const {
  default: reducer, resetQuizzes, dismissOverlay, updateTimer,
  clickRightOption, clickWrongOption, unfreeze
} = await import('../src/ducks/quizzes.js');

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

test('new games reset both modes and both question types', () => {
  for (const mode of ['basic', 'speedrun']) {
    for (const kind of ['attack', 'defend']) {
      const state = reducer({ scores: 99, freeze: true, finish: true }, resetQuizzes(mode, kind));
      assert.equal(state.timer, mode === 'basic' ? 60 : 0);
      assert.equal(state.scores, 0);
      assert.equal(state.status, '');
      assert.equal(state.freeze, false);
      assert.equal(state.finish, false);
      assert.equal(state.overlay, true);
      assert.equal(state.quiz.emeny.title, kind === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND');
    }
  }
});

test('start and timer updates preserve the score and current question', () => {
  const initial = reducer(undefined, resetQuizzes('basic', 'attack'));
  const started = reducer(initial, dismissOverlay());
  assert.equal(started.overlay, false);
  const ticked = reducer(started, updateTimer(59));
  assert.equal(ticked.timer, 59);
  assert.equal(ticked.scores, 0);
  assert.equal(ticked.quiz, initial.quiz);
  assert.equal(initial.overlay, true);
  assert.equal(initial.timer, 60);
});

test('wrong answer deducts a point, allows negatives, and retains the question after feedback', () => {
  const initial = reducer(undefined, resetQuizzes('basic', 'defend'));
  const index = initial.quiz.options.findIndex(option => option.type !== initial.quiz.answer);
  const status = getStatus(initial.quiz.options[index].demage);
  const wrong = reducer(initial, clickWrongOption(index, status));
  assert.equal(wrong.scores, -1);
  assert.equal(wrong.freeze, true);
  assert.equal(wrong.finish, false);
  assert.equal(wrong.status, status);
  assert.equal(wrong.quiz.options[index].clicked, true);
  assert.notEqual(wrong.quiz.options[index].correct, true);
  assert.equal(initial.quiz.options[index].clicked, undefined);
  const resumed = reducer(wrong, unfreeze('defend', false));
  assert.equal(resumed.freeze, false);
  assert.equal(resumed.status, '');
  assert.equal(resumed.quiz, wrong.quiz);
  assert.equal(resumed.scores, -1);
});

test('correct answer after a mistake adds one point and advances after feedback', () => {
  const initial = reducer(undefined, resetQuizzes('basic', 'attack'));
  const wrongIndex = initial.quiz.options.findIndex(option => option.type !== initial.quiz.answer);
  const wrong = reducer(initial, clickWrongOption(wrongIndex, 'EFFECTIVE_1'));
  const resumed = reducer(wrong, unfreeze('attack', false));
  const rightIndex = resumed.quiz.options.findIndex(option => option.type === resumed.quiz.answer);
  const right = reducer(resumed, clickRightOption(rightIndex, getStatus(resumed.quiz.options[rightIndex].demage)));
  assert.equal(right.scores, 0);
  assert.equal(right.freeze, true);
  assert.equal(right.finish, true);
  assert.equal(right.quiz.options[rightIndex].correct, true);
  assert.equal(right.quiz.options[wrongIndex].clicked, true);
  const next = reducer(right, unfreeze('attack', true));
  assert.equal(next.freeze, false);
  assert.equal(next.finish, false);
  assert.equal(next.status, '');
  assert.equal(next.scores, 0);
  assert.notEqual(next.quiz, right.quiz);
  assert.ok(next.quiz.options.every(option => !option.clicked));
});

test('damage feedback maps all single-type multipliers', () => {
  for (const [value, status] of [[0, 'EFFECTIVE_0'], [0.5, 'EFFECTIVE_1_2'], [1, 'EFFECTIVE_1'], [2, 'EFFECTIVE_2']]) {
    assert.equal(getStatus(value), status);
  }
});
