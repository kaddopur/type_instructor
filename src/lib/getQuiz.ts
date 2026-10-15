import sampleSize from 'lodash/sampleSize.js';
import shuffle from 'lodash/shuffle.js';
import max from 'lodash/max.js';
import min from 'lodash/min.js';
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
  'fairy'
] as const;

export type PokemonType = (typeof types)[number];

const demageMatrix = [
  [1,   1,   1,   1,   1, 1/2,   1,   0, 1/2,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [2,   1, 1/2, 1/2,   1,   2, 1/2,   0,   2,   1,   1,   1,   1, 1/2,   2,   1,   2, 1/2],
  [1,   2,   1,   1,   1, 1/2,   2,   1, 1/2,   1,   1,   2, 1/2,   1,   1,   1,   1,   1],
  [1,   1,   1, 1/2, 1/2, 1/2,   1, 1/2,   0,   1,   1,   2,   1,   1,   1,   1,   1,   2],
  [1,   1,   0,   2,   1,   2, 1/2,   1,   2,   2,   1, 1/2,   2,   1,   1,   1,   1,   1],
  [1, 1/2,   2,   1, 1/2,   1,   2,   1, 1/2,   2,   1,   1,   1,   1,   2,   1,   1,   1],
  [1, 1/2, 1/2, 1/2,   1,   1,   1, 1/2, 1/2, 1/2,   1,   2,   1,   2,   1,   1,   2, 1/2],
  [0,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 1/2,   1],
  [1,   1,   1,   1,   1,   2,   1,   1, 1/2, 1/2, 1/2,   1, 1/2,   1,   2,   1,   1,   2],
  [1,   1,   1,   1,   1, 1/2,   2,   1,   2, 1/2, 1/2,   2,   1,   1,   2, 1/2,   1,   1],
  [1,   1,   1,   1,   2,   2,   1,   1,   1,   2, 1/2, 1/2,   1,   1,   1, 1/2,   1,   1],
  [1,   1, 1/2, 1/2,   2,   2, 1/2,   1, 1/2, 1/2,   2, 1/2,   1,   1,   1, 1/2,   1,   1],
  [1,   1,   2,   1,   0,   1,   1,   1,   1,   1,   2, 1/2, 1/2,   1,   1, 1/2,   1,   1],
  [1,   2,   1,   2,   1,   1,   1,   1, 1/2,   1,   1,   1,   1, 1/2,   1,   1,   0,   1],
  [1,   1,   2,   1,   2,   1,   1,   1, 1/2, 1/2, 1/2,   2,   1,   1, 1/2,   2,   1,   1],
  [1,   1,   1,   1,   1,   1,   1,   1, 1/2,   1,   1,   1,   1,   1,   1,   2,   1,   0],
  [1, 1/2,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 1/2, 1/2],
  [1,   2,   1, 1/2,   1,   1,   1,   1, 1/2, 1/2,   1,   1,   1,   1,   1,   2,   2,   1]
];

const quizFactory = (
  demageList: number[],
  findAnswerDemage: (values: number[]) => number | undefined,
  emeny: Quiz['emeny']
): Quiz => {
  const answerDemage = findAnswerDemage(demageList);
  const answers: number[] = [];
  const others: number[] = [];

  demageList.forEach((demage, index) => {
    if (demage === answerDemage) {
      answers.push(index);
    } else {
      others.push(index);
    }
  });

  const [answerIndex] = sampleSize(answers, 1);
  const otherIndice = sampleSize(others, 3);

  return {
    emeny,
    options: shuffle([answerIndex, ...otherIndice]).map(typeIndex => ({
      type: types[typeIndex],
      demage: demageList[typeIndex]
    })),
    answer: types[answerIndex]
  }
}

const getQuiz = (quizType: QuizType, lastEmeny?: PokemonType): Quiz => {
  let emenyIndex = Math.floor(Math.random() * types.length);
  while(types[emenyIndex] === lastEmeny) {
    emenyIndex = Math.floor(Math.random() * types.length);
  }

  if (quizType === 'attack') {
    const enemyDefendList = demageMatrix.map(demage => demage[emenyIndex]);
    return quizFactory(enemyDefendList, max, {
      title: 'ENEMY_ATTACK',
      type: types[emenyIndex]
    });
  }

  const emenyAttackList = demageMatrix[emenyIndex];
  return quizFactory(emenyAttackList, min, {
    title: 'ENEMY_DEFEND',
    type: types[emenyIndex]
  });
};

export default getQuiz;
