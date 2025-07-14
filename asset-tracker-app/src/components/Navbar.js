import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {{
  return (
    <nav className="Navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/overview">Data Overview</Link>
      <Link to="/add">Add Money</Link>
    </nav>
  );
}}

export default Navbar;
