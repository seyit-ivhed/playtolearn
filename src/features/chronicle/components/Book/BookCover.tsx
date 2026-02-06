import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../ChronicleBook.module.css';

interface BookCoverProps {
    onStart: () => void;
    onLogin: () => void;
    hasProgress?: boolean;
    title?: string;
    subtitle?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
    onStart,
    onLogin,
    hasProgress = false,
    title,
    subtitle
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.coverContent}>
            <header className={styles.coverHeader}>
                <h1 className={styles.coverTitle}>{title || t('landing.title')}</h1>
            </header>

            <div className={styles.coverActions}>
                <button
                    className={`${styles.bookBtn} ${styles.btnPrimary}`}
                    onClick={onStart}
                    data-testid="cover-start-btn"
                >
                    {hasProgress ? t('landing.continue_journey') : t('landing.start_game')}
                </button>

                <button
                    className={`${styles.bookBtn} ${styles.btnSecondary}`}
                    onClick={onLogin}
                    data-testid="cover-login-btn"
                >
                    {t('landing.login')}
                </button>
            </div>

        </div>
    );
};
