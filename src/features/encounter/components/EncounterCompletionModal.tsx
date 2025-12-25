import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './EncounterCompletionModal.css';

interface EncounterCompletionModalProps {
    result: 'VICTORY' | 'DEFEAT';
    onContinue: () => void;
    difficulty: number;
    isFirstTime: boolean;
    xpReward?: number;
    customMessage?: string;
}

export const EncounterCompletionModal: React.FC<EncounterCompletionModalProps> = ({
    result,
    onContinue,
    difficulty,
    isFirstTime,
    xpReward,
    customMessage
}) => {
    const { t } = useTranslation();

    const isVictory = result === 'VICTORY';

    const [randomIndex] = React.useState(() => Math.floor(Math.random() * 4));

    // Use custom message if provided, otherwise pick a random victory message
    const victoryMessage = useMemo(() => {
        if (customMessage) return customMessage;

        const messages = [
            t('combat.completion.victory_message_1', 'Amazing work! The desert stands silent in awe of your power.'),
            t('combat.completion.victory_message_2', 'Victory! Your math skills are as sharp as a desert sun.'),
            t('combat.completion.victory_message_3', 'Spectacular! The enemy has been defeated. Onward to more adventures!'),
            t('combat.completion.victory_message_4', 'Incredible! You handled that with style and wisdom!')
        ];
        return messages[randomIndex];
    }, [customMessage, t, randomIndex]);

    return (
        <div className="completion-overlay">
            <motion.div
                className={`completion-modal ${isVictory ? 'victory' : 'defeat'}`}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <div className="completion-content">
                    {isVictory && <div className="victory-sparkles"></div>}

                    <motion.div
                        className="completion-banner"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h1>{isVictory ? t('combat.completion.victory_title', 'VICTORY!') : t('combat.completion.defeat_title', 'DEFEAT')}</h1>
                    </motion.div>

                    {isVictory && (
                        <div className="stars-earned arc">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="star-wrapper">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            delay: 0.5 + (i * 0.1),
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Star
                                            size={54}
                                            fill={i < difficulty ? "#FFD700" : "transparent"}
                                            color={i < difficulty ? "#FFD700" : "rgba(255,255,255,0.2)"}
                                            className={i < difficulty ? "star-earned glow" : "star-earned"}
                                        />
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    )}

                    <motion.div
                        className="completion-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <p>
                            {isVictory
                                ? victoryMessage
                                : t('combat.completion.defeat_message', 'Your party has fallen...')}
                        </p>
                    </motion.div>

                    {isVictory && isFirstTime && xpReward !== undefined && (
                        <motion.div
                            className="reward-section"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span className="reward-label">{t('rewards.gained', 'XP Gained:')}</span>
                            <motion.span
                                className="reward-value"
                                initial={{ scale: 1 }}
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                +{xpReward}
                            </motion.span>
                        </motion.div>
                    )}

                    <motion.div
                        className="completion-actions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <button className="completion-btn" onClick={onContinue}>
                            {t('combat.completion.continue_button', 'Continue')}
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};
