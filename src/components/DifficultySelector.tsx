import { useState, useEffect } from 'react';
import { usePlayerStore } from '../stores/player.store';
import type { DifficultyLevel } from '../types/math.types';

const DIFFICULTY_CONFIG: Record<DifficultyLevel, { label: string; title: string, description: string }> = {
    1: { label: 'Age 6', title: 'Apprentice', description: 'Addition & subtraction up to 10.' },
    2: { label: 'Age 7', title: 'Scout', description: 'Addition & subtraction up to 20. Simple multiplication.' },
    3: { label: 'Age 8', title: 'Adventurer', description: 'Numbers up to 50. Multiplication tables.' },
    4: { label: 'Age 9', title: 'Veteran', description: 'Numbers up to 100. Challenging multiplication.' },
    5: { label: 'Age 10', title: 'Master', description: 'Mixed operations including division.' },
};

export const DifficultySelector = () => {
    const { difficulty, setDifficulty } = usePlayerStore();
    const [selected, setSelected] = useState<DifficultyLevel>(difficulty);

    // Sync with store on mount
    useEffect(() => {
        setSelected(difficulty);
    }, [difficulty]);

    const handleSelect = (level: DifficultyLevel) => {
        setSelected(level);
        setDifficulty(level);
    };

    return (
        <div className="difficulty-selector-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
            <h3 style={{ margin: 0, color: '#e0e0e0', fontSize: '1.2rem' }}>Proficiency Level</h3>

            <div className="levels-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.5rem'
            }}>
                {(Object.keys(DIFFICULTY_CONFIG) as unknown as DifficultyLevel[]).map((level) => {
                    const config = DIFFICULTY_CONFIG[level];
                    const isSelected = selected === Number(level);

                    return (
                        <button
                            key={level}
                            onClick={() => handleSelect(Number(level) as DifficultyLevel)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '1rem',
                                background: isSelected ? 'rgba(100, 108, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                                border: isSelected ? '2px solid #646cff' : '2px solid transparent',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                color: isSelected ? '#fff' : '#aaa'
                            }}
                        >
                            <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>{config.label}</span>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                margin: '0.25rem 0',
                                color: isSelected ? '#fff' : '#ddd'
                            }}>
                                {config.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="description-box" style={{
                textAlign: 'center',
                minHeight: '1.5em',
                color: '#aaa',
                fontSize: '0.9rem',
                fontStyle: 'italic'
            }}>
                {DIFFICULTY_CONFIG[selected].description}
            </div>
        </div>
    );
};
