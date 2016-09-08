import getQuiz from '../lib/getQuiz';

// Constants
const TIME_LIMIT = 60;

// Actions
export const RESET_QUIZZES = 'type_instructor/quizzes/RESET_QUIZZES';

// Reducer
export default function reducer(state = {}, action = {}) {
  switch(action.type) {
    case RESET_QUIZZES:
      return {
        timer: action.payload.gameType === 'basic' ? TIME_LIMIT : 0,
        scores: 0,
        status: '',
        freeze: false,
        quiz: getQuiz(action.payload.quizType),
        overlay: true
      };
    default:
      return state;
  }
}

// Action Creators
export function resetQuizzes(gameType, quizType) {
  return {
    type: RESET_QUIZZES,
    payload: {
      gameType,
      quizType
    }
  }
}
