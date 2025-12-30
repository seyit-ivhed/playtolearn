import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/game/store';
import { useAdventureStore } from '../../stores/adventure.store';
import { ADVENTURES } from '../../data/adventures.data';
import { VOLUMES } from '../../data/volumes.data';
import { ChapterPage } from './components/ChapterPage';
import { TableOfContents } from './components/TableOfContents';
import './ChronicleBook.css';

export const ChronicleBook: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    // Store State


    const { chronicle, updateChroniclePosition, setActiveAdventure } = useGameStore();
    const { adventureStatuses } = useAdventureStore();

    // UI State
    const [isTocOpen, setIsTocOpen] = useState(false);

    // Find current volume and context
    const currentVolume = useMemo(() =>
        VOLUMES.find(v => v.id === chronicle.lastViewedVolumeId) || VOLUMES[0]
        , [chronicle.lastViewedVolumeId]);

    const volumeAdventures = useMemo(() =>
        ADVENTURES.filter(a => currentVolume.adventureIds.includes(a.id))
        , [currentVolume]);

    const currentAdventureIndex = useMemo(() => {
        const idx = volumeAdventures.findIndex(a => a.id === chronicle.lastViewedAdventureId);
        return idx !== -1 ? idx : 0;
    }, [volumeAdventures, chronicle.lastViewedAdventureId]);

    const currentAdventure = volumeAdventures[currentAdventureIndex];

    // Check if we just completed this adventure (triggering animation)
    const justCompletedAdventureId = location.state?.justCompletedAdventureId;
    const isJustCompleted = justCompletedAdventureId === currentAdventure?.id;

    // Navigation Handlers
    const handleNext = useCallback(() => {
        if (currentAdventureIndex < volumeAdventures.length - 1) {
            const nextAdj = volumeAdventures[currentAdventureIndex + 1];
            updateChroniclePosition(currentVolume.id, nextAdj.id);

            // If we were in "just completed" state, clear it now
            if (isJustCompleted) {
                navigate(location.pathname, { replace: true, state: {} });
            }
        }
    }, [currentAdventureIndex, volumeAdventures, currentVolume.id, updateChroniclePosition, isJustCompleted, navigate, location.pathname]);

    const handlePrev = useCallback(() => {
        if (currentAdventureIndex > 0) {
            const prevAdj = volumeAdventures[currentAdventureIndex - 1];
            updateChroniclePosition(currentVolume.id, prevAdj.id);
        }
    }, [currentAdventureIndex, volumeAdventures, currentVolume.id, updateChroniclePosition]);

    const handleJumpToChapter = (volumeId: string, adventureId: string) => {
        updateChroniclePosition(volumeId, adventureId);
        setIsTocOpen(false);
    };

    const handleBegin = (id: string) => {
        setActiveAdventure(id);
        navigate('/map');
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTocOpen) return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'm' || e.key === 'Enter') {
                setIsTocOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, isTocOpen]);

    const adventureTitles = useMemo(() =>
        ADVENTURES.reduce((acc, a) => {
            acc[a.id] = t(`adventures.${a.id}.title`, a.title || `Adventure ${a.id}`);
            return acc;
        }, {} as Record<string, string>)
        , [t]);

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
                                stars={0} // TODO: Get stars from encounterResults
                                onBegin={handleBegin}
                                onReplay={handleBegin}
                                onNext={handleNext}
                                onPrev={handlePrev}
                                canNext={currentAdventureIndex < volumeAdventures.length - 1}
                                canPrev={currentAdventureIndex > 0}
                                currentPage={currentAdventureIndex + 1}
                                totalPages={volumeAdventures.length}
                                isJustCompleted={isJustCompleted}
                            />

                        </motion.div>
                    </AnimatePresence>
                </div>


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
