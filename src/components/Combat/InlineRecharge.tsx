import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MathProblem } from '../../types/math.types';
import { MathOperation } from '../../types/math.types';
import styles from './InlineRecharge.module.css';

interface InlineRechargeProps {
    problem: MathProblem;
    onSubmit: (answer: number) => void;
    moduleType: 'attack' | 'defend' | 'special';
}

export function InlineRecharge({ problem, onSubmit, moduleType }: InlineRechargeProps) {
    const { t } = useTranslation();
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

    const getOperationSymbol = (op: MathOperation) => {
        switch (op) {
            case MathOperation.ADD: return '+';
            case MathOperation.SUBTRACT: return '-';
            case MathOperation.MULTIPLY: return '×';
            case MathOperation.DIVIDE: return '÷';
            default: return '?';
        }
    };

    const handleChoiceClick = (choice: number) => {
        setSelectedChoice(choice);
        // Auto-submit on selection for faster flow
        onSubmit(choice);
    };

    const operationSymbol = getOperationSymbol(problem.operation);

    const getModuleColor = () => {
        switch (moduleType) {
            case 'attack': return '#ef4444';
            case 'defend': return '#3b82f6';
            case 'special': return '#a855f7';
            default: return '#22c55e';
        }
    };

    return (
        <div className={styles.container} style={{ '--module-color': getModuleColor() } as React.CSSProperties}>
            <div className={styles.header}>
                <div className={styles.icon}>⚡</div>
                <div className={styles.headerText}>
                    <h3 className={styles.title} data-testid="inline-recharge-title">
                        {t('combat.math.recharge_prompt')}
                    </h3>
                    <div className={styles.equation} data-testid="inline-recharge-equation">
                        <span className={styles.operand}>{problem.operand1}</span>
                        <span className={styles.operator}>{operationSymbol}</span>
                        <span className={styles.operand}>{problem.operand2}</span>
                        <span className={styles.equals}>=</span>
                        <span className={styles.questionMark}>?</span>
                    </div>
                </div>
            </div>

            <div className={styles.choiceGrid}>
                {problem.choices?.map((choice, index) => (
                    <button
                        key={index}
                        className={`${styles.choiceButton} ${selectedChoice === choice ? styles.selected : ''}`}
                        onClick={() => handleChoiceClick(choice)}
                        data-testid={`inline-choice-${index}`}
                    >
                        <span className={styles.choiceLabel}>
                            {String.fromCharCode(65 + index)}
                        </span>
                        <span className={styles.choiceValue}>{choice}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
