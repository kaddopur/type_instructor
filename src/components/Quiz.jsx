import { useEffect, useRef, useState } from 'react';
import I18nPage from './I18nPage.jsx';
import I18nLink from './I18nLink.jsx';
import useGame from '../hooks/useGame.ts';
import { SCORE_TARGET } from '../lib/gameRules.ts';
import { savePersonalBest } from '../lib/personalBests.ts';
import QuestionPanel from './QuestionPanel.jsx';
import { useGameCompletion } from './GameRoute.tsx';
import { cn } from '../lib/utils.ts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function Quiz({
  messages,
  lang,
  params: { gameType, quizType },
  location: { pathname },
  navigate,
}) {
  const {
    timer,
    scores,
    status,
    quiz,
    missedQuestions,
    overlay,
    freeze,
    finish,
    result,
    start,
    answer,
  } = useGame(gameType, quizType);

  const { beginSession, completeGame } = useGameCompletion();
  const submitted = useRef(false);
  useEffect(() => beginSession(), [beginSession]);
  useEffect(() => {
    if (result !== null && !submitted.current) {
      submitted.current = true;
      savePersonalBest(gameType, quizType, result);
      completeGame({ resultPath: `${pathname}/result/${result}`, questions: missedQuestions });
    }
  }, [result, gameType, quizType, completeGame, pathname, missedQuestions]);

  const keyboardInput = useRef(false);
  const exitButton = useRef(null);
  const [exitOpen, setExitOpen] = useState(false);
  const { TIMER, SCORES, GOAL, GOAL_BASIC, GOAL_SPEEDRUN, START, MENU } = messages;

  return (
    <div
      className="Quiz mx-auto grid h-full w-[min(100%,720px)] grid-rows-[72px_minmax(0,1fr)_56px_minmax(120px,.85fr)] gap-3 p-4 landscape-short:w-[min(100%,1000px)] landscape-short:grid-cols-2 landscape-short:grid-rows-[72px_minmax(0,1fr)_48px]"
      onPointerDownCapture={() => {
        keyboardInput.current = false;
      }}
      onKeyDownCapture={() => {
        keyboardInput.current = true;
      }}
    >
      <Dialog
        open={overlay}
        onOpenChange={(open) => {
          if (!open) navigate(`/${lang}/menu`);
        }}
      >
        <DialogContent className="overlay" onCloseAutoFocus={(event) => event.preventDefault()}>
          <p
            className={cn(
              `mode-label mode-label-${gameType}`,
              'flex h-7 w-45 items-center justify-center rounded-[6px] bg-accent-soft text-[14px] leading-5 short:h-6',
              gameType === 'speedrun' && 'bg-[#def3fc]',
            )}
          >
            {messages[gameType === 'basic' ? 'BASIC' : 'SPEEDRUN']}
          </p>
          <DialogTitle>{GOAL}</DialogTitle>
          <DialogDescription
            asChild
            className="dialog-goal flex h-12 w-full items-center justify-center short:h-10 short:text-[14px] short:leading-5"
          >
            <span>
              {gameType === 'basic'
                ? GOAL_BASIC
                : GOAL_SPEEDRUN.replace('{scoreTarget}', SCORE_TARGET)}
            </span>
          </DialogDescription>
          <Button
            type="button"
            data-testid="start-game"
            variant="primary"
            className="dialog-action dialog-start h-15 min-h-0 w-[min(100%,280px)] px-2 py-1 whitespace-nowrap short:h-11"
            onClick={start}
          >
            {START}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="dialog-action dialog-menu h-12 min-h-0 w-[min(100%,280px)] rounded-[24px] border-2 border-ink px-2 py-1 text-[16px] whitespace-nowrap short:h-11"
          >
            <I18nLink to="/menu" lang={lang}>
              {MENU}
            </I18nLink>
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent
          className="exit-dialog grid-cols-[minmax(0,1fr)]"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            exitButton.current?.focus({ preventScroll: true });
          }}
        >
          <DialogTitle>{messages.EXIT_CONFIRM_TITLE}</DialogTitle>
          <DialogDescription>{messages.EXIT_CONFIRM_DESCRIPTION}</DialogDescription>
          <Button
            type="button"
            variant="primary"
            className="exit-action min-h-15 w-[min(100%,280px)] px-2 py-1 whitespace-normal"
            onClick={() => setExitOpen(false)}
          >
            {messages.CONTINUE_GAME}
          </Button>
          <Button
            asChild
            variant="ghost"
            className="exit-action min-h-12 w-[min(100%,280px)] rounded-[24px] border-2 border-ink px-2 py-1 text-[16px] whitespace-normal"
          >
            <I18nLink to="/menu" lang={lang}>
              {messages.RETURN_TO_MENU}
            </I18nLink>
          </Button>
        </DialogContent>
      </Dialog>
      <header className="quiz-hud min-w-0 landscape-short:col-span-full">
        <div className="stemHeader grid h-11 grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] items-center gap-2 text-right text-[14px] leading-7 whitespace-nowrap">
          <div className="stemTimer text-left">
            {TIMER}: {timer}
          </div>
          <Button
            ref={exitButton}
            type="button"
            variant="ghost"
            className="quiz-exit min-h-11 w-auto justify-self-center px-0 py-2 text-[14px] whitespace-nowrap text-muted"
            disabled={overlay || result !== null}
            onClick={() => setExitOpen(true)}
          >
            {messages.EXIT_GAME}
          </Button>
          <div className="stemScores">
            {SCORES}: {scores}
          </div>
        </div>
        <div
          className="quiz-progress flex h-7 items-center gap-3 text-[14px] whitespace-nowrap"
          aria-hidden={gameType !== 'speedrun' || undefined}
        >
          {gameType === 'speedrun' ? (
            <>
              <progress
                className="h-4 w-full appearance-none overflow-hidden rounded-[12px] border-2 border-ink bg-surface text-accent [&::-moz-progress-bar]:bg-accent [&::-webkit-progress-bar]:bg-surface [&::-webkit-progress-value]:bg-accent"
                max={SCORE_TARGET}
                value={Math.max(0, Math.min(scores, SCORE_TARGET))}
                aria-label={messages.PROGRESS}
              />
              <span>
                {Math.max(0, scores)} / {SCORE_TARGET}
              </span>
            </>
          ) : null}
        </div>
      </header>
      <QuestionPanel
        messages={messages}
        quizType={quizType}
        quiz={quiz}
        status={status}
        correct={finish}
        disabled={overlay || exitOpen || freeze || result !== null}
        onAnswer={answer}
        keyboardInput={keyboardInput}
        announceAnswer={(option, correct) =>
          `${messages[option.type.toUpperCase()]}: ${messages[correct ? 'CORRECT' : 'INCORRECT']}. ${SCORES}: ${scores + (correct ? 1 : -1)}.`
        }
      />
    </div>
  );
}

export default I18nPage(function QuizRoute(props) {
  return <Quiz key={props.location.pathname} {...props} />;
});
