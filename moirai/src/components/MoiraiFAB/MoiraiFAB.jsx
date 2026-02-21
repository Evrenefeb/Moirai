import React, { useState } from 'react';
import './MoiraiFAB.css';

const MoiraiFAB = ({ onSubmit, onReset }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleAction = (actionFunction) => {
    actionFunction(); // İstenen fonksiyonu çalıştır
    setIsOpen(false); // Menüyü kapat
  };

  return (
    <div className={`fab-container ${isOpen ? 'open' : ''}`}>
      
      {/* Ana Mühür Butonu */}
      <button 
        className={`fab-main-btn ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        title="Actions"
      >
        <div className="fab-rings">
          <div className="fab-ring fab-ring-one"></div>
          <div className="fab-ring fab-ring-two"></div>
        </div>
      </button>

      {/* Açılır Menü Tuşları */}
      <div className="fab-actions">
        <button className="fab-action-btn btn-submit" onClick={() => handleAction(onSubmit)}>
           Submit
        </button>
        
        <button className="fab-action-btn btn-reset" onClick={() => handleAction(onReset)}>
           Reset tables
        </button>
      </div>

    </div>
  );
};

export default MoiraiFAB;