import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import globe from '../images/globe.png';

function Home({ messages: { START, CHANGE_LANGUAGE, APP_DESCRIPTION, ABOUT_GAME, FAN_NOTICE }, lang }) {
  const pixels = 'home-pixels absolute top-[20px] size-[10px] bg-accent [box-shadow:10px_10px_var(--color-mode-blue),0_20px_var(--color-mode-blue),20px_0_var(--color-accent)]';
  return (
    <article className="Home relative grid h-full grid-rows-[1fr_auto_.65fr] gap-[24px] px-[24px] pt-[32px] pb-[20px] text-center short:grid-rows-[1fr_auto] short:gap-[12px] short:py-[16px] landscape-short:grid-cols-2">
      <div className={`${pixels} home-pixels-left left-[20px]`} aria-hidden="true" />
      <div className={`${pixels} home-pixels-right right-[20px] -scale-x-100`} aria-hidden="true" />
      <header className="home-hero self-end short:self-center">
        <h1 tabIndex={-1} className="text-[clamp(32px,9vw,48px)] leading-[1.45] [@media(max-height:480px)]:text-[32px]">Type Instructor</h1>
        <p className="mt-[16px] flex h-[48px] items-center justify-center text-[16px] leading-[24px] [font-family:system-ui,sans-serif] short:mt-[4px] short:h-[32px]">{APP_DESCRIPTION}</p>
      </header>
      <div className="home-actions grid justify-items-center gap-[20px] pt-[20px] compact:gap-[8px] compact:pt-0">
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
        <I18nLink className="home-about inline-flex min-h-[44px] w-[240px] items-center justify-center text-[16px] leading-[24px] underline underline-offset-[4px]" to="/about" lang={lang}>{ABOUT_GAME}</I18nLink>
      </div>
      <footer className="home-notice flex h-[72px] max-w-[560px] items-end justify-center self-end justify-self-center text-[12px] leading-[18px] text-muted [font-family:system-ui,sans-serif] landscape-short:col-span-full">{FAN_NOTICE}</footer>
    </article>
  );
}

export default I18nPage(Home);
