import sampleSize from 'lodash/sampleSize';
import shuffle from 'lodash/shuffle';

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

const getQuiz = (quizType) => {
  // const attackerIndex = Math.floor(Math.random() * types.length);
  const defenderIndex = Math.floor(Math.random() * types.length);

  if (quizType === 'attackSingle') {
    const defendList = demageMatrix.map(demage => demage[defenderIndex]);
    const maxDemage = Math.max(...defendList);
    let answers = [];
    let others = [];

    defendList.forEach((demage, index) => {
      if (demage === maxDemage) {
        answers.push(index);
      } else {
        others.push(index);
      }
    });

    const answerIndex = sampleSize(answers);
    const otherIndice = sampleSize(others, 3);

    const quiz = {
      emeny: {
        title: 'attack enemy',
        type: types[defenderIndex]
      },
      options: shuffle(answerIndex.concat(otherIndice)).map(option => ({
        type: types[option],
        value: defendList[option]
      })),
      answer: types[answerIndex]
    }
    return quiz;
  }
};

export default getQuiz;
