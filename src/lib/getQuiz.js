

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
    return quizzes[Math.floor(Math.random() * 2)];
};

export default getQuiz;