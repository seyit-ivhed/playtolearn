import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PuzzleData } from '../../../types/adventure.types';
import { validateNextStep, isSequenceComplete, generateStarPositions, type StarPosition } from './SequenceEngine';
import styles from './SequencePuzzle.module.css';

interface SequencePuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const SequencePuzzle = ({ data, onSolve }: SequencePuzzleProps) => {
    const { t } = useTranslation();
    const { options, targetValue, rules } = data;

    // Convert options to simple number array if they are complex objects (though sequence usually assumes numbers)
    const numericOptions = useMemo(() => {
        return options.map(opt => typeof opt === 'number' ? opt : opt.value);
    }, [options]);

    // Generate random positions for these options once
    const positions = useMemo(() => {
        return generateStarPositions(numericOptions.length, 15);
    }, [numericOptions.length]);

    // State
    const [path, setPath] = useState<number[]>([]); // Array of INDICES in numericOptions
    const [wrongSelection, setWrongSelection] = useState<number | null>(null); // Index of wrongly clicked star

    // Reset wrong selection animation after a delay
    useEffect(() => {
        if (wrongSelection !== null) {
            const timer = setTimeout(() => {
                setWrongSelection(null);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [wrongSelection]);

    const handleStarClick = (index: number) => {
        // Prevent clicking already selected stars (unless we want to allow backtracking? Let's keep it simple: strict forward path)
        if (path.includes(index)) return;

        const selectedValue = numericOptions[index];
        const currentValues = path.map(idx => numericOptions[idx]);

        // Validate
        if (validateNextStep(currentValues, selectedValue, rules)) {
            const newPath = [...path, index];
            setPath(newPath);

            // Check win condition
            const newValues = [...currentValues, selectedValue];
            if (isSequenceComplete(newValues, targetValue)) {
                // Determine a slight delay for visual satisfaction?
                setTimeout(() => {
                    onSolve();
                }, 500);
            }
        } else {
            // Trigger wrong animation
            setWrongSelection(index);
        }
    };

    const handleReset = () => {
        setPath([]);
        setWrongSelection(null);
    };

    return (
        <div className={styles.container}>
            <div className={styles.instruction}>
                {t('puzzle.sequence.instruction', 'Connect the stars in order!')}
                {rules && rules.length > 0 && ` (${t(`puzzle.rules.${rules[0]}`, rules[0])})`}
            </div>

            <div className={styles.skyMap}>
                {/* SVG Layer for Drawing Lines */}
                <svg className={styles.connectionsLayer}>
                    {/* Draw lines between connected stars */}
                    {path.map((starIndex, i) => {
                        if (i === 0) return null;
                        const prevStarIndex = path[i - 1];
                        const p1 = positions[prevStarIndex];
                        const p2 = positions[starIndex];

                        return (
                            <line
                                key={`line-${i}`}
                                x1={`${p1.x}%`}
                                y1={`${p1.y}%`}
                                x2={`${p2.x}%`}
                                y2={`${p2.y}%`}
                                className={`${styles.connectionLine} ${styles.active}`}
                            />
                        );
                    })}
                </svg>

                {/* Stars Layer */}
                {numericOptions.map((value, index) => {
                    const pos = positions[index];
                    const isSelected = path.includes(index);
                    const isWrong = wrongSelection === index;

                    return (
                        <div
                            key={index}
                            className={`
                                ${styles.star} 
                                ${isSelected ? styles.selected : ''} 
                                ${isWrong ? styles.wrong : ''}
                            `}
                            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            onClick={() => handleStarClick(index)}
                        >
                            <div className={styles.starContent}>
                                {value}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className={styles.resetButton} onClick={handleReset}>
                {t('puzzle.reset', 'Reset Path')}
            </button>
        </div>
    );
};
