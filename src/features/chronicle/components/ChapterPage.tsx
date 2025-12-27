import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Adventure } from '../../../types/adventure.types';
import { AdventureStatus } from '../../../types/adventure.types';
import './ChapterPage.css';

interface ChapterPageProps {
    adventure: Adventure;
    status: AdventureStatus;
    stars: number;
    onBegin: (id: string) => void;
    onReplay: (id: string) => void;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({
    adventure,
    status,
    stars,
    onBegin,
    onReplay
}) => {
    const { t } = useTranslation();
    const isLocked = status === AdventureStatus.LOCKED;
    const isCompleted = status === AdventureStatus.COMPLETED;

    return (
        <div className={`chapter-page ${isLocked ? 'locked' : ''}`} data-testid="chapter-page">
            <div className="chapter-header">
                <span className="chapter-number">{t('chronicle.chapter_prefix')} {adventure.id}</span>
                <h2 className="chapter-title" data-testid="chapter-title">{adventure.title || '???'}</h2>
            </div>



            <div className="chapter-content">
                <motion.div
                    className="illustration-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {adventure.illustration ? (
                        <img
                            src={adventure.illustration}
                            alt={adventure.title}
                            className="chapter-illustration"
                        />
                    ) : (
                        <div className="illustration-placeholder" />
                    )}
                    {isLocked && <div className="lock-icon">🔒</div>}
                </motion.div>

                <div className="chapter-details">
                    <p className="story-hook">
                        {isLocked
                            ? t('chronicle.mystery_path')
                            : (adventure.storyHook || adventure.description)
                        }
                    </p>

                    {!isLocked && (
                        <div className="chapter-meta">
                            <div className="meta-item">
                                <span className="label">{t('chronicle.difficulty')}:</span>
                                <span className="value">{'⭐'.repeat(adventure.difficulty)}</span>
                            </div>
                            <div className="meta-item">
                                <span className="label">{t('chronicle.encounters')}:</span>
                                <span className="value">{adventure.encounters.length}</span>
                            </div>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="completion-stats">
                            <div className="stars-earned">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
                                ))}
                            </div>
                            <div className="wax-seal">{t('chronicle.completed')}</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="chapter-footer">
                {!isLocked ? (
                    isCompleted ? (
                        <motion.button
                            className="book-btn replay-btn"
                            onClick={() => onReplay(adventure.id)}
                            data-testid="replay-chapter-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('chronicle.replay_chapter')}
                        </motion.button>
                    ) : (
                        <motion.button
                            className="book-btn begin-btn"
                            onClick={() => onBegin(adventure.id)}
                            data-testid="begin-chapter-btn"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(74, 55, 33, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('chronicle.begin_chapter')}
                        </motion.button>
                    )
                ) : (
                    <div className="locked-msg" data-testid="chapter-locked-msg">{t('chronicle.locked')}</div>
                )}
            </div>



        </div>
    );
};
