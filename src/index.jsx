import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import getMessages from './lib/getMessages.js';
import * as reducers from './ducks/index.js';
import Home from './components/Home.jsx';
import Menu from './components/Menu.jsx';
import Lang from './components/Lang.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';
import 'normalize.css';
import './index.css';
import './color.css';

const store = createStore(combineReducers({
  ...reducers,
  messages: getMessages
}));

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:lang/" element={<Home />} />
        <Route path="/:lang/menu" element={<Menu />} />
        <Route path="/:lang/lang" element={<Lang />} />
        <Route path="/:lang/quizzes/:catetory/:gameType/:quizType" element={<Quiz />} />
        <Route path="/:lang/quizzes/:catetory/:gameType/:quizType/result/:value" element={<Result />} />
      </Routes>
    </HashRouter>
  </Provider>
);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(`${import.meta.env.BASE_URL}service-worker.js`)
    .catch(error => console.warn('Service worker registration failed:', error));
}
