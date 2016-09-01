import React, { Component } from 'react';
import { Link } from 'react-router'

import './App.css';

// eslint-disable-next-line
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
      <div className="App C(white) ">
        <ul>
          <li>
            <Link to="/attacker">As an Attacker</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
