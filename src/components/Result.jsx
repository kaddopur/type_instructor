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
      <section className="result-panel my-auto grid w-[min(100%,420px)] justify-items-center gap-[16px] short:gap-[10px]">
        <h1 id="result-summary" tabIndex={-1} className="result-summary mb-[16px] flex w-full flex-col items-center gap-[16px] text-center short:mb-0 short:flex-row short:gap-[12px]">
          <span className="flex h-[64px] w-full items-center justify-center text-[24px] leading-[32px] short:w-3/5 short:text-[20px] short:leading-[28px]">{summary}</span>
          <strong className="flex h-[96px] min-w-[160px] items-center justify-center rounded-[16px] bg-accent-soft px-[20px] py-[12px] text-[48px] leading-[56px] font-normal short:h-[64px] short:min-w-[100px] short:text-[36px] short:leading-[40px]">{gameType === 'basic' ? value : `${value}s`}</strong>
        </h1>
        <div className="resultItem">
          <Button asChild variant="primary" className="result-action h-[60px] min-h-0 w-[260px] max-w-full whitespace-nowrap p-[8px] short:h-[48px]">
            <I18nLink aria-describedby="result-summary" to={`/quizzes/${category}/${gameType}/${quizType}`} lang={lang}>{RETRY}</I18nLink>
          </Button>
        </div>
        <div className="resultItem">
          <Button asChild className="result-action result-menu h-[48px] min-h-0 w-[260px] max-w-full whitespace-nowrap p-[8px] text-[16px]"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </div>
      </section>
      <footer className={pageFooter}><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Result);
