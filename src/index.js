import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , browserHistory } from 'react-router'
import './index.css';
import './atomizer.css';

import App from './App';
import Quiz from './components/Quiz';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App} />
    <Route path="/quizzes/:quizType" component={Quiz} />
  </Router>,
  document.getElementById('root')
);
