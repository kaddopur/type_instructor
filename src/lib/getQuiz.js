import sampleSize from 'lodash/sampleSize';
import shuffle from 'lodash/shuffle';
import max from 'lodash/max';

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

const quizFactory = (type, demageList, findAnswerDemage) => {
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
    emeny: {
      title: 'attack enemy',
      type
    },
    options: shuffle(answerIndex.concat(otherIndice)).map(option => ({
      type: types[option],
      value: demageList[option]
    })),
    answer: types[answerIndex]
  }
}

const getQuiz = (quizType) => {
  // const attackerIndex = Math.floor(Math.random() * types.length);
  const defenderIndex = Math.floor(Math.random() * types.length);

  if (quizType === 'attackSingle') {
    const defendList = demageMatrix.map(demage => demage[defenderIndex]);
    return quizFactory(types[defenderIndex], defendList, max);
  }
};

export default getQuiz;
