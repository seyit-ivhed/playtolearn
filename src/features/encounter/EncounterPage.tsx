
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEncounterStore } from '../../stores/encounter.store';
import { useGameStore } from '../../stores/game.store';
import { usePlayerStore } from '../../stores/player.store';
import { EncounterPhase } from '../../types/encounter.types';

import { generateProblem } from '../../utils/math-generator';
import { MathOperation, type MathProblem } from '../../types/math.types';
import { useState } from 'react';
import { UnitCard } from './components/UnitCard';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import { VisualEffectOverlay } from './components/VisualEffectOverlay';
import { getCompanionById } from '../../data/companions.data';
import { TurnAnnouncer } from './components/TurnAnnouncer';
import styles from './EncounterPage.module.css'; // Use module
import './EncounterPage.css'; // Keep legacy if needed

const EncounterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { difficulty } = usePlayerStore();
    const {
        phase, party, monsters,
        performAction,
        resolveSpecialAttack
    } = useEncounterStore();

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
        targetId?: string;
    } | null>(null);

    // Check if encounter is effectively over (all monsters dead)
    const isEncounterOver = monsters.every(m => m.isDead);

    const handleUnitAction = (unitId: string) => {
        if (phase !== EncounterPhase.PLAYER_TURN || isEncounterOver) return;

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
                // Reset Spirit Meter just before flip so user doesn't see it reset later
                useEncounterStore.getState().consumeSpirit(unitId);
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
            const effectName = companion?.specialAbility?.id || 'Generic';

            // Determine Target ID (for positioning VFX) - logic mirrors damage.ability.ts (first living enemy)
            let targetId: string | undefined;
            if (effectName === 'jaguar_strike' || companion?.specialAbility?.target === 'SINGLE_ENEMY') {
                const target = monsters.find(m => !m.isDead);
                if (target) {
                    targetId = target.id;
                }
            }

            // Close spotlight/math modal immediately to show full screen VFX
            setActiveChallenge(null);

            // Start VFX
            setActiveVFX({
                type: effectName,
                unitId: activeChallenge.unitId,
                targetId
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
        if (phase === EncounterPhase.VICTORY) {
            useGameStore.getState().completeEncounter();
            navigate('/map');
        } else if (phase === EncounterPhase.DEFEAT) {
            navigate('/camp');
        }
    };









    return (
        <div className="encounter-page">
            {/* Turn Announcer */}
            <TurnAnnouncer phase={phase} />

            {/* VFX Overlay - GLOBAL */}
            {activeVFX && (
                <VisualEffectOverlay
                    effectType={activeVFX.type}
                    onComplete={handleVFXComplete}
                    targetId={activeVFX.targetId}
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
                                    disableInteraction={isEncounterOver || !!activeChallenge || !!activeVFX}
                                />
                            </div>
                        ))}
                    </div>

                    {/* VS Indicator */}
                    <div className="vs-indicator">
                        <div className="vs-line"></div>
                        <span className="vs-text">{t('encounter.vs', 'VS')}</span>
                        <div className="vs-line bottom"></div>
                    </div>

                    {/* Monsters Grid */}
                    <div className="monster-grid">
                        <AnimatePresence mode="popLayout">
                            {monsters.filter(m => !m.isDead).map(unit => (
                                <motion.div
                                    key={unit.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.5,
                                        filter: "blur(10px)",
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    <UnitCard
                                        unit={unit}
                                        phase={phase}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
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
                (phase === EncounterPhase.VICTORY || phase === EncounterPhase.DEFEAT) && (
                    <EncounterCompletionModal
                        result={phase === EncounterPhase.VICTORY ? 'VICTORY' : 'DEFEAT'}
                        onContinue={handleCompletionContinue}
                    />
                )
            }
        </div >
    );
};

export default EncounterPage;
