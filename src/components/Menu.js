import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import './Menu.css';

class Menu extends Component {
  static contextTypes = {
    messages: PropTypes.object
  };

  render() {
    const {
      SINGLE_TYPED,
      DOUBLE_TYPED,
      HOME,
      ATTACK,
      DEFEND
    } = this.context.messages;

    return (
      <nav className="Menu">
        <section>
          <h1>{SINGLE_TYPED}</h1>
          <div className="menuItem">
            <Link to="/quizzes/attackSingle">{ATTACK}</Link>
          </div>
          <div className="menuItem">
            <Link to="/quizzes/defendSingle">{DEFEND}</Link>
          </div>
        </section>

        <section className="working">
          <h1>{DOUBLE_TYPED}</h1>
          <div className="menuItem">
            <Link to="/Menu">{ATTACK}</Link>
          </div>
          <div className="menuItem">
            <Link to="/Menu">{DEFEND}</Link>
          </div>
        </section>

        <footer>
          <Link to="/">{HOME}</Link>
        </footer>
      </nav>
    );
  }
}

export default Menu;
