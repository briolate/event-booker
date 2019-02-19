import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

const Navbar = props => (
  <header className="navbar">
    <div className="navbar__logo">
      <h1>Event Booker</h1>
    </div>
    <nav className="navbar__items">
      <ul>
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default Navbar;
