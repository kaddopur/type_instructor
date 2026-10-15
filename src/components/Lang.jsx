import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import { pageLayout, pageTitle, pageFooter } from '../lib/pageStyles.ts';
import { cn } from '../lib/utils.ts';

function Lang({ messages: { LANGUAGE, HOME }, lang }) {
  return (
    <nav className={cn('Lang', pageLayout)} aria-label={LANGUAGE}>
      <section className="language-panel my-auto grid w-full justify-items-center gap-[16px] short:gap-[10px]">
        <h1 tabIndex={-1} className={cn(pageTitle, 'mb-[12px] short:mb-0')}>{LANGUAGE}</h1>
        {[['en', 'English'], ['zh', '中文'], ['ja', '日本語']].map(([code, label]) => (
          <div key={code} className="langItem">
            <Button asChild className="language-choice grid h-[64px] w-[260px] max-w-full grid-cols-[24px_1fr_24px] px-[16px] py-[8px] aria-[current=page]:bg-accent-soft short:h-[48px] short:min-h-[48px]">
              <I18nLink to="/" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>
                <span className="language-check font-bold [font-family:sans-serif]" aria-hidden="true">{lang === code ? '✓' : ''}</span>
                <span>{label}</span><span aria-hidden="true" />
              </I18nLink>
            </Button>
          </div>
        ))}
      </section>
      <footer className={pageFooter}><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Lang);
