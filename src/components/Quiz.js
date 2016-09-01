import React, { Component } from 'react';
import getQuiz from '../lib/getQuiz';
import './Quiz.css';

class Quiz extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    timer: 60,
    combo: 0,
    status: '',
    freeze: false,
    quiz: getQuiz(this.props.params.quizType)
  };

  componentWillMount() {
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentDidMount() {
    this.timerInterval = setInterval(() => {
      this.setState({
        timer: this.state.timer - 1
      }, () => {
        if (this.state.timer === 0) {
          clearInterval(this.timerInterval);
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
        <div className={'stemContainer Ta(c) C(white) Bgc-' + emeny.type}>
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
            const { type } = option;
            return (
              <div className={'optionItem Ta(c) W(50%) C(white) Bgc-' + type}
                key={type + index}
                onClick={this.handleOptionClick}>
                <div className="optionText">{type}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  handleOptionClick(e) {
    const { combo, quiz, freeze } = this.state;

    if (freeze) {
      return; // no-op
    }

    const typeClicked = e.target.innerText;
    const value = quiz.options.filter(option => option.type === typeClicked)[0].value;
    const maxValue = Math.max(...quiz.options.map(option => option.value));

    this.setState({
      status: value === maxValue ? 'super effective' : 'not very effective',
      combo: typeClicked === quiz.answer ? (combo + 1) : 0,
      freeze: true
    }, () => {
      setTimeout(() => {
        this.setState({
          quiz: getQuiz(this.props.params.quizType),
          status: '',
          freeze: false
        });
      }, 500);
    });
  }
}

export default Quiz;
