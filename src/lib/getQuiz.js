import sampleSize from 'lodash/sampleSize';
import shuffle from 'lodash/shuffle';
import max from 'lodash/max';
import min from 'lodash/min';

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
];

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

// const quizzes = [
//   {
//     emeny: {
//       title: 'attack emeny',
//       type: 'dragon'
//     },
//     options: [
//       {
//         type: 'normal',
//         value: 1
//       },
//       {
//         type: 'poison',
//         value: 1
//       },
//       {
//         type: 'fairy',
//         value: 2
//       },
//       {
//         type: 'electric',
//         value: 0.5
//       }
//     ],
//     answer: 'fairy'
//   }
// ]

const quizFactory = (demageList, findAnswerDemage, emeny) => {
  const answerDemage = findAnswerDemage(demageList);
  let answers = [];
  let others = [];

  demageList.forEach((demage, index) => {
    if (demage === answerDemage) {
      answers.push(index);
    } else {
      others.push(index);
    }
  });

  const answerIndex = sampleSize(answers);
  const otherIndice = sampleSize(others, 3);

  return {
    emeny,
    options: shuffle(answerIndex.concat(otherIndice)).map(typeIndex => ({
      type: types[typeIndex],
      demage: demageList[typeIndex]
    })),
    answer: types[answerIndex]
  }
}

const getQuiz = (quizType, lastEmeny) => {
  let emenyIndex = Math.floor(Math.random() * types.length);
  while(types[emenyIndex] === lastEmeny) {
    emenyIndex = Math.floor(Math.random() * types.length);
  }

  if (quizType === 'attackSingle') {
    const enemyDefendList = demageMatrix.map(demage => demage[emenyIndex]);
    return quizFactory(enemyDefendList, max, {
      title: 'ENEMY_ATTACK',
      type: types[emenyIndex]
    });
  }

  if (quizType === 'defendSingle') {
    const emenyAttackList = demageMatrix[emenyIndex];
    return quizFactory(emenyAttackList, min, {
      title: 'ENEMY_DEFEND',
      type: types[emenyIndex]
    });
  }
};

export default getQuiz;
