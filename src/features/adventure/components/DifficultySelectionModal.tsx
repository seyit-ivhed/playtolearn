import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, ChevronDown } from 'lucide-react';
import { FormCloseButton } from '../../../components/ui/FormCloseButton';
import { getDifficultyExamples } from '../../../utils/math/difficulty-examples';
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
    currentStars
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

    const difficulties = [1, 2, 3];

    const getDifficultyLabel = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.apprentice', 'Apprentice (Age 6)');
            case 2: return t('difficulty.scout', 'Scout (Age 7)');
            case 3: return t('difficulty.adventurer', 'Adventurer (Age 8)');
            default: return '';
        }
    };

    const getDifficultyDescription = (level: number) => {
        switch (level) {
            case 1: return t('difficulty.desc_1', 'Addition and subtraction up to 10');
            case 2: return t('difficulty.desc_2', 'Addition and subtraction up to 20, intro to x2');
            case 3: return t('difficulty.desc_3', 'Arithmetic up to 100 and multiplication tables');
            default: return '';
        }
    };


    const displayDifficulty = hoveredDifficulty ?? selectedDifficulty;

    return (
        <div className="difficulty-modal-overlay" data-testid="difficulty-modal">
            <div className="difficulty-modal-content">
                <FormCloseButton onClick={onClose} />

                <h2 className="modal-title">
                    {title}
                    {currentStars !== undefined && currentStars > 0 && (
                        <div className="current-stars-display" style={{ display: 'inline-flex', marginLeft: '10px', verticalAlign: 'middle' }}>
                            {[...Array(currentStars)].map((_, i) => (
                                <Star key={`current-${i}`} size={20} fill="#FFD700" color="#FFD700" />
                            ))}
                        </div>
                    )}
                </h2>

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
                        <div className="explanation-content">
                            <div className="explanation-left">
                                <p className="explanation-text">
                                    {getDifficultyDescription(displayDifficulty)}
                                </p>
                            </div>
                            <div className="explanation-right">
                                <div className="examples-container">
                                    {getDifficultyExamples(displayDifficulty).map((example, index) => (
                                        <div key={index} className="example-tag">
                                            {example}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="start-button" data-testid="difficulty-start-btn" onClick={() => onStart(selectedDifficulty)}>
                        {t('difficulty.start', 'Start')}
                    </button>
                </div>
            </div>
        </div>
    );
};
