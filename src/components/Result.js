import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import './Result.css';

class Result extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const {
      YOUR_SCORES,
      RETRY,
      MENU,
      HOME
    } = this.context.messages;

    const { scores, quizType } = this.props.params;

    return (
      <nav className="Result">
        <section>
          <h1>{YOUR_SCORES}: {scores}</h1>
          <div className="resultItem">
            <Link to={`/quizzes/${quizType}`}>{RETRY}</Link>
          </div>
          <div className="resultItem">
            <Link to="/menu">{MENU}</Link>
          </div>
        </section>

        <footer>
          <Link to="/">{HOME}</Link>
        </footer>
      </nav>
    );
  }
}

export default Result;
