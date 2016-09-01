import React, { Component } from 'react';
import './App.css';

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
      <div className="App">
        {types.map((type, index) => (
          <div className={`Bgc-${type}`} key={type + index}>{type}</div>
        ))}
      </div>
    );
  }
}

export default App;
