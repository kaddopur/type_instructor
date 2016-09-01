import React, { Component } from 'react';
import './Quiz.css';

class Quiz extends Component {
  render() {
    return (
      <div className="Quiz">
        <div className="stemContainer Ta(c) C(white) Bgc-dragon">
          <div className="stemCombo">combo: 18</div>
          <div className="stemEnemy">
            <div className="stemEnemyText">attack enemy<br/>( dragon )</div>
          </div>
          <div className="stemStatus">super effective</div>
        </div>
        <div className="optionContainer">
          <div className="optionItem Ta(c) W(50%) C(white) Bgc-normal">
            <div className="optionText">normal</div>
          </div>
          <div className="optionItem Ta(c) W(50%) C(white) Bgc-poison">
            <div className="optionText">poison</div>
          </div>
          <div className="optionItem Ta(c) W(50%) C(white) Bgc-fairy">
            <div className="optionText">fairy</div>
          </div>
          <div className="optionItem Ta(c) W(50%) C(white) Bgc-electric">
            <div className="optionText">electric</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Quiz;
