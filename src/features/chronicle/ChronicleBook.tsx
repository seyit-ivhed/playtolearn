import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    const navigate = useNavigate();
    const { pageId } = useParams<{ pageId: string }>();

    // Check if user has any progress to decide initial state
    const hasAnyProgress = Object.keys(encounterResults).length > 0;

    // Determine Book State from URL
    const getBookStateFromUrl = (): 'COVER' | 'LOGIN' | 'DIFFICULTY' | 'ADVENTURE' => {
        if (!pageId || pageId === 'cover') return 'COVER';
        if (pageId === 'login') return 'LOGIN';
        if (pageId === 'difficulty') return 'DIFFICULTY';
        if (!isNaN(Number(pageId))) return 'ADVENTURE';
        return 'COVER';
    };

    const bookState = getBookStateFromUrl();
    const urlAdventureId = bookState === 'ADVENTURE' ? pageId : undefined;

    // UI State
    const [isTocOpen, setIsTocOpen] = React.useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = React.useState(false);

    // Hooks
    const {
        volumeAdventures,
        currentAdventureIndex,
        currentAdventure,
        adventureTitles,
        activeAdventureId // This comes from useChronicleData (either override or internal default)
    } = useChronicleData(urlAdventureId);

    // Redirect Logic
    useEffect(() => {
        // If at root /chronicle (pageId undefined), decide where to go
        if (!pageId) {
            if (hasAnyProgress) {
                // If user has progress, go to their active adventure
                if (activeAdventureId) {
                    navigate(`/chronicle/${activeAdventureId}`, { replace: true });
                }
            } else {
                // No progress -> Cover
                navigate('/chronicle/cover', { replace: true });
            }
        }
    }, [pageId, hasAnyProgress, activeAdventureId, navigate]);


    // Wrapper to navigate instead of setting internal state
    const handleSetActiveAdventureId = (id: string) => {
        navigate(`/chronicle/${id}`);
    };

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
        setActiveAdventureId: handleSetActiveAdventureId,
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
        if (hasAnyProgress) {
            // Continue game (go to current adventure)
            // activeAdventureId already holds the "highest unlocked" or "current" adventure logic from useChronicleData
            navigate(`/chronicle/${activeAdventureId}`);
        } else {
            navigate('/chronicle/difficulty');
        }
    };

    const handleDifficultySelected = (difficulty: number) => {
        setEncounterDifficulty(difficulty);
        // Start at adventure 1
        navigate('/chronicle/1');
    };

    const handleGoToLogin = () => {
        navigate('/chronicle/login');
    };

    const handleBackToCover = () => {
        navigate('/chronicle/cover');
    };

    const handleLoginSuccess = () => {
        // Login success -> Go to adventure (will use default logic to pick right one)
        // Navigate to root /chronicle and let the redirect logic pick the best adventure
        navigate('/chronicle', { replace: true });
    };

    if (!currentAdventure && bookState === 'ADVENTURE') {
        return null;
    }

    // Unified stacking logic: lower position = closer to front in a closed book.
    const calculatePageZIndex = (state: 'active' | 'flipped' | 'upcoming', position: number) => {
        if (state === 'active') {
            return 100;
        }
        if (state === 'flipped') {
            // Most recently flipped (highest position) should be on top of left stack.
            return 10 + position;
        }
        // Next up in line (lowest position) should be on top of right stack.
        return 50 - position;
    };

    // Calculate z-indices and states for 3D pages
    const coverState = bookState === 'COVER' ? 'active' : 'flipped';
    const loginState = bookState === 'LOGIN' ? 'active' : (bookState === 'COVER' ? 'upcoming' : 'flipped');
    const difficultyState = bookState === 'DIFFICULTY' ? 'active' : (bookState === 'COVER' || bookState === 'LOGIN' ? 'upcoming' : 'flipped');

    return (
        <BookLayout isOpen={bookState !== 'COVER'}>
            {/* COVER PAGE */}
            <BookPage
                state={coverState}
                zIndex={calculatePageZIndex(coverState, 0)}
                isCover
            >
                <BookCover
                    onStart={handleStartNewGame}
                    onLogin={handleGoToLogin}
                    hasProgress={hasAnyProgress}
                />
            </BookPage>

            {/* LOGIN PAGE */}
            <BookPage
                state={loginState}
                zIndex={calculatePageZIndex(loginState, 1)}
            >
                <BookLogin
                    onBack={handleBackToCover}
                    onSuccess={handleLoginSuccess}
                />
            </BookPage>

            {/* DIFFICULTY SELECTION PAGE */}
            <BookPage
                state={difficultyState}
                zIndex={calculatePageZIndex(difficultyState, 2)}
            >
                <BookDifficulty
                    onSelect={handleDifficultySelected}
                    onBack={handleBackToCover}
                />
            </BookPage>

            {/* ADVENTURE ITEM PAGES (The main content) */}
            {volumeAdventures.map((adventure, index) => {
                const isCurrentAdventure = index === currentAdventureIndex;
                const isPastAdventure = index < currentAdventureIndex;

                // Only mark as 'active' if we are actually in ADVENTURE mode
                const state = (bookState === 'ADVENTURE')
                    ? (isPastAdventure ? 'flipped' : isCurrentAdventure ? 'active' : 'upcoming')
                    : 'upcoming';

                const position = 3 + index;

                return (
                    <BookPage
                        key={adventure.id}
                        state={state}
                        zIndex={calculatePageZIndex(state, position)}
                    >
                        <div className={styles.pageMotionWrapper}>
                            <ChapterPage
                                adventure={adventure}
                                status={adventureStatuses[adventure.id] || 'LOCKED'}
                                stars={calculateAdventureStars(adventure.id, adventure.encounters, encounterResults)}
                                onBegin={handleBegin}
                                onReplay={handleBegin}
                                onNext={handleNext}
                                onPrev={() => {
                                    if (index === 0) {
                                        navigate('/chronicle/difficulty');
                                    } else {
                                        handlePrev();
                                    }
                                }}
                                canNext={index < volumeAdventures.length - 1}
                                canPrev={true}
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
