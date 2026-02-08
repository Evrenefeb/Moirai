import React from 'react';
// import logo from '../assets/Moirai_logo.png'
import './MoiraiNavbar.css';

const MoiraiNavbar = () => {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <a href="/" className="navbar-brand">
        <span>Moirai</span>
        
      </a>

      {/* Right: Links */}
      <div className="navbar-links">
        <a href="#about">About Us</a>
        <a href="https://https://github.com/Evrenefeb/Moirai.com/" target="_blank" rel="noreferrer">
          Docs ↗
        </a>
      </div>
      
    </nav>
  );
};

export default MoiraiNavbar;