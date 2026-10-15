import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Lang({ messages: { LANGUAGE, HOME }, lang }) {
  return (
    <nav className="Lang flex min-h-dvh w-full flex-col items-center" aria-label={LANGUAGE}>
      <section className="flex grow-[5] flex-col items-center">
        <h1 tabIndex={-1} className="mt-8 mb-4 text-[1.2rem] [text-shadow:0_.18rem_#0003]">{LANGUAGE}</h1>
        {[['en', 'English'], ['ja', '日本語'], ['zh', '中文']].map(([code, label]) => (
          <div key={code} className="langItem m-2">
            <Button asChild className="w-40 py-4">
              <I18nLink to="/lang" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>{label}</I18nLink>
            </Button>
          </div>
        ))}
      </section>
      <footer className="grow p-8"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Lang);
