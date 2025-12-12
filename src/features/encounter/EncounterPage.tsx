
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../../stores/combat.store';
import { useGameStore } from '../../stores/game.store';
import { usePlayerStore } from '../../stores/player.store';
import { CombatPhase } from '../../types/combat.types';
import MathChallengeModal from '../../components/MathChallengeModal';
import { generateProblem } from '../../utils/math-generator';
import { MathOperation, type MathProblem } from '../../types/math.types';
import { useState } from 'react';
import { UnitCard } from '../combat/components/UnitCard';
import { EncounterCompletionModal } from './components/EncounterCompletionModal';
import '../../styles/pages/EncounterPage.css';



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
        type: 'SPECIAL' | 'CRITICAL';
        unitId?: string;
        problem: MathProblem;
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
                problem
            });
            return;
        }

        // 20% Chance for Critical Math Challenge
        if (Math.random() < 0.2) {
            const ops = [MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.ADD, MathOperation.SUBTRACT];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const problem = generateProblem(op, difficulty);

            setActiveChallenge({
                type: 'CRITICAL',
                unitId,
                problem
            });
        } else {
            performAction(unitId);
        }
    };

    const handleChallengeComplete = (success: boolean) => {
        if (!activeChallenge) return;

        if (activeChallenge.type === 'SPECIAL' && activeChallenge.unitId) {
            resolveSpecialAttack(activeChallenge.unitId, success);
        } else if (activeChallenge.type === 'CRITICAL' && activeChallenge.unitId) {
            // If success, critical hit! If fail, normal hit.
            performAction(activeChallenge.unitId, { isCritical: success });
        }

        setActiveChallenge(null);
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
            {/* Top HUD */}


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

            {/* Math Modal */}
            {
                activeChallenge && (
                    <MathChallengeModal
                        problem={activeChallenge.problem}
                        title={activeChallenge.type === 'SPECIAL'
                            ? t('combat.encounter.ultimate_casting', "ULTIMATE CASTING!")
                            : t('combat.encounter.critical_opportunity', "CRITICAL OPPORTUNITY!")}
                        description={activeChallenge.type === 'SPECIAL'
                            ? t('combat.encounter.solve_to_unleash', "Solve correctly to UNLEASH POWER!")
                            : t('combat.encounter.solve_for_critical', "Solve correctly for DOUBLE EFFECT!")}
                        onComplete={handleChallengeComplete}
                        onClose={() => setActiveChallenge(null)}
                    />
                )
            }
            {/* Completion Modal */}
            {(phase === CombatPhase.VICTORY || phase === CombatPhase.DEFEAT) && (
                <EncounterCompletionModal
                    result={phase === CombatPhase.VICTORY ? 'VICTORY' : 'DEFEAT'}
                    onContinue={handleCompletionContinue}
                />
            )}
        </div >
    );
};

export default EncounterPage;
