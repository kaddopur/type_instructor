import React, { Component, PropTypes } from 'react';
import I18nLink from './I18nLink';
import I18nPage from './I18nPage';
import './Result.css';

class Result extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const { lang } = this.props.params;
    const {
      YOUR_SCORES,
      RETRY,
      MENU,
      HOME
    } = this.context.messages[lang];

    const { scores, quizType } = this.props.params;

    return (
      <nav className="Result">
        <section>
          <h1>{YOUR_SCORES}: {scores}</h1>
          <div className="resultItem">
            <I18nLink to={`/quizzes/${quizType}`} lang={lang}>{RETRY}</I18nLink>
          </div>
          <div className="resultItem">
            <I18nLink to="/menu" lang={lang}>{MENU}</I18nLink>
          </div>
        </section>

        <footer>
          <I18nLink to="/" lang={lang}>{HOME}</I18nLink>
        </footer>
      </nav>
    );
  }
}

export default I18nPage(Result);
