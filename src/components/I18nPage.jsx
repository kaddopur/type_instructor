import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';

const I18nPage = (ChildComponent) => {
  function LocalizedPage(props) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { lang = 'en' } = params;

    useEffect(() => {
      document.documentElement.style.fontSize = lang === 'en' ? '100%' : '125%';
      document.documentElement.lang = lang;
    }, [lang]);

    return <ChildComponent {...props} params={params} location={location} navigate={navigate} />;
  }

  return LocalizedPage;
};

export default I18nPage;
