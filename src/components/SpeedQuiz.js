import React, { Component, PropTypes } from 'react';
import I18nPage from './I18nPage';
import getQuiz from '../lib/getQuiz';
import Quiz from './Quiz';

class SpeedQuiz extends Quiz {
  constructor(props) {
    console.log('asdf');
    super(props);
    this.state = {
      timer: 0,
      scores: 0,
      status: '',
      freeze: false,
      quiz: getQuiz(this.props.params.quizType)
    };
  }
};

export default I18nPage(SpeedQuiz);
