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
    <div className="Quiz grid-rows-[72px_minmax(0,1fr)_56px_minmax(120px,.85fr)] [@media(max-height:480px)_and_(orientation:landscape)]:grid-rows-[72px_minmax(0,1fr)_48px]"
      onPointerDownCapture={() => { keyboardInput.current = false; }}
      onKeyDownCapture={() => { keyboardInput.current = true; }}>
      <Dialog open={overlay} onOpenChange={open => { if (!open) navigate(`/${lang}/menu`); }}>
        <DialogContent className="overlay" onCloseAutoFocus={event => event.preventDefault()}>
          <p className={`mode-label mode-label-${gameType}`}>{messages[gameType === 'basic' ? 'BASIC' : 'SPEEDRUN']}</p>
          <DialogTitle>{GOAL}</DialogTitle>
          <DialogDescription asChild className="dialog-goal">
            <span>{gameType === 'basic' ? GOAL_BASIC : GOAL_SPEEDRUN.replace('{scoreTarget}', SCORE_TARGET)}</span>
          </DialogDescription>
          <Button type="button" data-testid="start-game" variant="primary" className="dialog-action dialog-start" onClick={start}>{START}</Button>
          <Button asChild variant="ghost" className="dialog-action dialog-menu"><I18nLink to="/menu" lang={lang}>{MENU}</I18nLink></Button>
        </DialogContent>
      </Dialog>
      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="exit-dialog grid-cols-[minmax(0,1fr)]" onCloseAutoFocus={event => {
          event.preventDefault();
          exitButton.current?.focus({ preventScroll: true });
        }}>
          <DialogTitle>{messages.EXIT_CONFIRM_TITLE}</DialogTitle>
          <DialogDescription>{messages.EXIT_CONFIRM_DESCRIPTION}</DialogDescription>
          <Button type="button" variant="primary" className="exit-action min-h-[60px] w-[min(100%,280px)] whitespace-normal px-[8px] py-[4px]" onClick={() => setExitOpen(false)}>{messages.CONTINUE_GAME}</Button>
          <Button asChild variant="ghost" className="exit-action min-h-[48px] w-[min(100%,280px)] rounded-[24px] border-2 border-ink whitespace-normal px-[8px] py-[4px] text-[16px]"><I18nLink to="/menu" lang={lang}>{messages.RETURN_TO_MENU}</I18nLink></Button>
        </DialogContent>
      </Dialog>
      <header className="quiz-hud">
        <div className="stemHeader grid h-[44px] grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-[8px] text-right text-[14px] leading-[28px] whitespace-nowrap">
          <div className="stemTimer text-left">{TIMER}: {timer}</div>
          <Button ref={exitButton} type="button" variant="ghost" className="quiz-exit min-h-[44px] w-auto justify-self-center whitespace-nowrap px-0 py-[8px] text-[14px] text-muted" disabled={overlay || result !== null} onClick={() => setExitOpen(true)}>{messages.EXIT_GAME}</Button>
          <div className="stemScores">{SCORES}: {scores}</div>
        </div>
        <div className="quiz-progress" aria-hidden={gameType !== 'speedrun' || undefined}>
          {gameType === 'speedrun' ? <>
            <progress max={SCORE_TARGET} value={Math.max(0, Math.min(scores, SCORE_TARGET))} aria-label={messages.PROGRESS} />
            <span>{Math.max(0, scores)} / {SCORE_TARGET}</span>
          </> : null}
        </div>
      </header>
      <div className="quiz-stem">
        <div id="enemy-condition" className={cn('stemContainer', typeStyles[enemy.type], `Bgc-${enemy.type}`)}>
          <div className="stemEnemy">
            <div className="stemEnemyText">
              <span className="question-prompt">{messages[enemy.title]}</span>
              <strong className="question-type">{messages[enemy.type.toUpperCase()]}</strong>
            </div>
          </div>
        </div>
        <h1 id="quiz-question" className="quiz-instruction">{messages[quizType === 'attack' ? 'ATTACK_QUESTION' : 'DEFEND_QUESTION']}</h1>
      </div>
      <div className="stemStatus">
        {status ? <><span className="feedback-symbol" aria-hidden="true">{finish ? '✓' : '✕'}</span>
          {`${messages[finish ? 'CORRECT' : 'INCORRECT']}: ${messages[status]}`}</> : null}
      </div>
      <div ref={answerGroup} role="group" tabIndex={-1} aria-label={CHOOSE_ANSWER} aria-describedby="enemy-condition quiz-question" className="optionContainer">
        {options.map(({ type, damage, clicked, correct }, index) => (
          <Button key={type + index} type="button" variant="answer" size="answer"
            aria-label={`${messages[type.toUpperCase()]}${clicked ? `, ${DAMAGE_MULTIPLIER}: ${damage}` : ''}`}
            aria-describedby={index === 0 ? 'enemy-condition quiz-question' : undefined}
            tabIndex={clicked ? -1 : 0}
            aria-disabled={overlay || exitOpen || freeze || result !== null || clicked || undefined}
            className={cn('optionItem',
              clicked && !correct ? typeStyles.wrong : typeStyles[type], `Bgc-${clicked && !correct ? 'wrong' : type}`)}
            onClick={() => selectAnswer(index)}>
            <span className="optionText">
              {messages[type.toUpperCase()]}
              {clicked ? <><span className="answer-symbol" aria-hidden="true">{correct ? '✓' : '✕'}</span><span className="optionDamage" aria-hidden="true">{damage}</span></> : null}
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
