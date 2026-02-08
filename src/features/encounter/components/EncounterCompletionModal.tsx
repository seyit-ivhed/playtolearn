import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { GameParticles } from '@/components/ui/GameParticles';
import { VICTORY_CONFETTI_OPTIONS } from '@/components/ui/GameParticles.constants';
import './EncounterCompletionModal.css';

interface EncounterCompletionModalProps {
    result: 'VICTORY' | 'DEFEAT';
    onContinue: () => void;
    difficulty: number;
}

export const EncounterCompletionModal: React.FC<EncounterCompletionModalProps> = ({
    result,
    onContinue,
    difficulty,
}) => {
    const { t } = useTranslation();

    const isVictory = result === 'VICTORY';

    return (
        <div className={`completion-overlay ${isVictory ? 'victory' : 'defeat'}`}>
            {isVictory && (
                <div className="particles-backdrop">
                    <GameParticles options={VICTORY_CONFETTI_OPTIONS} />
                </div>
            )}

            <div className="completion-content">
                <motion.div
                    className={`completion-banner ${isVictory ? 'victory' : 'defeat'}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                    <h1>{isVictory ? t('combat.completion.victory_title', 'VICTORY!') : t('combat.completion.defeat_title', 'DEFEAT')}</h1>
                </motion.div>

                {isVictory && (
                    <div className="stars-row">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="star-wrapper">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        delay: 0.5 + (i * 0.15),
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20
                                    }}
                                >
                                    <Star
                                        size={96}
                                        fill={i < difficulty ? "var(--color-brand-accent)" : "transparent"}
                                        color={i < difficulty ? "var(--color-brand-accent)" : "rgba(255,255,255,0.2)"}
                                        className={i < difficulty ? "star-earned glow" : "star-earned"}
                                    />
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}

                <motion.div
                    className="completion-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                >
                    <PrimaryButton
                        className="completion-btn-primary"
                        onClick={onContinue}
                    >
                        {t('combat.completion.continue_button', 'Continue')}
                    </PrimaryButton>
                </motion.div>
            </div>
        </div>
    );
};
