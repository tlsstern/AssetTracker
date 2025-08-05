import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Navbar() {
  return (
    <nav className="Navbar">
      <Link to="/">Dashboard</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/overview">Data Overview</Link>
      <Link to="/add">Manage Assets</Link>
      <button className="btn btn-outline-danger" onClick={() => supabase.auth.signOut()}>Sign Out</button>
    </nav>
  );
}

export default Navbar;