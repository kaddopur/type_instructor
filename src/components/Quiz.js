import React, { Component } from 'react';
import { connect } from 'react-redux';
import I18nPage from './I18nPage';
import classnames from 'classnames';
import getQuiz from '../lib/getQuiz';
import getStatus from '../lib/getStatus';
import './Quiz.css';

import { resetQuizzes, dismissOverlay, updateTimer, clickRightOption, clickWrongOption, unfreeze } from '../ducks/quizzes';
import { push } from 'react-router-redux'

const SCORE_TARGET = 3;
const FREEZE_DURATION = 500;

class Quiz extends Component {

  // handler
  dismissOverlay() {
    const { 
      computed: {
        timerStep
      },
      actions: {
        dismissOverlay,
        updateTimer
      }
    } = this.props;

    dismissOverlay();

    this.timerInterval = setInterval(() => {
      updateTimer(this.props.quizzes.timer + timerStep);
    }, 1000);
  }

  componentWillMount() {
    this.props.actions.resetQuizzes();
  }

  componentWillReceiveProps(nextProps) {
    const { 
      location: {
        pathname
      },
      gameType,
      quizType,
      quizzes: {
        timer,
        scores,
        freeze
      },
      actions: {
        showResult,
        unfreeze
      }
    } = this.props;

    if (timer !== nextProps.quizzes.timer) {
      if (gameType === 'basic' && nextProps.quizzes.timer === 0) {
        clearInterval(this.timerInterval);
        showResult(`${pathname}/result/${scores}`);
      }  
    }

    if (freeze !== nextProps.quizzes.freeze) {
      if (nextProps.quizzes.freeze) {
        setTimeout(() => {
          unfreeze(quizType, nextProps.quizzes.finish);
          if (gameType === 'speedrun' && nextProps.quizzes.scores === SCORE_TARGET) {
            clearInterval(this.timerInterval);
            showResult(`${pathname}/result/${timer}`);
          }
        }, FREEZE_DURATION);
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    const {
      messages,
      gameType,
      quizzes: {
        timer,
        scores,
        status,
        quiz: {
          emeny = { type: '' },
          options = []
        } = {},
        overlay
      }
    } = this.props;

    const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN } = messages;

    const overlayDiv = (
      <div className="overlay" onClick={this.dismissOverlay.bind(this)}>
        <h2>{GOAL}</h2>
        <span>{gameType === 'basic' ? GOAL_BASIC : GOAL_SPEEDRUN}</span>
      </div>
    );

    return (
      <div className="Quiz">
        {overlay ? overlayDiv : null}
        <div className={`stemContainer Bgc-${emeny.type}`}>
          <div className="stemHeader">
            <div className="stemTimer">{TIMER}: {timer}</div>
            <div className="stemScores">{SCORES}: {scores}</div>
          </div>
          <div className="stemEnemy">
            <div className="stemEnemyText">{messages[emeny.title]}<br/>( {messages[emeny.type.toUpperCase()]} )</div>
          </div>
          <div className="stemStatus">{messages[status]}</div>
        </div>
        <div className="optionContainer">
          {options.map((option, index) => {
            const { type, demage, clicked, correct } = option;
            const optionClass = classnames('optionItem', {
              [`Bgc-${type}`]: !clicked || correct,
              'Bgc-wrong': clicked && !correct
            });
            return (
              <div key={type + index}
                className={optionClass}
                onClick={this.handleOptionClick.bind(this, index)}>
                <div className="optionText">
                  {messages[type.toUpperCase()]}
                  {clicked ? <div className="optionDemage">{demage}</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  handleOptionClick(clickIndex, e) {
    const { scores, quiz, freeze } = this.props.quizzes;

    if (freeze) {
      return; // no-op
    }

    const {
      type: clickType,
      demage: clickDemage,
      clicked
    } = quiz.options[clickIndex];

    if (clicked) {
      return; // no-op
    }

    if (clickType === quiz.answer) {
      this.props.actions.clickRightOption(clickIndex, getStatus(clickDemage));
    } else {
      this.props.actions.clickWrongOption(clickIndex, getStatus(clickDemage));
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    messages,
    quizzes
  } = state;

  const {
    lang = 'en',
    gameType,
    quizType
  } = ownProps.params;

  return {
    messages: messages[lang],
    lang,
    quizzes,
    gameType,
    quizType,
    computed: {
      timerStep: gameType === 'basic' ? -1 : 1
    }
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    gameType,
    quizType
  } = ownProps.params;

  return {
    actions: {
      resetQuizzes: () => {
        dispatch(resetQuizzes(gameType, quizType));
      },
      dismissOverlay: () => {
        dispatch(dismissOverlay());
      },
      showResult: (resultUrl) => {
        dispatch(push(resultUrl));
      },
      updateTimer: (timer) => {
        dispatch(updateTimer(timer));
      },
      clickRightOption: (index, status) => {
        dispatch(clickRightOption(index, status));
      },
      clickWrongOption: (index, status) => {
        dispatch(clickWrongOption(index, status));
      },
      unfreeze: (quizType, finish) => {
        dispatch(unfreeze(quizType, finish));
      }
    }
  }
};

// {
//   gameType: basic|speedrun,
//   quizType: attack|defend
// }

export default I18nPage(connect(mapStateToProps, mapDispatchToProps)(Quiz));
