import type { PokemonType } from './getQuiz.ts';

export type GameType = 'basic' | 'speedrun';
export type QuizType = 'attack' | 'defend';
export type Language = 'en' | 'zh' | 'ja';

export interface GameRouteParams {
  lang: Language;
  catetory: 's';
  gameType: GameType;
  quizType: QuizType;
  value?: string;
}

export interface Quiz {
  emeny: { title: 'ENEMY_ATTACK' | 'ENEMY_DEFEND'; type: PokemonType };
  options: { type: PokemonType; demage: number; clicked?: boolean; correct?: boolean }[];
  answer: PokemonType;
}
