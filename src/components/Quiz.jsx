import { useEffect, useRef, useState } from 'react';
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
    timer, scores, status, quiz: { enemy, options, answer: correctType }, overlay, freeze, finish, result, start, answer
  } = useGame(gameType, quizType);

  useEffect(() => {
    if (result !== null) navigate(`${pathname}/result/${result}`);
  }, [result, navigate, pathname]);

  const answerGroup = useRef(null);
  const [announcement, setAnnouncement] = useState('');
  const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN, START, MENU, CHOOSE_ANSWER, DAMAGE_MULTIPLIER } = messages;

  useEffect(() => {
    if (!overlay && !freeze && result === null && options.every(option => !option.clicked)) {
      answerGroup.current?.querySelector('button:not([aria-disabled="true"])')?.focus({ preventScroll: true });
    }
  }, [overlay, freeze, result, options]);

  function selectAnswer(index) {
    const option = options[index];
    if (overlay || freeze || result !== null || option.clicked) return;
    const outcome = option.type === correctType;
    answer(index);
    setAnnouncement(`${messages[option.type.toUpperCase()]}: ${messages[outcome ? 'CORRECT' : 'INCORRECT']}. ${SCORES}: ${scores + (outcome ? 1 : -1)}.`);
  }

  return (
    <div className="Quiz">
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
      <header className="quiz-hud">
        <div className="stemHeader">
          <div className="stemTimer">{TIMER}: {timer}</div>
          <div className="stemScores">{SCORES}: {scores}</div>
        </div>
        <div className="quiz-progress" aria-hidden={gameType !== 'speedrun' || undefined}>
          {gameType === 'speedrun' ? <>
            <progress max={SCORE_TARGET} value={Math.max(0, Math.min(scores, SCORE_TARGET))} aria-label={messages.PROGRESS} />
            <span>{Math.max(0, scores)} / {SCORE_TARGET}</span>
          </> : null}
        </div>
      </header>
      <div className={cn('stemContainer', typeStyles[enemy.type], `Bgc-${enemy.type}`)}>
        <div className="stemEnemy">
          <h1 id="quiz-question" className="stemEnemyText">
            <span className="question-prompt">{messages[enemy.title]}</span>
            <strong className="question-type">( {messages[enemy.type.toUpperCase()]} )</strong>
          </h1>
        </div>
      </div>
      <div className="stemStatus">
        {status ? <><span className="feedback-symbol" aria-hidden="true">{finish ? '✓' : '✕'}</span>
          {`${messages[finish ? 'CORRECT' : 'INCORRECT']}: ${messages[status]}`}</> : null}
      </div>
      <div ref={answerGroup} role="group" aria-label={CHOOSE_ANSWER} className="optionContainer">
        {options.map(({ type, damage, clicked, correct }, index) => (
          <Button key={type + index} type="button" variant="answer" size="answer"
            aria-label={`${messages[type.toUpperCase()]}${clicked ? `, ${DAMAGE_MULTIPLIER}: ${damage}` : ''}`}
            aria-describedby={index === 0 ? 'quiz-question' : undefined}
            tabIndex={clicked ? -1 : 0}
            aria-disabled={overlay || freeze || result !== null || clicked || undefined}
            className={cn('optionItem',
              clicked && !correct ? typeStyles.wrong : typeStyles[type], `Bgc-${clicked && !correct ? 'wrong' : type}`)}
            onClick={() => selectAnswer(index)}>
            <span className="optionText">
              {messages[type.toUpperCase()]}
              {clicked ? <span className="optionDamage" aria-hidden="true">{correct ? '✓' : '✕'} ×{damage}</span> : null}
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
