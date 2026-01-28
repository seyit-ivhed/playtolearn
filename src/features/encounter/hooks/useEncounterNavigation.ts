
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../../stores/game/store';
import { usePremiumStore } from '../../../stores/premium.store';
import { useEncounterStore } from '../../../stores/encounter/store';
import { checkNavigationAccess } from '../../../utils/navigation-security.utils';
import { EncounterPhase } from '../../../types/encounter.types';
import { ADVENTURES } from '../../../data/adventures.data';
import { EXPERIENCE_CONFIG } from '../../../data/experience.data';
import { EncounterType } from '../../../types/adventure.types';

interface UseEncounterNavigationProps {
    adventureId?: string;
    nodeIndex: number;
    phase: EncounterPhase;
}

export const useEncounterNavigation = ({
    adventureId,
    nodeIndex,
    phase
}: UseEncounterNavigationProps) => {
    const navigate = useNavigate();

    // Global Store Access
    const { encounterResults, completeEncounter, addCompanionExperience, companionStats, activeParty, isAdventureUnlocked: isProgressionUnlocked } = useGameStore();
    const { isAdventureUnlocked: isPremiumUnlocked, initialized: premiumInitialized } = usePremiumStore();


    // Local State
    const [showExperienceScreen, setShowExperienceScreen] = useState(false);
    const [previousCompanionStats, setPreviousCompanionStats] = useState<Record<string, { experience?: number; level?: number }>>({});

    // Safety Gate
    useEffect(() => {
        if (premiumInitialized && adventureId) {
            const access = checkNavigationAccess({
                adventureId,
                nodeIndex,
                isPremiumUnlocked,
                isProgressionUnlocked,
                encounterResults
            });

            if (!access.allowed) {
                navigate('/chronicle', { replace: true });
            }
        }
    }, [premiumInitialized, adventureId, nodeIndex, isPremiumUnlocked, isProgressionUnlocked, encounterResults, navigate]);

    // Handle Completion Trigger (Continue Button)
    const handleCompletionContinue = useCallback(() => {
        if (!adventureId || !nodeIndex) {
            navigate('/chronicle');
            return;
        }

        if (phase === EncounterPhase.VICTORY) {
            // Check if we should show XP screen
            if (!showExperienceScreen) {
                const adventure = ADVENTURES.find(a => a.id === adventureId);
                const encounter = adventure?.encounters.find(e => e.id === `${adventureId}_${nodeIndex}`);

                if (encounter && encounter.type !== EncounterType.ENDING) {
                    // 1. Capture snapshots of CURRENT stats (before adding XP)
                    const statsSnapshot: Record<string, { experience?: number; level?: number }> = {};

                    activeParty.forEach(id => {
                        if (companionStats[id]) {
                            statsSnapshot[id] = { ...companionStats[id] };
                        }
                    });
                    setPreviousCompanionStats(statsSnapshot);

                    // 2. Add Experience
                    activeParty.forEach(id => {
                        addCompanionExperience(id, EXPERIENCE_CONFIG.ENCOUNTER_XP_REWARD);
                    });

                    // 3. Show Screen
                    setShowExperienceScreen(true);
                    return; // Stop here, don't navigate yet
                }
            }

            // Normal Navigation Logic (called when showExperienceScreen is true and we click continue on that, OR if we skipped it)
            completeEncounter(adventureId, nodeIndex);

            // Check if this was a BOSS encounter
            // We use the store state directly here or passed monsters, assuming monsters state is current
            const currentMonsters = useEncounterStore.getState().monsters;
            const isBossEncounter = currentMonsters.some(m => m.isBoss);

            if (isBossEncounter) {
                navigate(`/map/${adventureId}`, { state: { adventureCompleted: true, focalNode: nodeIndex } });
            } else {
                // Focus on the NEXT node
                navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex + 1 } });
            }
        } else if (phase === EncounterPhase.DEFEAT) {
            // Focus on the SAME node
            navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex } });
        }
    }, [
        adventureId,
        nodeIndex,
        phase,
        showExperienceScreen,
        navigate,
        activeParty,
        companionStats,
        addCompanionExperience,
        completeEncounter
    ]);

    return {
        showExperienceScreen,
        previousCompanionStats,
        handleCompletionContinue,
        activeParty // Exposing this as it's needed by the UI
    };
};
