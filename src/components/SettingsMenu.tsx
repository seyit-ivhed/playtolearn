import React, { useState, useRef, useEffect } from 'react';
import { usePlayerStore } from '../stores/player.store';
import { resetGame } from '../utils/store-utils';
import { DebugConsole } from './DebugConsole';
import '../styles/settings.css';

import { useTranslation } from 'react-i18next';

const SettingsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDebugOpen, setIsDebugOpen] = useState(false);
    const { difficulty, setDifficulty, language, setLanguage } = usePlayerStore();
    const { i18n } = useTranslation();
    const menuRef = useRef<HTMLDivElement>(null);

    // Sync language on mount/change
    useEffect(() => {
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language, i18n]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleDifficultyChange = (level: number) => {
        setDifficulty(level as 1 | 2 | 3 | 4 | 5);
    };

    const handleLanguageChange = (lang: 'en' | 'sv') => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetGame();
        }
    };

    const difficultyLabels = {
        1: 'Novice (Age 6)',
        2: 'Apprentice (Age 7)',
        3: 'Adventurer (Age 8)',
        4: 'Hero (Age 9)',
        5: 'Master (Age 10)',
    };

    return (
        <div className="settings-container" ref={menuRef}>
            <button
                className={`settings-button ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Settings"
                data-testid="settings-button"
            >
                ⚙️
            </button>

            {isOpen && (
                <div className="settings-dropdown" data-testid="settings-menu">
                    <div className="settings-section">
                        <h4>Difficulty</h4>
                        <select
                            value={difficulty}
                            onChange={(e) => handleDifficultyChange(Number(e.target.value))}
                            className="settings-select"
                            data-testid="difficulty-select"
                        >
                            {Object.entries(difficultyLabels).map(([level, label]) => (
                                <option key={level} value={level}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="settings-section">
                        <h4>Language</h4>
                        <div className="language-toggle">
                            <button
                                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('en')}
                            >
                                🇬🇧 EN
                            </button>
                            <button
                                className={`lang-btn ${language === 'sv' ? 'active' : ''}`}
                                onClick={() => handleLanguageChange('sv')}
                            >
                                🇸🇪 SV
                            </button>
                        </div>
                    </div>

                    <div className="settings-section">
                        <button
                            className="reset-button"
                            onClick={handleReset}
                            data-testid="reset-button"
                        >
                            Reset Progress
                        </button>
                    </div>

                    <div className="settings-section">
                        <button
                            className="debug-button"
                            onClick={() => { setIsDebugOpen(true); setIsOpen(false); }}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                backgroundColor: '#1e293b',
                                color: '#94a3b8',
                                border: '1px solid #334155',
                                borderRadius: '0.5rem',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            🛠️ Open Debug Console
                        </button>
                    </div>
                </div>
            )}

            {isDebugOpen && (
                <DebugConsole onClose={() => setIsDebugOpen(false)} />
            )}
        </div>
    );
};

export default SettingsMenu;
