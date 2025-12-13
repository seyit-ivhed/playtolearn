
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../../stores/combat.store';
import { useGameStore } from '../../stores/game.store';
import { usePlayerStore } from '../../stores/player.store';
import { CombatPhase } from '../../types/combat.types';
// import MathChallengeModal from '../../components/MathChallengeModal'; // Removed
import { generateProblem } from '../../utils/math-generator';
import { MathOperation, type MathProblem } from '../../types/math.types';
import { useState } from 'react';
import { UnitCard } from '../combat/components/UnitCard';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import { VisualEffectOverlay } from './components/VisualEffectOverlay';
import { getCompanionById } from '../../data/companions.data';
import { TurnAnnouncer } from './components/TurnAnnouncer';
import styles from './EncounterPage.module.css'; // Use module
import '../../styles/pages/EncounterPage.css'; // Keep legacy if needed

const EncounterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { difficulty } = usePlayerStore();
    const {
        phase, party, monsters,
        performAction,
        resolveSpecialAttack
    } = useCombatStore();

    const [activeChallenge, setActiveChallenge] = useState<{
        type: 'SPECIAL';
        unitId: string;
        problem: MathProblem;
        spotlightOpen: boolean;
        isFlipped: boolean;
    } | null>(null);


    const [activeVFX, setActiveVFX] = useState<{
        type: string;
        unitId: string;
    } | null>(null);

    const handleUnitAction = (unitId: string) => {
        if (phase !== CombatPhase.PLAYER_TURN) return;

        const unit = party.find(u => u.id === unitId);
        if (!unit) return;

        // Check for Ultimate (Spirit >= 100)
        if (unit.currentSpirit >= 100) {
            const ops = [MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.ADD];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const problem = generateProblem(op, difficulty);

            setActiveChallenge({
                type: 'SPECIAL',
                unitId,
                problem,
                spotlightOpen: true,
                isFlipped: false // Start front, then flip
            });

            // Start flip animation shortly after open
            setTimeout(() => {
                setActiveChallenge(prev => prev ? { ...prev, isFlipped: true } : null);
            }, 2000);

            return;
        }

        // Standard Action (No random math challenge)
        performAction(unitId);
    };

    const handleChallengeComplete = (success: boolean) => {
        if (!activeChallenge) return;

        if (success) {
            // Trigger VFX instead of immediate resolve
            const unit = party.find(u => u.id === activeChallenge.unitId);
            const companion = unit ? getCompanionById(unit.templateId) : null;

            // Determine Effect Type based on ability name or ID
            const effectName = companion?.specialAbility?.name || 'Generic';

            // Close spotlight/math modal immediately to show full screen VFX
            setActiveChallenge(null);

            // Start VFX
            setActiveVFX({
                type: effectName,
                unitId: activeChallenge.unitId
            });
        } else {
            // Failure case: No VFX, just close and resolve (miss) via store if needed
            // For now, let's say failing cancels the attack or does weak attack?
            // Existing logic was resolveSpecialAttack(..., success)
            resolveSpecialAttack(activeChallenge.unitId, success);
            setActiveChallenge(null);
        }
    };

    const handleVFXComplete = () => {
        if (activeVFX) {
            resolveSpecialAttack(activeVFX.unitId, true); // Success confirmed by getting here
            setActiveVFX(null);
        }
    };

    const handleCompletionContinue = () => {
        if (phase === CombatPhase.VICTORY) {
            useGameStore.getState().completeEncounter();
            navigate('/map');
        } else if (phase === CombatPhase.DEFEAT) {
            navigate('/camp');
        }
    };








    return (
        <div className="encounter-page">
            {/* Turn Announcer */}
            <TurnAnnouncer phase={phase} />

            {/* VFX Overlay - GLOBAL (Disable for Protective Stance as it's now per-card) */}
            {
                activeVFX &&
                !activeVFX.type.includes('Protective Stance') &&
                !activeVFX.type.includes('Village Squire') && (
                    <VisualEffectOverlay
                        effectType={activeVFX.type}
                        onComplete={handleVFXComplete}
                    />
                )
            }

            {/* Logic for Per-Card VFX timer (since VisualEffectOverlay handles timer usually) */}
            {/* We need a hidden timer or effect handler if the global overlay isn't rendered */}
            {activeVFX && (activeVFX.type.includes('Protective Stance') || activeVFX.type.includes('Village Squire')) && (
                <VisualEffectOverlay
                    effectType="HIDDEN_TIMER_ONLY" // Hacky: Just use it to run the timer? Or better, implement a side-effect here.
                    onComplete={handleVFXComplete}
                />
            )}
            {/* Actually, VisualEffectOverlay renders nothing if type doesn't match? Let's check. 
               If it returns null, the useEffect inside it still runs! 
               So we can just render it with the original type, but css/logic inside might render DOM.
               
               Better Approach: Just render VisualEffectOverlay but update IT to return null for Protective Stance DOM.
               
               Let's do the prop pass first.
            */}

            {/* Battlefield */}
            <div className="battlefield">
                <div className="battle-layout">
                    {/* Party Grid */}
                    <div className="party-grid">
                        {party.map(unit => (
                            <div key={unit.id} className="card-wrapper">
                                <UnitCard
                                    unit={unit}
                                    phase={phase}
                                    onAct={() => handleUnitAction(unit.id)}
                                    activeVisualEffect={activeVFX?.type}
                                />
                            </div>
                        ))}
                    </div>

                    {/* VS Indicator */}
                    <div className="vs-indicator">
                        <div className="vs-line"></div>
                        <span className="vs-text">{t('combat.encounter.vs', 'VS')}</span>
                        <div className="vs-line bottom"></div>
                    </div>

                    {/* Monsters Grid */}
                    <div className="monster-grid">
                        {monsters.map(unit => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                phase={phase}
                            />
                        ))}
                    </div>
                </div>


            </div>

            {/* Spotlight Overlay */}
            {
                activeChallenge && activeChallenge.spotlightOpen && !activeVFX && (
                    <div className={styles.spotlightContainer}>
                        <div className={styles.spotlightCardWrapper}>
                            {(() => {
                                const unit = party.find(u => u.id === activeChallenge.unitId);
                                if (!unit) return null;
                                return (
                                    <UnitCard
                                        unit={unit}
                                        phase={phase}
                                        isFlipped={activeChallenge.isFlipped}
                                        mathProblem={activeChallenge.problem}
                                        onMathAnswer={handleChallengeComplete}
                                    />
                                );
                            })()}
                        </div>
                    </div>
                )
            }
            {/* Completion Modal */}
            {
                (phase === CombatPhase.VICTORY || phase === CombatPhase.DEFEAT) && (
                    <EncounterCompletionModal
                        result={phase === CombatPhase.VICTORY ? 'VICTORY' : 'DEFEAT'}
                        onContinue={handleCompletionContinue}
                    />
                )
            }
        </div >
    );
};

export default EncounterPage;
