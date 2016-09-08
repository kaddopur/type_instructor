import React, { Component } from 'react';
import { connect } from 'react-redux';
import I18nPage from './I18nPage';
import classnames from 'classnames';
import getQuiz from '../lib/getQuiz';
import getStatus from '../lib/getStatus';
import './Quiz.css';

import { resetQuizzes, dismissOverlay } from '../ducks/quizzes';
import { push } from 'react-router-redux'

const SCORE_TARGET = 20;

class Quiz extends Component {
  dismissOverlay() {
    const { 
      location: {
        pathname
      },
      gameType,
      computed: {
        timerStep
      }
    } = this.props;

    this.props.actions.dismissOverlay();

    // this.timerInterval = setInterval(() => {
    //   const { timer, scores } = this.state.quizzes;
    //   this.setState({
    //     timer: timer + timerStep
    //   }, () => {
    //     if (gameType === 'basic' && timer === 0) {
    //       clearInterval(this.timerInterval);
    //       this.props.actions.showResult(`${pathname}/result/${scores}`);
    //     }
    //   });
    // }, 1000);
  }

  componentWillMount() {
    this.props.actions.resetQuizzes();
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    const {
      timer,
      scores,
      status,
      quiz: {
        emeny = { type: '' },
        options = []
      } = {},
      overlay
    } = this.props.quizzes;

    const {
      messages,
      gameType
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
    const { scores, quiz, freeze } = this.state;

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
      this.setState({
        status: getStatus(clickDemage),
        scores: scores + 1,
        freeze: true,
        quiz: {
          ...quiz,
          options: [
            ...quiz.options.slice(0, clickIndex),
            {
              ...quiz.options[clickIndex],
              clicked: true,
              correct: true
            },
            ...quiz.options.slice(clickIndex + 1)
          ]
        }
      }, () => {
        setTimeout(() => {
          this.setState({
            quiz: getQuiz(this.props.params.quizType, quiz.emeny.type),
            status: '',
            freeze: false
          }, () => {
            if (this.props.gameType === 'speedrun' && this.state.scores === SCORE_TARGET) {
              clearInterval(this.timerInterval);
              this.props.actions.showResult(`${this.props.location.pathname}/result/${this.state.timer}`);
            }
          });
        }, 500);
      });
      return;
    }

    this.setState({
      status: getStatus(clickDemage),
      scores: scores - 1,
      freeze: true,
      quiz: {
        ...quiz,
        options: [
          ...quiz.options.slice(0, clickIndex),
          {
            ...quiz.options[clickIndex],
            clicked: true
          },
          ...quiz.options.slice(clickIndex + 1)
        ]
      }
    }, () => {
      setTimeout(() => {
        this.setState({
          status: '',
          freeze: false
        });
      }, 500);
    });
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
        dispatch(push(resultUrl))
      }
    }
  }
};

// {
//   gameType: basic|speedrun,
//   quizType: attack|defend
// }

export default I18nPage(connect(mapStateToProps, mapDispatchToProps)(Quiz));
