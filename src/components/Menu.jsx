import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import { getPersonalBest } from '../lib/personalBests.ts';
import { pageLayout, pageTitle, pageFooter } from '../lib/pageStyles.ts';
import { cn } from '../lib/utils.ts';

function Menu({ messages, lang }) {
  const {
    BASIC,
    SPEEDRUN,
    HOME,
    ATTACK,
    DEFEND,
    MENU,
    SELECT_CHALLENGE,
    BASIC_DESCRIPTION,
    SPEEDRUN_DESCRIPTION,
  } = messages;
  return (
    <nav className={cn('Menu', pageLayout, 'compact:gap-2')} aria-label={MENU}>
      <h1 tabIndex={-1} className={pageTitle}>
        {SELECT_CHALLENGE}
      </h1>
      <div className="mode-grid my-auto grid w-[min(100%,420px)] gap-5 min-[800px]:w-[min(100%,900px)] min-[800px]:grid-cols-2 compact:gap-3 landscape-short:w-[min(100%,900px)] landscape-short:grid-cols-2">
        {[
          ['basic', BASIC, BASIC_DESCRIPTION],
          ['speedrun', SPEEDRUN, SPEEDRUN_DESCRIPTION],
        ].map(([mode, title, description]) => (
          <section
            key={mode}
            className={cn(
              `mode-card mode-${mode}`,
              "relative overflow-hidden rounded-2xl border-3 border-ink bg-surface px-4 pt-7 pb-5 before:absolute before:inset-x-0 before:top-0 before:h-3 before:bg-accent before:content-[''] compact:px-3 compact:pt-4 compact:pb-2.5 compact:before:h-2",
              mode === 'speedrun' && 'before:bg-mode-blue',
            )}
          >
            <h2 className="flex h-9 items-center text-[24px] leading-7 compact:h-7 compact:text-[22px]">
              {title}
            </h2>
            <p className="flex h-15 items-center text-[14px] leading-5 compact:h-10">
              {description}
            </p>
            <div className="mode-actions mt-3 grid grid-cols-2 gap-3 compact:mt-2">
              {[
                ['attack', ATTACK],
                ['defend', DEFEND],
              ].map(([kind, label]) => {
                const best = getPersonalBest(mode, kind);
                const value =
                  best === null
                    ? '—'
                    : mode === 'basic'
                      ? best
                      : messages.SECONDS_SHORT.replace('{value}', best);
                return (
                  <div key={kind} className="menuItem">
                    <Button
                      asChild
                      className="min-h-14 w-full px-1 text-[18px] compact:min-h-11 compact:py-1"
                    >
                      <I18nLink
                        aria-describedby={`record-${mode}-${kind}`}
                        to={`/quizzes/s/${mode}/${kind}`}
                        lang={lang}
                      >
                        {label}
                      </I18nLink>
                    </Button>
                    <span
                      id={`record-${mode}-${kind}`}
                      className="personal-best mt-2 block text-center text-[14px] leading-5 text-muted"
                    >
                      {messages[mode === 'basic' ? 'BEST_SCORE' : 'BEST_TIME'].replace(
                        '{value}',
                        value,
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <footer className={pageFooter}>
        <I18nLink to="/" lang={lang}>
          {HOME}
        </I18nLink>
      </footer>
    </nav>
  );
}

export default I18nPage(Menu);
