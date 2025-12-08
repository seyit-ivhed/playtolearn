import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../stores/combat.store';
import { useGameStore } from '../stores/game.store';
import { CombatPhase } from '../types/combat.types';
import MathChallengeModal from '../components/MathChallengeModal';
import { generateProblem } from '../utils/math-generator';
import { MathOperation, type MathProblem } from '../types/math.types';
import { useState } from 'react';
import { UnitCard } from '../components/combat/UnitCard';

const EncounterPage = () => {
    const navigate = useNavigate();
    const {
        phase, party, monsters,
        performAction, resolveRecharge,
        specialMeter, resolveSpecialAttack
    } = useCombatStore();

    const [activeChallenge, setActiveChallenge] = useState<{
        type: 'RECHARGE' | 'SPECIAL';
        unitId?: string;
        problem: MathProblem;
    } | null>(null);

    const startRecharge = (unitId: string) => {
        // Generate a standard problem
        const ops = [MathOperation.ADD, MathOperation.SUBTRACT];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const problem = generateProblem(op, 1); // Difficulty 1

        setActiveChallenge({
            type: 'RECHARGE',
            unitId,
            problem
        });
    };

    const startSpecialAttack = () => {
        if (specialMeter < 100 || phase !== CombatPhase.PLAYER_TURN) return;

        // Generate a HARD problem
        const ops = [MathOperation.MULTIPLY, MathOperation.DIVIDE, MathOperation.ADD];
        const op = ops[Math.floor(Math.random() * ops.length)];
        const problem = generateProblem(op, 2); // Difficulty 2

        setActiveChallenge({
            type: 'SPECIAL',
            problem
        });
    };

    const handleChallengeComplete = (success: boolean) => {
        if (!activeChallenge) return;

        if (activeChallenge.type === 'RECHARGE' && activeChallenge.unitId) {
            resolveRecharge(activeChallenge.unitId, success);
        } else if (activeChallenge.type === 'SPECIAL') {
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

    const handleRetreat = () => {
        if (confirm("Run away?")) {
            navigate('/map');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[url('/combat-bg-forest.png')] bg-cover relative overflow-hidden">
            {/* Top HUD */}
            <div className="absolute top-4 w-full flex justify-between px-8 z-50 pointer-events-none">
                {/* Retreat (Pointer events enabled) */}
                <div className="pointer-events-auto">
                    <button onClick={handleRetreat} className="bg-gray-500 text-white text-sm py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transistion-colors" data-testid="encounter-retreat-btn">
                        🏳️ Retreat
                    </button>
                </div>

                {/* Turn Indicator */}
                <div className="pointer-events-auto">
                    <div
                        className={`
                            px-8 py-2 rounded-full font-black text-xl shadow-lg border-2 border-white/20 backdrop-blur-md
                            ${phase === CombatPhase.PLAYER_TURN ? 'bg-indigo-600 text-white animate-bounce-subtle' : 'bg-red-800 text-white'}
                        `}
                        data-testid="encounter-turn-indicator"
                    >
                        {phase === CombatPhase.PLAYER_TURN ? "YOUR TURN" : (phase === CombatPhase.MONSTER_TURN ? "MONSTER TURN..." : phase)}
                    </div>
                </div>

                {/* Empty Spacer */}
                <div className="w-24"></div>
            </div>

            {/* Battlefield */}
            <div className="flex-1 flex flex-col items-center justify-center gap-8 px-12 z-0 pb-12 pt-12 overflow-y-auto">
                <div className="flex items-center gap-12 w-full justify-center">
                    {/* Party Grid */}
                    <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
                        {party.map(unit => (
                            <div key={unit.id} className="transition-transform duration-300">
                                <UnitCard
                                    unit={unit}
                                    phase={phase}
                                    onAct={() => performAction(unit.id)}
                                    onRecharge={() => startRecharge(unit.id)}
                                />
                            </div>
                        ))}
                    </div>

                    {/* VS Indicator */}
                    <div className="flex flex-col items-center justify-center opacity-40 mix-blend-overlay pointer-events-none">
                        <div className="h-32 w-1 bg-white/50 rounded-full mb-4"></div>
                        <span className="text-4xl font-black text-white italic">VS</span>
                        <div className="h-32 w-1 bg-white/50 rounded-full mt-4"></div>
                    </div>

                    {/* Monsters Grid */}
                    <div className="flex flex-col gap-6 items-center">
                        {monsters.map(unit => (
                            <UnitCard
                                key={unit.id}
                                unit={unit}
                                phase={phase}
                            />
                        ))}
                    </div>
                </div>

                {/* Party Spirit Meter (Now Below Cards) */}
                <div className="flex justify-center z-40 mt-4">
                    <div
                        className={`
                            relative w-[600px] h-14 bg-gray-900/90 rounded-full border-4 overflow-hidden backdrop-blur-md transition-all duration-300
                            ${specialMeter >= 100 && phase === CombatPhase.PLAYER_TURN
                                ? 'border-[var(--color-brand-secondary)] cursor-pointer hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse'
                                : 'border-gray-600 cursor-default'}
                        `}
                        onClick={startSpecialAttack}
                        title={specialMeter >= 100 ? "Click to Activate Ultimate!" : `${Math.floor(specialMeter)}% Spirit`}
                    >
                        {/* Background Bar */}
                        <div
                            className={`h-full transition-all duration-700 ease-out flex items-center justify-start overflow-hidden
                                ${specialMeter >= 100 ? 'bg-gradient-to-r from-purple-800 via-purple-600 to-fuchsia-500' : 'bg-gradient-to-r from-yellow-700 to-yellow-500'}
                            `}
                            style={{ width: `${specialMeter}%` }}
                        >
                            {/* Sparkle effect when full */}
                            {specialMeter >= 100 && (
                                <div className="w-full h-full animate-shimmer bg-white/20" />
                            )}
                        </div>

                        {/* Text Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className={`text-xl font-black uppercase tracking-[0.2em] drop-shadow-lg ${specialMeter >= 100 ? 'text-white' : 'text-gray-200'}`}>
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
                        title={activeChallenge.type === 'RECHARGE' ? "Recharge Focus!" : "ULTIMATE CASTING!"}
                        description={activeChallenge.type === 'RECHARGE' ? "Solve this to regain energy!" : "Solve correctly to UNLEASH POWER!"}
                        onComplete={handleChallengeComplete}
                        onClose={() => setActiveChallenge(null)}
                    />
                )
            }
        </div >
    );
};

export default EncounterPage;
