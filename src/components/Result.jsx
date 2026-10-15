import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Result({ messages: { YOUR_SCORES, YOUR_TIME, RETRY, MENU, HOME }, lang,
  params: { value, category, gameType, quizType } }) {
  const summary = gameType === 'basic' ? YOUR_SCORES : YOUR_TIME;
  return (
    <nav className="Result page-layout" aria-label={summary}>
      <section className="result-panel">
        <h1 id="result-summary" tabIndex={-1} className="result-summary">
          <span>{summary}</span>
          <strong>{gameType === 'basic' ? value : `${value}s`}</strong>
        </h1>
        <div className="resultItem">
          <Button asChild variant="primary" className="result-action">
            <I18nLink aria-describedby="result-summary" to={`/quizzes/${category}/${gameType}/${quizType}`} lang={lang}>{RETRY}</I18nLink>
          </Button>
        </div>
        <div className="resultItem">
          <Button asChild className="result-action result-menu"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </div>
      </section>
      <footer className="page-footer"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Result);
