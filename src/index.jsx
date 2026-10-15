import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import Lang from './components/Lang.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';
import GameRoute from './components/GameRoute.tsx';
import 'normalize.css';
import './index.css';
import './color.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:lang/" element={<Home />} />
        <Route path="/:lang/menu" element={<Menu />} />
        <Route path="/:lang/lang" element={<Lang />} />
        <Route path="/:lang/quizzes/:category/:gameType/:quizType" element={<GameRoute />}>
          <Route index element={<Quiz />} />
          <Route path="result/:value" element={<Result />} />
        </Route>
        <Route path="*" element={<Navigate to="/en/" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`, { updateViaCache: 'none' })
    .catch(error => console.warn('Service worker registration failed:', error));
}
