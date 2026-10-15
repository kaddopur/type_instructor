import React, { PureComponent } from 'react';
import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import './Result.css';

class Result extends PureComponent {
  render() {
    const {
      messages: {
        YOUR_SCORES,
        YOUR_TIME,
        RETRY,
        MENU,
        HOME
      },
      lang,
      params: {
        value,
        catetory,
        gameType,
        quizType
      }
    } = this.props;

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
