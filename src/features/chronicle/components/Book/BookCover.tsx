import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../ChronicleBook.module.css';

interface BookCoverProps {
    onStart: () => void;
    onLogin: () => void;
    title?: string;
    subtitle?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
    onStart,
    onLogin,
    title = "Play to Learn",
    subtitle = "Embark on an epic journey of knowledge and adventure."
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.coverContent}>
            <div className={styles.coverDecorations}>
                <div className={styles.cornerDecoration} />
                <div className={styles.cornerDecoration} />
                <div className={styles.cornerDecoration} />
                <div className={styles.cornerDecoration} />
            </div>

            <header className={styles.coverHeader}>
                <h1 className={styles.coverTitle}>{title}</h1>
                <p className={styles.coverSubtitle}>{subtitle}</p>
            </header>

            <div className={styles.coverActions}>
                <button
                    className={`${styles.bookBtn} ${styles.btnPrimary}`}
                    onClick={onStart}
                    data-testid="cover-start-btn"
                >
                    {t('landing.start_game', 'Start New Game')}
                </button>

                <button
                    className={`${styles.bookBtn} ${styles.btnSecondary}`}
                    onClick={onLogin}
                    data-testid="cover-login-btn"
                >
                    {t('landing.login', 'Log In')}
                </button>
            </div>

            <footer className={styles.coverFooter}>
                <span className={styles.editionLabel}>First Edition</span>
            </footer>
        </div>
    );
};
