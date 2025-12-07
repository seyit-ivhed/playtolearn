import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCombatStore } from '../stores/combat.store';
import { useGameStore } from '../stores/game.store';
import { type CombatUnit, CombatPhase } from '../types/combat.types';
import { getCompanionById } from '../data/companions.data';

const UnitCard = ({ unit, isActive, onClick, onRecharge }: {
    unit: CombatUnit,
    isActive: boolean,
    onClick?: () => void,
    onRecharge?: () => void
}) => {
    const isEnemy = !unit.isPlayer;
    const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

    // Companion Specifics
    // Base data lookup (if needed later)
    // const companionData = unit.isPlayer ? getCompanionById(unit.templateId) : null;

    return (
        <div
            className={`
                relative w-40 p-3 rounded-xl border-4 transition-all
                ${unit.isDead ? 'opacity-50 grayscale' : 'opacity-100'}
                ${isActive ? 'scale-110 border-[var(--color-brand-accent)] shadow-[0_0_20px_var(--color-brand-accent)] z-10' : 'border-[var(--color-bg-tertiary)] bg-white'}
                ${!isEnemy && isActive ? 'cursor-pointer' : ''}
            `}
            onClick={() => !isEnemy && !unit.isDead && onClick?.()}
        >
            {/* Health Bar */}
            <div className="absolute -top-4 left-2 right-2 h-4 bg-gray-700 rounded-full overflow-hidden border-2 border-white">
                <div
                    className={`h-full transition-all duration-500 ${isEnemy ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'}`}
                    style={{ width: `${healthPercent}%` }}
                />
            </div>

            {/* Shield Overlay */}
            {unit.currentShield > 0 && (
                <div className="absolute -top-6 -right-2 bg-blue-500 text-white font-bold text-xs px-2 py-0.5 rounded-full border border-white">
                    🛡️ {unit.currentShield}
                </div>
            )}

            {/* Icon */}
            <div className="flex justify-center text-5xl my-2">
                {unit.icon}
            </div>

            {/* Name */}
            <div className="text-center font-bold text-sm truncate">{unit.name}</div>

            {/* Energy (Player Only) */}
            {!isEnemy && (
                <div className="flex justify-center gap-1 mt-2">
                    {Array(unit.maxEnergy).fill(0).map((_, i) => (
                        <div
                            key={i}
                            className={`w-3 h-3 rounded-full border border-gray-400 ${i < unit.currentEnergy ? 'bg-yellow-400' : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
            )}

            {/* Recharge Button Overlay */}
            {!isEnemy && unit.currentEnergy === 0 && !unit.isDead && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRecharge?.(); }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold rounded-lg hover:bg-black/70 backdrop-blur-sm animate-pulse"
                >
                    ⚡ RECHARGE
                </button>
            )}
        </div>
    );
};

const CombatPage = () => {
    const navigate = useNavigate();
    const {
        phase, party, enemies, combatLog, selectedUnitId,
        selectUnit, performAction, rechargeUnit, endPlayerTurn
    } = useCombatStore();

    const selectedUnit = party.find(u => u.id === selectedUnitId);

    // Auto-select first active unit if none selected
    useEffect(() => {
        if (phase === CombatPhase.PLAYER_TURN && !selectedUnitId) {
            const firstActive = party.find(u => !u.isDead && u.currentEnergy > 0);
            if (firstActive) selectUnit(firstActive.id);
        }
    }, [phase, party, selectedUnitId, selectUnit]);

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
            <div className="flex justify-between p-4 z-10">
                <button onClick={handleRetreat} className="bg-gray-500 text-sm py-1 px-3" data-testid="combat-retreat-btn">🏳️ Retreat</button>
                <div className="bg-black/50 text-white px-4 py-1 rounded-full font-bold" data-testid="combat-turn-indicator">
                    {phase === CombatPhase.PLAYER_TURN ? "YOUR TURN" : (phase === CombatPhase.ENEMY_TURN ? "ENEMY TURN..." : phase)}
                </div>
            </div>

            {/* Battlefield */}
            <div className="flex-1 flex items-center justify-between px-12 z-0">

                {/* Left: Party */}
                <div className="grid grid-cols-2 gap-8 items-center">
                    {party.map(unit => (
                        <div key={unit.id} className={unit.id === selectedUnitId ? 'transform translate-x-4 transition-transform' : ''} data-testid={`unit-card-${unit.templateId}`}>
                            <UnitCard
                                unit={unit}
                                isActive={unit.id === selectedUnitId || (phase === CombatPhase.ENEMY_TURN && !unit.isDead)} // Highlight target in enemy turn if needed, but simplified for now
                                onClick={() => selectUnit(unit.id)}
                                onRecharge={() => rechargeUnit(unit.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* VS */}
                {phase === CombatPhase.ENEMY_TURN && (
                    <div className="text-6xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pulse">
                        VS
                    </div>
                )}

                {/* Right: Enemies */}
                <div className="flex flex-col gap-4 items-center">
                    {enemies.map(unit => (
                        <UnitCard key={unit.id} unit={unit} isActive={false} />
                    ))}
                </div>
            </div>

            {/* Bottom: Action Menu */}
            <div className="h-48 bg-[var(--color-bg-primary)] border-t-4 border-[var(--color-bg-tertiary)] flex shadow-2xl z-20">
                {/* Info Panel */}
                <div className="w-1/3 p-4 border-r-2 border-[var(--color-bg-tertiary)] bg-[var(--color-bg-secondary)] relative">
                    {selectedUnit ? (
                        <>
                            <div className="font-bold text-xl mb-1">{selectedUnit.name}</div>
                            {(() => {
                                const data = getCompanionById(selectedUnit.templateId);
                                return (
                                    <>
                                        <div className="text-sm text-[var(--color-text-secondary)] mb-2 italic">"{data.description}"</div>
                                        <div className="bg-white p-2 rounded-lg border border-gray-300">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-2xl">{data.icon}</span>
                                                <span className="font-bold text-[var(--color-brand-primary)]">{data.abilityName}</span>
                                            </div>
                                            <div className="text-xs">{data.abilityDescription}</div>
                                        </div>
                                    </>
                                );
                            })()}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic">Select a hero...</div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center gap-4">
                    {phase === CombatPhase.PLAYER_TURN ? (
                        <div className="flex items-center gap-4">
                            <button
                                className="text-lg py-4 px-8 min-w-[200px] flex flex-col items-center gap-1 hover:scale-105"
                                disabled={!selectedUnit || selectedUnit.currentEnergy <= 0}
                                onClick={() => selectedUnit && performAction(selectedUnit.id)}
                                data-testid="combat-act-btn"
                            >
                                <span className="text-2xl">⚔️</span>
                                <div>ACT</div>
                                {selectedUnit && <div className="text-xs opacity-80 font-normal">Costs 1 Energy</div>}
                            </button>

                            <div className="w-px h-16 bg-gray-300 mx-4"></div>

                            <button
                                className="bg-[var(--color-warning)]"
                                onClick={endPlayerTurn}
                            >
                                ⏳ End Turn
                            </button>
                        </div>
                    ) : (
                        <div className="text-xl font-bold text-[var(--color-text-secondary)] animate-pulse">
                            Enemy is thinking...
                        </div>
                    )}
                </div>

                {/* Combat Log */}
                <div className="w-1/4 p-4 bg-black/5 overflow-y-auto text-xs font-mono" data-testid="combat-log">
                    {combatLog.slice().reverse().map((log, i) => (
                        <div key={i} className="mb-1 border-b border-black/5 pb-1 last:border-0">
                            {log}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CombatPage;
