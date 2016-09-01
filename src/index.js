import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route , hashHistory } from 'react-router';
import getMessages from './lib/getMessages';
import 'normalize.css'
import './index.css';
import './color.css'

import Home from './components/Home';
import Menu from './components/Menu';
import Quiz from './components/Quiz';
import Result from './components/Result';

class App extends Component {
  static childContextTypes = {
    messages: PropTypes.object
  }

  getChildContext() {
    return {
      messages: getMessages('zh-Hant-TW')
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
      <Route path="/menu" component={Menu} />
      <Route path="/quizzes/:quizType" component={Quiz} />
      <Route path="/quizzes/:quizType/result/:combo" component={Result} />
    </Router>
  </App>,
  document.getElementById('root')
);
