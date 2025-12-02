import styles from '../../pages/CombatPage.module.css';

interface DefeatScreenProps {
    onRetry: () => void;
    onReturn: () => void;
}

export function DefeatScreen({ onRetry, onReturn }: DefeatScreenProps) {
    return (
        <div className={styles.endScreen} data-testid="defeat-screen">
            <div className={styles.endScreenContent}>
                <h2 data-testid="defeat-title">Defeat 💥</h2>
                <p>Your ship was destroyed!</p>
                <button onClick={onRetry}>Retry</button>
                <button onClick={onReturn}>Return to Missions</button>
            </div>
        </div>
    );
}
