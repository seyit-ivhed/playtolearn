import { useTranslation } from 'react-i18next';
import styles from '../../pages/CombatPage.module.css';

interface DefeatScreenProps {
    onRetry: () => void;
    onReturn: () => void;
}

export function DefeatScreen({ onRetry, onReturn }: DefeatScreenProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.endScreen} data-testid="defeat-screen">
            <div className={styles.endScreenContent}>
                <h2 data-testid="defeat-title">{t('combat.defeat.title')}</h2>
                <p>{t('combat.defeat.message')}</p>
                <button onClick={onRetry}>{t('combat.defeat.retry')}</button>
                <button onClick={onReturn}>{t('combat.defeat.return')}</button>
            </div>
        </div>
    );
}
