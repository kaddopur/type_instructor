import { createStore } from 'zustand/vanilla';
import { createQuizGenerator } from '../lib/getQuiz.ts';
import getStatus from '../lib/getStatus.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';
import type { GameType, QuizType, Quiz } from '../lib/types.ts';

export interface QuizState {
  timer: number;
  scores: number;
  status: ReturnType<typeof getStatus> | '';
  freeze: boolean;
  finish: boolean;
  finishTime: number | null;
  result: number | null;
  quiz: Quiz;
  overlay: boolean;
  start: () => void;
  tick: () => void;
  answer: (index: number) => void;
  advance: () => void;
}

export function createQuizStore(gameType: GameType, quizType: QuizType) {
  const nextQuiz = createQuizGenerator(quizType);
  return createStore<QuizState>(set => ({
    timer: gameType === 'basic' ? 60 : 0,
    scores: 0,
    status: '',
    freeze: false,
    finish: false,
    finishTime: null,
    result: null,
    quiz: nextQuiz(),
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
        status: getStatus(option.damage),
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
        quiz: state.finish && !completed ? nextQuiz() : state.quiz
      };
    })
  }));
}
