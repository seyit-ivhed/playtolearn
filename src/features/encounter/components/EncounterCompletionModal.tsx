import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './EncounterCompletionModal.css';

interface EncounterCompletionModalProps {
    result: 'VICTORY' | 'DEFEAT';
    onContinue: () => void;
}

export const EncounterCompletionModal: React.FC<EncounterCompletionModalProps> = ({ result, onContinue }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Slight delay to allow for entrance animation
        setIsVisible(true);
    }, []);

    const isVictory = result === 'VICTORY';

    // Dynamic classes
    const modalClass = `completion-modal ${isVictory ? 'victory' : 'defeat'} ${isVisible ? 'visible' : ''}`;

    return (
        <div className="completion-overlay">
            <div className={modalClass}>
                <div className="completion-content">
                    <div className="completion-banner">
                        <h1>{isVictory ? t('combat.completion.victory_title', 'VICTORY!') : t('combat.completion.defeat_title', 'DEFEAT')}</h1>
                    </div>

                    <div className="completion-message">
                        <p>
                            {isVictory
                                ? t('combat.completion.victory_message', 'The enemy has been vanquished!')
                                : t('combat.completion.defeat_message', 'Your party has fallen...')}
                        </p>
                    </div>

                    <div className="completion-actions">
                        <button className="completion-btn" onClick={onContinue}>
                            {t('combat.completion.continue_button', 'Continue')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
