import React, { Component, PropTypes } from 'react';
import I18nLink from './I18nLink';
import './Home.css';
import globe from '../images/globe.png';

class Home extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const { lang = 'en' } = this.props.params;
    const { START } = this.context.messages[lang];

    return (
      <article className="Home">
        <h1>Type Instructor of Pokémon</h1>
        <section className="start">
          <I18nLink to="/menu" lang={lang}>{START}</I18nLink>
        </section>
        <section className="lang">
          <I18nLink to="/lang" lang={lang}>
            <img src={globe} alt="change language"/>
          </I18nLink>
        </section>
        <footer>
          <a href="https://twitter.com/kaddopur" target="_blank">@kaddopur</a>
        </footer>
      </article>
    );
  }
}

export default Home;
