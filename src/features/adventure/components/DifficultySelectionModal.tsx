import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, X, ChevronDown } from 'lucide-react';
import './DifficultySelectionModal.css';

interface DifficultySelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (difficulty: number) => void;
    title: string;
    initialDifficulty: number;
}

export const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
    isOpen,
    onClose,
    onStart,
    title,
    initialDifficulty
}) => {
    const { t } = useTranslation();
    const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hoveredDifficulty, setHoveredDifficulty] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const displayDifficulty = hoveredDifficulty ?? selectedDifficulty;

    return (
        <div className="difficulty-modal-overlay">
            <div className="difficulty-modal-content">
                <button className="close-button" onClick={onClose} aria-label="Close">
                    <X size={24} color="#e5c05b" />
                </button>

                <h2 className="modal-title">{title}</h2>

                <div className="difficulty-selection-container">
                    <div
                        className="custom-dropdown"
                        ref={dropdownRef}
                        onMouseEnter={() => !isDropdownOpen && setHoveredDifficulty(selectedDifficulty)}
                        onMouseLeave={() => !isDropdownOpen && setHoveredDifficulty(null)}
                    >
                        <div
                            className={`dropdown-header ${isDropdownOpen ? 'open' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="selected-value">
                                <span className="difficulty-name">{getDifficultyLabel(selectedDifficulty)}</span>
                                <div className="stars-mini">
                                    {[...Array(selectedDifficulty)].map((_, i) => (
                                        <Star key={i} size={24} fill="#FFD700" color="#FFD700" />
                                    ))}
                                </div>
                            </div>
                            <ChevronDown size={20} className={`arrow ${isDropdownOpen ? 'rotated' : ''}`} />
                        </div>

                        {isDropdownOpen && (
                            <div className="dropdown-list">
                                {difficulties.map((level) => (
                                    <div
                                        key={level}
                                        className={`dropdown-item ${selectedDifficulty === level ? 'selected' : ''}`}
                                        onClick={() => {
                                            setSelectedDifficulty(level);
                                            setIsDropdownOpen(false);
                                            setHoveredDifficulty(null);
                                        }}
                                        onMouseEnter={() => setHoveredDifficulty(level)}
                                        onMouseLeave={() => setHoveredDifficulty(null)}
                                    >
                                        <div className="item-content">
                                            <span className="item-label">{getDifficultyLabel(level)}</span>
                                            <div className="item-stars">
                                                {[...Array(level)].map((_, i) => (
                                                    <Star key={i} size={20} fill="#FFD700" color="#FFD700" />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="difficulty-explanation-box">
                        <p className="explanation-text">
                            {getDifficultyDescription(displayDifficulty)}
                        </p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="start-button" onClick={() => onStart(selectedDifficulty)}>
                        {t('difficulty.start', 'Start')}
                    </button>
                </div>
            </div>
        </div>
    );
};
