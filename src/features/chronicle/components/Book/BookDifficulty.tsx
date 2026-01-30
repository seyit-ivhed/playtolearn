import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronLeft } from 'lucide-react';
import { getDifficultyExamples } from '../../../../utils/math/difficulty-examples';
import styles from './BookDifficulty.module.css';

interface BookDifficultyProps {
    onSelect: (difficulty: number) => void;
    onBack: () => void;
}

export const BookDifficulty: React.FC<BookDifficultyProps> = ({ onSelect, onBack }) => {
    const { t } = useTranslation();

    const difficulties = [1, 2, 3];

    const getDifficultyLabel = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.apprentice');
            case 2: return t('difficulty.scout');
            case 3: return t('difficulty.adventurer');
            default: return '';
        }
    };

    const getDifficultyDescription = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.desc_1');
            case 2: return t('difficulty.desc_2');
            case 3: return t('difficulty.desc_3');
            default: return '';
        }
    };

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <h2 className={styles.title}>{t('difficulty.select_title', 'Select Math Level')}</h2>
                <p className={styles.subtitle}>{t('difficulty.change_later_subtitle', 'You can always change this in the game')}</p>
            </div>

            <div className={styles.cardsContainer}>
                {difficulties.map((level) => (
                    <div
                        key={level}
                        className={styles.difficultyCard}
                        onClick={() => onSelect(level)}
                        data-testid={`difficulty-option-${level}`}
                    >
                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>{getDifficultyLabel(level)}</span>
                            <div className={styles.stars}>
                                {[...Array(level)].map((_, i) => (
                                    <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                                ))}
                            </div>
                        </div>

                        <p className={styles.description}>
                            {getDifficultyDescription(level)}
                        </p>

                        <div className={styles.examplesContainer}>
                            {getDifficultyExamples(level).slice(0, 3).map((example, i) => (
                                <span key={i} className={styles.exampleTag}>{example}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button className={styles.backBtn} onClick={onBack}>
                <ChevronLeft size={16} />
                {t('common.back', 'Back')}
            </button>

        </div>
    );
};
