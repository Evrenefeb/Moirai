import React, { useState, useEffect } from 'react';
import './CriteriaTable.css'; 

const CriteriaTable = ({ onDataChange }) => {
  // 1. DEMO MODU STATE'İ
  const [isDemoMode, setIsDemoMode] = useState(true);

  // 2. BAŞLANGIÇ VERİSİ (3 Shadow Block)
  const [rows, setRows] = useState([
    { id: 'demo-1', name: 'Price', weight: '8' },
    { id: 'demo-2', name: 'Performance', weight: '9' },
    { id: 'demo-3', name: 'Design', weight: '7' }
  ]);
  
  const [tableName, setTableName] = useState('New PC (Example)');

  // 3. TABLOYA DOKUNULDUĞUNDA SIFIRLAMA MANTIĞI
  const handleInteraction = () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setTableName(''); // Başlığı temizle
      setRows([{ id: Date.now(), name: '', weight: '' }]); // Tek boş satıra dön
    }
  };

  const handleChange = (id, field, value) => {
    // --- KURAL 1: AĞIRLIK KONTROLÜ (Max 10) ---
    if (field === 'weight') {
      if (value === '') { 
        // Silmeye izin ver
      } 
      else if (parseInt(value) > 10 || parseInt(value) < 1) {
        return; // Hatalı sayıyı engelle
      }
    }

    const updatedRows = rows.map((row) => {
      if (row.id === id) return { ...row, [field]: value };
      return row;
    });

    // --- KURAL 2: MAKSİMUM SATIR SAYISI VE GHOST ROW ---
    const lastRow = updatedRows[updatedRows.length - 1];
    if (lastRow.id === id && value !== '') {
      if (updatedRows.length < 10) {
        updatedRows.push({ id: Date.now() + 1, name: '', weight: '' });
      }
    }
    setRows(updatedRows);
  };

  const handleDelete = (id) => {
    if (rows.length === 1) {
      setRows([{ id: Date.now(), name: '', weight: '' }]);
      return;
    }
    setRows(rows.filter(row => row.id !== id));
  };

  useEffect(() => {
    const validData = rows.filter(r => r.name.trim() !== '' || r.weight !== '');
    if (onDataChange) {
      onDataChange({ tableName, data: validData });
    }
  }, [rows, tableName]);

  return (
    <div className="criteria-container" onClick={handleInteraction}>
      
      {/* 1. Tablo İsmi Girişi */}
      <input 
        type="text" 
        className={`table-title-input ${isDemoMode ? 'shadow-text' : ''}`} 
        placeholder="Table Name (ex: New PC)"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
        onFocus={handleInteraction}
      />

      {/* YENİ EKLENEN KISIM: Kullanıcıya ne yapması gerektiğini anlatan uyarı */}
      {isDemoMode && (
        <div className="demo-hint-message">
           [ Example Data Active — Click on the table to clear and start ]
        </div>
      )}

      {/* 2. Tablo Gövdesi */}
      <div className="table-wrapper">
        <table className="moirai-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th style={{ width: '120px' }}>Rating</th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={index === rows.length - 1 && !isDemoMode ? 'ghost-row' : ''}>
                <td>
                  <input
                    type="text"
                    placeholder="New criteria..."
                    value={row.name}
                    onChange={(e) => handleChange(row.id, 'name', e.target.value)}
                    onFocus={handleInteraction}
                    className={`transparent-input ${isDemoMode ? 'shadow-text' : ''}`}
                    readOnly={isDemoMode} 
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="-"
                    value={row.weight}
                    onChange={(e) => handleChange(row.id, 'weight', e.target.value)}
                    onFocus={handleInteraction}
                    className={`transparent-input center-text ${isDemoMode ? 'shadow-text' : ''}`}
                    readOnly={isDemoMode}
                  />
                </td>
                <td className="action-cell">
                  {!isDemoMode && index !== rows.length - 1 && (
                    <button onClick={() => handleDelete(row.id)} className="delete-btn">✕</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CriteriaTable;