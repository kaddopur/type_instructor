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
import './Landing.css';

const screenshots = {
  en: { menu: enMenu, attack: enAttack, defend: enDefend },
  zh: { menu: zhMenu, attack: zhAttack, defend: zhDefend },
  ja: { menu: jaMenu, attack: jaAttack, defend: jaDefend }
};
const repository = 'https://github.com/kaddopur/type_instructor';

function Landing({ lang, messages: { HOME } }) {
  const text = copy[lang];
  const images = screenshots[lang];
  return (
    <article className="Landing">
      <header className="landing-nav landing-width">
        <I18nLink className="landing-brand" to="/" lang={lang}>Type Instructor</I18nLink>
        <nav className="landing-languages" aria-label={text.languageLabel}>
          {[['en', 'English'], ['zh', '中文'], ['ja', '日本語']].map(([code, label]) => (
            <I18nLink key={code} to="/about" lang={code} hrefLang={code} aria-current={lang === code ? 'page' : undefined}>{label}</I18nLink>
          ))}
        </nav>
      </header>
      <section className="landing-hero landing-width" aria-labelledby="landing-title">
        <div>
          <p className="landing-eyebrow">{text.eyebrow}</p>
          <h1 id="landing-title">{text.title[0]}<br />{text.title[1]}</h1>
          <p className="landing-intro">{text.intro}</p>
          <div className="landing-actions">
            <Button asChild variant="primary"><I18nLink to="/menu" lang={lang}>{text.play}</I18nLink></Button>
            <Button variant="ghost" onClick={() => document.getElementById('how-to-play')?.scrollIntoView({ block: 'start' })}>{text.howLink}</Button>
          </div>
          <ul className="landing-facts">{text.facts.map(fact => <li key={fact}>{fact}</li>)}</ul>
        </div>
        <figure className="landing-hero-shot">
          <img src={images.attack} alt={text.heroAlt} width="390" height="844" fetchPriority="high" />
          <figcaption>{text.screenshotLabel}</figcaption>
        </figure>
      </section>
      <section id="how-to-play" className="landing-section landing-width" aria-labelledby="how-title">
        <p className="landing-eyebrow">01 / {text.howLink}</p>
        <h2 id="how-title">{text.howTitle}</h2>
        <ol className="landing-steps">
          {text.steps.map((step, index) => <li key={step.title}>
            <span className="landing-step-number" aria-hidden="true">0{index + 1}</span>
            <h3>{step.title}</h3><p>{step.body}</p>
          </li>)}
        </ol>
      </section>
      <section className="landing-section landing-width landing-modes" aria-labelledby="modes-title">
        <div>
          <h2 id="modes-title">{text.modesTitle}</h2>
          <p>{text.modesIntro}</p>
          <div className="landing-mode-card">
            <h3>{text.basicTitle}</h3><p className="landing-rule">{text.basicRule}</p><p>{text.basicBody}</p>
          </div>
          <div className="landing-mode-card landing-mode-speedrun">
            <h3>{text.speedrunTitle}</h3><p className="landing-rule">{text.speedrunRule}</p><p>{text.speedrunBody}</p>
          </div>
        </div>
        <figure className="landing-menu-shot">
          <img src={images.menu} alt={text.menuAlt} width="390" height="844" loading="lazy" />
          <figcaption>{text.screenshotLabel}</figcaption>
        </figure>
      </section>
      <section className="landing-section landing-width" aria-labelledby="questions-title">
        <h2 id="questions-title">{text.questionsTitle}</h2>
        <div className="landing-questions">
          {[['attack', text.attackTitle, text.attackBody, text.heroAlt], ['defend', text.defendTitle, text.defendBody, text.defendAlt]].map(([kind, title, body, alt]) => (
            <div key={kind} className="landing-question-card">
              <div><h3>{title}</h3><p>{body}</p></div>
              <img src={images[kind]} alt={alt} width="390" height="844" loading="lazy" />
            </div>
          ))}
        </div>
      </section>
      <section className="landing-section landing-width landing-details" aria-label={text.controlsTitle}>
        {[[text.controlsTitle, text.controlsBody], [text.feedbackTitle, text.feedbackBody], [text.offlineTitle, text.offlineBody]].map(([title, body]) => (
          <div key={title}><h2>{title}</h2><p>{body}</p></div>
        ))}
      </section>
      <section className="landing-closing landing-width" aria-labelledby="closing-title">
        <h2 id="closing-title">{text.finalTitle}</h2><p>{text.finalBody}</p>
        <Button asChild variant="primary"><I18nLink to="/menu" lang={lang}>{text.play}</I18nLink></Button>
      </section>
      <footer className="landing-footer landing-width">
        <div><I18nLink to="/" lang={lang}>{HOME}</I18nLink><a href={repository} target="_blank" rel="noreferrer">{text.source}</a></div>
        <p>{text.footer}</p>
      </footer>
    </article>
  );
}

export default I18nPage(Landing);
