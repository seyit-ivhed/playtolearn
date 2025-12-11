import { useEffect } from 'react';
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
import '../../styles/pages/EncounterPage.css';



const EncounterPage = () => {
    const navigate = useNavigate();
    const { difficulty } = usePlayerStore();
    const {
        phase, party, monsters,
        performAction,
        specialMeter, resolveSpecialAttack
    } = useCombatStore();

    const [activeChallenge, setActiveChallenge] = useState<{
        type: 'SPECIAL';
        unitId?: string;
        problem: MathProblem;
    } | null>(null);



    const startSpecialAttack = () => {
        if (specialMeter < 100 || phase !== CombatPhase.PLAYER_TURN) return;

        // Generate a problem based on user difficulty
        const ops = [MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.ADD];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const problem = generateProblem(op, difficulty);

        setActiveChallenge({
            type: 'SPECIAL',
            problem
        });
    };

    const handleChallengeComplete = (success: boolean) => {
        if (!activeChallenge) return;

        if (activeChallenge.type === 'SPECIAL') {
            resolveSpecialAttack(success);
        }

        setActiveChallenge(null);
    };

    // Handle Victory/Defeat
    useEffect(() => {
        if (phase === CombatPhase.VICTORY) {
            setTimeout(() => {
                alert("Victoria! Returning to Map...");
                // Ideally show a results screen
                useGameStore.getState().completeEncounter();
                navigate('/map');
            }, 1000);
        } else if (phase === CombatPhase.DEFEAT) {
            setTimeout(() => {
                alert("Defeat! Retreating to Camp...");
                navigate('/camp');
            }, 1000);
        }
    }, [phase, navigate]);



    const isSpecialReady = specialMeter >= 100 && phase === CombatPhase.PLAYER_TURN;

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
                                    onAct={() => performAction(unit.id)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* VS Indicator */}
                    <div className="vs-indicator">
                        <div className="vs-line"></div>
                        <span className="vs-text">VS</span>
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

                {/* Party Spirit Meter */}
                <div className="spirit-meter-container">
                    <div
                        className={`spirit-meter ${isSpecialReady ? 'ready' : ''}`}
                        onClick={startSpecialAttack}
                        title={specialMeter >= 100 ? "Click to Activate Ultimate!" : `${Math.floor(specialMeter)}% Spirit`}
                    >
                        {/* Background Bar */}
                        <div
                            className="spirit-meter-bar"
                            style={{ width: `${specialMeter}%` }}
                        >
                            {/* Sparkle effect when full */}
                            {specialMeter >= 100 && (
                                <div className="shimmer" />
                            )}
                        </div>

                        {/* Text Overlay */}
                        <div className="spirit-meter-text-overlay">
                            <span className="spirit-meter-text">
                                {specialMeter >= 100 ? "✨ UNLEASH ULTIMATE ✨" : `Party Spirit ${Math.floor(specialMeter)}%`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Math Modal */}
            {
                activeChallenge && (
                    <MathChallengeModal
                        problem={activeChallenge.problem}
                        title="ULTIMATE CASTING!"
                        description="Solve correctly to UNLEASH POWER!"
                        onComplete={handleChallengeComplete}
                        onClose={() => setActiveChallenge(null)}
                    />
                )
            }
        </div >
    );
};

export default EncounterPage;
