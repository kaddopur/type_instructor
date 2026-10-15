import { useLocation } from 'react-router';

function AppShell({ children }) {
  const { pathname } = useLocation();
  const scrolling = /\/about\/?$/.test(pathname);
  return (
    <main id="main-content" className="app-shell">
      <div className={`app-content${scrolling ? ' app-content-scroll' : ''}`}>{children}</div>
    </main>
  );
}

export default AppShell;
