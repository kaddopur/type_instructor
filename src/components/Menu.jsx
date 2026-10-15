import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import { getPersonalBest } from '../lib/personalBests.ts';

function Menu({ messages, lang }) {
  const { BASIC, SPEEDRUN, HOME, ATTACK, DEFEND, MENU, SELECT_CHALLENGE, BASIC_DESCRIPTION, SPEEDRUN_DESCRIPTION } = messages;
  return (
    <nav className="Menu page-layout" aria-label={MENU}>
      <h1 tabIndex={-1} className="page-title">{SELECT_CHALLENGE}</h1>
      <div className="mode-grid">
        {[['basic', BASIC, BASIC_DESCRIPTION], ['speedrun', SPEEDRUN, SPEEDRUN_DESCRIPTION]].map(([mode, title, description]) => (
          <section key={mode} className={`mode-card mode-${mode}`}>
            <h2>{title}</h2>
            <p>{description}</p>
            <div className="mode-actions">
              {[['attack', ATTACK], ['defend', DEFEND]].map(([kind, label]) => {
                const best = getPersonalBest(mode, kind);
                const value = best === null ? '—' : mode === 'basic' ? best : messages.SECONDS_SHORT.replace('{value}', best);
                return (
                  <div key={kind} className="menuItem">
                    <Button asChild className="min-h-[56px] w-full px-[4px] text-[18px]">
                      <I18nLink aria-describedby={`record-${mode}-${kind}`} to={`/quizzes/s/${mode}/${kind}`} lang={lang}>{label}</I18nLink>
                    </Button>
                    <span id={`record-${mode}-${kind}`} className="personal-best mt-[8px] block text-center text-[14px] leading-[20px] text-muted">
                      {messages[mode === 'basic' ? 'BEST_SCORE' : 'BEST_TIME'].replace('{value}', value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <footer className="page-footer"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Menu);
