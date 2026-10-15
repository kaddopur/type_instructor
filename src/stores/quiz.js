import { createStore } from 'zustand/vanilla';
import getQuiz from '../lib/getQuiz.js';
import getStatus from '../lib/getStatus.js';

// BUG-02: unify this target with the localized 20-point instructions in step 4.
export const SCORE_TARGET = 3;

export function createQuizStore(gameType, quizType) {
  return createStore(set => ({
    timer: gameType === 'basic' ? 60 : 0,
    scores: 0,
    status: '',
    freeze: false,
    finish: false,
    finishTime: null,
    result: null,
    quiz: getQuiz(quizType),
    overlay: true,

    start: () => set(state => state.overlay ? { overlay: false } : state),

    tick: () => set(state => {
      if (state.overlay || state.result !== null) return state;
      const timer = state.timer + (gameType === 'basic' ? -1 : 1);
      return { timer, result: gameType === 'basic' && timer === 0 ? state.scores : null };
    }),

    answer: index => set(state => {
      const option = state.quiz.options[index];
      if (state.overlay || state.freeze || state.result !== null ||
          !Number.isInteger(index) || !option || option.clicked) return state;
      const correct = option.type === state.quiz.answer;
      return {
        scores: state.scores + (correct ? 1 : -1),
        status: getStatus(option.demage),
        freeze: true,
        finish: correct,
        finishTime: correct ? state.timer : null,
        quiz: {
          ...state.quiz,
          options: state.quiz.options.map((item, itemIndex) =>
            itemIndex === index ? { ...item, clicked: true, correct } : item)
        }
      };
    }),

    advance: () => set(state => {
      if (!state.freeze || state.result !== null) return state;
      const completed = gameType === 'speedrun' && state.finish && state.scores === SCORE_TARGET;
      return {
        freeze: false,
        finish: false,
        finishTime: null,
        status: '',
        result: completed ? state.finishTime : null,
        quiz: state.finish && !completed ? getQuiz(quizType) : state.quiz
      };
    })
  }));
}
