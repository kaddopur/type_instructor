import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import './Home.css';

class Home extends Component {
  static contextTypes = {
    messages: PropTypes.object
  }

  render() {
    return (
      <article className="Home">
        {this.context.messages.FOO}
        <h1>Type Instructor of Pokémon</h1>
        <section className="start">
          <Link to="/menu">{this.context.messages.START}</Link>
        </section>
        <footer>
          <a href="https://twitter.com/kaddopur" target="_blank">@kaddopur</a>
        </footer>
      </article>
    );
  }
}

export default Home;
