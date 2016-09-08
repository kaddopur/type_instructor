import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , hashHistory } from 'react-router';
import getMessages from './lib/getMessages';
import 'normalize.css';
import './index.css';
import './color.css';

import Home from './components/Home';
import Menu from './components/Menu';
import Lang from './components/Lang';
import Quiz from './components/Quiz';
import Result from './components/Result';

import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

const store = createStore(
  combineReducers({
    messages: getMessages,
    routing: routerReducer
  }),
  window.devToolsExtension ? window.devToolsExtension() : undefined
);

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Home} />
      <Route path="/:lang/" component={Home} />
      <Route path="/:lang/menu" component={Menu} />
      <Route path="/:lang/lang" component={Lang} />
      <Route path="/:lang/quizzes/:catetory/:gameType/:quizType" component={Quiz} />
      <Route path="/:lang/quizzes/:catetory/:gameType/:quizType/result/:value" component={Result} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
