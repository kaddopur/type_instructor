import { useEffect, useRef, useState } from 'react';
import I18nPage from './I18nPage.jsx';
import I18nLink from './I18nLink.jsx';
import useGame from '../hooks/useGame.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';
import { savePersonalBest } from '../lib/personalBests.ts';
import { typeStyles } from '../lib/typeStyles.ts';
import { cn } from '../lib/utils.ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function Quiz({ messages, lang, params: { gameType, quizType }, location: { pathname }, navigate }) {
  const {
    timer, scores, status, quiz: { enemy, options, answer: correctType }, overlay, freeze, finish, result, start, answer
  } = useGame(gameType, quizType);

  useEffect(() => {
    if (result !== null) {
      savePersonalBest(gameType, quizType, result);
      navigate(`${pathname}/result/${result}`);
    }
  }, [result, gameType, quizType, navigate, pathname]);

  const answerGroup = useRef(null);
  const keyboardInput = useRef(false);
  const exitButton = useRef(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN, START, MENU, CHOOSE_ANSWER, DAMAGE_MULTIPLIER } = messages;

  useEffect(() => {
    if (!overlay && !exitOpen && !freeze && result === null && options.every(option => !option.clicked)) {
      const target = keyboardInput.current
        ? answerGroup.current?.querySelector('button:not([aria-disabled="true"])')
        : answerGroup.current;
      target?.focus({ preventScroll: true });
    }
  }, [overlay, exitOpen, freeze, result, options]);

  function selectAnswer(index) {
    const option = options[index];
    if (overlay || exitOpen || freeze || result !== null || option.clicked) return;
    const outcome = option.type === correctType;
    answer(index);
    setAnnouncement(`${messages[option.type.toUpperCase()]}: ${messages[outcome ? 'CORRECT' : 'INCORRECT']}. ${SCORES}: ${scores + (outcome ? 1 : -1)}.`);
  }

  return (
    <div className="Quiz mx-auto grid h-full w-[min(100%,720px)] grid-rows-[72px_minmax(0,1fr)_56px_minmax(120px,.85fr)] gap-3 p-4 landscape-short:w-[min(100%,1000px)] landscape-short:grid-cols-2 landscape-short:grid-rows-[72px_minmax(0,1fr)_48px]"
      onPointerDownCapture={() => { keyboardInput.current = false; }}
      onKeyDownCapture={() => { keyboardInput.current = true; }}>
      <Dialog open={overlay} onOpenChange={open => { if (!open) navigate(`/${lang}/menu`); }}>
        <DialogContent className="overlay" onCloseAutoFocus={event => event.preventDefault()}>
          <p className={cn(`mode-label mode-label-${gameType}`, 'flex h-7 w-45 items-center justify-center rounded-[6px] bg-accent-soft text-[14px] leading-5 short:h-6', gameType === 'speedrun' && 'bg-[#def3fc]')}>{messages[gameType === 'basic' ? 'BASIC' : 'SPEEDRUN']}</p>
          <DialogTitle>{GOAL}</DialogTitle>
          <DialogDescription asChild className="dialog-goal flex h-12 w-full items-center justify-center short:h-10 short:text-[14px] short:leading-5">
            <span>{gameType === 'basic' ? GOAL_BASIC : GOAL_SPEEDRUN.replace('{scoreTarget}', SCORE_TARGET)}</span>
          </DialogDescription>
          <Button type="button" data-testid="start-game" variant="primary" className="dialog-action dialog-start h-15 min-h-0 w-[min(100%,280px)] whitespace-nowrap px-2 py-1 short:h-11" onClick={start}>{START}</Button>
          <Button asChild variant="ghost" className="dialog-action dialog-menu h-12 min-h-0 w-[min(100%,280px)] rounded-[24px] border-2 border-ink whitespace-nowrap px-2 py-1 text-[16px] short:h-11"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </DialogContent>
      </Dialog>
      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="exit-dialog grid-cols-[minmax(0,1fr)]" onCloseAutoFocus={event => {
          event.preventDefault();
          exitButton.current?.focus({ preventScroll: true });
        }}>
          <DialogTitle>{messages.EXIT_CONFIRM_TITLE}</DialogTitle>
          <DialogDescription>{messages.EXIT_CONFIRM_DESCRIPTION}</DialogDescription>
          <Button type="button" variant="primary" className="exit-action min-h-15 w-[min(100%,280px)] whitespace-normal px-2 py-1" onClick={() => setExitOpen(false)}>{messages.CONTINUE_GAME}</Button>
          <Button asChild variant="ghost" className="exit-action min-h-12 w-[min(100%,280px)] rounded-[24px] border-2 border-ink whitespace-normal px-2 py-1 text-[16px]"><I18nLink to="/menu" lang={lang}>{messages.RETURN_TO_MENU}</I18nLink></Button>
        </DialogContent>
      </Dialog>
      <header className="quiz-hud min-w-0 landscape-short:col-span-full">
        <div className="stemHeader grid h-11 grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-2 text-right text-[14px] leading-7 whitespace-nowrap">
          <div className="stemTimer text-left">{TIMER}: {timer}</div>
          <Button ref={exitButton} type="button" variant="ghost" className="quiz-exit min-h-11 w-auto justify-self-center whitespace-nowrap px-0 py-2 text-[14px] text-muted" disabled={overlay || result !== null} onClick={() => setExitOpen(true)}>{messages.EXIT_GAME}</Button>
          <div className="stemScores">{SCORES}: {scores}</div>
        </div>
        <div className="quiz-progress flex h-7 items-center gap-3 text-[14px] whitespace-nowrap" aria-hidden={gameType !== 'speedrun' || undefined}>
          {gameType === 'speedrun' ? <>
            <progress className="h-4 w-full appearance-none overflow-hidden rounded-[12px] border-2 border-ink bg-surface text-accent [&::-webkit-progress-bar]:bg-surface [&::-webkit-progress-value]:bg-accent [&::-moz-progress-bar]:bg-accent" max={SCORE_TARGET} value={Math.max(0, Math.min(scores, SCORE_TARGET))} aria-label={messages.PROGRESS} />
            <span>{Math.max(0, scores)} / {SCORE_TARGET}</span>
          </> : null}
        </div>
      </header>
      <div className="quiz-stem grid min-h-0 grid-rows-[minmax(0,1fr)_64px] gap-3 landscape-short:col-start-1 landscape-short:row-start-2 landscape-short:grid-rows-[minmax(0,1fr)_48px] landscape-short:gap-2">
        <div id="enemy-condition" className={cn('stemContainer flex min-h-0 items-center justify-center rounded-2xl border-3 border-ink p-3 text-center landscape-short:p-2', typeStyles[enemy.type], `Bgc-${enemy.type}`)}>
          <div className="stemEnemy w-full">
            <div className="stemEnemyText flex flex-col items-center justify-center">
              <span className="question-prompt flex h-10 w-full items-center justify-center text-[16px] leading-6 landscape-short:h-7 landscape-short:text-[14px] landscape-short:leading-5">{messages[enemy.title]}</span>
              <strong className="question-type block text-[28px] leading-10 font-normal landscape-short:text-[24px] landscape-short:leading-8">{messages[enemy.type.toUpperCase()]}</strong>
            </div>
          </div>
        </div>
        <h1 id="quiz-question" className="quiz-instruction flex h-16 items-center justify-center px-1 text-center text-[16px] leading-6 whitespace-pre-line landscape-short:h-12 landscape-short:leading-5">{messages[quizType === 'attack' ? 'ATTACK_QUESTION' : 'DEFEND_QUESTION']}</h1>
      </div>
      <div className="stemStatus flex h-14 items-center justify-center gap-2 text-center text-[14px] leading-5 landscape-short:col-start-1 landscape-short:row-start-3 landscape-short:h-12">
        {status ? <><span className="feedback-symbol text-[24px] font-[sans-serif]" aria-hidden="true">{finish ? '✓' : '✕'}</span>
          {`${messages[finish ? 'CORRECT' : 'INCORRECT']}: ${messages[status]}`}</> : null}
      </div>
      <div ref={answerGroup} role="group" tabIndex={-1} aria-label={CHOOSE_ANSWER} aria-describedby="enemy-condition quiz-question" className="optionContainer grid min-h-0 grid-cols-2 grid-rows-2 gap-3 landscape-short:col-start-2 landscape-short:row-span-2 landscape-short:row-start-2">
        {options.map(({ type, damage, clicked, correct }, index) => (
          <Button key={type + index} type="button" variant="answer" size="answer"
            aria-label={`${messages[type.toUpperCase()]}${clicked ? `, ${DAMAGE_MULTIPLIER}: ${damage}` : ''}`}
            aria-describedby={index === 0 ? 'enemy-condition quiz-question' : undefined}
            tabIndex={clicked ? -1 : 0}
            aria-disabled={overlay || exitOpen || freeze || result !== null || clicked || undefined}
            className={cn('optionItem min-h-11 min-w-0 w-full rounded-[18px] border-3 border-ink px-2 py-1 text-[20px] leading-7 focus-visible:outline-offset-[-6px]',
              clicked && !correct ? typeStyles.wrong : typeStyles[type], `Bgc-${clicked && !correct ? 'wrong' : type}`)}
            onClick={() => selectAnswer(index)}>
            <span className="optionText flex flex-col items-center justify-center">
              {messages[type.toUpperCase()]}
              {clicked ? <><span className="answer-symbol absolute top-1.5 right-2 text-[16px] leading-5 font-[sans-serif]" aria-hidden="true">{correct ? '✓' : '✕'}</span><span className="optionDamage text-[14px] leading-5" aria-hidden="true">{damage}</span></> : null}
            </span>
          </Button>
        ))}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</div>
    </div>
  );
}

export default I18nPage(function QuizRoute(props) {
  return <Quiz key={props.location.pathname} {...props} />;
});
