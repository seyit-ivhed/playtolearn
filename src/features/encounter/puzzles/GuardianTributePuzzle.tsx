import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import {
    type GuardianTributePuzzleData,
    type GuardianConstraint,
    GuardianConstraintType,
    validateGuardianConstraint,
    validateGuardianTributeSolution
} from '../../../utils/math/puzzles/guardian-tribute';
import guardianImage from '../../../assets/images/puzzles/guardian-statue.png';

interface GuardianTributePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const GuardianTributePuzzle = ({ data, onSolve }: GuardianTributePuzzleProps) => {
    const { t } = useTranslation();
    const puzzleData = data as GuardianTributePuzzleData;

    // Initialize guardian values to 0
    const [guardianValues, setGuardianValues] = useState<number[]>(
        new Array(puzzleData.guardians.length).fill(0)
    );
    const [isSolved, setIsSolved] = useState(false);

    // Calculate remaining gems
    const totalDistributed = guardianValues.reduce((sum, val) => sum + val, 0);
    const remainingGems = puzzleData.totalGems - totalDistributed;

    // Handle increment/decrement
    const adjustGuardianValue = (guardianIndex: number, delta: number) => {
        if (isSolved) return;

        setGuardianValues(prev => {
            const newValues = [...prev];
            const newValue = Math.max(0, newValues[guardianIndex] + delta);

            // Don't allow going over total gems
            const newTotal = newValues.reduce((sum, val, idx) =>
                idx === guardianIndex ? sum + newValue : sum + val, 0
            );

            if (newTotal > puzzleData.totalGems) return prev;

            newValues[guardianIndex] = newValue;

            // Check if puzzle is solved
            const validation = validateGuardianTributeSolution(newValues, puzzleData);
            if (validation.isValid) {
                setIsSolved(true);
                setTimeout(() => onSolve(), 1500);
            }

            return newValues;
        });
    };

    // Format constraint description
    const getConstraintDescription = (constraint: GuardianConstraint): string => {
        switch (constraint.type) {
            case GuardianConstraintType.EXACT:
                return t('puzzle.guardian_tribute.constraint.exact', 'Needs exactly {{value}} gems', { value: constraint.value });

            case GuardianConstraintType.MULTIPLIER:
                return t('puzzle.guardian_tribute.constraint.multiplier', 'Needs {{multiplier}}× Guardian {{target}}', {
                    multiplier: constraint.multiplier,
                    target: (constraint.targetGuardian ?? 0) + 1
                });

            case GuardianConstraintType.ADDITION:
                const sign = (constraint.value ?? 0) >= 0 ? '+' : '';
                return t('puzzle.guardian_tribute.constraint.addition', 'Needs {{value}} Guardian {{target}}', {
                    value: `${sign}${constraint.value}`,
                    target: (constraint.targetGuardian ?? 0) + 1
                });

            case GuardianConstraintType.RANGE:
                return t('puzzle.guardian_tribute.constraint.range', 'Needs {{min}}-{{max}} gems', {
                    min: constraint.min,
                    max: constraint.max
                });

            case GuardianConstraintType.DIVISIBILITY:
                return t('puzzle.guardian_tribute.constraint.divisibility', 'Needs multiple of {{value}}', { value: constraint.value });

            case GuardianConstraintType.COMPARISON:
                const op = constraint.operator === 'greater' ? '>' : '<';
                return t('puzzle.guardian_tribute.constraint.comparison', 'Needs {{op}} Guardian {{target}}', {
                    op,
                    target: (constraint.targetGuardian ?? 0) + 1
                });

            default:
                return '';
        }
    };

