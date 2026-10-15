import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Lang({ messages: { LANGUAGE, HOME }, lang }) {
  return (
    <nav className="Lang flex min-h-full w-full flex-col items-center text-[20px]" aria-label={LANGUAGE}>
      <section className="flex grow-[5] flex-col items-center">
        <h1 tabIndex={-1} className="mt-[2em] mb-[1em] text-[1.2em]">{LANGUAGE}</h1>
        {[['en', 'English'], ['ja', '日本語'], ['zh', '中文']].map(([code, label]) => (
          <div key={code} className="langItem m-[.5em]">
            <Button asChild className="min-h-[4em] w-[10em] rounded-[24px] py-[1em] text-[1em]">
              <I18nLink to="/lang" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>{label}</I18nLink>
            </Button>
          </div>
        ))}
      </section>
      <footer className="grow p-[2em]"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Lang);
