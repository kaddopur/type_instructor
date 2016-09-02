import React, { Component, PropTypes } from 'react';
import I18nLink from './I18nLink';
import I18nPage from './I18nPage';
import './Lang.css';

class Lang extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const { lang } = this.props.params;
    const { LANGUAGE, HOME } = this.context.messages[lang];

    return (
      <nav className="Lang">
        <section>
          <h1>{LANGUAGE}</h1>
          <div className={`langItem ${lang === 'en' ? 'active' : ''}`}>
            <I18nLink to="/lang" lang="en">English</I18nLink>
          </div>
          <div className={`langItem ${lang === 'ja' ? 'active' : ''}`}>
            <I18nLink to="/lang" lang="ja">日本語</I18nLink>
          </div>
          <div className={`langItem ${lang === 'zh' ? 'active' : ''}`}>
            <I18nLink to="/lang" lang="zh">中文</I18nLink>
          </div>
        </section>

        <footer>
          <I18nLink to="/" lang={lang}>{HOME}</I18nLink>
        </footer>
      </nav>
    );
  }
}

export default I18nPage(Lang);
