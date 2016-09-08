import getQuiz from '../lib/getQuiz';

// Constants
const TIME_LIMIT = 60;

// Actions
export const RESET_QUIZZES = 'type_instructor/quizzes/RESET_QUIZZES';
export const DISMISS_OVERLAY = 'type_instructor/quizzes/DISMISS_OVERLAY';
export const UPDATE_TIMER = 'type_instructor/quizzes/UPDATE_TIMER';

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
    case DISMISS_OVERLAY:
      return {
        ...state,
        overlay: false
      };
    case UPDATE_TIMER:
      return {
        ...state,
        timer: action.payload.timer
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
  };
}

export function dismissOverlay() {
  return {
    type: DISMISS_OVERLAY
  };
}

export function updateTimer(timer) {
  return {
    type: UPDATE_TIMER,
    payload: {
      timer
    }
  };
}
