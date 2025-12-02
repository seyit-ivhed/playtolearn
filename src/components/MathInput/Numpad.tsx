import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Numpad.module.css';

interface NumpadProps {
    onSubmit: (answer: number) => void;
    disabled?: boolean;
}

export default function Numpad({ onSubmit, disabled = false }: NumpadProps) {
    const { t } = useTranslation();
    const [value, setValue] = useState<string>('');

    const handleNumberClick = (num: number) => {
        if (disabled) return;
        setValue((prev) => prev + num.toString());
    };

    const handleBackspace = () => {
        if (disabled) return;
        setValue((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        if (disabled) return;
        setValue('');
    };

    const handleSubmit = () => {
        if (disabled || value === '') return;
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            onSubmit(numValue);
            setValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key >= '0' && e.key <= '9') {
            setValue((prev) => prev + e.key);
        } else if (e.key === 'Backspace') {
            setValue((prev) => prev.slice(0, -1));
        } else if (e.key === 'Enter' && value !== '') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            setValue('');
        }
    };

    return (
        <div className={styles.numpadContainer} onKeyDown={handleKeyPress} tabIndex={0}>
            <div className={styles.display}>
                <span className={styles.displayValue}>{value || '0'}</span>
            </div>

            <div className={styles.buttonGrid}>
                {[7, 8, 9].map((num) => (
                    <button
                        key={num}
                        className={styles.numButton}
                        onClick={() => handleNumberClick(num)}
                        disabled={disabled}
                        data-testid={`numpad-${num}`}
                    >
                        {num}
                    </button>
                ))}

                {[4, 5, 6].map((num) => (
                    <button
                        key={num}
                        className={styles.numButton}
                        onClick={() => handleNumberClick(num)}
                        disabled={disabled}
                        data-testid={`numpad-${num}`}
                    >
                        {num}
                    </button>
                ))}

                {[1, 2, 3].map((num) => (
                    <button
                        key={num}
                        className={styles.numButton}
                        onClick={() => handleNumberClick(num)}
                        disabled={disabled}
                        data-testid={`numpad-${num}`}
                    >
                        {num}
                    </button>
                ))}

                <button
                    className={`${styles.actionButton} ${styles.clearButton}`}
                    onClick={handleClear}
                    disabled={disabled}
                    data-testid="numpad-clear"
                >
                    C
                </button>

                <button
                    className={styles.numButton}
                    onClick={() => handleNumberClick(0)}
                    disabled={disabled}
                    data-testid="numpad-0"
                >
                    0
                </button>

                <button
                    className={`${styles.actionButton} ${styles.backspaceButton}`}
                    onClick={handleBackspace}
                    disabled={disabled}
                    data-testid="numpad-backspace"
                >
                    ⌫
                </button>
            </div>

            <button
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={disabled || value === ''}
                data-testid="numpad-submit"
            >
                {t('math.submit_answer')}
            </button>
        </div>
    );
}
