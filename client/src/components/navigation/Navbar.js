import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';
import './Navbar.css';

const Navbar = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="navbar">
          <div className="navbar__logo">
            <h1>EventBook</h1>
          </div>
          <nav className="navbar__items">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li onClick={context.logout}>Logout</li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default Navbar;
