import { expect, test } from 'vitest';
import getQuiz, { createQuizGenerator } from './getQuiz.ts';
import type { QuizType } from './types.ts';

const types = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy',
] as const;

function question(mode: QuizType, enemyIndex: number) {
  return getQuiz(mode, types[enemyIndex]);
}

test('all 18 attack and defense targets have four unique options and one best answer', () => {
  const immuneAttacks = new Set([
    'normal',
    'fighting',
    'poison',
    'ground',
    'ghost',
    'electric',
    'psychic',
    'dragon',
  ]);
  for (const mode of ['attack', 'defend'] as const) {
    for (const [enemyIndex, enemy] of types.entries()) {
      const quiz = question(mode, enemyIndex);
      const label = `${mode}/${enemy}`;
      expect(quiz.enemy.type, label).toBe(enemy);
      expect(quiz.enemy.title).toBe(mode === 'attack' ? 'ENEMY_ATTACK' : 'ENEMY_DEFEND');
      expect(quiz.options.length, label).toBe(4);
      expect(new Set(quiz.options.map((option) => option.type)).size, label).toBe(4);
      expect(
        quiz.options.every((option) => types.includes(option.type)),
        label,
      ).toBeTruthy();
      const answer = quiz.options.find((option) => option.type === quiz.answer);
      if (!answer) throw new Error(`Missing answer: ${label}`);
      const expected = mode === 'attack' ? 2 : immuneAttacks.has(enemy) ? 0 : 0.5;
      expect(answer.damage, label).toBe(expected);
      for (const option of quiz.options) {
        expect([0, 0.5, 1, 2].includes(option.damage), label).toBeTruthy();
        if (option !== answer) {
          expect(
            mode === 'attack' ? option.damage < answer.damage : option.damage > answer.damage,
            label,
          ).toBeTruthy();
        }
      }
    }
  }
});

test('representative matchups preserve attack/defense matrix orientation', () => {
  const attackNormal = question('attack', types.indexOf('normal'));
  expect(attackNormal.answer).toBe('fighting');
  const defenseElectric = question('defend', types.indexOf('electric'));
  expect(defenseElectric.answer).toBe('ground');
  const defenseDragon = question('defend', types.indexOf('dragon'));
  expect(defenseDragon.answer).toBe('fairy');
});

test('shuffled bags cover all targets once per round without consecutive repeats', () => {
  for (const mode of ['attack', 'defend'] as const) {
    const next = createQuizGenerator(mode);
    const targets = Array.from({ length: 180 }, () => next().enemy.type);
    for (let start = 0; start < targets.length; start += 18) {
      expect(new Set(targets.slice(start, start + 18))).toEqual(new Set(types));
    }
    expect(targets.every((target, index) => index === 0 || target !== targets[index - 1])).toBe(
      true,
    );
  }
});

test('every defense target has four unique options and one best answer in both preferences', () => {
  const immuneAttacks = new Set([
    'normal',
    'fighting',
    'poison',
    'ground',
    'ghost',
    'electric',
    'psychic',
    'dragon',
  ]);
  for (const enemy of types) {
    for (const preference of ['immunity', 'resistance'] as const) {
      const quiz = getQuiz('defend', enemy, preference);
      const expected = preference === 'immunity' && immuneAttacks.has(enemy) ? 0 : 0.5;
      expect(quiz.options).toHaveLength(4);
      expect(new Set(quiz.options.map((option) => option.type)).size).toBe(4);
      expect(quiz.options.find((option) => option.type === quiz.answer)?.damage).toBe(expected);
      expect(quiz.options.filter((option) => option.damage === expected)).toHaveLength(1);
      expect(quiz.options.every((option) => option.damage >= expected)).toBe(true);
    }
  }
});

test('defense preferences alternate per target across shuffled rounds and reset in new sessions', () => {
  const immuneAttacks = new Set([
    'normal',
    'fighting',
    'poison',
    'ground',
    'ghost',
    'electric',
    'psychic',
    'dragon',
  ]);
  const next = createQuizGenerator('defend');
  for (let round = 0; round < 3; round++) {
    const seen = new Set();
    for (let index = 0; index < 18; index++) {
      const quiz = next();
      seen.add(quiz.enemy.type);
      const expected = round !== 1 && immuneAttacks.has(quiz.enemy.type) ? 0 : 0.5;
      expect(quiz.options.find((option) => option.type === quiz.answer)?.damage).toBe(expected);
      expect(quiz.options.every((option) => option.damage >= expected)).toBe(true);
    }
    expect(seen.size).toBe(18);
    // A separate generator must always start with the immunity preference.
    const fresh = createQuizGenerator('defend');
    for (let index = 0; index < 18; index++) {
      const quiz = fresh();
      const expected = immuneAttacks.has(quiz.enemy.type) ? 0 : 0.5;
      expect(quiz.options.find((option) => option.type === quiz.answer)?.damage).toBe(expected);
    }
  }
});

test('electric and dragon resistance questions exclude immunity and teach actual resistance', () => {
  const electric = getQuiz('defend', 'electric', 'resistance');
  expect(['grass', 'electric', 'dragon']).toContain(electric.answer);
  expect(electric.options.some((option) => option.type === 'ground')).toBe(false);
  const dragon = getQuiz('defend', 'dragon', 'resistance');
  expect(dragon.answer).toBe('steel');
  expect(dragon.options.some((option) => option.type === 'fairy')).toBe(false);
});
