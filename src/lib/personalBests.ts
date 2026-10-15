import type { GameType, QuizType } from './types.ts';

export function getPersonalBest(mode: GameType, kind: QuizType): number | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(`type-instructor:best:${mode}:${kind}`) ?? 'null');
    return typeof value === 'number' && Number.isSafeInteger(value) && (mode === 'basic' || value >= 0) ? value : null;
  } catch {
    return null;
  }
}

export function savePersonalBest(mode: GameType, kind: QuizType, value: number) {
  if (!Number.isSafeInteger(value) || (mode === 'speedrun' && value < 0)) return;
  const best = getPersonalBest(mode, kind);
  if (best !== null && (mode === 'basic' ? value <= best : value >= best)) return;
  try {
    localStorage.setItem(`type-instructor:best:${mode}:${kind}`, JSON.stringify(value));
  } catch {
    // A storage restriction must not prevent the game from finishing.
  }
}
