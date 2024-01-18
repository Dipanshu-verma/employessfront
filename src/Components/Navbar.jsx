import React from 'react'
import "../App.css"
import { Link } from 'react-router-dom';
const Navbar = () => {
  return (
    <nav className="navbar">
    <div className="logo">EMS</div>
    <ul className="nav-list">
    <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
    </ul>
  </nav>
  )
}

export default Navbar