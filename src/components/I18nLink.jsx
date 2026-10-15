import { Link } from 'react-router'

function I18nLink(props) {
  const {
    children,
    lang = 'en',
    to
  } = props;

  return (
    <Link to={`/${lang}${to}`}>{children}</Link>
  );
}

export default I18nLink;
