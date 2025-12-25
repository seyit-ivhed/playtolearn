import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, X } from 'lucide-react';
import './DifficultySelectionModal.css';

interface DifficultySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (difficulty: number) => void;
    title: string;
    initialDifficulty: number;
    currentStars?: number;
}

export const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
    isOpen,
    onClose,
    onStart,
    title,
    initialDifficulty,
    currentStars = 0
}) => {
    const { t } = useTranslation();
    const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);

    if (!isOpen) return null;

    const difficulties = [1, 2, 3, 4, 5];

    const getDifficultyLabel = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.apprentice', 'Apprentice');
            case 2: return t('difficulty.scout', 'Scout');
            case 3: return t('difficulty.adventurer', 'Adventurer');
            case 4: return t('difficulty.veteran', 'Veteran');
            case 5: return t('difficulty.master', 'Master');
            default: return '';
        }
    };

    const getDifficultyDescription = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.desc_1', 'Basic addition (0-10)');
            case 2: return t('difficulty.desc_2', 'Addition and basic subtraction');
            case 3: return t('difficulty.desc_3', 'Multiplication and harder arithmetic');
            case 4: return t('difficulty.desc_4', 'Division and multi-digit numbers');
            case 5: return t('difficulty.desc_5', 'Complex challenges and remainders');
            default: return '';
        }
    };

    return (
        <div className="difficulty-modal-overlay">
            <div className="difficulty-modal-content">
                <button className="close-button" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{title}</h2>

                {currentStars > 0 && (
                    <div className="current-progress">
                        <span>{t('difficulty.best_rank', 'Best Rank')}:</span>
                        <div className="stars-container">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    fill={i < currentStars ? "#FFD700" : "transparent"}
                                    color={i < currentStars ? "#FFD700" : "#666"}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="difficulty-selector">
                    <p>{t('difficulty.select_title', 'Select Math Difficulty')}</p>
                    <div className="difficulty-options">
                        {difficulties.map((level) => (
                            <button
                                key={level}
                                className={`difficulty-option ${selectedDifficulty === level ? 'selected' : ''}`}
                                onClick={() => setSelectedDifficulty(level)}
                            >
                                <div className="stars">
                                    {[...Array(level)].map((_, i) => (
                                        <Star key={i} size={14} fill="#FFD700" color="#FFD700" />
                                    ))}
                                </div>
                                <span className="level-label">{getDifficultyLabel(level)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="difficulty-info">
                    <h3>{getDifficultyLabel(selectedDifficulty)}</h3>
                    <p>{getDifficultyDescription(selectedDifficulty)}</p>
                </div>

                <div className="modal-actions">
                    <button className="start-button" onClick={() => onStart(selectedDifficulty)}>
                        {t('difficulty.start_encounter', 'Start Encounter')}
                    </button>
                </div>
            </div>
        </div>
    );
};
