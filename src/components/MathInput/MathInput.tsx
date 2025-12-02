import Numpad from './Numpad';
import MultipleChoice from './MultipleChoice';
import styles from './MathInput.module.css';
import { type MathProblem, MathOperation } from '../../types/math.types';

export type InputMode = 'numpad' | 'multiple-choice';

interface MathInputProps {
    problem: MathProblem;
    onSubmit: (answer: number) => void;
    inputMode?: InputMode;
    disabled?: boolean;
}

export default function MathInput({
    problem,
    onSubmit,
    inputMode = 'multiple-choice',
    disabled = false
}: MathInputProps) {
    const getOperationSymbol = (op: MathOperation) => {
        switch (op) {
            case MathOperation.ADD: return '+';
            case MathOperation.SUBTRACT: return '-';
            case MathOperation.MULTIPLY: return '×';
            case MathOperation.DIVIDE: return '÷';
            default: return '?';
        }
    };

    const operationSymbol = getOperationSymbol(problem.operation);

    return (
        <div className={styles.mathInputContainer}>
            <div className={styles.problemDisplay}>
                <div className={styles.equation}>
                    <span className={styles.operand} data-testid="operand1">{problem.operand1}</span>
                    <span className={styles.operator} data-testid="operator">{operationSymbol}</span>
                    <span className={styles.operand} data-testid="operand2">{problem.operand2}</span>
                    <span className={styles.equals}>=</span>
                    <span className={styles.questionMark}>?</span>
                </div>
            </div>

            <div className={styles.inputSection}>
                {inputMode === 'numpad' ? (
                    <Numpad onSubmit={onSubmit} disabled={disabled} />
                ) : (
                    <MultipleChoice
                        choices={problem.choices || []}
                        onSubmit={onSubmit}
                        disabled={disabled}
                    />
                )}
            </div>
        </div>
    );
}
