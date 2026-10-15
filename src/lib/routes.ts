import type { GameRouteParams, Language } from './types.ts';

export function normalizeLanguage(lang: string | undefined): Language {
  return lang === 'zh' || lang === 'ja' ? lang : 'en';
}

export function isGameRoute(
  params: Record<string, string | undefined>,
): params is Record<string, string | undefined> & GameRouteParams {
  const { category, gameType, quizType, value } = params;
  if (
    category !== 's' ||
    (gameType !== 'basic' && gameType !== 'speedrun') ||
    (quizType !== 'attack' && quizType !== 'defend')
  )
    return false;
  if (value === undefined) return true;
  return (
    (gameType === 'basic' ? /^-?\d+$/ : /^\d+$/).test(value) && Number.isSafeInteger(Number(value))
  );
}
