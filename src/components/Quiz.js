import React, { Component } from 'react';
import './Quiz.css';

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: 60,
      combo: 0,
      status: '',
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
  }

  render() {
    const { quiz, combo, status } = this.state;
    const { emeny, options } = quiz;

    return (
      <div className="Quiz">
        <div className="stemContainer Ta(c) C(white) Bgc-dragon">
          <div className="stemCombo">combo: {combo}</div>
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
