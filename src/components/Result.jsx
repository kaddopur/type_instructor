import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import { pageLayout, pageFooter } from '../lib/pageStyles.ts';
import { cn } from '../lib/utils.ts';

function Result({ messages: { YOUR_SCORES, YOUR_TIME, RETRY, MENU, HOME }, lang,
  params: { value, category, gameType, quizType } }) {
  const summary = gameType === 'basic' ? YOUR_SCORES : YOUR_TIME;
  return (
    <nav className={cn('Result', pageLayout)} aria-label={summary}>
      <section className="result-panel my-auto grid w-[min(100%,420px)] justify-items-center gap-4 short:gap-2.5">
        <h1 id="result-summary" tabIndex={-1} className="result-summary mb-4 flex w-full flex-col items-center gap-4 text-center short:mb-0 short:flex-row short:gap-3">
          <span className="flex h-16 w-full items-center justify-center text-[24px] leading-8 short:w-3/5 short:text-[20px] short:leading-7">{summary}</span>
          <strong className="flex h-24 min-w-40 items-center justify-center rounded-[16px] bg-accent-soft px-5 py-3 text-[48px] leading-14 font-normal short:h-16 short:min-w-25 short:text-[36px] short:leading-10">{gameType === 'basic' ? value : `${value}s`}</strong>
        </h1>
        <div className="resultItem">
          <Button asChild variant="primary" className="result-action h-15 min-h-0 w-65 max-w-full whitespace-nowrap p-2 short:h-12">
            <I18nLink aria-describedby="result-summary" to={`/quizzes/${category}/${gameType}/${quizType}`} lang={lang}>{RETRY}</I18nLink>
          </Button>
        </div>
        <div className="resultItem">
          <Button asChild className="result-action result-menu h-12 min-h-0 w-65 max-w-full whitespace-nowrap p-2 text-[16px]"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </div>
      </section>
      <footer className={pageFooter}><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Result);
