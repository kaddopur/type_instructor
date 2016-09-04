import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , hashHistory } from 'react-router';
import getMessages from './lib/getMessages';
import 'normalize.css'
import './index.css';
import './color.css'

import Home from './components/Home';
import Menu from './components/Menu';
import Lang from './components/Lang';
import Quiz from './components/Quiz';
import Result from './components/Result';

class App extends Component {
  static childContextTypes = {
    messages: PropTypes.object
  };

  getChildContext() {
    return {
      messages: getMessages()
    }
  }

  render() {
    return this.props.children;
  }
}

ReactDOM.render(
  <App>
    <Router history={hashHistory}>
      <Route path="/" component={Home} />
      <Route path="/:lang/" component={Home} />
      <Route path="/:lang/menu" component={Menu} />
      <Route path="/:lang/lang" component={Lang} />
      <Route path="/:lang/quizzes/:catetory/:gameType/:quizType" component={Quiz} />
      <Route path="/:lang/quizzes/:catetory/:gameType/:quizType/result/:scores" component={Result} />
    </Router>
  </App>,
  document.getElementById('root')
);
