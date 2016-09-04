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
      YOUR_TIME,
      RETRY,
      MENU,
      HOME
    } = this.context.messages[lang];

    const { value, catetory, gameType, quizType } = this.props.params;
    let titleDiv = null;

    if (gameType === 'basic') {
      titleDiv = <h1>{YOUR_SCORES}<br/>{value}</h1>;
    } else if (gameType === 'speedrun') {
      titleDiv = <h1>{YOUR_TIME}<br/>{`${value}s`}</h1>;
    }

    return (
      <nav className="Result">
        <section>
          {titleDiv}
          <div className="resultItem">
            <I18nLink to={`/quizzes/${catetory}/${gameType}/${quizType}`} lang={lang}>{RETRY}</I18nLink>
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
