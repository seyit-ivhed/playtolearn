import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type PuzzleProps, type EquationData } from '../../../../types/adventure.types';
import { validateAnswer } from './EquationEngine';
import styles from './EquationPuzzle.module.css';

const SHAKE_DURATION_MS = 500;
const SUCCESS_DELAY_MS = 2000;

export const EquationPuzzle = ({ data, onSolve, instruction }: PuzzleProps) => {
    const { t } = useTranslation();
    const puzzleData = data as EquationData;

    if (!puzzleData || !puzzleData.equations) {
        console.error('Invalid equation puzzle data');
        return null;
    }

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    const handleChoiceSelect = (value: number) => {
        if (isSolved || isShaking) {
            return;
        }

        setSelectedAnswer(value);

        if (validateAnswer(value, puzzleData.correctAnswer)) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, SUCCESS_DELAY_MS);
        } else {
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
                setSelectedAnswer(null);
            }, SHAKE_DURATION_MS);
        }
    };

    const renderTerm = (term: { symbolIndex: number; coefficient: number }, index: number) => {
        const symbol = puzzleData.symbols[term.symbolIndex];
        const isNegative = term.coefficient < 0;

        return (
            <span key={index} className={styles.term}>
                {index > 0 && (
                    <span className={styles.operator}>
                        {isNegative ? '−' : '+'}
                    </span>
                )}
                <span className={styles.symbolBox} data-testid={`symbol-${term.symbolIndex}`}>
                    {symbol}
                </span>
            </span>
        );
    };

    return (
        <div className={styles.container}>
            <div className={`${styles.equationsArea} ${isShaking ? styles.shake : ''}`}>
                {puzzleData.equations.map((equation, eqIndex) => (
                    <div key={eqIndex} className={styles.equationRow} data-testid={`equation-${eqIndex}`}>
                        <div className={styles.leftSide}>
                            {equation.left.map((term, tIndex) => renderTerm(term, tIndex))}
                        </div>
                        <span className={styles.equals}>=</span>
                        <span className={styles.resultValue}>{equation.right}</span>
                    </div>
                ))}

                <div className={styles.divider} />

                <div className={styles.questionRow} data-testid="equation-question">
                    <span className={styles.symbolBox}>
                        {puzzleData.symbols[puzzleData.targetSymbolIndex]}
                    </span>
                    <span className={styles.equals}>=</span>
                    <span className={styles.questionMark}>?</span>
                </div>
            </div>

            <div className={styles.choicesArea}>
                {puzzleData.choices.map((choice, index) => {
                    const isCorrectChoice = isSolved && choice === puzzleData.correctAnswer;
                    const isWrongChoice = isShaking && choice === selectedAnswer;
                    let choiceClass = styles.choiceButton;
                    if (isCorrectChoice) {
                        choiceClass += ` ${styles.correct}`;
                    }
                    if (isWrongChoice) {
                        choiceClass += ` ${styles.wrong}`;
                    }

                    return (
                        <button
                            key={index}
                            className={choiceClass}
                            onClick={() => handleChoiceSelect(choice)}
                            disabled={isSolved}
                            data-testid={`choice-${index}`}
                        >
                            {choice}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
