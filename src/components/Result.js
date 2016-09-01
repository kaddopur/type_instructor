import React, { Component } from 'react';
import { Link } from 'react-router'
import './Result.css';

class Result extends Component {
  render() {
    return (
      <nav className="Result">
        <section>
          <h1>Your score: {this.props.params.combo}</h1>
          <div className="resultItem">
            <Link to="/quizzes/attackSingle">Retry</Link>
          </div>
          <div className="resultItem">
            <Link to="/menu">Menu</Link>
          </div>
        </section>

        <footer>
          <Link to="/">home</Link>
        </footer>
      </nav>
    );
  }
}

export default Result;
