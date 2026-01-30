import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/game/store';
import { useAuth } from '../../hooks/useAuth';
import { VOLUMES } from '../../data/volumes.data';
import { calculateAdventureStars } from '../../utils/progression.utils';
import { ChapterPage } from './components/ChapterPage';
import { TableOfContents } from './components/TableOfContents';
import { PremiumStoreModal } from '../premium/components/PremiumStoreModal';
import { useChronicleData } from './hooks/useChronicleData';
import { useChronicleNavigation } from './hooks/useChronicleNavigation';
import { useChronicleKeyboardShortcuts } from './hooks/useChronicleKeyboardShortcuts';
import styles from './ChronicleBook.module.css';
import { BookLayout } from './components/Book/BookLayout';
import { BookPage } from './components/Book/BookPage';
import { BookCover } from './components/Book/BookCover';

import { BookLogin } from './components/Book/BookLogin';
import { BookDifficulty } from './components/Book/BookDifficulty';

export const ChronicleBook: React.FC = () => {
    const { t } = useTranslation();
    const { adventureStatuses, isAdventureUnlocked, encounterResults, setEncounterDifficulty } = useGameStore();
    const { isAuthenticated } = useAuth();

    // Check if user has any progress to decide initial state
    const hasAnyProgress = Object.keys(encounterResults).length > 0;
    const shouldShowCover = !isAuthenticated && !hasAnyProgress;

    // UI State
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [bookState, setBookState] = useState<'COVER' | 'LOGIN' | 'DIFFICULTY' | 'ADVENTURE'>(
        shouldShowCover ? 'COVER' : 'ADVENTURE'
    );

    // Hooks
    const {
        volumeAdventures,
        currentAdventureIndex,
        currentAdventure,
        adventureTitles,
        setActiveAdventureId
    } = useChronicleData();

    const {
        handleNext,
        handlePrev,
        handleJumpToChapter,
        handleBegin,
        isJustCompleted
    } = useChronicleNavigation({
        currentAdventureIndex,
        volumeAdventures,
        currentAdventure,
        setActiveAdventureId,
        setIsPremiumModalOpen,
        setIsTocOpen
    });

    useChronicleKeyboardShortcuts({
        isTocOpen,
        handleNext: bookState === 'ADVENTURE' ? handleNext : () => { },
        handlePrev: bookState === 'ADVENTURE' ? handlePrev : () => { },
        setIsTocOpen: bookState === 'ADVENTURE' ? setIsTocOpen : () => { }
    });

    // Handlers for Cover Interactions
    const handleStartNewGame = () => {
        setBookState('DIFFICULTY');
    };

    const handleDifficultySelected = (difficulty: number) => {
        setEncounterDifficulty(difficulty);
        setActiveAdventureId('1');
        setBookState('ADVENTURE');
    };

    const handleGoToLogin = () => {
        setBookState('LOGIN');
    };

    const handleBackToCover = () => {
        setBookState('COVER');
    };

    const handleLoginSuccess = () => {
        setBookState('ADVENTURE');
    };

    if (!currentAdventure && bookState === 'ADVENTURE') {
        return null;
    }

    // Calculate z-indices and states for 3D pages
    const coverState = bookState === 'COVER' ? 'active' : 'flipped';
    // Login and Difficulty conceptually sit "on top" of adventures but "under" cover when cover is closed.
    // When cover opens, if we are in LOGIN or DIFFICULTY, that page is active.
    // Order: Cover -> Login / Difficulty -> Adventure Pages

    const loginState = bookState === 'LOGIN' ? 'active' : (bookState === 'COVER' ? 'upcoming' : 'flipped');
    const difficultyState = bookState === 'DIFFICULTY' ? 'active' : (bookState === 'COVER' || bookState === 'LOGIN' ? 'upcoming' : 'flipped');

    return (
        <BookLayout isOpen={bookState !== 'COVER'}>
            {/* COVER PAGE */}
            <BookPage
                state={coverState}
                zIndex={bookState === 'COVER' ? 30 : 5}
                isCover
            >
                <BookCover
                    onStart={handleStartNewGame}
                    onLogin={handleGoToLogin}
                />
            </BookPage>

            {/* LOGIN PAGE */}
            <BookPage
                state={loginState}
                zIndex={bookState === 'LOGIN' ? 25 : (bookState === 'COVER' ? 5 : 6)}
            >
                <BookLogin
                    onBack={handleBackToCover}
                    onSuccess={handleLoginSuccess}
                />
            </BookPage>

            {/* DIFFICULTY SELECTION PAGE */}
            <BookPage
                state={difficultyState}
                zIndex={bookState === 'DIFFICULTY' ? 24 : (bookState === 'COVER' || bookState === 'LOGIN' ? 4 : 7)}
            >
                <BookDifficulty
                    onSelect={handleDifficultySelected}
                    onBack={handleBackToCover}
                />
            </BookPage>

            {/* ADVENTURE ITEM PAGES (The main content) */}
            {volumeAdventures.map((adventure, index) => {
                const state = index < currentAdventureIndex ? 'flipped' :
                    index === currentAdventureIndex ? 'active' : 'upcoming';

                // Calculate z-index: active is 20, flipped are 10+index, upcoming are 10-index
                const zIndex = index === currentAdventureIndex ? 20 :
                    index < currentAdventureIndex ? 10 + index : 10 - index;

                return (
                    <BookPage
                        key={adventure.id}
                        state={state}
                        zIndex={zIndex}
                    >
                        <div className={styles.pageMotionWrapper}>
                            <ChapterPage
                                adventure={adventure}
                                status={adventureStatuses[adventure.id] || 'LOCKED'}
                                stars={calculateAdventureStars(adventure.id, adventure.encounters, encounterResults)}
                                onBegin={handleBegin}
                                onReplay={handleBegin}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                canNext={index < volumeAdventures.length - 1}
                                canPrev={index > 0}
                                currentPage={index + 1}
                                totalPages={volumeAdventures.length}
                                isJustCompleted={isJustCompleted && adventure.id === currentAdventure?.id}
                                isPremiumLocked={!isAdventureUnlocked(adventure.id)}
                                hasProgress={Object.keys(encounterResults).some(key => key.startsWith(`${adventure.id}_`))}
                            />
                        </div>
                    </BookPage>
                );
            })}

            <PremiumStoreModal
                isOpen={isPremiumModalOpen}
                onClose={() => setIsPremiumModalOpen(false)}
            />

            {bookState === 'ADVENTURE' && (
                <>
                    {/* TOC Button Overlay */}
                    <button
                        className={styles.tocTrigger}
                        onClick={() => setIsTocOpen(true)}
                        data-testid="toc-trigger-btn"
                    >
                        {t('chronicle.contents')}
                    </button>

                    {isTocOpen && currentAdventure && (
                        <TableOfContents
                            volumes={VOLUMES}
                            adventureStatuses={adventureStatuses}
                            adventureTitles={adventureTitles}
                            activeAdventureId={currentAdventure.id}
                            onJumpToChapter={handleJumpToChapter}
                            onClose={() => setIsTocOpen(false)}
                        />
                    )}
                </>
            )}
        </BookLayout>
    );
};
