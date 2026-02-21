import React, { useState, useEffect, useRef } from 'react';
import '/src/components/CriteriaTable/CriteriaTable.css'; 
import { useDraggableScroll } from '../../scripts/useDraggableScroll.js';

const createEmptyRow = () => ({
    id: crypto.randomUUID(),
    name: '',
    scores: {}
});

function OperationsTable({ criteria = [], onDataChange }) {
    const [options, setOptions] = useState([createEmptyRow()]);
    const tableWrapperRef = useRef(null);
    const { onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDraggableScroll(tableWrapperRef);

    // Kritik: Sadece geçerli datayı parent'a iletir
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onDataChange) {
                const validData = options.filter(o => o.name.trim() !== '');
                onDataChange(validData);
            }
        }, 300); // Debounce: Performans için küçük bir gecikme
        return () => clearTimeout(timer);
    }, [options, onDataChange]);

    const handleNameChange = (id, value) => {
        setOptions(prev => {
            const updated = prev.map(opt => opt.id === id ? { ...opt, name: value } : opt);
            
            // Eğer son satır doluyorsa otomatik yeni "hayalet" satır ekle
            const lastRow = updated[updated.length - 1];
            if (lastRow.id === id && value.trim() !== '') {
                return [...updated, createEmptyRow()];
            }
            return updated;
        });
    };

    const handleScoreChange = (optId, critId, val) => {
        if (val !== '') {
            const num = parseInt(val);
            if (isNaN(num) || num < 1 || num > 10) return;
        }

        setOptions(prev => prev.map(opt => 
            opt.id === optId 
                ? { ...opt, scores: { ...opt.scores, [critId]: val } } 
                : opt
        ));
    };

    const handleDelete = (id) => {
        setOptions(prev => {
            const filtered = prev.filter(o => o.id !== id);
            return filtered.length === 0 ? [createEmptyRow()] : filtered;
        });
    };

    return (
        <div className="criteria-container">
            <h3 className='table-title-input' style={{fontFamily: 'Cinzel, serif', color: 'var(--text-main)'}}>
                2. Rate Your Options
            </h3>

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
                            <th style={{ width: '25%' }}>Candidate</th>
                            {criteria.map((c) => (
                                <th key={c.id} style={{ textAlign: 'center' }}>
                                    {c.name || '(N/A)'}
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.weight || 0}x</div>
                                </th>
                            ))}
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {options.map((opt, index) => (
                            <tr key={opt.id} className={index === options.length - 1 ? 'ghost-row' : ''}>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="..."
                                        value={opt.name}
                                        onChange={(e) => handleNameChange(opt.id, e.target.value)}
                                        className="transparent-input" 
                                    />
                                </td>

                                {criteria.map((c) => (
                                    <td key={c.id}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="-"
                                            className="transparent-input center-text"
                                            value={opt.scores[c.id] || ''}
                                            onChange={(e) => handleScoreChange(opt.id, c.id, e.target.value)} 
                                        />
                                    </td>
                                ))}

                                <td className="action-cell">
                                    {index !== options.length - 1 && (
                                        <button className="delete-btn" onClick={() => handleDelete(opt.id)}>✕</button>
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