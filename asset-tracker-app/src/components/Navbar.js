import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="Navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/overview">Data Overview</Link>
      <Link to="/add">Manage Assets</Link>
    </nav>
  );
}

export default Navbar;