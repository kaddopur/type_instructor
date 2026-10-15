import React, { Component } from 'react';
import { Link } from 'react-router'

class I18nLink extends Component {
  render() {
    const {
      children,
      lang = 'en',
      to
    } = this.props;

    return (
      <Link to={`/${lang}${to}`}>{children}</Link>
    );
  }
}

export default I18nLink;
