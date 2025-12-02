import { useTranslation } from 'react-i18next';
import styles from '../../pages/CombatPage.module.css';

interface VictoryScreenProps {
    enemyName: string;
    onCollectRewards: () => void;
}

export function VictoryScreen({ enemyName, onCollectRewards }: VictoryScreenProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.endScreen} data-testid="victory-screen">
            <div className={styles.endScreenContent}>
                <h2 data-testid="victory-title">{t('combat.victory.title')}</h2>
                <p>{t('combat.victory.message', { enemyName })}</p>
                <button onClick={onCollectRewards} data-testid="collect-rewards-button">
                    {t('combat.victory.collect_rewards')}
                </button>
            </div>
        </div>
    );
}
