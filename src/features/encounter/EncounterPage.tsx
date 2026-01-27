
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEncounterStore } from '../../stores/encounter/store';
import { useGameStore } from '../../stores/game/store';
import { usePremiumStore } from '../../stores/premium.store';
import { checkNavigationAccess } from '../../utils/navigation-security.utils';
import { EncounterPhase } from '../../types/encounter.types';
import { generateProblem, getAllowedOperations } from '../../utils/math-generator';
import { type MathProblem, type DifficultyLevel } from '../../types/math.types';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import { VisualEffectOverlay } from './components/VisualEffectOverlay';
import { TurnAnnouncer } from './components/TurnAnnouncer';
import { Battlefield } from './components/Battlefield';
import { SpecialChallengeOverlay } from './components/SpecialChallengeOverlay';
import { useDelayedUnitRemoval } from './hooks/useDelayedUnitRemoval';
import { getVFXDetails, checkIsEncounterOver } from './utils/encounter-logic';
import styles from './EncounterPage.module.css';
import './EncounterPage.css';
import { ADVENTURES } from '../../data/adventures.data';
import { EXPERIENCE_CONFIG } from '../../data/experience.data';
import { ExperienceDistributionScreen } from './components/experience/ExperienceDistributionScreen';
import { EncounterType } from '../../types/adventure.types';

const EncounterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { adventureId, nodeIndex: nodeIndexParam } = useParams<{ adventureId: string; nodeIndex: string }>();
    const nodeIndex = parseInt(nodeIndexParam || '1', 10);

    const {
        phase, party, monsters,
        performAction,
        resolveSpecialAttack,
        difficulty
    } = useEncounterStore();

    const { encounterResults, completeEncounter } = useGameStore();

    const isProgressionUnlocked = useGameStore(state => state.isAdventureUnlocked);
    const { isAdventureUnlocked: isPremiumUnlocked, initialized: premiumInitialized } = usePremiumStore();
    const { addCompanionExperience, companionStats, activeParty } = useGameStore();

    const [showExperienceScreen, setShowExperienceScreen] = useState(false);
    const [previousCompanionStats, setPreviousCompanionStats] = useState<Record<string, { experience?: number; level?: number }>>({});

    const [activeChallenge, setActiveChallenge] = useState<{
        type: 'SPECIAL';
        unitId: string;
        problem: MathProblem;
        spotlightOpen: boolean;
        isFlipped: boolean;
    } | null>(null);

    // Sync alive monsters but delay removal of dead ones for animations
    const visibleMonsterIds = useDelayedUnitRemoval(monsters);

    const [activeVFX, setActiveVFX] = useState<{
        type: string;
        unitId: string;
        targetId?: string;
    } | null>(null);

    const isEncounterOver = checkIsEncounterOver(monsters);

    // Safety gate: Validate premium, progression and node sequence
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

    const handleUnitAction = (unitId: string) => {
        if (phase !== EncounterPhase.PLAYER_TURN || isEncounterOver) return;

        const unit = party.find(u => u.id === unitId);
        if (!unit) return;

        // Check for Ultimate (Spirit >= 100)
        if (unit.currentSpirit >= 100) {
            const currentDifficulty = (difficulty || 1) as DifficultyLevel;
            const allowedOps = getAllowedOperations(currentDifficulty);
            const op = allowedOps[Math.floor(Math.random() * allowedOps.length)];
            const problem = generateProblem(op, currentDifficulty);

            setActiveChallenge({
                type: 'SPECIAL',
                unitId,
                problem,
                spotlightOpen: true,
                isFlipped: false
            });

            // Start flip animation shortly after open
            setTimeout(() => {
                useEncounterStore.getState().consumeSpirit(unitId);
                setActiveChallenge(prev => prev ? { ...prev, isFlipped: true } : null);
            }, 2000);

            return;
        }

        performAction(unitId);
    };

    const handleChallengeComplete = (success: boolean) => {
        if (!activeChallenge) return;

        if (success) {
            const { type, targetId } = getVFXDetails(activeChallenge.unitId, party, monsters);
            setActiveChallenge(null);
            setActiveVFX({
                type,
                unitId: activeChallenge.unitId,
                targetId
            });
        } else {
            resolveSpecialAttack(activeChallenge.unitId, success);
            setActiveChallenge(null);
        }
    };

    const handleVFXComplete = () => {
        if (activeVFX) {
            resolveSpecialAttack(activeVFX.unitId, true);
            setActiveVFX(null);
        }
    };

    const handleCompletionContinue = () => {
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
                    // We need to look up stats from the Game Store (companionStats), not the local encounter party
                    // because local party might be slightly drifted? Actually GameStore is the source of truth for progression.
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
    };

    return (
        <div className="encounter-page">
            <header className={styles.header}>
                <div className={styles.headerControls}>
                    <button
                        className={styles.abortLink}
                        onClick={() => navigate(`/map/${adventureId}`, { state: { focalNode: nodeIndex } })}
                        disabled={!!activeChallenge || !!activeVFX || isEncounterOver}
                    >
                        {t('retreat')}
                    </button>
                </div>
            </header>

            <TurnAnnouncer phase={phase} />

            {activeVFX && (
                <VisualEffectOverlay
                    effectType={activeVFX.type}
                    onComplete={handleVFXComplete}
                    targetId={activeVFX.targetId}
                />
            )}

            <Battlefield
                party={party}
                monsters={monsters}
                visibleMonsterIds={visibleMonsterIds}
                phase={phase}
                isEncounterOver={isEncounterOver}
                activeVFXType={activeVFX?.type}
                activeChallengeUnitId={activeChallenge?.unitId}
                isVFXActive={!!activeVFX}
                onUnitAction={handleUnitAction}
            />

            {activeChallenge && (
                <SpecialChallengeOverlay
                    challenge={activeChallenge}
                    party={party}
                    phase={phase}
                    isVFXActive={!!activeVFX}
                    onComplete={handleChallengeComplete}
                />
            )}

            {(phase === EncounterPhase.VICTORY || phase === EncounterPhase.DEFEAT) && !showExperienceScreen && (
                <EncounterCompletionModal
                    result={phase === EncounterPhase.VICTORY ? 'VICTORY' : 'DEFEAT'}
                    onContinue={handleCompletionContinue}

                    difficulty={difficulty || 1}

                />
            )}

            {showExperienceScreen && (
                <ExperienceDistributionScreen
                    partyIds={activeParty}
                    previousStats={previousCompanionStats}
                    onContinue={handleCompletionContinue}
                />
            )}
        </div>
    );
};

export default EncounterPage;
