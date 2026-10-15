import sampleSize from 'lodash/sampleSize.js';
import shuffle from 'lodash/shuffle.js';
import type { Quiz, QuizType } from './types.ts';

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

export type PokemonType = (typeof types)[number];

const damageMatrix = [
  [1, 1, 1, 1, 1, 1 / 2, 1, 0, 1 / 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 1, 1 / 2, 1 / 2, 1, 2, 1 / 2, 0, 2, 1, 1, 1, 1, 1 / 2, 2, 1, 2, 1 / 2],
  [1, 2, 1, 1, 1, 1 / 2, 2, 1, 1 / 2, 1, 1, 2, 1 / 2, 1, 1, 1, 1, 1],
  [1, 1, 1, 1 / 2, 1 / 2, 1 / 2, 1, 1 / 2, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
  [1, 1, 0, 2, 1, 2, 1 / 2, 1, 2, 2, 1, 1 / 2, 2, 1, 1, 1, 1, 1],
  [1, 1 / 2, 2, 1, 1 / 2, 1, 2, 1, 1 / 2, 2, 1, 1, 1, 1, 2, 1, 1, 1],
  [1, 1 / 2, 1 / 2, 1 / 2, 1, 1, 1, 1 / 2, 1 / 2, 1 / 2, 1, 2, 1, 2, 1, 1, 2, 1 / 2],
  [0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1 / 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1 / 2, 1 / 2, 1 / 2, 1, 1 / 2, 1, 2, 1, 1, 2],
  [1, 1, 1, 1, 1, 1 / 2, 2, 1, 2, 1 / 2, 1 / 2, 2, 1, 1, 2, 1 / 2, 1, 1],
  [1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1 / 2, 1 / 2, 1, 1, 1, 1 / 2, 1, 1],
  [1, 1, 1 / 2, 1 / 2, 2, 2, 1 / 2, 1, 1 / 2, 1 / 2, 2, 1 / 2, 1, 1, 1, 1 / 2, 1, 1],
  [1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 1 / 2, 1 / 2, 1, 1, 1 / 2, 1, 1],
  [1, 2, 1, 2, 1, 1, 1, 1, 1 / 2, 1, 1, 1, 1, 1 / 2, 1, 1, 0, 1],
  [1, 1, 2, 1, 2, 1, 1, 1, 1 / 2, 1 / 2, 1 / 2, 2, 1, 1, 1 / 2, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1 / 2, 1, 1, 1, 1, 1, 1, 2, 1, 0],
  [1, 1 / 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1 / 2, 1 / 2],
  [1, 2, 1, 1 / 2, 1, 1, 1, 1, 1 / 2, 1 / 2, 1, 1, 1, 1, 1, 2, 2, 1],
];

const quizFactory = (
  quizType: QuizType,
  damageList: number[],
  answerDamage: number,
  enemy: Quiz['enemy'],
): Quiz => {
  const answers: number[] = [];
  const others: number[] = [];

  damageList.forEach((damage, index) => {
    if (damage === answerDamage) {
      answers.push(index);
    } else if (quizType === 'attack' ? damage < answerDamage : damage > answerDamage) {
      others.push(index);
    }
  });

  const [answerIndex] = sampleSize(answers, 1);
  const otherIndices = sampleSize(others, 3);

  return {
    enemy,
    options: shuffle([answerIndex, ...otherIndices]).map((typeIndex) => ({
      type: types[typeIndex],
      damage: damageList[typeIndex],
    })),
    answer: types[answerIndex],
  };
};

const getQuiz = (
  quizType: QuizType,
  enemy: PokemonType = types[Math.floor(Math.random() * types.length)],
  defensePreference: 'immunity' | 'resistance' = 'immunity',
): Quiz => {
  const enemyIndex = types.indexOf(enemy);

  if (quizType === 'attack') {
    const enemyDefendList = damageMatrix.map((damage) => damage[enemyIndex]);
    return quizFactory(quizType, enemyDefendList, Math.max(...enemyDefendList), {
      title: 'ENEMY_ATTACK',
      type: types[enemyIndex],
    });
  }

  const enemyAttackList = damageMatrix[enemyIndex];
  const answerDamage =
    defensePreference === 'resistance' && enemyAttackList.includes(0.5)
      ? 0.5
      : Math.min(...enemyAttackList);
  return quizFactory(quizType, enemyAttackList, answerDamage, {
    title: 'ENEMY_DEFEND',
    type: types[enemyIndex],
  });
};

export function createQuizGenerator(quizType: QuizType): () => Quiz {
  let bag: PokemonType[] = [];
  let previous: PokemonType | undefined;
  const resistanceTargets = new Set<PokemonType>();

  return () => {
    if (bag.length === 0) {
      bag = shuffle(types);
      if (bag[0] === previous) [bag[0], bag[1]] = [bag[1], bag[0]];
    }
    const enemy = bag.shift()!;
    previous = enemy;
    const preference = resistanceTargets.has(enemy) ? 'resistance' : 'immunity';
    if (quizType === 'defend') {
      if (resistanceTargets.has(enemy)) resistanceTargets.delete(enemy);
      else resistanceTargets.add(enemy);
    }
    return getQuiz(quizType, enemy, preference);
  };
}

export default getQuiz;
