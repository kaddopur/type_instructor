import { useLocation } from 'react-router';
import { cn } from '../lib/utils.ts';

function AppShell({ children }) {
  const { pathname } = useLocation();
  const scrolling = /\/about\/?$/.test(pathname);
  return (
    <main id="main-content" className="app-shell h-dvh overflow-hidden [padding:env(safe-area-inset-top,0px)_env(safe-area-inset-right,0px)_env(safe-area-inset-bottom,0px)_env(safe-area-inset-left,0px)]">
      <div className={cn('app-content h-full overflow-hidden', scrolling && 'app-content-scroll overflow-y-auto [scrollbar-gutter:stable] overscroll-contain')}>{children}</div>
    </main>
  );
}

export default AppShell;
