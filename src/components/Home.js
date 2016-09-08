import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import I18nLink from './I18nLink';
import I18nPage from './I18nPage';
import './Home.css';
import globe from '../images/globe.png';

class Home extends PureComponent {
  render() {
    const {
      messages: {
        START
      },
      lang
    } = this.props;

    return (
      <article className="Home">
        <h1>Type Instructor of Pokémon</h1>
        <section className="start">
          <I18nLink to="/menu" lang={lang}>{START}</I18nLink>
        </section>
        <section className="lang">
          <I18nLink to="/lang" lang={lang}>
            <img src={globe} width="32" height="32" alt="change language"/>
          </I18nLink>
        </section>
        <footer>
          <a href="https://twitter.com/kaddopur" target="_blank">@kaddopur</a>
        </footer>
      </article>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {
    messages
  } = state;

  const {
    lang = 'en'
  } = ownProps.params;

  return {
    messages: messages[lang],
    lang
  };
};

export default I18nPage(connect(mapStateToProps)(Home));
