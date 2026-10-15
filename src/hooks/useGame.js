import { useEffect, useState } from 'react';
import { useStore } from 'zustand';
import { createQuizStore } from '../stores/quiz.js';

export default function useGame(gameType, quizType) {
  const [store] = useState(() => createQuizStore(gameType, quizType));
  const state = useStore(store);
  const { overlay, freeze, result } = state;

  useEffect(() => {
    if (overlay || result !== null) return;
    const interval = setInterval(() => store.getState().tick(), 1000);
    return () => clearInterval(interval);
  }, [store, overlay, result]);

  useEffect(() => {
    if (!freeze || result !== null) return;
    const timeout = setTimeout(() => store.getState().advance(), 500);
    return () => clearTimeout(timeout);
  }, [store, freeze, result]);

  return state;
}
