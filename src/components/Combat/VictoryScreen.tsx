import styles from '../../pages/CombatPage.module.css';

interface VictoryScreenProps {
    enemyName: string;
    onCollectRewards: () => void;
}

export function VictoryScreen({ enemyName, onCollectRewards }: VictoryScreenProps) {
    return (
        <div className={styles.endScreen} data-testid="victory-screen">
            <div className={styles.endScreenContent}>
                <h2 data-testid="victory-title">Victory! 🎉</h2>
                <p>You defeated the {enemyName}!</p>
                <button onClick={onCollectRewards} data-testid="collect-rewards-button">
                    Collect Rewards
                </button>
            </div>
        </div>
    );
}
