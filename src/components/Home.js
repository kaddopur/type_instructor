import React, { Component } from 'react';
import { Link } from 'react-router'
import './Home.css';

class Home extends Component {
  render() {
    return (
      <article className="Home">
        <h1>Type Instructor of Pokémon</h1>
        <section className="start">
          <Link to="/menu">Start</Link>
        </section>
        <footer>
          <a href="https://twitter.com/kaddopur" target="_blank">@kaddopur</a>
        </footer>
      </article>
    );
  }
}

export default Home;
