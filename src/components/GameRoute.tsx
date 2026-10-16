import { useCallback, useState } from 'react';
import { Navigate, Outlet, useNavigate, useParams, useOutletContext } from 'react-router';
import { isGameRoute, normalizeLanguage } from '../lib/routes.ts';
import type { Quiz } from '../lib/types.ts';

interface CompletedSession {
  id: string;
  resultPath: string;
  questions: Quiz[];
}

interface GameCompletionContext {
  completed: CompletedSession | null;
  beginSession: () => void;
  completeGame: (completion: { resultPath: string; questions: Quiz[] }) => void;
}

export function useGameCompletion() {
  return useOutletContext<GameCompletionContext | undefined>();
}

export default function GameRoute() {
  const params = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState<CompletedSession | null>(null);
  const beginSession = useCallback(() => setCompleted(null), []);
  const completeGame = useCallback(
    ({ resultPath, questions }: { resultPath: string; questions: Quiz[] }) => {
      const id = crypto.randomUUID();
      setCompleted({ id, resultPath, questions });
      navigate(resultPath, { state: { completedSessionId: id } });
    },
    [navigate],
  );

  return isGameRoute(params) ? (
    <Outlet context={{ completed, beginSession, completeGame } satisfies GameCompletionContext} />
  ) : (
    <Navigate to={`/${normalizeLanguage(params.lang)}/menu`} replace />
  );
}
