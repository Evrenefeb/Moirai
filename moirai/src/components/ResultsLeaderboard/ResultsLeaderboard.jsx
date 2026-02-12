import React, { useState } from 'react';
import './ResultsLeaderboard.css';

const ResultsLeaderboard = ({ results, criteria }) => {
  const [activeTab, setActiveTab] = useState('TOTAL');

  if (!results || results.length === 0) return null;

  // --- 1. SIRALAMA MANTIĞI (GÜNCELLENDİ) ---
  const getSortedData = () => {
    const data = [...results];

    if (activeTab === 'TOTAL') {
      return data.sort((a, b) => b.finalScore - a.finalScore);
    } else {
      // DÜZELTME: Ham puan yerine "Ağırlıklı Puanı" (Contribution) kullanıyoruz
      // breakdown[KriterAdı].contributionValue verisine erişiyoruz
      return data.sort((a, b) => {
        const valA = a.breakdown[activeTab]?.contributionValue || 0;
        const valB = b.breakdown[activeTab]?.contributionValue || 0;
        return valB - valA;
      });
    }
  };

  const sortedResults = getSortedData();

  return (
    <div className="leaderboard-container">
      
      {/* --- SEKMELER (Full Width) --- */}
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'TOTAL' ? 'active' : ''}`}
          onClick={() => setActiveTab('TOTAL')}
        >
          TOTAL
        </button>

        {criteria.map((c) => (
          <button
            key={c.id}
            className={`tab-button ${activeTab === c.name ? 'active' : ''}`}
            onClick={() => setActiveTab(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

     
      <div className="leaderboard-body">
        <h3 className="tab-title">
            {activeTab === 'TOTAL' ? '🏆 Genel Sıralama' : `🎯 ${activeTab} Analizi`}
        </h3>

        <table className="moirai-table leaderboard-table">
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>#</th>
              <th style={{ textAlign: 'left' }}>Aday</th>
              <th style={{ width: '150px', textAlign: 'center' }}>
                {activeTab === 'TOTAL' ? 'Toplam Skor' : 'Ağırlıklı Puan'}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((row, index) => {
              
              let displayScore;
              
              if (activeTab === 'TOTAL') {
                 displayScore = row.finalScore; // 0-10 arası genel ortalama
              } else {
                 // Sadece o kriterin (Puan x Ağırlık) değeri
                 displayScore = row.breakdown[activeTab]?.contributionValue || 0;
              }

              return (
                <tr key={row.id} className={index === 0 ? 'winner-row' : ''}>
                  <td className="rank-cell">{index + 1}</td>
                  <td className="name-cell">
                    {row.name}
                    {index === 0 && <span className="crown-icon">👑</span>}
                  </td>
                  <td className="score-cell">
                    {displayScore} 
                    
                    {activeTab !== 'TOTAL' && (
                        <span style={{fontSize:'0.7em', opacity:0.6, marginLeft:'5px'}}>
                            (Ham: {row.rawScores[activeTab]})
                        </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsLeaderboard;