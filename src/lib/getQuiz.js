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
  [1,   1,   1,   1,   1, 1⁄2,   1,   0, 1⁄2,   1,   1,   1,   1,   1,   1,   1,   1,   1],
  [2,   1, 1⁄2, 1⁄2,   1,  2,  1⁄2,   0,   2,   1,   1,   1,   1, 1⁄2,   2,   1,   2, 1⁄2],
  [1,   2,   1,   1,   1, 1⁄2,   2,   1, 1⁄2,   1,   1,   2, 1⁄2,   1,   1,   1,   1,   1],
  [1,   1,   1, 1⁄2, 1⁄2, 1⁄2,   1, 1⁄2,   0,   1,   1,   2,   1,   1,   1,   1,   1,   2],
  [1,   1,   0,   2,   1,   2, 1⁄2,   1,   2,   2,   1, 1⁄2,   2,   1,   1,   1,   1,   1],
  [1, 1⁄2,   2,   1, 1⁄2,   1,   2,   1, 1⁄2,   2,   1,   1,   1,   1,   2,   1,   1,   1],
  [1, 1⁄2, 1⁄2, 1⁄2,   1,   1,   1, 1⁄2, 1⁄2, 1⁄2,   1,   2,   1,   2,   1,   1,   2, 1⁄2],
  [0,   1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 1⁄2,   1],
  [1,   1,   1,   1,   1,   2,   1,   1, 1⁄2, 1⁄2, 1⁄2,   1, 1⁄2,   1,   2,   1,   1,   2],
  [1,   1,   1,   1,   1, 1⁄2,   2,   1,   2, 1⁄2, 1⁄2,   2,   1,   1,   2, 1⁄2,   1,   1],
  [1,   1,   1,   1,   2,   2,   1,   1,   1,   2, 1⁄2, 1⁄2,   1,   1,   1, 1⁄2,   1,   1],
  [1,   1, 1⁄2, 1⁄2,   2,   2, 1⁄2,   1, 1⁄2, 1⁄2,   2, 1⁄2,   1,   1,   1, 1⁄2,   1,   1],
  [1,   1,   2,   1,   0,   1,   1,   1,   1,   1,   2, 1⁄2, 1⁄2,   1,   1, 1⁄2,   1,   1],
  [1,   2,   1,   2,   1,   1,   1,   1, 1⁄2,   1,   1,   1,   1, 1⁄2,   1,   1,   0,   1],
  [1,   1,   2,   1,   2,   1,   1,   1, 1⁄2, 1⁄2, 1⁄2,   2,   1,   1, 1⁄2,   2,   1,   1],
  [1,   1,   1,   1,   1,   1,   1,   1, 1⁄2,   1,   1,   1,   1,   1,   1,   2,   1,   0],
  [1, 1⁄2,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   2,   1,   1, 1⁄2, 1⁄2],
  [1,   2,   1, 1⁄2,   1,   1,   1,   1, 1⁄2, 1⁄2,   1,   1,   1,   1,   1,   2,   2,   1]
];

const quizzes = [
  {
    emeny: {
      title: 'attack emeny',
      type: 'dragon'
    },
    options: [
      {
        type: 'normal',
        value: 1
      },
      {
        type: 'poison',
        value: 1
      },
      {
        type: 'fairy',
        value: 2
      },
      {
        type: 'electric',
        value: 0.5
      }
    ],
    answer: 'fairy'
  },
  {
    emeny: {
      title: 'attack emeny',
      type: 'steel'
    },
    options: [
      {
        type: 'rock',
        value: 0.5
      },
      {
        type: 'fire',
        value: 2
      },
      {
        type: 'flying',
        value: 0.5
      },
      {
        type: 'bug',
        value: 0.5
      }
    ],
    answer: 'fire'
  }
]

const getQuiz = (quizType) => {
  const attackerIndex = Math.floor(Math.random() * types.length);
  const defenderIndex = Math.floor(Math.random() * types.length);

  if (quizType === 'attacker') {

  }
  return quizzes[Math.floor(Math.random() * 2)];
};

export default getQuiz;
