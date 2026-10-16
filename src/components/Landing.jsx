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
import enResultActions from '../images/landing/en-result-actions.png';
import zhResultActions from '../images/landing/zh-result-actions.png';
import jaResultActions from '../images/landing/ja-result-actions.png';
import { cn } from '../lib/utils.ts';

const screenshots = {
  en: { menu: enMenu, attack: enAttack, defend: enDefend, resultActions: enResultActions },
  zh: { menu: zhMenu, attack: zhAttack, defend: zhDefend, resultActions: zhResultActions },
  ja: { menu: jaMenu, attack: jaAttack, defend: jaDefend, resultActions: jaResultActions },
};
const repository = 'https://github.com/kaddopur/type_instructor';
const contentWidth =
  'mx-auto w-[min(calc(100%-48px),1120px)] landing-mobile:w-[min(calc(100%-32px),560px)]';
const section = 'border-t-2 border-ink py-16 scroll-mt-6 landing-mobile:py-10';
const heading = 'mb-6 font-pixel text-[clamp(22px,2.5vw,28px)] leading-[1.6] font-normal';
const image = 'block h-auto w-full rounded-[18px] border-2 border-ink bg-canvas';
const stepsGrid = 'mt-8 grid list-none grid-cols-3 gap-5 p-0 landing-mobile:grid-cols-1';
const stepCard = 'rounded-[18px] border-2 border-ink bg-surface p-6';

