import React, { Component } from 'react';
import { Link } from 'react-router'
import './Menu.css';

class Menu extends Component {
  render() {
    return (
      <nav className="Menu">
        <section>
          <h1>Single-typed</h1>
          <div className="menuItem">
            <Link to="/quizzes/attackSingle">Attack</Link>
          </div>
          <div className="menuItem">
            <Link to="/quizzes/defendSingle">Defend</Link>
          </div>
        </section>

        <section className="working">
          <h1>Double-typed</h1>
          <div className="menuItem">
            <Link to="/Menu">Attack</Link>
          </div>
          <div className="menuItem">
            <Link to="/Menu">Defend</Link>
          </div>
        </section>

        <footer>
          <Link to="/">home</Link>
        </footer>
      </nav>
    );
  }
}

export default Menu;
