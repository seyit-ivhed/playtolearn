import type { MathProblem } from '../../../types/math.types';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface MathCardFaceProps {
    problem: MathProblem;
    abilityName: string;
    onAnswer: (correct: boolean) => void;
}

export const MathCardFace = ({ problem, abilityName, onAnswer }: MathCardFaceProps) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<number | string | null>(null);

    const handleAnswer = (choice: number | string) => {
        if (selected !== null) return; // Prevent double click
        setSelected(choice);
        const isCorrect = choice === problem.correctAnswer;

        // Small delay to show visual feedback before closing
        setTimeout(() => {
            onAnswer(isCorrect);
        }, 800);
    };

    const getBtnClass = (choice: number | string) => {
        if (selected === null) return 'math-choice-btn';
        if (choice === problem.correctAnswer) return 'math-choice-btn correct';
        if (choice === selected && choice !== problem.correctAnswer) return 'math-choice-btn wrong';
        return 'math-choice-btn dimmed';
    };

    const operationMap = {
        'ADD': '+',
        'SUBTRACT': '-',
        'MULTIPLY': '×',
        'DIVIDE': '÷'
    } as const;

    const formatAnswer = (answer: number | string) => {
        if (typeof answer !== 'string') return answer;

        // Parse "Q R r" format
        const match = answer.match(/^(\d+)\s*R\s*(\d+)$/);
        if (match) {
            return (
                <span>
                    {match[1]}
                    <span className="math-remainder-text">{t('math.remainder')}</span>
                    {match[2]}
                </span>
            );
        }
        return answer;
    };

    return (
        <div className="unit-card-face back">
            <h3 className="math-title">{abilityName}</h3>

            <div className="math-problem-display">
                <span className="operand">{problem.operand1}</span>
                <span className="operator">{operationMap[problem.operation]}</span>
                <span className="operand">{problem.operand2}</span>
                <span className="equals">=</span>
                <span className="question-mark">?</span>
            </div>

            <div className={`math-choices-grid ${typeof problem.correctAnswer === 'string' ? 'single-col' : ''}`}>
                {problem.choices?.map((choice, idx) => (
                    <button
                        key={`${choice}-${idx}`}
                        className={getBtnClass(choice)}
                        onClick={(e) => { e.stopPropagation(); handleAnswer(choice); }}
                    >
                        {formatAnswer(choice)}
                    </button>
                ))}
            </div>
        </div>
    );
};
