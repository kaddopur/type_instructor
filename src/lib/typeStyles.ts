import type { PokemonType } from './getQuiz.ts';

// Complete class names let Tailwind include every randomly selected type.
export const typeStyles = {
  normal: 'bg-type-normal text-black',
  fighting: 'bg-type-fighting text-white',
  flying: 'bg-type-flying text-black',
  poison: 'bg-type-poison text-white',
  ground: 'bg-type-ground text-black',
  rock: 'bg-type-rock text-black',
  bug: 'bg-type-bug text-black',
  ghost: 'bg-type-ghost text-white',
  steel: 'bg-type-steel text-black',
  fire: 'bg-type-fire text-black',
  water: 'bg-type-water text-black',
  grass: 'bg-type-grass text-black',
  electric: 'bg-type-electric text-black',
  psychic: 'bg-type-psychic text-black',
  ice: 'bg-type-ice text-black',
  dragon: 'bg-type-dragon text-black',
  dark: 'bg-type-dark text-white',
  fairy: 'bg-type-fairy text-black',
  wrong: 'bg-type-wrong text-white',
} satisfies Record<PokemonType | 'wrong', string>;
