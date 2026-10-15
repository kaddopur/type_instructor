import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Lang({ messages: { LANGUAGE, HOME }, lang }) {
  return (
    <nav className="Lang page-layout" aria-label={LANGUAGE}>
      <section className="language-panel">
        <h1 tabIndex={-1} className="page-title">{LANGUAGE}</h1>
        {[['en', 'English'], ['zh', '中文'], ['ja', '日本語']].map(([code, label]) => (
          <div key={code} className="langItem">
            <Button asChild className="language-choice">
              <I18nLink to="/" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>
                <span className="language-check" aria-hidden="true">{lang === code ? '✓' : ''}</span>
                <span>{label}</span><span aria-hidden="true" />
              </I18nLink>
            </Button>
          </div>
        ))}
      </section>
      <footer className="page-footer"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Lang);
