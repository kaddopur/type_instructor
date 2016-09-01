import React, { Component } from 'react';
import './Quiz.css';

class Quiz extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  state = {
    timer: 5,
    combo: 0,
    status: 'super effective',
    quiz: {
      emeny: {
        title: 'attack emeny',
        type: 'dragon'
      },
      options: [
        {
          type: 'normal',
          value: 1
        },
        {
          type: 'poison',
          value: 1
        },
        {
          type: 'fairy',
          value: 2
        },
        {
          type: 'electric',
          value: 0.5
        }
      ],
      answer: 2
    }
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
        <div className="stemContainer Ta(c) C(white) Bgc-dragon">
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
              <div className={"optionItem Ta(c) W(50%) C(white) Bgc-" + type}
                key={type + index}>
                <div className="optionText">{type}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Quiz;
