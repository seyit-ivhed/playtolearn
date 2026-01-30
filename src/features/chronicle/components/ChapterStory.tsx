import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface ChapterStoryProps {
    adventureId: string;
    adventureStoryHook?: string;
    adventureDescription?: string;
    isLocked: boolean | undefined;
    isCompleted: boolean;
    isJustCompleted?: boolean;
    stars: number;
}

export const ChapterStory: React.FC<ChapterStoryProps> = ({
    adventureId,
    adventureStoryHook,
    adventureDescription,
    isLocked,
    isCompleted,
    isJustCompleted,
    stars
}) => {
    const { t } = useTranslation();

    return (
        <div className="chapter-details">
            <p className="story-hook">
                {isLocked
                    ? t('chronicle.mystery_path')
                    : t(`adventures.${adventureId}.story_hook`, adventureStoryHook || adventureDescription || '')
                }
            </p>

            <div className="completion-stats" style={{ visibility: isCompleted ? 'visible' : 'hidden' }}>
                <div className="stars-earned">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
                    ))}
                </div>
                <motion.div
                    className="wax-seal"
                    initial={isJustCompleted ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring", stiffness: 300, damping: 20, delay: 0.2
                    }}
                >
                    {t('chronicle.completed')}
                </motion.div>
            </div>
        </div>
    );
};
