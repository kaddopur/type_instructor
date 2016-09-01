import React, { Component } from 'react';
import { Link } from 'react-router'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App C(white) ">
        <ul>
          <li>
            <Link to="/quizzes/attacker">As an Attacker</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default App;
