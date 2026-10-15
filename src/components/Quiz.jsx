import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import I18nPage from './I18nPage.jsx';
import classnames from 'classnames';
import getStatus from '../lib/getStatus.js';
import './Quiz.css';
import {
  resetQuizzes,
  dismissOverlay,
  updateTimer,
  clickRightOption,
  clickWrongOption,
  unfreeze
} from '../ducks/quizzes.js';

const SCORE_TARGET = 3;
const FREEZE_DURATION = 500;

class Quiz extends PureComponent {

  // handler
  dismissOverlay() {
    if (this.timerInterval) {
      return;
    }
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

  handleOptionClick(clickIndex, e) {
    const {
      quizzes: {
        quiz,
        freeze
      },
      actions: {
        clickRightOption,
        clickWrongOption
      }
    } = this.props;

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
      clickRightOption(clickIndex, getStatus(clickDemage));
    } else {
      clickWrongOption(clickIndex, getStatus(clickDemage));
    }
  }

  // life cycle methods
  componentDidMount() {
    this.props.actions.resetQuizzes();
  }

  componentDidUpdate(prevProps) {
    const { 
      location: {
        pathname
      },
      gameType,
      quizType,
      navigate,
      quizzes: {
        timer,
        scores,
        freeze,
        finish
      },
      actions: {
        unfreeze
      }
    } = this.props;

    if (timer !== prevProps.quizzes.timer) {
      if (gameType === 'basic' && timer === 0) {
        clearInterval(this.timerInterval);
        navigate(`${pathname}/result/${scores}`);
      }  
    }

    if (freeze !== prevProps.quizzes.freeze) {
      if (freeze) {
        this.feedbackTimeout = setTimeout(() => {
          unfreeze(quizType, finish);
          if (gameType === 'speedrun' && scores === SCORE_TARGET) {
            clearInterval(this.timerInterval);
            navigate(`${pathname}/result/${timer}`);
          }
        }, FREEZE_DURATION);
      }
    }
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

  componentWillUnmount() {
    clearInterval(this.timerInterval);
    clearTimeout(this.feedbackTimeout);
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

export default I18nPage(connect(mapStateToProps, mapDispatchToProps)(Quiz));