    // Check if constraint is satisfied
    const isConstraintSatisfied = (guardianIndex: number): boolean => {
        return validateGuardianConstraint(
            guardianValues[guardianIndex],
            puzzleData.guardians[guardianIndex].constraint,
            guardianValues
        );
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '1rem' }}>
                    {t('puzzle.guardian_tribute.desc', "Distribute gems among the ancient guardians according to their demands.")}
                </p>
                <div style={{
                    fontSize: '1.5rem',
                    color: remainingGems === 0 ? '#22c55e' : '#fbbf24',
                    fontWeight: 'bold'
                }}>
                    {t('puzzle.guardian_tribute.total_gems', 'Total Gems: {{total}}', { total: puzzleData.totalGems })} |
                    {' '}
                    {t('puzzle.guardian_tribute.remaining_gems', 'Remaining: {{remaining}}', { remaining: remainingGems })}
                </div>
            </div>

            {/* Guardians */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(puzzleData.guardians.length, 3)}, 1fr)`,
                gap: '2rem',
                width: '100%'
            }}>
                {puzzleData.guardians.map((guardian, index) => {
                    const isSatisfied = isConstraintSatisfied(index);
                    const value = guardianValues[index];

                    return (
                        <motion.div
                            key={index}
                            animate={isSolved && isSatisfied ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
                            transition={{ repeat: isSolved ? Infinity : 0, duration: 1.5 }}
                            style={{
                                position: 'relative',
                                background: `url(${guardianImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: `3px solid ${isSatisfied ? '#22c55e' : 'rgba(212, 175, 55, 0.3)'}`,
                                borderRadius: '20px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '400px',
                                boxShadow: isSatisfied ? '0 0 30px rgba(34, 197, 94, 0.4)' : '0 10px 30px rgba(0,0,0,0.5)',
                                transition: 'all 0.3s'
                            }}
                        >
                            {/* Overlay for Readability */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
                                zIndex: 1
                            }} />

                            {/* Content Container */}
                            <div style={{
                                position: 'relative',
                                zIndex: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                height: '100%',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                {/* Guardian Number */}
                                <div style={{
                                    fontSize: '1.2rem',
                                    color: '#d4af37',
                                    fontWeight: 'bold',
                                    fontFamily: 'serif',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                    background: 'rgba(0,0,0,0.4)',
                                    padding: '0.2rem 1rem',
                                    borderRadius: '20px',
                                    border: '1px solid rgba(212, 175, 55, 0.3)'
                                }}>
                                    {t('puzzle.guardian_tribute.guardian_number', 'Guardian {{number}}', { number: index + 1 })}
                                </div>

                                <div style={{ width: '100%' }}>
                                    {/* Constraint Description */}
                                    <div style={{
                                        fontSize: '1rem',
                                        color: '#fff',
                                        fontWeight: '500',
                                        marginBottom: '1rem',
                                        textShadow: '0 2px 4px rgba(0,0,0,1)',
                                        background: 'rgba(0,0,0,0.6)',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        borderLeft: `4px solid ${isSatisfied ? '#22c55e' : '#d4af37'}`
                                    }}>
                                        {getConstraintDescription(guardian.constraint)}
                                    </div>

                                    {/* Value Display */}
                                    <div style={{
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        color: isSatisfied ? '#22c55e' : '#fbbf24',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        textShadow: '0 0 20px rgba(0,0,0,0.9)',
                                        marginBottom: '1rem'
                                    }}>
                                        {value}
                                        {isSatisfied && <span style={{ fontSize: '2rem' }}>✓</span>}
                                        {!isSatisfied && value > 0 && <span style={{ fontSize: '2rem', color: '#ef4444' }}>✗</span>}
                                    </div>

                                    {/* Controls */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <button
                                            onClick={() => adjustGuardianValue(index, -1)}
                                            disabled={isSolved || value === 0}
                                            style={{
                                                padding: '0.5rem 1.5rem',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                color: '#d4af37',
                                                cursor: value === 0 || isSolved ? 'not-allowed' : 'pointer',
                                                opacity: value === 0 || isSolved ? 0.5 : 1,
                                                transition: 'all 0.2s',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => adjustGuardianValue(index, 1)}
                                            disabled={isSolved || remainingGems === 0}
                                            style={{
                                                padding: '0.5rem 1.5rem',
                                                fontSize: '1.5rem',
                                                borderRadius: '12px',
                                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                                background: 'rgba(0, 0, 0, 0.7)',
                                                color: '#d4af37',
                                                cursor: (remainingGems === 0 || isSolved) ? 'not-allowed' : 'pointer',
                                                opacity: (remainingGems === 0 || isSolved) ? 0.5 : 1,
                                                transition: 'all 0.2s',
                                                fontWeight: 'bold',
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            +1
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Success Message */}
            {isSolved && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        fontSize: '1.5rem',
                        color: '#22c55e',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}
                >
                    {t('puzzle.guardian_tribute.success', 'The guardians are satisfied! ✨')}
                </motion.div>
            )}
        </div>
    );
};
