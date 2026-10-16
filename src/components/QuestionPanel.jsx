import { useEffect, useRef, useState } from 'react';
import { typeStyles } from '../lib/typeStyles.ts';
import { cn } from '../lib/utils.ts';
import { Button } from '@/components/ui/button';

export default function QuestionPanel({
  messages,
  quizType,
  quiz: { enemy, options, answer: correctType },
  status,
  correct,
  disabled,
  onAnswer,
  announceAnswer,
  keyboardInput,
}) {
  const answerGroup = useRef(null);
  const [announcement, setAnnouncement] = useState('');
  const { CHOOSE_ANSWER, DAMAGE_MULTIPLIER } = messages;

  useEffect(() => {
    if (!disabled && options.every((option) => !option.clicked)) {
      const target = keyboardInput.current
        ? answerGroup.current?.querySelector('button:not([aria-disabled="true"])')
        : answerGroup.current;
      target?.focus({ preventScroll: true });
    }
  }, [disabled, options, keyboardInput]);

  function selectAnswer(index) {
    const option = options[index];
    if (disabled || !option || option.clicked) return;
    const outcome = option.type === correctType;
    onAnswer(index);
    setAnnouncement(announceAnswer(option, outcome));
  }

  return (
    <>
      <div className="quiz-stem grid min-h-0 grid-rows-[minmax(0,1fr)_64px] gap-3 landscape-short:col-start-1 landscape-short:row-start-2 landscape-short:grid-rows-[minmax(0,1fr)_48px] landscape-short:gap-2">
        <div
          id="enemy-condition"
          className={cn(
            'stemContainer flex min-h-0 items-center justify-center rounded-2xl border-3 border-ink p-3 text-center landscape-short:p-2',
            typeStyles[enemy.type],
            `Bgc-${enemy.type}`,
          )}
        >
          <div className="stemEnemy w-full">
            <div className="stemEnemyText flex flex-col items-center justify-center">
              <span className="question-prompt flex h-10 w-full items-center justify-center text-[16px] leading-6 landscape-short:h-7 landscape-short:text-[14px] landscape-short:leading-5">
                {messages[enemy.title]}
              </span>
              <strong className="question-type block text-[28px] leading-10 font-normal landscape-short:text-[24px] landscape-short:leading-8">
                {messages[enemy.type.toUpperCase()]}
              </strong>
            </div>
          </div>
        </div>
        <h1
          id="quiz-question"
          className="quiz-instruction flex h-16 items-center justify-center px-1 text-center text-[16px] leading-6 whitespace-pre-line landscape-short:h-12 landscape-short:leading-5"
        >
          {messages[quizType === 'attack' ? 'ATTACK_QUESTION' : 'DEFEND_QUESTION']}
        </h1>
      </div>
      <div className="stemStatus flex h-14 items-center justify-center gap-2 text-center text-[14px] leading-5 landscape-short:col-start-1 landscape-short:row-start-3 landscape-short:h-12">
        {status ? (
          <>
            <span className="feedback-symbol font-[sans-serif] text-[24px]" aria-hidden="true">
              {correct ? '✓' : '✕'}
            </span>
            {`${messages[correct ? 'CORRECT' : 'INCORRECT']}: ${messages[status]}`}
          </>
        ) : null}
      </div>
      <div
        ref={answerGroup}
        role="group"
        tabIndex={-1}
        aria-label={CHOOSE_ANSWER}
        aria-describedby="enemy-condition quiz-question"
        className="optionContainer grid min-h-0 grid-cols-2 grid-rows-2 gap-3 landscape-short:col-start-2 landscape-short:row-span-2 landscape-short:row-start-2"
      >
        {options.map(({ type, damage, clicked, correct }, index) => (
          <Button
            key={type + index}
            type="button"
            variant="answer"
            size="answer"
            aria-label={`${messages[type.toUpperCase()]}${clicked ? `, ${DAMAGE_MULTIPLIER}: ${damage}` : ''}`}
            aria-describedby={index === 0 ? 'enemy-condition quiz-question' : undefined}
            tabIndex={clicked ? -1 : 0}
            aria-disabled={disabled || clicked || undefined}
            className={cn(
              'optionItem min-h-11 w-full min-w-0 rounded-[18px] border-3 border-ink px-2 py-1 text-[20px] leading-7 focus-visible:outline-offset-[-6px]',
              clicked && !correct ? typeStyles.wrong : typeStyles[type],
              `Bgc-${clicked && !correct ? 'wrong' : type}`,
            )}
            onClick={() => selectAnswer(index)}
          >
            <span className="optionText flex flex-col items-center justify-center">
              {messages[type.toUpperCase()]}
              {clicked ? (
                <>
                  <span
                    className="answer-symbol absolute top-1.5 right-2 font-[sans-serif] text-[16px] leading-5"
                    aria-hidden="true"
                  >
                    {correct ? '✓' : '✕'}
                  </span>
                  <span className="optionDamage text-[14px] leading-5" aria-hidden="true">
                    {damage}
                  </span>
                </>
              ) : null}
            </span>
          </Button>
        ))}
      </div>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status ? announcement : ''}
      </div>
    </>
  );
}
