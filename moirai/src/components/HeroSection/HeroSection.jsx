// src/components/HeroSection/HeroSection.jsx
import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container">
      <h1 className="hero-title">Weighted Decision Matrix</h1>
      <p className="hero-description">
        A systematic approach to complex decisions. Define your evaluation criteria, assign relative weights, and score your candidates to generate an objective, data-driven ranking.
      </p>

      <div className="hero-steps">
        <div className="hero-step">
          <span className="step-number">01</span>
          <span className="step-text">Set Criteria</span>
        </div>
        
        <span className="step-divider">→</span>
        
        <div className="hero-step">
          <span className="step-number">02</span>
          <span className="step-text">Score Options</span>
        </div>
        
        <span className="step-divider">→</span>
        
        <div className="hero-step">
          <span className="step-number">03</span>
          <span className="step-text">Calculate</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;