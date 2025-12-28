import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';

interface GuardianTributePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const GuardianTributePuzzle = ({ data, onSolve }: GuardianTributePuzzleProps) => {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [attempts, setAttempts] = useState(0);

    const target = data.targetValue;
    const divisor = 3; // Thematic fixed value for 3 Guardians
    const correctAnswer = target / divisor;

    const handleSelect = (option: number) => {
        if (isSolved) return;

        setSelectedOption(option);
        if (option === correctAnswer) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 1000);
        } else {
            setAttempts(prev => prev + 1);
            // Flash red or something
            setTimeout(() => setSelectedOption(null), 1000);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', color: '#fbbf24', marginBottom: '1rem' }}>
                    {t('puzzle.guardian_tribute.title', "The Guardian's Tribute")}
                </h2>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>
                    {t('puzzle.guardian_tribute.desc', "Divide {{total}} Gems equally among the 3 Stone Guardians.", { total: target })}
                </p>
            </div>

            {/* Guardians Visual */}
            <div style={{ display: 'flex', gap: '2rem' }}>
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        animate={isSolved ? { scale: [1, 1.1, 1], y: [0, -10, 0] } : {}}
                        transition={{ repeat: isSolved ? Infinity : 0, duration: 1 }}
                        style={{
                            width: '120px',
                            height: '160px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '2px solid rgba(251, 191, 36, 0.3)',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem'
                        }}
                    >
                        🗿
                        <div style={{ fontSize: '1rem', marginTop: '10px', color: '#fbbf24' }}>
                            {isSolved ? correctAnswer : '?'}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                {data.options.map((opt, idx) => {
                    const val = typeof opt === 'number' ? opt : opt.value;
                    const isCorrect = val === correctAnswer;
                    const isSelected = selectedOption === val;

                    return (
                        <motion.button
                            key={idx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSelect(val)}
                            disabled={isSolved || selectedOption !== null}
                            style={{
                                padding: '1.5rem 2.5rem',
                                fontSize: '1.5rem',
                                borderRadius: '15px',
                                border: '2px solid',
                                borderColor: isSelected ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                                background: isSelected ? (isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {val}
                        </motion.button>
                    );
                })}
            </div>

            {attempts > 0 && !isSolved && (
                <p style={{ color: '#fca5a5' }}>
                    {t('puzzle.incorrect', 'Not quite right. Try again!')}
                </p>
            )}
        </div>
    );
};
