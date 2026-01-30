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

// New Book Components
import { BookLayout } from './components/Book/BookLayout';
import { BookPage } from './components/Book/BookPage';
import { BookCover } from './components/Book/BookCover';
import { BookLogin } from './components/Book/BookLogin';

export const ChronicleBook: React.FC = () => {
    const { t } = useTranslation();
    const { adventureStatuses, isAdventureUnlocked, encounterResults } = useGameStore();
    const { isAuthenticated } = useAuth();

    // Check if user has any progress to decide initial state
    const hasAnyProgress = Object.keys(encounterResults).length > 0;
    const shouldShowCover = !isAuthenticated && !hasAnyProgress;

    // UI State
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [bookState, setBookState] = useState<'COVER' | 'LOGIN' | 'ADVENTURE'>(
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

    if (!currentAdventure && bookState === 'ADVENTURE') return null;

    // Calculate z-indices and states for 3D pages
    const coverState = bookState === 'COVER' ? 'active' : 'flipped';
    const loginState = bookState === 'LOGIN' ? 'active' : (bookState === 'COVER' ? 'upcoming' : 'flipped');
    // const adventureState = bookState === 'ADVENTURE' ? 'active' : 'upcoming';

    return (
        <BookLayout>
            {/* COVER PAGE */}
            <BookPage
                state={coverState}
                zIndex={bookState === 'COVER' ? 30 : 10}
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
                zIndex={bookState === 'LOGIN' ? 25 : 5}
            >
                <BookLogin
                    onBack={handleBackToCover}
                    onSuccess={handleLoginSuccess}
                />
            </BookPage>

            {/* ADVENTURE ITEM PAGE (The main content) */}
            {/* In a real book, we might have multiple pages. Here we keep the 'stack' illusion 
                by having the Adventure page sit 'under' the cover/login pages until they flip open.
            */}
            <div
                className={styles.bookPage}
                style={{
                    zIndex: 20,
                    transform: 'rotateY(0deg)' // Always flat, cover flips reveals it
                }}
            >
                <div className={styles.pageFront}>
                    {bookState === 'ADVENTURE' && currentAdventure && (
                        <div className={styles.pageMotionWrapper}>
                            <ChapterPage
                                adventure={currentAdventure}
                                status={adventureStatuses[currentAdventure.id] || 'LOCKED'}
                                stars={calculateAdventureStars(currentAdventure.id, currentAdventure.encounters, encounterResults)}
                                onBegin={handleBegin}
                                onReplay={handleBegin}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                canNext={currentAdventureIndex < volumeAdventures.length - 1}
                                canPrev={currentAdventureIndex > 0}
                                currentPage={currentAdventureIndex + 1}
                                totalPages={volumeAdventures.length}
                                isJustCompleted={isJustCompleted}
                                isPremiumLocked={!isAdventureUnlocked(currentAdventure.id)}
                                hasProgress={Object.keys(encounterResults).some(key => key.startsWith(`${currentAdventure.id}_`))}
                            />
                        </div>
                    )}
                </div>
            </div>

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
