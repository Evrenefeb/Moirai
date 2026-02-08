import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './color_palette.css';

// IMPORT THE PROVIDER
import { ThemeProvider } from './ThemeContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* WRAP THE APP HERE */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);