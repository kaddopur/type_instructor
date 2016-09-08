import getQuiz from '../lib/getQuiz';

// Constants
const TIME_LIMIT = 60;

// Actions
export const RESET_QUIZZES = 'type_instructor/quizzes/RESET_QUIZZES';
export const DISMISS_OVERLAY = 'type_instructor/quizzes/DISMISS_OVERLAY';
export const UPDATE_TIMER = 'type_instructor/quizzes/UPDATE_TIMER';
export const CLICK_RIGHT_OPTION = 'type_instructor/quizzes/CLICK_RIGHT_OPTION';
export const CLICK_WRONG_OPTION = 'type_instructor/quizzes/CLICK_WRONG_OPTION';
export const UNFREEZE = 'type_instructor/quizzes/UNFREEZE';

// Reducer
const initialState = {
  timer: TIME_LIMIT,
  scores: 0,
  status: '',
  freeze: false,
  finish: false,
  quiz: getQuiz('attack'),
  overlay: true
};

export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
    case RESET_QUIZZES:
      return {
        timer: action.payload.gameType === 'basic' ? TIME_LIMIT : 0,
        scores: 0,
        status: '',
        freeze: false,
        finish: false,
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
    case CLICK_RIGHT_OPTION:
      return {
        ...state,
        status: action.payload.status,
        scores: state.scores + 1,
        freeze: true,
        finish: true,
        quiz: {
          ...state.quiz,
          options: [
            ...state.quiz.options.slice(0, action.payload.index),
            {
              ...state.quiz.options[action.payload.index],
              clicked: true,
              correct: true
            },
            ...state.quiz.options.slice(action.payload.index + 1)
          ]
        }
      };
    case CLICK_WRONG_OPTION:
      return {
        ...state,
        status: action.payload.status,
        scores: state.scores - 1,
        freeze: true,
        quiz: {
          ...state.quiz,
          options: [
            ...state.quiz.options.slice(0, action.payload.index),
            {
              ...state.quiz.options[action.payload.index],
              clicked: true
            },
            ...state.quiz.options.slice(action.payload.index + 1)
          ]
        }
      };
    case UNFREEZE:
      return {
        ...state,
        freeze: false,
        status: '',
        finish: action.payload.finish ? false : state.finish,
        quiz: action.payload.finish ? getQuiz(action.payload.quizType) : state.quiz
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

export function clickRightOption(index, status) {
  return {
    type: CLICK_RIGHT_OPTION,
    payload: {
      index,
      status
    }
  };
}

export function clickWrongOption(index, status) {
  return {
    type: CLICK_WRONG_OPTION,
    payload: {
      index,
      status
    }
  };
}

export function unfreeze(quizType, finish) {
  return {
    type: UNFREEZE,
    payload: {
      quizType,
      finish
    }
  };
}
