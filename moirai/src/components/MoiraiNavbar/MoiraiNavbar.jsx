import React from 'react'; 
import './MoiraiNavbar.css';
import github from '/src/assets/github.svg'

// IMPORT THE HOOK
import { useTheme } from '/src/ThemeContext'; 

const MoiraiNavbar = () => {
  // USE THE GLOBAL STATE instead of local state from ThemeContext.jsx important for the light mode dark mode
  const { theme, switchTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="navbar-brand">
          <span>Moirai</span>
        </a>


        <button className="theme-badge" 
        onClick={() => switchTheme(theme === 'light' ? 'dark' : 'light')}
        >
        <span className="theme-icon">  {theme === 'light' ? '📜' : '🌑'} </span>
        
        </button>
      </div>

      <div className="navbar-links">
        <a href="#about">About Us</a>
        <a href="https://github.com/Evrenefeb/Moirai" target="_blank" rel="noreferrer" className="github-link">
          {/* Bu SVG kodu GitHub logosunun çizimidir */}
          <svg 
          viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            stroke="currentColor" 
            strokeWidth="2" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default MoiraiNavbar;