import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import './Menu.css';

function Menu(props) {
  const {
    messages: {
      BASIC,
      SPEEDRUN,
      HOME,
      ATTACK,
      DEFEND
    },
    lang
  } = props;

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
          <I18nLink to="/quizzes/s/speedrun/defend" lang={lang}>{DEFEND}</I18nLink>
        </div>
      </section>

      <footer>
        <I18nLink to="/" lang={lang}>{HOME}</I18nLink>
      </footer>
    </nav>
  );
}

export default I18nPage(Menu);
