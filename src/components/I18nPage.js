import React, { Component } from 'react';

const I18nPage = (ChildComponent) => {
  class WrappedComponent extends Component {
    componentWillReceiveProps(nextProps) {
      this.handleFontSizeChanges(nextProps);
    }

    componentDidMount() {
      this.handleFontSizeChanges(this.props);
    }

    handleFontSizeChanges(props) {
      const { lang = 'en' } = props.params;

      if (lang === 'en') {
        document.documentElement.style.fontSize = "100%"
      } else {
        document.documentElement.style.fontSize = "125%"
      }
    }

    render() {
      return <ChildComponent {...this.props} {...this.state} />;
    }
  }

  return WrappedComponent;
}

export default I18nPage;


