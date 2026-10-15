import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import globe from '../images/globe.png';

function Home({ messages: { START, CHANGE_LANGUAGE, APP_DESCRIPTION }, lang }) {
  return (
    <article className="Home">
      <div className="home-pixels home-pixels-left" aria-hidden="true" />
      <div className="home-pixels home-pixels-right" aria-hidden="true" />
      <header className="home-hero">
        <h1 tabIndex={-1}><span>Type Instructor</span>{' '}<span>of Pokémon</span></h1>
        <p>{APP_DESCRIPTION}</p>
      </header>
      <div className="home-actions">
        <section className="start">
          <Button asChild variant="primary" className="w-[240px] max-w-full text-[24px]">
            <I18nLink to="/menu" lang={lang}>{START}</I18nLink>
          </Button>
        </section>
        <section className="lang">
          <Button asChild className="min-h-[48px] w-[180px] text-[16px]">
            <I18nLink to="/lang" lang={lang} aria-label={CHANGE_LANGUAGE}>
              <img src={globe} width="24" height="24" alt="" />
              <span aria-hidden="true">{lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : '中文'} ▾</span>
            </I18nLink>
          </Button>
        </section>
      </div>
      <footer><a tabIndex={0} href="https://twitter.com/kaddopur" target="_blank" rel="noreferrer">@kaddopur</a></footer>
    </article>
  );
}

export default I18nPage(Home);
