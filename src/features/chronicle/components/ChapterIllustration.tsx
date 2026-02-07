import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ChapterIllustrationProps {
    illustration: string | null | undefined;
    adventureTitle: string;
    isLocked: boolean | undefined;
    stars: number;
    isCompleted: boolean;
    isJustCompleted?: boolean;
}

export const ChapterIllustration: React.FC<ChapterIllustrationProps> = ({
    illustration,
    adventureTitle,
    isLocked,
    stars,
    isCompleted,
    isJustCompleted
}) => {
    const { t } = useTranslation();

    return (
        <div className="illustration-container">
            {illustration ? (
                <img
                    src={illustration}
                    alt={adventureTitle}
                    className="chapter-illustration"
                />
            ) : (
                <div className="illustration-placeholder" />
            )}
            {isLocked && <div className="lock-icon">🔒</div>}

            {isCompleted && (
                <div className="completion-stats-overlay">
                    <div className="stars-earned small">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
                        ))}
                    </div>
                    <motion.div
                        className="wax-seal-small"
                        initial={isJustCompleted ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring", stiffness: 300, damping: 20, delay: 0.2
                        }}
                    >
                        {t('chronicle.completed')}
                    </motion.div>
                </div>
            )}
        </div>
    );
};
