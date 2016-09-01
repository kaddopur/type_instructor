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

    return (
      <nav className="Result">
        <section>
          <h1>{YOUR_SCORES}: {this.props.params.combo}</h1>
          <div className="resultItem">
            <Link to="/quizzes/attackSingle">{RETRY}</Link>
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
