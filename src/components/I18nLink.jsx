import { Link } from 'react-router';

export default function I18nLink({ children, lang = 'en', to, ...props }) {
  return <Link lang={lang} to={`/${lang}${to}`} {...props}>{children}</Link>;
}
