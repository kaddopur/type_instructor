import { Link } from 'react-router';

export default function I18nLink({ children, lang = 'en', to, ...props }) {
  // Explicit tabindex also includes links in WebKit's default keyboard navigation.
  return (
    <Link tabIndex={0} lang={lang} to={`/${lang}${to}`} {...props}>
      {children}
    </Link>
  );
}
