import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , browserHistory } from 'react-router'
import './index.css';
import './atomizer.css';

import App from './App';
import Quiz from './components/Quiz';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/type_instructor" component={App} />
    <Route path="/type_instructor/quizzes/:quizType" component={Quiz} />
  </Router>,
  document.getElementById('root')
);
