import React, { Component } from 'react';
import classnames from 'classnames';
import getQuiz from '../lib/getQuiz';
import getStatus from '../lib/getStatus';
import './Quiz.css';

class Quiz extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    timer: 2,
    combo: 0,
    status: '',
    freeze: false,
    quiz: getQuiz(this.props.params.quizType)
  };

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState({
        timer: this.state.timer - 1
      }, () => {
        if (this.state.timer === 0) {
          clearInterval(this.timerInterval);
          this.context.router.push(`${this.props.location.pathname}/result/${this.state.combo}`);
        }
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  render() {
    const { timer, combo, status, quiz } = this.state;
    const { emeny, options } = quiz;

    return (
      <div className="Quiz">
        <div className={`stemContainer Bgc-${emeny.type}`}>
          <div className="stemHeader">
            <div className="stemTimer">timer: {timer}</div>
            <div className="stemCombo">combo: {combo}</div>
          </div>
          <div className="stemEnemy">
            <div className="stemEnemyText">{emeny.title}<br/>( {emeny.type} )</div>
          </div>
          <div className="stemStatus">{status}</div>
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
                  {type}
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
    const { combo, quiz, freeze } = this.state;

    if (freeze) {
      return; // no-op
    }

    const {
      type: clickType,
      demage: clickDemage
    } = quiz.options[clickIndex];

    if (clickType === quiz.answer) {
      this.setState({
        status: getStatus(clickDemage),
        combo: combo + 1,
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
          });
        }, 500);
      });
      return;
    }

    this.setState({
      status: getStatus(clickDemage),
      combo: combo - 1,
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

export default Quiz;
