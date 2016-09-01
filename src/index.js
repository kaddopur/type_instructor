import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , hashHistory } from 'react-router'
import './index.css';

import App from './App';
import Quiz from './components/Quiz';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App} />
    <Route path="/quizzes/:quizType" component={Quiz} />
  </Router>,
  document.getElementById('root')
);
