import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import './Lang.css';

function Lang(props) {
  const {
    messages: {
      LANGUAGE,
      HOME
    },
    lang
  } = props;

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

export default I18nPage(Lang);
