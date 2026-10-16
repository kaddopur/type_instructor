import { createStore } from 'zustand/vanilla';
import type { Quiz } from '../lib/types.ts';

type ActiveQuestion = { current: Quiz; pending: Quiz[]; wrongIndices: number[] };
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
  return current ? { kind: 'answering', current, pending, wrongIndices: [] } : { kind: 'complete' };
}

export function createMistakePracticeStore(questions: Quiz[]) {
  return createStore<PracticeState>((set) => ({
    phase: nextPhase(questions),
    answer: (index) =>
      set((state) => {
        const { phase } = state;
        if (
          phase.kind !== 'answering' ||
          !Number.isInteger(index) ||
          phase.wrongIndices.includes(index)
        )
          return state;
        const option = phase.current.options[index];
        if (!option) return state;
        const correct = option.type === phase.current.answer;
        return {
          phase: {
            ...phase,
            kind: 'feedback',
            selectedIndex: index,
            correct,
            wrongIndices: correct ? phase.wrongIndices : [...phase.wrongIndices, index],
          },
        };
      }),
    advance: () =>
      set((state) => {
        const { phase } = state;
        if (phase.kind !== 'feedback') return state;
        if (!phase.correct) {
          return {
            phase: {
              kind: 'answering',
              current: phase.current,
              pending: phase.pending,
              wrongIndices: phase.wrongIndices,
            },
          };
        }
        return {
          phase: nextPhase(
            phase.wrongIndices.length ? [...phase.pending, phase.current] : phase.pending,
          ),
        };
      }),
  }));
}
