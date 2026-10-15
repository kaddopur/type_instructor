import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import globe from '../images/globe.png';

function Home({ messages: { START, CHANGE_LANGUAGE, APP_DESCRIPTION, ABOUT_GAME, FAN_NOTICE }, lang }) {
  return (
    <article className="Home">
      <div className="home-pixels home-pixels-left" aria-hidden="true" />
      <div className="home-pixels home-pixels-right right-[20px] -scale-x-100" aria-hidden="true" />
      <header className="home-hero">
        <h1 tabIndex={-1} className="text-[clamp(32px,9vw,48px)] leading-[1.45] [@media(max-height:480px)]:text-[32px]">Type Instructor</h1>
        <p>{APP_DESCRIPTION}</p>
      </header>
      <div className="home-actions">
        <section className="start">
          <Button asChild variant="primary" className="w-[240px] max-w-full text-[24px]">
            <I18nLink to="/menu" lang={lang}>{START}</I18nLink>
          </Button>
        </section>
        <section className="lang">
          <Button asChild className="h-[56px] min-h-0 w-[220px] whitespace-nowrap text-[16px]">
            <I18nLink to="/lang" lang={lang} aria-label={CHANGE_LANGUAGE}>
              <img src={globe} width="24" height="24" alt="" />
              <span aria-hidden="true">{lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : '中文'} ▾</span>
            </I18nLink>
          </Button>
        </section>
        <I18nLink className="home-about" to="/about" lang={lang}>{ABOUT_GAME}</I18nLink>
      </div>
      <footer className="home-notice">{FAN_NOTICE}</footer>
    </article>
  );
}

export default I18nPage(Home);
