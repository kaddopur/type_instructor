import React, { Component, PropTypes } from 'react';
import I18nPage from './I18nPage';
import classnames from 'classnames';
import getQuiz from '../lib/getQuiz';
import getStatus from '../lib/getStatus';
import './Quiz.css';

const TIME_LIMIT = 60;
const SCORE_TARGET = 20;

class Quiz extends Component {
  static contextTypes = {
    router: PropTypes.object,
    messages: PropTypes.object
  };

  state = {
    timer: this.props.params.gameType === 'basic' ? TIME_LIMIT : 0,
    scores: 0,
    status: '',
    freeze: false,
    quiz: getQuiz(this.props.params.quizType),
    overlay: true
  };

  dismissOverlay() {
    const { 
      location: {
        pathname
      },
      params: {
        gameType
      }
    } = this.props;
    const timerStep = gameType === 'basic' ? -1 : 1;

    this.setState({
      overlay: false
    });

    this.timerInterval = setInterval(() => {
      const { timer, scores } = this.state;
      this.setState({
        timer: timer + timerStep
      }, () => {
        if (gameType === 'basic' && timer === 0) {
          clearInterval(this.timerInterval);
          this.context.router.push(`${pathname}/result/${scores}`);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    const { timer, scores, status, quiz, overlay } = this.state;
    const { emeny, options } = quiz;
    const { lang, gameType } = this.props.params;
    const messages = this.context.messages[lang];
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
            if (this.props.params.gameType === 'speedrun' && this.state.scores === SCORE_TARGET) {
              clearInterval(this.timerInterval);
              this.context.router.push(`${this.props.location.pathname}/result/${this.state.timer}`);
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

export default I18nPage(Quiz);
