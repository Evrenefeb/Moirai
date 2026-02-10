import React, { useState, useEffect, useRef } from 'react';
// CSS dosya yolunun doğruluğundan emin ol (senin attığın yola sadık kaldım)
import '/src/components/CriteriaTable/CriteriaTable.css'; 
// Hook dosya yolunun doğruluğundan emin ol
import { useDraggableScroll } from '../../scripts/useDraggableScroll.js';

function OperationsTable({ criteria, onDataChange }) {
    // --- STATE ---
    const [options, setOptions] = useState([
        { id: Date.now(), name: '', scores: {} }
    ]);

    // --- GRAB AND SCROLL KURULUMU ---
    const tableWrapperRef = useRef(null);
    const { onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDraggableScroll(tableWrapperRef);

    // --- 1. İSİM DEĞİŞİKLİĞİ ve GHOST ROW YÖNETİMİ ---
    const handleNameChange = (id, newName) => {
        // 1. Önce ismi güncelle
        let updatedOptions = options.map(opt => {
            if (opt.id === id) return { ...opt, name: newName };
            return opt;
        });

        // 2. GHOST ROW EKLEME MANTIĞI
        const lastRow = updatedOptions[updatedOptions.length - 1];
        if (lastRow.id === id && newName !== '') {
            updatedOptions.push({ id: Date.now() + 1, name: '', scores: {} });
        }

        // 3. GHOST ROW SİLME MANTIĞI
        if (updatedOptions.length >= 2) {
            const secondToLast = updatedOptions[updatedOptions.length - 2];
            const last = updatedOptions[updatedOptions.length - 1];

            // Sondan ikinci boşalmışsa VE sonuncu da boşsa
            if (secondToLast.name.trim() === '' && last.name.trim() === '') {
                updatedOptions.pop(); // Son elemanı diziden at
            }
        }

        setOptions(updatedOptions);
    };

    // --- 2. PUAN DEĞİŞİKLİĞİ ---
    const handleScoreChange = (optionId, criteriaId, score) => {
        // Puan kontrolü (1-10 arası)
        if (score !== '' && (parseInt(score) > 10 || parseInt(score) < 1)) return;

        const updatedOptions = options.map(opt => {
            if (opt.id === optionId) {
                const newScores = { ...opt.scores, [criteriaId]: score };
                return { ...opt, scores: newScores };
            }
            return opt;
        });
        setOptions(updatedOptions);
    };

    // --- 3. SATIR SİLME FONKSİYONU ---
    const handleDelete = (id) => {
        if (options.length === 1) {
            setOptions([{ id: Date.now(), name: '', scores: {} }]);
            return;
        }
        setOptions(options.filter(o => o.id !== id));
    };

    // --- VERİ GÖNDERME ---
    useEffect(() => {
        if (onDataChange) {
            const validData = options.filter(o => o.name.trim() !== '');
            onDataChange(validData);
        }
    }, [options]);

    return (
        <div className="criteria-container">
            <h3 className='table-title-input' style={{fontFamily: 'Cinzel, serif', color: 'var(--text-main)'}}>
                2. Rate Your Options
            </h3>

            {/* --- BURASI DÜZELTİLDİ: Eventler div'e bağlandı --- */}
            <div 
                className="table-wrapper"
                ref={tableWrapperRef}
                onMouseDown={onMouseDown}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{ cursor: 'grab', overflowX: 'auto' }} 
            >
                <table className="moirai-table">
                    <thead>
                        <tr>
                            {/* Başlıklar */}
                            <th style={{ width: '25%' }}>Candidate</th>

                            {criteria.map((c) => (
                                <th key={c.id} style={{ textAlign: 'center' }}>
                                    {c.name || '(İsimsiz)'}
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                                        {c.weight || 0}x
                                    </div>
                                </th>
                            ))}

                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {options.map((opt, index) => (
                            <tr key={opt.id} className={index === options.length - 1 ? 'ghost-row' : ''}>

                                {/* 1. İsim Input */}
                                <td>
                                    <input
                                        type="text"
                                        placeholder="..."
                                        value={opt.name}
                                        onChange={(e) => handleNameChange(opt.id, e.target.value)}
                                        className="transparent-input" />
                                </td>

                                {/* 2. Puanlar */}
                                {criteria.map((c) => (
                                    <td key={c.id}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="-"
                                            className="transparent-input center-text"
                                            value={opt.scores[c.id] || ''}
                                            onChange={(e) => handleScoreChange(opt.id, c.id, e.target.value)} />
                                    </td>
                                ))}

                                {/* 3. Silme Butonu */}
                                <td className="action-cell">
                                    {index !== options.length - 1 && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(opt.id)}
                                        >
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
}

export default OperationsTable;