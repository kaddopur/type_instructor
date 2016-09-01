import React, { Component } from 'react';
import './App.css';
import './atomizer.css';

const types = [
  'normal',
  'fighting',
  'flying',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'ice',
  'dragon',
  'dark',
  'fairy'
];

class App extends Component {
  render() {
    return (
      <div className="App C(white) Fz(1em)">
        {types.map((type, index) => (
          <div className={'Ta(c) Bgc-' + type} key={type + index}>{type}</div>
        ))}
      </div>
    );
  }
}

export default App;
