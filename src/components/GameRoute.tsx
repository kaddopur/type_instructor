import { Navigate, Outlet, useParams } from 'react-router';
import { isGameRoute, normalizeLanguage } from '../lib/routes.ts';

export default function GameRoute() {
  const params = useParams();
  return isGameRoute(params) ? (
    <Outlet />
  ) : (
    <Navigate to={`/${normalizeLanguage(params.lang)}/menu`} replace />
  );
}
