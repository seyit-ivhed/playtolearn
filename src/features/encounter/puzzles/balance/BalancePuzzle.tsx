import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PuzzleData } from '../../../../types/adventure.types';
import {
    type BalancePuzzleData,
    type Weight,
    calculateTotalWeight,
    validateBalance
} from './BalanceEngine';
import styles from './BalancePuzzle.module.css';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

interface BalancePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
    instruction?: string;
}

const GREEK_RUNES = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ'];

export const BalancePuzzle = ({ data, onSolve, instruction }: BalancePuzzleProps) => {
    const { t } = useTranslation();
    const initialData = data as BalancePuzzleData;

    const [leftStack, setLeftStack] = useState<Weight[]>(initialData.leftStack);
    const [rightStack, setRightStack] = useState<Weight[]>(initialData.rightStack);
    const [isSolved, setIsSolved] = useState(false);

    const leftRunes = GREEK_RUNES.slice(0, 6);
    const rightRunes = GREEK_RUNES.slice(6, 12);

    const handleRemoveWeight = (side: 'left' | 'right', weightId: string) => {
        if (isSolved) {
            return;
        }

        if (side === 'left') {
            const next = leftStack.filter(w => w.id !== weightId);
            setLeftStack(next);
            checkSolution(next, rightStack);
        } else {
            const next = rightStack.filter(w => w.id !== weightId);
            setRightStack(next);
            checkSolution(leftStack, next);
        }
    };

    const checkSolution = (l: Weight[], r: Weight[]) => {
        if (validateBalance(l, r)) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 3000);
        }
    };

    const handleReset = () => {
        if (isSolved) {
            return;
        }
        setLeftStack(initialData.leftStack);
        setRightStack(initialData.rightStack);
    };

    const leftTotal = calculateTotalWeight(leftStack);
    const rightTotal = calculateTotalWeight(rightStack);

    // Check if all removable stones are gone
    const hasRemovableStones = [...leftStack, ...rightStack].some(w => !w.isHeavy);

    return (
        <div className={styles.layout}>
            {/* Immersive Background */}
            <div className={styles.backgroundContainer} />
            <div className={styles.vignette} />

            <div className={styles.puzzleWrapper}>
                {/* Gate Runes Overlay */}
                <div className={styles.runesContainer}>
                    <div className={styles.runeColumn}>
                        {leftRunes.map((r, i) => (
                            <span key={i} className={`${styles.rune} ${isSolved ? styles.runeLit : ''}`}>{r}</span>
                        ))}
                    </div>
                    <div className={styles.runeColumn}>
                        {rightRunes.map((r, i) => (
                            <span key={i} className={`${styles.rune} ${isSolved ? styles.runeLit : ''}`}>{r}</span>
                        ))}
                    </div>
                </div>

                {/* Puzzle Content */}
                <div className={styles.puzzleContent}>
                    {/* Instructions */}
                    {instruction && (
                        <div className={styles.puzzleInstruction}>
                            {instruction}
                        </div>
                    )}

                    <div className={styles.platesContainer}>
                        {/* Left Scale Arm */}
                        <div
                            className={`${styles.scaleArm} ${styles.leftArm}`}
                            style={{
                                transform: `translateY(${leftTotal > rightTotal ? '40px' : leftTotal < rightTotal ? '-40px' : '0'})`
                            }}
                        >
                            <div className={styles.chain} />
                            <div className={styles.chain} />
                            <div className={styles.weightStack}>
                                {leftStack.map((weight) => (
                                    <WeightComponent
                                        key={weight.id}
                                        weight={weight}
                                        side="left"
                                        onRemove={handleRemoveWeight}
                                        disabled={isSolved}
                                    />
                                ))}
                            </div>
                            <div className={styles.plateInfo}>
                                {leftTotal}
                            </div>
                        </div>

                        {/* Right Scale Arm */}
                        <div
                            className={`${styles.scaleArm} ${styles.rightArm}`}
                            style={{
                                transform: `translateY(${rightTotal > leftTotal ? '40px' : rightTotal < leftTotal ? '-40px' : '0'})`
                            }}
                        >
                            <div className={styles.chain} />
                            <div className={styles.chain} />
                            <div className={styles.weightStack}>
                                {rightStack.map((weight) => (
                                    <WeightComponent
                                        key={weight.id}
                                        weight={weight}
                                        side="right"
                                        onRemove={handleRemoveWeight}
                                        disabled={isSolved}
                                    />
                                ))}
                            </div>
                            <div className={styles.plateInfo}>
                                {rightTotal}
                            </div>
                        </div>
                    </div>

                    {/* Controls/Status */}
                    <div className={styles.controls}>
                        {isSolved ? (
                            <div className={styles.successMessage}>
                                {t('puzzle.success', 'Success! ✨')}
                            </div>
                        ) : (
                            <PrimaryButton
                                onClick={handleReset}
                                data-testid="puzzle-reset-button"
                                variant={!hasRemovableStones ? 'gold' : 'primary'}
                                radiate={!hasRemovableStones}
                            >
                                {t('common.start_over', 'Start Over')}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface WeightComponentProps {
    weight: Weight;
    side: 'left' | 'right';
    onRemove: (side: 'left' | 'right', id: string) => void;
    disabled: boolean;
}

const WeightComponent = ({ weight, side, onRemove, disabled }: WeightComponentProps) => {
    return (
        <div
            className={`${styles.weight} ${weight.isHeavy ? styles.heavyWeight : ''} ${disabled ? styles.disabled : ''} ${styles.weightEntering}`}
            onClick={() => {
                if (!weight.isHeavy && !disabled) {
                    onRemove(side, weight.id);
                }
            }}
        >
            {weight.value}
        </div>
    );
};

