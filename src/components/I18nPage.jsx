import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import messages from '../lib/messages.js';
import { normalizeLanguage } from '../lib/routes.ts';

const I18nPage = (ChildComponent) => {
  function LocalizedPage(props) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const lang = normalizeLanguage(params.lang);

    useEffect(() => {
      document.documentElement.style.fontSize = lang === 'en' ? '100%' : '125%';
      document.documentElement.lang = lang;
      const heading = document.querySelector('main h1');
      document.title = `${heading?.innerText.replace(/\s+/g, ' ').trim() || 'Type Instructor'} | Pokémon`;
      if (!document.querySelector('[role="dialog"]')) heading?.focus({ preventScroll: true });
    }, [lang, location.pathname]);

    return <ChildComponent {...props} params={params} location={location} navigate={navigate}
      messages={messages[lang]} lang={lang} />;
  }

  return LocalizedPage;
};

export default I18nPage;
