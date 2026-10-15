import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Result({ messages: { YOUR_SCORES, YOUR_TIME, RETRY, MENU, HOME }, lang,
  params: { value, category, gameType, quizType } }) {
  return (
    <nav className="Result flex min-h-full w-full flex-col items-center" aria-label={gameType === 'basic' ? YOUR_SCORES : YOUR_TIME}>
      <section className="flex grow-[10] flex-col items-center">
        <h1 id="result-summary" tabIndex={-1} className="mt-8 mb-4 text-center text-[1.2rem] leading-loose [text-shadow:0_.18rem_#0003]">
          {gameType === 'basic' ? YOUR_SCORES : YOUR_TIME}<br />{gameType === 'basic' ? value : `${value}s`}
        </h1>
        <div className="resultItem m-2">
          <Button asChild className="w-[240px] max-w-full whitespace-nowrap"><I18nLink aria-describedby="result-summary" to={`/quizzes/${category}/${gameType}/${quizType}`} lang={lang}>{RETRY}</I18nLink></Button>
        </div>
        <div className="resultItem m-2">
          <Button asChild className="w-[240px] max-w-full whitespace-nowrap"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </div>
      </section>
      <footer className="grow p-8"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Result);
