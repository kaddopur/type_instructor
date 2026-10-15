import { useEffect } from 'react';
import I18nPage from './I18nPage.jsx';
import I18nLink from './I18nLink.jsx';
import useGame from '../hooks/useGame.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';
import { typeStyles } from '../lib/typeStyles.ts';
import { cn } from '../lib/utils.ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function Quiz({ messages, lang, params: { gameType, quizType }, location: { pathname }, navigate }) {
  const {
    timer, scores, status, quiz: { enemy, options }, overlay, freeze, result, start, answer
  } = useGame(gameType, quizType);

  useEffect(() => {
    if (result !== null) navigate(`${pathname}/result/${result}`);
  }, [result, navigate, pathname]);

  const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN, START, MENU } = messages;

  return (
    <div className="Quiz flex h-dvh w-full flex-col overflow-hidden">
      <Dialog open={overlay} onOpenChange={open => { if (!open) navigate(`/${lang}/menu`); }}>
        <DialogContent className="overlay" onCloseAutoFocus={event => event.preventDefault()}>
          <DialogTitle>{GOAL}</DialogTitle>
          <DialogDescription asChild>
            <span>{gameType === 'basic' ? GOAL_BASIC : GOAL_SPEEDRUN.replace('{scoreTarget}', SCORE_TARGET)}</span>
          </DialogDescription>
          <Button type="button" data-testid="start-game" className="mx-auto" onClick={start}>{START}</Button>
          <Button asChild variant="ghost" className="mx-auto py-2"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </DialogContent>
      </Dialog>
      <div className={cn('stemContainer relative flex min-h-0 flex-1 flex-col items-center text-center text-[1.4rem] leading-[1.6]', typeStyles[enemy.type], `Bgc-${enemy.type}`)}>
        <div className="stemHeader flex w-full">
          <div className="stemTimer w-1/2 text-[.8rem] leading-[4]">{TIMER}: {timer}</div>
          <div className="stemScores w-1/2 text-[.8rem] leading-[4]">{SCORES}: {scores}</div>
        </div>
        <div className="stemEnemy min-h-0 w-full flex-1">
          <h1 tabIndex={-1} className="stemEnemyText flex h-full flex-col items-center justify-center px-4 text-[1.4rem] leading-loose">
            {messages[enemy.title]}<br />( {messages[enemy.type.toUpperCase()]} )
          </h1>
        </div>
        <div className="stemStatus min-h-[3.2rem] text-[.8rem] leading-[4]">{messages[status]}</div>
      </div>
      <div className="optionContainer grid w-full shrink-0 grid-cols-2">
        {options.map(({ type, damage, clicked, correct }, index) => (
          <Button key={type + index} type="button" variant="answer" size="answer"
            aria-disabled={overlay || freeze || result !== null || clicked || undefined}
            className={cn('optionItem h-[min(37.5vw,25dvh)] min-h-12 w-full flex-col whitespace-normal text-base leading-loose focus-visible:z-10 focus-visible:-outline-offset-4 focus-visible:ring-inset',
              clicked && !correct ? typeStyles.wrong : typeStyles[type], `Bgc-${clicked && !correct ? 'wrong' : type}`)}
            onClick={() => answer(index)}>
            <span className="optionText flex flex-col items-center justify-center">
              {messages[type.toUpperCase()]}
              {clicked ? <span className="optionDamage text-[.8rem]">{damage}</span> : null}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default I18nPage(function QuizRoute(props) {
  return <Quiz key={props.location.pathname} {...props} />;
});
