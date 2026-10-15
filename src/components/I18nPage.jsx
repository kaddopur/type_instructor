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
    }, [lang]);

    return <ChildComponent {...props} params={params} location={location} navigate={navigate}
      messages={messages[lang]} lang={lang} />;
  }

  return LocalizedPage;
};

export default I18nPage;
