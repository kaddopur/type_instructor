import { useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';
import { createMistakePracticeStore } from '../stores/mistakePractice.ts';
import getStatus from '../lib/getStatus.ts';
import QuestionPanel from './QuestionPanel.jsx';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function MistakePractice({
  questions,
  quizType,
  messages,
  onClose,
  onCloseAutoFocus,
}) {
  const [store] = useState(() => createMistakePracticeStore(questions));
  const { phase, answer } = useStore(store);
  const keyboardInput = useRef(false);

  useEffect(() => {
    if (phase.kind !== 'feedback') return;
    const timeout = setTimeout(() => store.getState().advance(), 500);
    return () => clearTimeout(timeout);
  }, [phase, store]);

  const feedback = phase.kind === 'feedback';
  const selected = feedback ? phase.current.options[phase.selectedIndex] : null;
  const quiz =
    phase.kind === 'complete'
      ? null
      : {
          ...phase.current,
          options: phase.current.options.map(({ type, damage }, index) => ({
            type,
            damage,
            ...(feedback && index === phase.selectedIndex
              ? { clicked: true, correct: phase.correct }
              : phase.wrongIndices.includes(index)
                ? { clicked: true, correct: false }
                : {}),
          })),
        };

  return (
    <DialogContent
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        onCloseAutoFocus();
      }}
      className="practice-dialog h-[100dvh] max-h-[100dvh] w-full max-w-none grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(0,1fr)] justify-items-stretch gap-0 rounded-none border-0 p-[env(safe-area-inset-top,0px)_env(safe-area-inset-right,0px)_env(safe-area-inset-bottom,0px)_env(safe-area-inset-left,0px)] short:gap-0"
      onPointerDownCapture={() => {
        keyboardInput.current = false;
      }}
      onKeyDownCapture={() => {
        keyboardInput.current = true;
      }}
    >
      <header className="mx-auto grid w-full max-w-250 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 px-4 pt-3 text-left">
        <DialogTitle className="text-[20px] leading-7 short:text-[18px]">
          {messages.PRACTICE_TITLE}
        </DialogTitle>
        <Button variant="ghost" className="row-span-2 min-h-11 px-2 text-[14px]" onClick={onClose}>
          {messages.PRACTICE_CLOSE}
        </Button>
        <DialogDescription className="text-[14px] leading-5">
          {messages.PRACTICE_DESCRIPTION}
        </DialogDescription>
      </header>
      {phase.kind === 'complete' ? (
        <div className="flex flex-col items-center justify-center gap-6 p-4">
          <p id="practice-complete" role="status" className="text-[24px]">
            {messages.PRACTICE_COMPLETE}
          </p>
          <Button
            autoFocus
            aria-describedby="practice-complete"
            variant="primary"
            onClick={onClose}
          >
            {messages.PRACTICE_RETURN}
          </Button>
        </div>
      ) : (
        <div className="MistakePractice mx-auto grid min-h-0 w-[min(100%,720px)] grid-rows-[32px_minmax(0,1fr)_56px_minmax(120px,.85fr)] gap-3 p-4 landscape-short:w-[min(100%,1000px)] landscape-short:grid-cols-2 landscape-short:grid-rows-[32px_minmax(0,1fr)_48px]">
          <p className="practice-remaining flex items-center text-[14px] landscape-short:col-span-full">
            {messages.PRACTICE_REMAINING.replace('{count}', phase.pending.length + 1)}
          </p>
          <QuestionPanel
            messages={messages}
            quizType={quizType}
            quiz={quiz}
            status={selected ? getStatus(selected.damage) : ''}
            correct={feedback && phase.correct}
            disabled={feedback}
            onAnswer={answer}
            keyboardInput={keyboardInput}
            announceAnswer={(option, correct) =>
              `${messages[option.type.toUpperCase()]}: ${messages[correct ? 'CORRECT' : 'INCORRECT']}.`
            }
          />
        </div>
      )}
    </DialogContent>
  );
}
