import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , hashHistory } from 'react-router';
import 'normalize.css'
import './index.css';
import './color.css'

import Home from './components/Home';
import Menu from './components/Menu';
import Quiz from './components/Quiz';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Home} />
    <Route path="/menu" component={Menu} />
    <Route path="/quizzes/:quizType" component={Quiz} />
  </Router>,
  document.getElementById('root')
);
