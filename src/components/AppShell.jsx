function AppShell({ children }) {
  return (
    <main id="main-content" className="app-shell">
      <div className="app-content">{children}</div>
    </main>
  );
}

export default AppShell;
