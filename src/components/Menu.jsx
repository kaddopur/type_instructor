import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Menu({ messages: { BASIC, SPEEDRUN, HOME, ATTACK, DEFEND, MENU }, lang }) {
  return (
    <nav className="Menu flex min-h-dvh w-full flex-col items-center" aria-label={MENU}>
      <h1 tabIndex={-1} className="sr-only">{MENU}</h1>
      {[['basic', BASIC], ['speedrun', SPEEDRUN]].map(([mode, title]) => (
        <section key={mode} className="flex grow-[5] flex-col items-center">
          <h2 className="mt-8 mb-4 text-[1.2rem] [text-shadow:0_.18rem_#0003]">{title}</h2>
          {[['attack', ATTACK], ['defend', DEFEND]].map(([kind, label]) => (
            <div key={kind} className="menuItem m-2">
              <Button asChild><I18nLink to={`/quizzes/s/${mode}/${kind}`} lang={lang}>{label}</I18nLink></Button>
            </div>
          ))}
        </section>
      ))}
      <footer className="grow p-8"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Menu);
