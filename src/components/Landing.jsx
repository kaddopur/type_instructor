import I18nLink from './I18nLink.jsx';
import I18nPage from './I18nPage.jsx';
import { Button } from '@/components/ui/button';
import copy from '../lang/landing.json';
import enMenu from '../images/landing/en-menu.png';
import enAttack from '../images/landing/en-attack.png';
import enDefend from '../images/landing/en-defend.png';
import zhMenu from '../images/landing/zh-menu.png';
import zhAttack from '../images/landing/zh-attack.png';
import zhDefend from '../images/landing/zh-defend.png';
import jaMenu from '../images/landing/ja-menu.png';
import jaAttack from '../images/landing/ja-attack.png';
import jaDefend from '../images/landing/ja-defend.png';
import { cn } from '../lib/utils.ts';

const screenshots = {
  en: { menu: enMenu, attack: enAttack, defend: enDefend },
  zh: { menu: zhMenu, attack: zhAttack, defend: zhDefend },
  ja: { menu: jaMenu, attack: jaAttack, defend: jaDefend }
};
const repository = 'https://github.com/kaddopur/type_instructor';
const contentWidth = 'mx-auto w-[min(calc(100%_-_48px),1120px)] landing-mobile:w-[min(calc(100%_-_32px),560px)]';
const section = 'border-t-2 border-ink py-[64px] scroll-mt-[24px] landing-mobile:py-[40px]';
const heading = 'mb-[24px] font-pixel text-[clamp(22px,2.5vw,28px)] leading-[1.6] font-normal';
const image = 'block h-auto w-full rounded-[18px] border-2 border-ink bg-canvas';
const stepsGrid = 'mt-[32px] grid list-none grid-cols-3 gap-[20px] p-0 landing-mobile:grid-cols-1';
const stepCard = 'rounded-[18px] border-2 border-ink bg-surface p-[24px]';

