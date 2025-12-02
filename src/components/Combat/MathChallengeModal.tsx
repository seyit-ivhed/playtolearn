import type { MathProblem } from '../../types/math.types';
import MathInput from '../MathInput/MathInput';
import styles from '../../pages/CombatPage.module.css';

interface MathChallengeModalProps {
    isOpen: boolean;
    problem: MathProblem | null;
    onSubmit: (answer: number) => void;
}

export function MathChallengeModal({ isOpen, problem, onSubmit }: MathChallengeModalProps) {
    if (!isOpen || !problem) return null;

    return (
        <div className={styles.mathModal} data-testid="math-modal">
            <div className={styles.mathModalContent}>
                <h3 data-testid="math-modal-title">Solve to Attack!</h3>
                <MathInput
                    problem={problem}
                    onSubmit={onSubmit}
                    inputMode="numpad"
                />
            </div>
        </div>
    );
}
