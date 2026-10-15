import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';

function Menu({ messages: { BASIC, SPEEDRUN, HOME, ATTACK, DEFEND, MENU }, lang }) {
  return (
    <nav className="Menu flex min-h-full w-full flex-col items-center text-[20px]" aria-label={MENU}>
      <h1 tabIndex={-1} className="sr-only">{MENU}</h1>
      {[['basic', BASIC], ['speedrun', SPEEDRUN]].map(([mode, title]) => (
        <section key={mode} className="flex grow-[5] flex-col items-center">
          <h2 className="mt-[40px] mb-[20px] text-[24px] [text-shadow:0_3.6px_#0003]">{title}</h2>
          {[['attack', ATTACK], ['defend', DEFEND]].map(([kind, label]) => (
            <div key={kind} className="menuItem m-[10px]">
              <Button asChild className="min-h-[80px] w-[175px] rounded-[24px] px-[15px] py-[30px] text-[20px]"><I18nLink to={`/quizzes/s/${mode}/${kind}`} lang={lang}>{label}</I18nLink></Button>
            </div>
          ))}
        </section>
      ))}
      <footer className="grow p-[40px]"><I18nLink to="/" lang={lang}>{HOME}</I18nLink></footer>
    </nav>
  );
}

export default I18nPage(Menu);
