import { createStore } from 'zustand/vanilla';
import type { Quiz } from '../lib/types.ts';

type ActiveQuestion = { current: Quiz; pending: Quiz[] };
export type PracticePhase =
  | ({ kind: 'answering' } & ActiveQuestion)
  | ({ kind: 'feedback'; selectedIndex: number; correct: boolean } & ActiveQuestion)
  | { kind: 'complete' };

interface PracticeState {
  phase: PracticePhase;
  answer: (index: number) => void;
  advance: () => void;
}

function nextPhase(questions: Quiz[]): PracticePhase {
  const [current, ...pending] = questions;
  return current ? { kind: 'answering', current, pending } : { kind: 'complete' };
}

export function createMistakePracticeStore(questions: Quiz[]) {
  return createStore<PracticeState>((set) => ({
    phase: nextPhase(questions),
    answer: (index) =>
      set((state) => {
        const { phase } = state;
        if (phase.kind !== 'answering' || !Number.isInteger(index)) return state;
        const option = phase.current.options[index];
        if (!option) return state;
        return {
          phase: {
            ...phase,
            kind: 'feedback',
            selectedIndex: index,
            correct: option.type === phase.current.answer,
          },
        };
      }),
    advance: () =>
      set((state) => {
        const { phase } = state;
        if (phase.kind !== 'feedback') return state;
        return {
          phase: nextPhase(phase.correct ? phase.pending : [...phase.pending, phase.current]),
        };
      }),
  }));
}
