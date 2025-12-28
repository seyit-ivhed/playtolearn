import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { PuzzleData } from '../../../types/adventure.types';
import {
    type GuardianTributePuzzleData,
    type GuardianConstraint,
    GuardianConstraintType,
    validateGuardianTributeSolution
} from '../../../utils/math/puzzles/guardian-tribute';
import guardianImage from '../../../assets/images/puzzles/guardian-statue.png';

interface GuardianTributePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

const GUARDIAN_SYMBOLS = ['ᛗ', 'ᛟ', 'ᚦ', 'ᛒ', 'ᚠ'];

const GuardianSymbolBadge = ({ symbol, size = '3.5rem', boxSize = '80px', style = {} }: {
    symbol: string,
    size?: string,
    boxSize?: string,
    style?: React.CSSProperties
}) => (
    <div style={{
        fontSize: size,
        color: '#d4af37',
        fontWeight: 'bold',
        fontFamily: 'serif',
        textShadow: '0 4px 8px rgba(0,0,0,0.9)',
        background: 'rgba(0,0,0,0.6)',
        width: boxSize,
        height: boxSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: '2px solid rgba(212, 175, 55, 0.4)',
        boxShadow: 'inset 0 0 15px rgba(212, 175, 55, 0.2)',
        lineHeight: '1',
        ...style
    }}>
        {symbol}
    </div>
);

