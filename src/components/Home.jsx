import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import globe from '../images/globe.png';

function Home({
  messages: { START, CHANGE_LANGUAGE, APP_DESCRIPTION, ABOUT_GAME, FAN_NOTICE },
  lang,
}) {
  const pixels =
    'home-pixels absolute top-5 size-2.5 bg-accent [box-shadow:10px_10px_var(--color-mode-blue),0_20px_var(--color-mode-blue),20px_0_var(--color-accent)]';
  return (
    <article className="Home relative grid h-full grid-rows-[1fr_auto_.65fr] gap-6 px-6 pt-8 pb-5 text-center short:grid-rows-[1fr_auto] short:gap-3 short:py-4 landscape-short:grid-cols-2">
      <div className={`${pixels} home-pixels-left left-5`} aria-hidden="true" />
      <div className={`${pixels} home-pixels-right right-5 -scale-x-100`} aria-hidden="true" />
      <header className="home-hero self-end short:self-center">
        <h1 tabIndex={-1} className="text-[clamp(32px,9vw,48px)] leading-[1.45] short:text-[32px]">
          Type Instructor
        </h1>
        <p className="mt-4 flex h-12 items-center justify-center font-[system-ui,sans-serif] text-[16px] leading-6 short:mt-1 short:h-8">
          {APP_DESCRIPTION}
        </p>
      </header>
      <div className="home-actions grid justify-items-center gap-5 pt-5 compact:gap-2 compact:pt-0">
        <section className="start">
          <Button asChild variant="primary" className="w-60 max-w-full text-[24px]">
            <I18nLink to="/menu" lang={lang}>
              {START}
            </I18nLink>
          </Button>
        </section>
        <section className="lang">
          <Button asChild className="h-14 min-h-0 w-55 text-[16px] whitespace-nowrap">
            <I18nLink to="/lang" lang={lang} aria-label={CHANGE_LANGUAGE}>
              <img src={globe} width="24" height="24" alt="" />
              <span aria-hidden="true">
                {lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : '中文'} ▾
              </span>
            </I18nLink>
          </Button>
        </section>
        <I18nLink
          className="home-about inline-flex min-h-11 w-60 items-center justify-center text-[16px] leading-6 underline underline-offset-4"
          to="/about"
          lang={lang}
        >
          {ABOUT_GAME}
        </I18nLink>
      </div>
      <footer className="home-notice flex h-18 max-w-md items-end justify-center self-end justify-self-center font-[system-ui,sans-serif] text-[12px] leading-4.5 text-muted landscape-short:col-span-full">
        {FAN_NOTICE}
      </footer>
    </article>
  );
}

export default I18nPage(Home);
