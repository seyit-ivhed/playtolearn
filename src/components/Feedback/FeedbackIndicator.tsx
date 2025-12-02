import styles from './FeedbackIndicator.module.css';

export type FeedbackState = 'correct' | 'incorrect' | 'pending' | 'neutral';

interface FeedbackIndicatorProps {
    state: FeedbackState;
    message?: string;
}

export default function FeedbackIndicator({
    state,
    message
}: FeedbackIndicatorProps) {
    if (state === 'neutral') {
        return null;
    }

    const getIcon = () => {
        switch (state) {
            case 'correct':
                return '⭐';
            case 'incorrect':
                return '💫';
            case 'pending':
                return '🚀';
            default:
                return '';
        }
    };

    const getDefaultMessage = () => {
        switch (state) {
            case 'correct':
                return 'Awesome! You got it!';
            case 'incorrect':
                return 'Not quite! Try again!';
            case 'pending':
                return 'Thinking...';
            default:
                return '';
        }
    };

    return (
        <div className={`${styles.feedbackContainer} ${styles[state]}`}>
            <div className={styles.iconWrapper}>
                <span className={styles.icon}>{getIcon()}</span>
            </div>
            <p className={styles.message}>{message || getDefaultMessage()}</p>
        </div>
    );
}
