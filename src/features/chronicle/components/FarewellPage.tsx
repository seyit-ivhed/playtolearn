import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import { PrimaryButton } from '../../../components/ui/PrimaryButton';
import styles from './FarewellPage.module.css';

export const FarewellPage: React.FC = () => {
    const { t } = useTranslation();

    const handleStartFresh = () => {
        window.location.href = '/chronicle';
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card} role="main" aria-label={t('farewell.title')}>
                <div className={styles.icon} aria-hidden="true">
                    <Sparkles size={40} />
                </div>
                <h1 className={styles.title}>{t('farewell.title')}</h1>
                <p className={styles.message}>{t('farewell.message')}</p>
                <PrimaryButton
                    onClick={handleStartFresh}
                    data-testid="farewell-start-fresh-btn"
                >
                    {t('farewell.start_fresh')}
                </PrimaryButton>
            </div>
        </div>
    );
};
