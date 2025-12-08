import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../stores/combat.store';
import { useGameStore } from '../stores/game.store';
import { type CombatUnit, CombatPhase } from '../types/combat.types';
import { getCompanionById } from '../data/companions.data';

const UnitCard = ({ unit, phase, onAct, onRecharge }: {
    unit: CombatUnit,
    phase: CombatPhase,
    onAct?: () => void,
    onRecharge?: () => void
}) => {
    const isMonster = !unit.isPlayer;
    const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN;

    return (
        <div
            className={`
                relative w-56 p-4 rounded-2xl border-4 transition-all flex flex-col gap-2
                ${unit.isDead ? 'opacity-50 grayscale' : 'opacity-100'}
                ${unit.hasActed && !unit.isDead ? 'opacity-70 saturate-50 scale-95 border-gray-400' : 'border-[var(--color-bg-tertiary)] bg-white shadow-lg'}
                ${!isMonster && !unit.hasActed ? 'hover:scale-105 hover:z-10' : ''}
            `}
            data-testid={`unit-card-${unit.templateId}`}
        >
            {/* Acted Status Overlay */}
            {unit.hasActed && !unit.isDead && (
                <div className="absolute top-2 right-2 z-20 bg-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    DONE
                </div>
            )}

            {/* Health Bar */}
            <div className="absolute -top-3 left-4 right-4 h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-white shadow-sm z-20">
                <div
                    className={`h-full transition-all duration-500 ${isMonster ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'}`}
                    style={{ width: `${healthPercent}%` }}
                />
            </div>

            {/* Shield Overlay */}
            {unit.currentShield > 0 && (
                <div className="absolute -top-5 -right-2 bg-blue-500 text-white font-bold text-xs px-2 py-0.5 rounded-full border border-white z-20">
                    🛡️ {unit.currentShield}
                </div>
            )}

            {/* Image / Icon */}
            <div className="flex justify-center mt-2 mb-1">
                {!isMonster && companionData ? (
                    <img
                        src={companionData.image}
                        alt={unit.name}
                        className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
                    />
                ) : (
                    <div className="text-6xl my-4 text-center">{unit.icon}</div>
                )}
            </div>

            {/* Content Container */}
            <div className="flex flex-col items-center text-center gap-1">
                <div className="font-black text-lg leading-tight text-[var(--color-text-primary)]">
                    {unit.name}
                </div>

                {/* Description (Player Only) */}
                {!isMonster && companionData && (
                    <div className="text-xs text-[var(--color-text-secondary)] italic line-clamp-2 h-8 leading-tight">
                        {companionData.description}
                    </div>
                )}
            </div>

            {/* Player Actions */}
            {!isMonster && companionData && (
                <div className="mt-2 flex flex-col gap-2">
                    {/* Energy Pips */}
                    <div className="flex justify-center gap-1 mb-1">
                        {Array(unit.maxEnergy).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full border border-gray-400 ${i < unit.currentEnergy ? 'bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'bg-gray-200'}`}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Ability Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onAct?.(); }}
                            disabled={!canAct || unit.currentEnergy <= 0}
                            className={`
                                flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2
                                ${canAct && unit.currentEnergy > 0
                                    ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-accent)] text-white cursor-pointer hover:brightness-110 active:scale-95'
                                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
                            `}
                            title={companionData.abilityDescription}
                            data-testid={`action-btn-ability-${unit.id}`}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider">{companionData.abilityName}</span>
                            <span className="text-[10px] opacity-80">1 Energy</span>
                        </button>

                        {/* Recharge Button */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onRecharge?.(); }}
                            disabled={!canAct} // Can always recharge if it's their turn and they haven't acted? Or only if energy < max? Assuming always allowed if hasActed is false.
                            className={`
                                flex flex-col items-center justify-center py-2 px-1 rounded-lg border-2
                                ${canAct
                                    ? 'bg-[var(--color-warning)] border-yellow-600 text-white cursor-pointer hover:brightness-110 active:scale-95'
                                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'}
                            `}
                            data-testid={`action-btn-recharge-${unit.id}`}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider">Recharge</span>
                            <span className="text-[10px] opacity-80">Ends Turn</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const EncounterPage = () => {
    const navigate = useNavigate();
    const {
        phase, party, monsters,
        performAction, rechargeUnit
    } = useCombatStore();

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

                {/* Spacer for centering logic if needed, or maybe specific HUD element */}
                <div className="w-24"></div>
            </div>

            {/* Battlefield */}
            <div className="flex-1 flex items-center justify-center gap-16 px-12 z-0 pb-12">
                {/* Party Grid */}
                <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
                    {party.map(unit => (
                        <div key={unit.id} className="transition-transform duration-300">
                            <UnitCard
                                unit={unit}
                                phase={phase}
                                onAct={() => performAction(unit.id)}
                                onRecharge={() => rechargeUnit(unit.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* VS Indicator */}
                <div className="flex flex-col items-center justify-center opacity-80 mix-blend-overlay">
                    <div className="h-32 w-1 bg-white/30 rounded-full mb-4"></div>
                    <span className="text-4xl font-black text-white italic">VS</span>
                    <div className="h-32 w-1 bg-white/30 rounded-full mt-4"></div>
                </div>

                {/* Monsters Grid */}
                <div className="flex flex-col gap-6 items-center">
                    {monsters.map(unit => (
                        <UnitCard
                            key={unit.id}
                            unit={unit}
                            phase={phase} // Pass phase to monster too, though functionality logic is restricted inside
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EncounterPage;