function Landing({ lang, messages: { HOME, APP_DESCRIPTION, FAN_NOTICE } }) {
  const text = copy[lang];
  const images = screenshots[lang];
  return (
    <article className="Landing font-[system-ui,sans-serif] text-[17px] leading-[1.75] text-ink [&_a]:[-webkit-tap-highlight-color:transparent] [&_button]:[-webkit-tap-highlight-color:transparent] [&_p]:max-w-[65ch]">
      <header
        className={cn(
          'landing-nav landing-width',
          contentWidth,
          'flex items-center justify-between gap-6 border-b-2 border-ink py-7 landing-mobile:flex-col landing-mobile:gap-3 landing-mobile:py-5',
        )}
      >
        <I18nLink
          className="landing-brand font-pixel text-[17px] leading-normal font-normal"
          to="/"
          lang={lang}
        >
          Type Instructor
        </I18nLink>
        <nav
          className="landing-languages flex shrink-0 gap-2 text-[15px]"
          aria-label={text.languageLabel}
        >
          {[
            ['en', 'English'],
            ['zh', '中文'],
            ['ja', '日本語'],
          ].map(([code, label]) => (
            <I18nLink
              className="inline-flex min-h-11 w-18.5 items-center justify-center rounded-[12px] border-2 border-transparent aria-[current=page]:border-ink aria-[current=page]:bg-accent-soft"
              key={code}
              to="/about"
              lang={code}
              hrefLang={code}
              aria-current={lang === code ? 'page' : undefined}
            >
              {label}
            </I18nLink>
          ))}
        </nav>
      </header>
      <section
        className={cn(
          'landing-hero landing-width',
          contentWidth,
          'grid grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] items-center gap-16 pt-16 pb-20 landing-mobile:grid-cols-1 landing-mobile:gap-10 landing-mobile:pt-10 landing-mobile:pb-12',
        )}
        aria-labelledby="landing-title"
      >
        <div>
          <p className="landing-eyebrow font-pixel text-[13px] leading-[1.8] font-normal text-muted">
            {text.eyebrow}
          </p>
          <h1
            id="landing-title"
            className="mt-5 mb-6 font-pixel text-[clamp(28px,3.5vw,42px)] leading-[1.4] font-normal"
          >
            Type Instructor
          </h1>
          <p className="landing-subtitle mb-5 text-[20px] font-semibold">{APP_DESCRIPTION}</p>
          <p className="landing-intro text-[18px]">{text.intro}</p>
          <p className="landing-notice mt-4 text-[14px] text-muted">{FAN_NOTICE}</p>
          <div className="landing-actions mt-8 mb-6 flex flex-wrap gap-4 landing-mobile:gap-3">
            <Button
              asChild
              variant="primary"
              className="min-h-14 w-57.5 text-[16px] landing-mobile:w-full"
            >
              <I18nLink to="/menu" lang={lang}>
                {text.play}
              </I18nLink>
            </Button>
            <Button
              variant="ghost"
              className="min-h-14 w-57.5 text-[16px] landing-mobile:w-full"
              onClick={() =>
                document.getElementById('how-to-play')?.scrollIntoView({ block: 'start' })
              }
            >
              {text.howLink}
            </Button>
          </div>
          <ul className="landing-facts flex list-none flex-wrap gap-2.5 p-0 text-[14px]">
            {text.facts.map((fact) => (
              <li className="rounded-[8px] border border-ink bg-surface px-3 py-1" key={fact}>
                {fact}
              </li>
            ))}
          </ul>
        </div>
        <figure className="landing-hero-shot m-0 w-[min(100%,300px)] rotate-2 justify-self-center landing-mobile:w-[min(80%,280px)] landing-mobile:rotate-none">
          <img
            className={image}
            src={images.attack}
            alt={text.heroAlt}
            width="390"
            height="844"
            fetchPriority="high"
          />
          <figcaption className="mt-3 text-center text-[13px] text-muted">
            {text.screenshotLabel}
          </figcaption>
        </figure>
      </section>
      <section
        id="how-to-play"
        className={cn('landing-section landing-width', contentWidth, section)}
        aria-labelledby="how-title"
      >
        <p className="landing-eyebrow font-pixel text-[13px] leading-[1.8] font-normal text-muted">
          01 / {text.howLink}
        </p>
        <h2 className={heading} id="how-title">
          {text.howTitle}
        </h2>
        <ol className={cn('landing-steps', stepsGrid)}>
          {text.steps.map((step, index) => (
            <li className={stepCard} key={step.title}>
              <span
                className="landing-step-number mb-6 inline-flex size-11 items-center justify-center rounded-lg border-2 border-ink bg-accent font-pixel text-[16px]"
                aria-hidden="true"
              >
                0{index + 1}
              </span>
              <h3 className="mb-4 font-pixel text-[20px] leading-normal font-normal">
                {step.title}
              </h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section
        className={cn(
          'landing-section landing-width landing-modes',
          contentWidth,
          section,
          'grid grid-cols-[minmax(0,1fr)_minmax(0,.7fr)] items-center gap-16 landing-mobile:grid-cols-1 landing-mobile:gap-10',
        )}
        aria-labelledby="modes-title"
      >
        <div>
          <h2 className={heading} id="modes-title">
            {text.modesTitle}
          </h2>
          <p>{text.modesIntro}</p>
          <div className="landing-mode-card mt-6 rounded-[18px] border-2 border-t-10 border-ink border-t-accent bg-surface p-6">
            <h3 className="mb-4 font-pixel text-[20px] leading-normal font-normal">
              {text.basicTitle}
            </h3>
            <p className="landing-rule mb-3 font-pixel text-[16px] font-normal">{text.basicRule}</p>
            <p>{text.basicBody}</p>
          </div>
          <div className="landing-mode-card landing-mode-speedrun mt-6 rounded-[18px] border-2 border-t-10 border-ink border-t-mode-blue bg-surface p-6">
            <h3 className="mb-4 font-pixel text-[20px] leading-normal font-normal">
              {text.speedrunTitle}
            </h3>
            <p className="landing-rule mb-3 font-pixel text-[16px] font-normal">
              {text.speedrunRule}
            </p>
            <p>{text.speedrunBody}</p>
          </div>
        </div>
        <figure className="landing-menu-shot m-0 w-[min(100%,300px)] justify-self-center">
          <img
            className={image}
            src={images.menu}
            alt={text.menuAlt}
            width="390"
            height="844"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center text-[13px] text-muted">
            {text.screenshotLabel}
          </figcaption>
        </figure>
      </section>
      <section
        className={cn(
          'landing-section landing-width',
          contentWidth,
          section,
          'grid grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] items-center gap-12 landing-mobile:grid-cols-1 landing-mobile:gap-8',
        )}
        aria-labelledby="practice-title"
      >
        <div>
          <h2 className={heading} id="practice-title">
            {text.practiceTitle}
          </h2>
          <p>{text.practiceIntro}</p>
          <p className="mt-4">{text.practiceRule}</p>
          <p className="mt-4">{text.practiceReset}</p>
        </div>
        <figure className="landing-practice-shot m-0 w-[min(100%,284px)] justify-self-center">
          <img
            className={image}
            src={images.resultActions}
            alt={text.practiceAlt}
            width="284"
            height="212"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center text-[13px] text-muted">
            {text.screenshotLabel}
          </figcaption>
        </figure>
      </section>
      <section
        className={cn('landing-section landing-width', contentWidth, section)}
        aria-labelledby="questions-title"
      >
        <h2 className={heading} id="questions-title">
          {text.questionsTitle}
        </h2>
        <div className="landing-questions mt-8 grid grid-cols-2 gap-8 landing-mobile:grid-cols-1 landing-mobile:gap-5">
          {[
            ['attack', text.attackTitle, text.attackBody, text.heroAlt],
            ['defend', text.defendTitle, text.defendBody, text.defendAlt],
          ].map(([kind, title, body, alt]) => (
            <div
              key={kind}
              className="landing-question-card flex flex-col items-center gap-7 rounded-2xl border-2 border-ink bg-surface p-7 landing-mobile:p-5"
            >
              <div>
                <h3 className="mb-4 font-pixel text-[20px] leading-normal font-normal">{title}</h3>
                <p>{body}</p>
              </div>
              <img
                className={cn(image, 'mt-auto w-[min(100%,280px)]')}
                src={images[kind]}
                alt={alt}
                width="390"
                height="844"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
      <section
        className={cn(
          'landing-section landing-width landing-details',
          contentWidth,
          section,
          'grid grid-cols-3 gap-8 landing-mobile:grid-cols-1 landing-mobile:gap-5',
        )}
        aria-label={text.controlsTitle}
      >
        {[
          [text.controlsTitle, text.controlsBody],
          [text.feedbackTitle, text.feedbackBody],
          [text.offlineTitle, text.offlineBody],
        ].map(([title, body]) => (
          <div key={title}>
            <h2 className={cn(heading, 'text-[20px] leading-[1.6]')}>{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </section>
      <section
        id="install-app"
        className={cn('landing-section landing-width landing-install', contentWidth, section)}
        aria-labelledby="install-title"
      >
        <h2 className={heading} id="install-title">
          {text.installTitle}
        </h2>
        <p>{text.installIntro}</p>
        <ul className={cn('landing-install-options', stepsGrid)}>
          {text.installOptions.map(({ title, steps }) => (
            <li className={stepCard} key={title}>
              <h3 className="mb-4 font-pixel text-[20px] leading-normal font-normal">{title}</h3>
              <ol className="list-decimal pl-[1.4em] [&>li+li]:mt-3">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
        <p className="landing-install-note mt-6">{text.installBrowserNote}</p>
        <p className="landing-install-note mt-6">{text.installOfflineNote}</p>
        <nav
          className="landing-install-guides mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[14px] [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_a]:underline-offset-4"
          aria-label={text.installGuide}
        >
          {[
            ['Safari', 'https://support.apple.com/guide/iphone/iphea86e5236/ios'],
            ['Chrome', 'https://support.google.com/chrome/answer/9658361'],
            [
              'Edge',
              'https://support.microsoft.com/en-US/edge/install-manage-or-uninstall-apps-in-microsoft-edge',
            ],
          ].map(([browser, href]) => (
            <a key={browser} href={href} target="_blank" rel="noreferrer">
              {browser} · {text.installGuide}
            </a>
          ))}
        </nav>
      </section>
      <section
        className={cn(
          'landing-closing landing-width',
          contentWidth,
          'rounded-[24px] border-3 border-ink bg-accent-soft px-8 py-12 text-center landing-mobile:px-5 landing-mobile:py-8',
        )}
        aria-labelledby="closing-title"
      >
        <h2 className={heading} id="closing-title">
          {text.finalTitle}
        </h2>
        <p className="mx-auto mb-7">{text.finalBody}</p>
        <Button
          asChild
          variant="primary"
          className="min-h-14 w-57.5 text-[16px] landing-mobile:w-full landing-mobile:max-w-70"
        >
          <I18nLink to="/menu" lang={lang}>
            {text.play}
          </I18nLink>
        </Button>
      </section>
      <footer
        className={cn(
          'landing-footer landing-width',
          contentWidth,
          'pt-10 pb-6 text-[14px] text-muted [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_a]:underline-offset-4',
        )}
      >
        <div className="mb-4 flex flex-wrap justify-between gap-4">
          <I18nLink to="/" lang={lang}>
            {HOME}
          </I18nLink>
          <a href={repository} target="_blank" rel="noreferrer">
            {text.source}
          </a>
        </div>
        <p>{text.footer}</p>
      </footer>
    </article>
  );
}

export default I18nPage(Landing);
