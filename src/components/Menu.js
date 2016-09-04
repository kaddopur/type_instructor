import React, { Component, PropTypes } from 'react';
import I18nLink from './I18nLink';
import I18nPage from './I18nPage';
import './Menu.css';

class Menu extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const { lang } = this.props.params;
    const {
      BASIC,
      SPEEDRUN,
      HOME,
      ATTACK,
      DEFEND
    } = this.context.messages[lang];

    return (
      <nav className="Menu">
        <section>
          <h1>{BASIC}</h1>
          <div className="menuItem">
            <I18nLink to="/quizzes/s/basic/attack" lang={lang}>{ATTACK}</I18nLink>
          </div>
          <div className="menuItem">
            <I18nLink to="/quizzes/s/basic/defend" lang={lang}>{DEFEND}</I18nLink>
          </div>
        </section>

        <section>
          <h1>{SPEEDRUN}</h1>
          <div className="menuItem">
            <I18nLink to="/quizzes/s/speedrun/attack" lang={lang}>{ATTACK}</I18nLink>
          </div>
          <div className="menuItem">
            <I18nLink to="/quizzes/s/speedrun/attack" lang={lang}>{DEFEND}</I18nLink>
          </div>
        </section>

        <footer>
          <I18nLink to="/" lang={lang}>{HOME}</I18nLink>
        </footer>
      </nav>
    );
  }
}

export default I18nPage(Menu);
