import React, { useState, useEffect, useRef } from 'react';
import '/src/components/CriteriaTable/CriteriaTable.css'; 
import { useDraggableScroll } from '../../scripts/useDraggableScroll.js';

const createEmptyRow = () => ({
    id: crypto.randomUUID(),
    name: '',
    scores: {}
});

const initialDemoOptions = [
    { id: 'demo-opt-1', name: 'Option A', scores: { 'demo-1': '7', 'demo-2': '8', 'demo-3': '9' } },
    { id: 'demo-opt-2', name: 'Option B', scores: { 'demo-1': '9', 'demo-2': '6', 'demo-3': '5' } },
    { id: 'demo-opt-3', name: 'Option C', scores: { 'demo-1': '5', 'demo-2': '9', 'demo-3': '8' } }
];

function OperationsTable({ criteria = [], onDataChange }) {
    const [isDemoMode, setIsDemoMode] = useState(true);
    const [options, setOptions] = useState([createEmptyRow()]);

    const tableWrapperRef = useRef(null);
    const { onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useDraggableScroll(tableWrapperRef);

    // SENKRONİZASYON VE GÜVENLİK MOTORU (Flash ve boşluk bug'ını çözer)
    useEffect(() => {
        if (criteria.length === 0) return;

        const hasDemoCriteria = criteria[0].id.toString().startsWith('demo-');

        if (hasDemoCriteria && isDemoMode) {
            // Eğer gelen kriterler demo ise ve biz hala demo modundaysak, adayları zorla demo yap
            setOptions(initialDemoOptions);
        } else if (!hasDemoCriteria && isDemoMode) {
            // Eğer gelen kriterler gerçek veri ise, demo modundan çık ve tabloyu temizle
            setIsDemoMode(false);
            setOptions([createEmptyRow()]);
        }
    }, [criteria, isDemoMode]);

    // TABLOYA DOKUNULDUĞUNDA SIFIRLAMA
    const handleInteraction = () => {
        if (isDemoMode) {
            setIsDemoMode(false);
            setOptions([createEmptyRow()]);
        }
    };

    // VERİLERİ YUKARI İLETME (Debounce ile)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onDataChange) {
                const validData = options.filter(o => o.name.trim() !== '');
                onDataChange(validData);
            }
        }, 300); 
        return () => clearTimeout(timer);
    }, [options, onDataChange]);

    const handleNameChange = (id, value) => {
        setOptions(prev => {
            const updated = prev.map(opt => opt.id === id ? { ...opt, name: value } : opt);
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
            opt.id === optId ? { ...opt, scores: { ...opt.scores, [critId]: val } } : opt
        ));
    };

    const handleDelete = (id) => {
        setOptions(prev => {
            const filtered = prev.filter(o => o.id !== id);
            return filtered.length === 0 ? [createEmptyRow()] : filtered;
        });
    };

    return (
        <div className="criteria-container" onClick={handleInteraction}>
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
                                <th key={c.id} style={{ textAlign: 'center' }} className={isDemoMode ? 'shadow-text' : ''}>
                                    {c.name || '(İsimsiz)'}
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{c.weight || 0}x</div>
                                </th>
                            ))}
                            <th style={{ width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {options.map((opt, index) => (
                            <tr key={opt.id} className={index === options.length - 1 && !isDemoMode ? 'ghost-row' : ''}>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="..."
                                        value={opt.name}
                                        onChange={(e) => handleNameChange(opt.id, e.target.value)}
                                        onFocus={handleInteraction}
                                        className={`transparent-input ${isDemoMode ? 'shadow-text' : ''}`} 
                                        readOnly={isDemoMode}
                                    />
                                </td>

                                {criteria.map((c) => (
                                    <td key={c.id}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            placeholder="-"
                                            className={`transparent-input center-text ${isDemoMode ? 'shadow-text' : ''}`}
                                            value={opt.scores[c.id] || ''}
                                            onChange={(e) => handleScoreChange(opt.id, c.id, e.target.value)} 
                                            onFocus={handleInteraction}
                                            readOnly={isDemoMode}
                                        />
                                    </td>
                                ))}

                                <td className="action-cell">
                                    {!isDemoMode && index !== options.length - 1 && (
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