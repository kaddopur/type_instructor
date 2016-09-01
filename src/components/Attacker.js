import React, { Component } from 'react';
import './Attacker.css';

class Attacker extends Component {
  render() {
    return (
      <div className="Attacker">
        <div className="stemContainer Ta(c) C(white) Bgc-dragon">Enemy<br/>( dragon )</div>
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

export default Attacker;