function Landing({ lang, messages: { HOME, APP_DESCRIPTION, FAN_NOTICE } }) {
  const text = copy[lang];
  const images = screenshots[lang];
  return (
    <article className="Landing text-[17px] leading-[1.75] text-ink [font-family:system-ui,sans-serif] [&_p]:max-w-[65ch] [&_button]:[-webkit-tap-highlight-color:transparent] [&_a]:[-webkit-tap-highlight-color:transparent]">
      <header className={cn('landing-nav landing-width', contentWidth, 'flex items-center justify-between gap-[24px] border-b-2 border-ink py-[28px] landing-mobile:flex-col landing-mobile:gap-[12px] landing-mobile:py-[20px]')}>
        <I18nLink className="landing-brand font-pixel text-[17px] leading-[1.5] font-normal" to="/" lang={lang}>Type Instructor</I18nLink>
        <nav className="landing-languages flex shrink-0 gap-[8px] text-[15px]" aria-label={text.languageLabel}>
          {[['en', 'English'], ['zh', '中文'], ['ja', '日本語']].map(([code, label]) => (
            <I18nLink className="inline-flex min-h-[44px] w-[74px] items-center justify-center rounded-[12px] border-2 border-transparent aria-[current=page]:border-ink aria-[current=page]:bg-accent-soft" key={code} to="/about" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>{label}</I18nLink>
          ))}
        </nav>
      </header>
      <section className={cn('landing-hero landing-width', contentWidth, 'grid grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] items-center gap-[64px] pt-[64px] pb-[80px] landing-mobile:grid-cols-1 landing-mobile:gap-[40px] landing-mobile:pt-[40px] landing-mobile:pb-[48px]')} aria-labelledby="landing-title">
        <div>
          <p className="landing-eyebrow font-pixel text-[13px] leading-[1.8] font-normal text-muted">{text.eyebrow}</p>
          <h1 id="landing-title" className="mt-[20px] mb-[24px] font-pixel text-[clamp(28px,3.5vw,42px)] leading-[1.4] font-normal">Type Instructor</h1>
          <p className="landing-subtitle mb-[20px] text-[20px] font-semibold">{APP_DESCRIPTION}</p>
          <p className="landing-intro text-[18px]">{text.intro}</p>
          <p className="landing-notice mt-[16px] text-[14px] text-muted">{FAN_NOTICE}</p>
          <div className="landing-actions mt-[32px] mb-[24px] flex flex-wrap gap-[16px] landing-mobile:gap-[12px]">
            <Button asChild variant="primary" className="min-h-[56px] w-[230px] text-[16px] landing-mobile:w-full"><I18nLink to="/menu" lang={lang}>{text.play}</I18nLink></Button>
            <Button variant="ghost" className="min-h-[56px] w-[230px] text-[16px] landing-mobile:w-full" onClick={() => document.getElementById('how-to-play')?.scrollIntoView({ block: 'start' })}>{text.howLink}</Button>
          </div>
          <ul className="landing-facts flex list-none flex-wrap gap-[10px] p-0 text-[14px]">{text.facts.map(fact => <li className="rounded-[8px] border border-ink bg-surface px-[12px] py-[4px]" key={fact}>{fact}</li>)}</ul>
        </div>
        <figure className="landing-hero-shot m-0 w-[min(100%,300px)] rotate-[2deg] justify-self-center landing-mobile:w-[min(80%,280px)] landing-mobile:rotate-none">
          <img className={image} src={images.attack} alt={text.heroAlt} width="390" height="844" fetchPriority="high" />
          <figcaption className="mt-[12px] text-center text-[13px] text-muted">{text.screenshotLabel}</figcaption>
        </figure>
      </section>
      <section id="how-to-play" className={cn('landing-section landing-width', contentWidth, section)} aria-labelledby="how-title">
        <p className="landing-eyebrow font-pixel text-[13px] leading-[1.8] font-normal text-muted">01 / {text.howLink}</p>
        <h2 className={heading} id="how-title">{text.howTitle}</h2>
        <ol className={cn('landing-steps', stepsGrid)}>
          {text.steps.map((step, index) => <li className={stepCard} key={step.title}>
            <span className="landing-step-number mb-[24px] inline-flex size-[44px] items-center justify-center rounded-[10px] border-2 border-ink bg-accent font-pixel text-[16px]" aria-hidden="true">0{index + 1}</span>
            <h3 className="mb-[16px] font-pixel text-[20px] leading-[1.5] font-normal">{step.title}</h3><p>{step.body}</p>
          </li>)}
        </ol>
      </section>
      <section className={cn('landing-section landing-width landing-modes', contentWidth, section, 'grid grid-cols-[minmax(0,1fr)_minmax(0,.7fr)] items-center gap-[64px] landing-mobile:grid-cols-1 landing-mobile:gap-[40px]')} aria-labelledby="modes-title">
        <div>
          <h2 className={heading} id="modes-title">{text.modesTitle}</h2>
          <p>{text.modesIntro}</p>
          <div className="landing-mode-card mt-[24px] rounded-[18px] border-2 border-t-[10px] border-ink border-t-accent bg-surface p-[24px]">
            <h3 className="mb-[16px] font-pixel text-[20px] leading-[1.5] font-normal">{text.basicTitle}</h3><p className="landing-rule mb-[12px] font-pixel text-[16px] font-normal">{text.basicRule}</p><p>{text.basicBody}</p>
          </div>
          <div className="landing-mode-card landing-mode-speedrun mt-[24px] rounded-[18px] border-2 border-t-[10px] border-ink border-t-mode-blue bg-surface p-[24px]">
            <h3 className="mb-[16px] font-pixel text-[20px] leading-[1.5] font-normal">{text.speedrunTitle}</h3><p className="landing-rule mb-[12px] font-pixel text-[16px] font-normal">{text.speedrunRule}</p><p>{text.speedrunBody}</p>
          </div>
        </div>
        <figure className="landing-menu-shot m-0 w-[min(100%,300px)] justify-self-center">
          <img className={image} src={images.menu} alt={text.menuAlt} width="390" height="844" loading="lazy" />
          <figcaption className="mt-[12px] text-center text-[13px] text-muted">{text.screenshotLabel}</figcaption>
        </figure>
      </section>
      <section className={cn('landing-section landing-width', contentWidth, section)} aria-labelledby="questions-title">
        <h2 className={heading} id="questions-title">{text.questionsTitle}</h2>
        <div className="landing-questions mt-[32px] grid grid-cols-2 gap-[32px] landing-mobile:grid-cols-1 landing-mobile:gap-[20px]">
          {[['attack', text.attackTitle, text.attackBody, text.heroAlt], ['defend', text.defendTitle, text.defendBody, text.defendAlt]].map(([kind, title, body, alt]) => (
            <div key={kind} className="landing-question-card flex flex-col items-center gap-[28px] rounded-[20px] border-2 border-ink bg-surface p-[28px] landing-mobile:p-[20px]">
              <div><h3 className="mb-[16px] font-pixel text-[20px] leading-[1.5] font-normal">{title}</h3><p>{body}</p></div>
              <img className={cn(image, 'mt-auto w-[min(100%,280px)]')} src={images[kind]} alt={alt} width="390" height="844" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
      <section className={cn('landing-section landing-width landing-details', contentWidth, section, 'grid grid-cols-3 gap-[32px] landing-mobile:grid-cols-1 landing-mobile:gap-[20px]')} aria-label={text.controlsTitle}>
        {[[text.controlsTitle, text.controlsBody], [text.feedbackTitle, text.feedbackBody], [text.offlineTitle, text.offlineBody]].map(([title, body]) => (
          <div key={title}><h2 className={cn(heading, 'text-[20px] leading-[1.6]')}>{title}</h2><p>{body}</p></div>
        ))}
      </section>
      <section id="install-app" className={cn('landing-section landing-width landing-install', contentWidth, section)} aria-labelledby="install-title">
        <h2 className={heading} id="install-title">{text.installTitle}</h2>
        <p>{text.installIntro}</p>
        <ul className={cn('landing-install-options', stepsGrid)}>
          {text.installOptions.map(({ title, steps }) => (
            <li className={stepCard} key={title}>
              <h3 className="mb-[16px] font-pixel text-[20px] leading-[1.5] font-normal">{title}</h3>
              <ol className="list-decimal pl-[1.4em] [&>li+li]:mt-[12px]">{steps.map(step => <li key={step}>{step}</li>)}</ol>
            </li>
          ))}
        </ul>
        <p className="landing-install-note mt-[24px]">{text.installBrowserNote}</p>
        <p className="landing-install-note mt-[24px]">{text.installOfflineNote}</p>
        <nav className="landing-install-guides mt-[16px] flex flex-wrap gap-x-[24px] gap-y-[8px] text-[14px] [&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:underline [&_a]:underline-offset-[4px]" aria-label={text.installGuide}>
          {[
            ['Safari', 'https://support.apple.com/guide/iphone/iphea86e5236/ios'],
            ['Chrome', 'https://support.google.com/chrome/answer/9658361'],
            ['Edge', 'https://support.microsoft.com/en-US/edge/install-manage-or-uninstall-apps-in-microsoft-edge']
          ].map(([browser, href]) => <a key={browser} href={href} target="_blank" rel="noreferrer">{browser} · {text.installGuide}</a>)}
        </nav>
      </section>
      <section className={cn('landing-closing landing-width', contentWidth, 'rounded-[24px] border-[3px] border-ink bg-accent-soft px-[32px] py-[48px] text-center landing-mobile:px-[20px] landing-mobile:py-[32px]')} aria-labelledby="closing-title">
        <h2 className={heading} id="closing-title">{text.finalTitle}</h2><p className="mx-auto mb-[28px]">{text.finalBody}</p>
        <Button asChild variant="primary" className="min-h-[56px] w-[230px] text-[16px] landing-mobile:w-full landing-mobile:max-w-[280px]"><I18nLink to="/menu" lang={lang}>{text.play}</I18nLink></Button>
      </section>
      <footer className={cn('landing-footer landing-width', contentWidth, 'pt-[40px] pb-[24px] text-[14px] text-muted [&_a]:inline-flex [&_a]:min-h-[44px] [&_a]:items-center [&_a]:underline [&_a]:underline-offset-[4px]')}>
        <div className="mb-[16px] flex flex-wrap justify-between gap-[16px]"><I18nLink to="/" lang={lang}>{HOME}</I18nLink><a href={repository} target="_blank" rel="noreferrer">{text.source}</a></div>
        <p>{text.footer}</p>
      </footer>
    </article>
  );
}

export default I18nPage(Landing);
