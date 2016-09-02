import React, { Component, PropTypes } from 'react';
import I18nLink from './I18nLink';
import './Menu.css';

class Menu extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const { lang } = this.props.params;
    const {
      SINGLE_TYPED,
      DOUBLE_TYPED,
      HOME,
      ATTACK,
      DEFEND
    } = this.context.messages[lang];

    return (
      <nav className="Menu">
        <section>
          <h1>{SINGLE_TYPED}</h1>
          <div className="menuItem">
            <I18nLink to="/quizzes/attackSingle" lang={lang}>{ATTACK}</I18nLink>
          </div>
          <div className="menuItem">
            <I18nLink to="/quizzes/defendSingle" lang={lang}>{DEFEND}</I18nLink>
          </div>
        </section>

        <section className="working">
          <h1>{DOUBLE_TYPED}</h1>
          <div className="menuItem">
            <I18nLink to="/Menu" lang={lang}>{ATTACK}</I18nLink>
          </div>
          <div className="menuItem">
            <I18nLink to="/Menu" lang={lang}>{DEFEND}</I18nLink>
          </div>
        </section>

        <footer>
          <I18nLink to="/" lang={lang}>{HOME}</I18nLink>
        </footer>
      </nav>
    );
  }
}

export default Menu;