export const GuardianTributePuzzle = ({ data, onSolve }: GuardianTributePuzzleProps) => {
    const { t } = useTranslation();
    const puzzleData = data as GuardianTributePuzzleData;

    // Initialize guardian values to 0
    const [guardianValues, setGuardianValues] = useState<number[]>(
        new Array(puzzleData.guardians.length).fill(0)
    );
    const [isSolved, setIsSolved] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);

    // Calculate remaining gems
    const totalDistributed = guardianValues.reduce((sum, val) => sum + val, 0);
    const remainingGems = puzzleData.totalGems - totalDistributed;

    // Handle increment/decrement
    const adjustGuardianValue = (guardianIndex: number, delta: number) => {
        if (isSolved) return;

        // Clear feedback when user starts adjusting again
        setShowFeedback(false);

        setGuardianValues(prev => {
            const newValues = [...prev];
            const newValue = Math.max(0, newValues[guardianIndex] + delta);

            // Don't allow going over total gems
            const newTotal = newValues.reduce((sum, val, idx) =>
                idx === guardianIndex ? sum + newValue : sum + val, 0
            );

            if (newTotal > puzzleData.totalGems) return prev;

            newValues[guardianIndex] = newValue;
            return newValues;
        });
    };

    const handleOffer = () => {
        if (isSolved) return;

        const validation = validateGuardianTributeSolution(guardianValues, puzzleData);
        setShowFeedback(true);

        if (validation.isValid) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 3500);
        }
    };

    // Format constraint description
    const renderConstraint = (constraint: GuardianConstraint) => {
        const targetSymbol = GUARDIAN_SYMBOLS[constraint.targetGuardian ?? 0];
        const Badge = (
            <GuardianSymbolBadge
                symbol={targetSymbol}
                boxSize="40px"
                size="1.5rem"
                style={{ verticalAlign: 'middle', margin: '0 0.25rem' }}
            />
        );

        switch (constraint.type) {
            case GuardianConstraintType.EXACT:
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>{constraint.value}</span>
                    </div>
                );

            case GuardianConstraintType.MULTIPLIER:
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {Badge}
                        <span style={{ fontSize: '1.5rem' }}>× {constraint.multiplier}</span>
                    </div>
                );

            case GuardianConstraintType.ADDITION:
                const sign = (constraint.value ?? 0) >= 0 ? '+' : '';
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {Badge}
                        <span style={{ fontSize: '1.5rem' }}>{sign}{constraint.value}</span>
                    </div>
                );

            case GuardianConstraintType.RANGE:
                return (
                    <>
                        {t('encounter.puzzles.guardian_tribute.constraint.range', { min: constraint.min, max: constraint.max })}
                    </>
                );
            case GuardianConstraintType.HALVE:
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.2rem', color: '#ffd700', fontWeight: 'bold' }}>½</span>
                        {Badge}
                    </div>
                );
            case GuardianConstraintType.COMPARISON:
                const op = constraint.operator === 'greater' ? '>' : '<';
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{op}</span>
                        {Badge}
                    </div>
                );

            default:
                return null;
        }
    };

    // Check if statue has the correct amount of gems according to the solution
    const isStatueCorrect = (guardianIndex: number): boolean => {
        return guardianValues[guardianIndex] === puzzleData.guardians[guardianIndex].solution;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <p style={{
                        fontSize: '1.8rem',
                        color: '#e2e8f0', // Brighter text
                        margin: 0,
                        lineHeight: '1.6',
                        fontFamily: 'serif',
                        letterSpacing: '0.02em'
                    }}>
                        {t('puzzle.guardian_tribute.desc', "Distribute the gems among the statues")}
                    </p>
                </div>
                <div style={{
                    fontSize: '2.5rem',
                    color: totalDistributed === puzzleData.totalGems
                        ? '#22c55e'
                        : (showFeedback && remainingGems > 0 ? '#ef4444' : '#fbbf24'),
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '3rem', // Increased margin to accommodate absolute message
                    textShadow: '0 0 20px rgba(0,0,0,0.5)',
                    position: 'relative' // Anchor for absolute child
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span>💎</span>
                        <span>{totalDistributed} / {puzzleData.totalGems}</span>
                    </div>
                    {showFeedback && !isSolved && remainingGems > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                fontSize: '1.2rem',
                                color: '#ef4444',
                                fontWeight: '500',
                                position: 'absolute',
                                bottom: '-2rem', // Place it in the margin space
                                width: '100%',
                                textAlign: 'center'
                            }}
                        >
                            {t('encounter.puzzles.guardian_tribute.gems_remaining', 'You still have gems to distribute.')}
                        </motion.div>
                    )}
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
                    const isCorrect = isStatueCorrect(index);
                    const value = guardianValues[index];
                    const displayFeedback = showFeedback || isSolved;

                    return (
                        <motion.div
                            key={index}
                            animate={isSolved && isCorrect ? { scale: [1, 1.05, 1], y: [0, -5, 0] } : {}}
                            transition={{ repeat: isSolved ? Infinity : 0, duration: 1.5 }}
                            style={{
                                position: 'relative',
                                background: `url(${guardianImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: `3px solid ${displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : 'rgba(212, 175, 55, 0.3)'}`,
                                borderRadius: '20px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '400px',
                                boxShadow: displayFeedback && isCorrect ? '0 0 30px rgba(34, 197, 94, 0.4)' : '0 10px 30px rgba(0,0,0,0.5)',
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
                                {/* Guardian Symbol Badge */}
                                <GuardianSymbolBadge
                                    symbol={GUARDIAN_SYMBOLS[index]}
                                    style={{ marginTop: '-1rem' }}
                                />

                                <div style={{ width: '100%' }}>
                                    {/* Constraint Description */}
                                    <div style={{
                                        fontSize: '1.4rem',
                                        color: '#fff',
                                        fontWeight: '500',
                                        marginBottom: '1rem',
                                        textShadow: '0 2px 4px rgba(0,0,0,1)',
                                        background: 'rgba(0,0,0,0.6)',
                                        padding: '0.75rem',
                                        borderRadius: '10px',
                                        borderLeft: `4px solid ${displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : '#d4af37'}`
                                    }}>
                                        {renderConstraint(guardian.constraint)}
                                    </div>

                                    {/* Value Display */}
                                    <div style={{
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        color: displayFeedback ? (isCorrect ? '#22c55e' : '#ef4444') : '#fbbf24',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        textShadow: '0 0 20px rgba(0,0,0,0.9)',
                                        marginBottom: '1rem'
                                    }}>
                                        <span>💎</span>
                                        {value}
                                        {displayFeedback && isCorrect && <span style={{ fontSize: '2rem' }}>✓</span>}
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

            {/* Offer Button */}
            {!isSolved && (
                <motion.button
                    whileHover={{ scale: totalDistributed > 0 ? 1.05 : 1 }}
                    whileTap={{ scale: totalDistributed > 0 ? 0.95 : 1 }}
                    onClick={handleOffer}
                    disabled={totalDistributed === 0}
                    style={{
                        marginTop: '1rem',
                        padding: '1rem 3rem',
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: totalDistributed === 0 ? '#64748b' : '#fff',
                        background: totalDistributed === 0
                            ? 'rgba(71, 85, 105, 0.4)'
                            : 'linear-gradient(to bottom, #d4af37 0%, #926239 100%)',
                        border: '2px solid rgba(212, 175, 55, 0.5)',
                        borderRadius: '12px',
                        cursor: totalDistributed === 0 ? 'not-allowed' : 'pointer',
                        boxShadow: totalDistributed === 0 ? 'none' : '0 4px 15px rgba(212, 175, 55, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'serif',
                        transition: 'all 0.3s'
                    }}
                >
                    {t('encounter.puzzles.guardian_tribute.offer', 'Offer Tribute')}
                </motion.button>
            )}



            {/* Success Message */}
            {isSolved && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                        fontSize: '1.5rem',
                        color: '#22c55e',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginTop: '1rem'
                    }}
                >
                    {t('encounter.puzzles.guardian_tribute.success', 'The guardians are satisfied! ✨')}
                </motion.div>
            )}
        </div>
    );
};
