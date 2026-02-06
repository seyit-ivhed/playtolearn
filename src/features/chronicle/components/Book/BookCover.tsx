import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../ChronicleBook.module.css';
import { PrimaryButton } from '../Shared/PrimaryButton';
import { GameParticles } from '../../../../components/ui/GameParticles';
import { BOOK_MAGIC_OPTIONS } from '../../../../components/ui/GameParticles.constants';

interface BookCoverProps {
    onStart: () => void;
    onLogin: () => void;
    hasProgress?: boolean;
    title?: string;
    subtitle?: string;
    isActive?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({
    onStart,
    onLogin,
    hasProgress = false,
    title,
    isActive = true
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.coverContent}>
            <div className={styles.runeGlow} />
            <div style={{
                position: 'absolute',
                width: '200%',
                zIndex: 0,
                pointerEvents: 'none',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.5s ease-out'
            }}>
                <GameParticles options={BOOK_MAGIC_OPTIONS} />
            </div>
            <header className={styles.coverHeader}>
                <h1 className={styles.coverTitle}>{title || t('landing.title')}</h1>
            </header>

            <div className={styles.coverActions}>
                <PrimaryButton
                    className={styles.btnPrimaryOverrides}
                    onClick={onStart}
                    data-testid="cover-start-btn"
                >
                    {hasProgress ? t('landing.continue_journey') : t('landing.start_game')}
                </PrimaryButton>

                <PrimaryButton
                    className={styles.btnSecondary}
                    onClick={onLogin}
                    data-testid="cover-login-btn"
                >
                    {t('landing.login')}
                </PrimaryButton>
            </div>

        </div >
    );
};
