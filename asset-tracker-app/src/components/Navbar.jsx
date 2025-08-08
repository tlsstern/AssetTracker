import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="Navbar">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/transactions">Transactions</Link>
      <Link to="/dashboard/overview">Data Overview</Link>
      <Link to="/dashboard/add">Manage Assets</Link>
    </nav>
  );
}

export default Navbar;