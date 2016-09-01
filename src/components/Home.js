import React, { Component } from 'react';
import { Link } from 'react-router'

class Home extends Component {
  render() {
    return (
      <div className="Home C(white) ">
        <ul>
          <li>
            <Link to="/quizzes/attackEmeny">As an Attacker</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;
