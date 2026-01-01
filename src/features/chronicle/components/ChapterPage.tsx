import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Adventure } from '../../../types/adventure.types';
import { AdventureStatus } from '../../../types/adventure.types';
import { getAdventureIllustration } from '../../../data/adventure-assets';
import './ChapterPage.css';

interface ChapterPageProps {
    adventure: Adventure;
    status: AdventureStatus;
    stars: number;
    onBegin: (id: string) => void;
    onReplay: (id: string) => void;
    onNext: () => void;
    onPrev: () => void;
    canNext: boolean;
    canPrev: boolean;
    currentPage: number;
    totalPages: number;
    isJustCompleted?: boolean;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({
    adventure,
    status,
    stars,
    onBegin,
    onReplay,
    onNext,
    onPrev,
    canNext,
    canPrev,

    currentPage,
    totalPages,
    isJustCompleted
}) => {
    const { t } = useTranslation();
    const isPrologue = adventure.id === 'prologue';
    const isLocked = !isPrologue && status === AdventureStatus.LOCKED;
    const isCompleted = status === AdventureStatus.COMPLETED;
    const illustration = getAdventureIllustration(adventure.id);

    return (
        <div className={`chapter-page ${isLocked ? 'locked' : ''}`} data-testid="chapter-page">
            <div className="chapter-header">
                <span className="chapter-number">
                    {isPrologue ? t('adventures.prologue.prefix') : `${t('chronicle.chapter_prefix')} ${adventure.id}`}
                </span>
                <h2 className="chapter-title" data-testid="chapter-title">
                    {t(`adventures.${adventure.id}.title`, adventure.title || '???')}
                </h2>
            </div>



            <div className="chapter-content">
                <motion.div
                    className="illustration-container"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {illustration ? (
                        <img
                            src={illustration}
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
                            : t(`adventures.${adventure.id}.story_hook`, adventure.storyHook || adventure.description || '')
                        }
                    </p>


                    {!isPrologue && (
                        <div className="completion-stats" style={{ visibility: isCompleted ? 'visible' : 'hidden' }}>
                            <div className="stars-earned">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={`star ${i < stars ? 'filled' : ''}`}>⭐</span>
                                ))}
                            </div>
                            <motion.div
                                className="wax-seal"
                                initial={isJustCompleted ? { scale: 3, opacity: 0 } : { scale: 1, opacity: 1 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                    delay: 0.2
                                }}
                            >
                                {t('chronicle.completed')}
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>

            <div className="chapter-footer">
                <div className="footer-controls">

                    <motion.button
                        className="nav-btn"
                        onClick={onPrev}
                        disabled={!canPrev}
                        whileHover={canPrev ? { scale: 1.1 } : {}}
                        whileTap={canPrev ? { scale: 0.9 } : {}}
                        data-testid="prev-page-btn"
                        aria-label="Previous Page"
                    >
                        <ChevronLeft size={64} />
                    </motion.button>

                    <div className="main-action">
                        {isPrologue ? (
                            <motion.button
                                className="book-btn begin-btn"
                                onClick={onNext}
                                data-testid="next-chapter-btn"
                                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(74, 55, 33, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('chronicle.next_chapter', 'Next Chapter')}
                            </motion.button>
                        ) : !isLocked ? (
                            isJustCompleted && canNext ? (
                                <motion.button
                                    className="book-btn begin-btn"
                                    onClick={onNext}
                                    data-testid="next-chapter-btn"
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(74, 55, 33, 0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {t('chronicle.next_chapter', 'Next Chapter')}
                                </motion.button>
                            ) : isCompleted ? (
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

                    <motion.button
                        className="nav-btn"
                        onClick={onNext}
                        disabled={!canNext}
                        whileHover={canNext ? { scale: 1.1 } : {}}
                        whileTap={canNext ? { scale: 0.9 } : {}}
                        data-testid="next-page-btn"
                        aria-label="Next Page"
                    >
                        <ChevronRight size={64} />
                    </motion.button>
                </div>


                <div className="page-indicator-bottom" data-testid="page-indicator">
                    {t('chronicle.page_x_of_y', { current: currentPage, total: totalPages })}
                </div>
            </div>



        </div >
    );
};
