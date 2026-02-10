import React, { useState, useEffect } from 'react';
import './CriteriaTable.css'; 

const CriteriaTable = ({ onDataChange }) => {
  const [rows, setRows] = useState([
    { id: Date.now(), name: '', weight: '' } //garanti satır
  ]);
  
  const [tableName, setTableName] = useState('');

  //INPUT DEĞİŞİKLİĞİ VE GHOST ROW MANTIĞI
  const handleChange = (id, field, value) => {
  // --- KURAL 1: AĞIRLIK KONTROLÜ (Max 10) ---
  if (field === 'weight') {
    // Eğer kullanıcı boş bırakırsa izin ver (silme işlemi için)
    if (value === '') {
      // Devam et, aşağıda işlensin
    } 
    // Eğer sayı 10'dan büyükse veya 1'den küçükse (ve boş değilse) İŞLEMİ İPTAL ET
    else if (parseInt(value) > 10 || parseInt(value) < 1) {
      return; // Fonksiyondan çık, state'i güncelleme (Böylece ekrana yansımaz)
    }
  }

  // --- MEVCUT GÜNCELLEME MANTIĞI ---
  const updatedRows = rows.map((row) => {
    if (row.id === id) {
      return { ...row, [field]: value };
    }
    return row;
  });

  // --- KURAL 2: MAKSİMUM SATIR SAYISI (Max 10) ---
  // Ghost Row Mantığı:
  const lastRow = updatedRows[updatedRows.length - 1];
  
  // Eğer son satıra yazılıyorsa VE henüz 10 satıra ulaşmadıysak yeni satır aç
  if (lastRow.id === id && value !== '') {
    if (updatedRows.length < 10) {
      updatedRows.push({ id: Date.now() + 1, name: '', weight: '' });
    }
  }

  setRows(updatedRows);
};

  
  const handleDelete = (id) => {
    // Tek satır kaldıysa sildirmeyelim, içi boşalsın yeter
    if (rows.length === 1) {
      setRows([{ id: Date.now(), name: '', weight: '' }]);
      return;
    }
    const filteredRows = rows.filter(row => row.id !== id);
    setRows(filteredRows);
  };

  // Tablo verilerini gondermek için bunu kullanıcaz
  useEffect(() => {
    // Sadece dolu satırları filtreleyip gönderelim (Ghost row gitmesin)
    const validData = rows.filter(r => r.name.trim() !== '' || r.weight !== '');
    if (onDataChange) {
      onDataChange({ tableName, data: validData });
    }
  }, [rows, tableName]);

  return (
    <div className="criteria-container">
      {/* Tablo İsmi Girişi */}
      <input 
        type="text" 
        className="table-title-input" 
        placeholder="Table Name (ex: New PC)"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />

      <div className="table-wrapper">
        <table className="moirai-table">
          <thead>
            <tr>
              <th>criteria name (N)</th>
              <th style={{ width: '120px' }}>importance (1-10)</th>
              <th style={{ width: '50px' }}></th> {/* Silme butonu için */}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={index === rows.length - 1 ? 'ghost-row' : ''}>
                <td>
                  <input
                    type="text"
                    placeholder="New criteria..."
                    value={row.name}
                    onChange={(e) => handleChange(row.id, 'name', e.target.value)}
                    className="transparent-input"
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
                    className="transparent-input center-text"
                  />
                </td>
                <td className="action-cell">
                  {}
                  {index !== rows.length - 1 && (
                    <button onClick={() => handleDelete(row.id)} className="delete-btn">
                      ✕
                    </button>
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