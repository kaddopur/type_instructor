import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import globe from '../images/globe.png';

function Home({ messages: { START, CHANGE_LANGUAGE }, lang }) {
  return (
    <article className="Home flex min-h-dvh w-full flex-col items-center bg-[linear-gradient(135deg,#f7ae00_50%,transparent_0),linear-gradient(45deg,#2db6eb_50%,transparent_0)]">
      <h1 tabIndex={-1} className="grow-[3] px-8 py-16 text-[clamp(1.25rem,5vw,2rem)] leading-[1.4] [text-shadow:0_5px_#0003]">Type Instructor of Pokémon</h1>
      <section className="start grow">
        <Button asChild className="text-[1.2rem]">
          <I18nLink to="/menu" lang={lang}>{START}</I18nLink>
        </Button>
      </section>
      <section className="lang mt-6">
        <Button asChild variant="ghost" size="icon">
          <I18nLink to="/lang" lang={lang}>
            <img src={globe} width="32" height="32" alt={CHANGE_LANGUAGE} />
          </I18nLink>
        </Button>
      </section>
      <footer className="p-16 text-center">
        <a href="https://twitter.com/kaddopur" target="_blank" rel="noreferrer">@kaddopur</a>
      </footer>
    </article>
  );
}

export default I18nPage(Home);
