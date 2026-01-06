import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/game/store';
import { useAdventureStore } from '../../stores/adventure.store';
import { VOLUMES } from '../../data/volumes.data';
import { calculateAdventureStars } from '../../utils/progression.utils';
import { ChapterPage } from './components/ChapterPage';
import { TableOfContents } from './components/TableOfContents';
import { PremiumStoreModal } from '../premium/components/PremiumStoreModal';
import { usePremiumStore } from '../../stores/premium.store';
import { useChronicleData } from './hooks/useChronicleData';
import { useChronicleNavigation } from './hooks/useChronicleNavigation';
import { useChronicleKeyboardShortcuts } from './hooks/useChronicleKeyboardShortcuts';
import './ChronicleBook.css';

export const ChronicleBook: React.FC = () => {
    const { t } = useTranslation();
    const { adventureStatuses } = useAdventureStore();
    const { isAdventureUnlocked } = usePremiumStore();

    // UI State
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

    // Hooks
    const {
        currentVolume,
        volumeAdventures,
        currentAdventureIndex,
        currentAdventure,
        adventureTitles,
        encounterResults
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
        currentVolume,
        currentAdventure,
        setIsPremiumModalOpen,
        setIsTocOpen
    });

    useChronicleKeyboardShortcuts({
        isTocOpen,
        handleNext,
        handlePrev,
        setIsTocOpen
    });

    if (!currentAdventure) return null;

    return (
        <div className="chronicle-wrapper" data-testid="chronicle-page">
            <div className="book-container" data-testid="chronicle-book">
                <div className="book-spine"></div>
                <div className="book-page left-page">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentAdventure.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="page-motion-wrapper"
                        >
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
                            />

                        </motion.div>
                    </AnimatePresence>
                </div>

                <PremiumStoreModal
                    isOpen={isPremiumModalOpen}
                    onClose={() => setIsPremiumModalOpen(false)}
                />


                {/* TOC Button Overlay */}
                <button
                    className="toc-trigger"
                    onClick={() => setIsTocOpen(true)}
                    data-testid="toc-trigger-btn"
                >
                    {t('chronicle.contents')}
                </button>
            </div>

            {isTocOpen && (
                <TableOfContents
                    volumes={VOLUMES}
                    adventureStatuses={adventureStatuses}
                    adventureTitles={adventureTitles}
                    activeAdventureId={useGameStore.getState().activeAdventureId}
                    onJumpToChapter={handleJumpToChapter}
                    onClose={() => setIsTocOpen(false)}
                />
            )}
        </div>
    );
};
