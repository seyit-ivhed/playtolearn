import { type CombatUnit, CombatPhase } from '../../types/combat.types';
import { getCompanionById } from '../../data/companions.data';

interface UnitCardProps {
    unit: CombatUnit;
    phase: CombatPhase;
    onAct?: () => void;
    onRecharge?: () => void;
}

export const UnitCard = ({ unit, phase, onAct, onRecharge }: UnitCardProps) => {
    const isMonster = !unit.isPlayer;
    const healthPercent = (unit.currentHealth / unit.maxHealth) * 100;

    // Companion Data
    const companionData = !isMonster ? getCompanionById(unit.templateId) : null;
    const canAct = !unit.hasActed && !unit.isDead && phase === CombatPhase.PLAYER_TURN;

    // Interaction Handler
    const handleCardClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!canAct) return;

        if (unit.rechargeFailed) return;

        if (unit.currentEnergy > 0) {
            onAct?.();
        } else {
            onRecharge?.();
        }
    };

    // Card State Classes
    const cardStateClasses = `
        ${unit.isDead ? 'opacity-50 grayscale' : 'opacity-100'}
        ${unit.hasActed && !unit.isDead ? 'opacity-60 saturate-0 brightness-75 border-gray-600 scale-95' : ''}
        ${!isMonster && !unit.hasActed && canAct ? 'hover:scale-105 hover:z-10 cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}
        ${!isMonster && !unit.hasActed && !canAct ? 'cursor-not-allowed' : ''}
        ${unit.currentEnergy === 0 && !unit.rechargeFailed && !unit.hasActed && !isMonster ? 'ring-4 ring-yellow-400 animate-pulse border-yellow-600' : ''}
    `;

    // Border Colors
    const borderColor = unit.currentEnergy === 0 && !isMonster && !unit.hasActed
        ? 'border-yellow-600'
        : (isMonster ? 'border-red-900' : 'border-[#2c1d11]');

    return (
        <div
            className={`
                relative w-64 h-96 rounded-3xl border-8 transition-all duration-300 flex flex-col items-center
                bg-gray-800 shadow-2xl overflow-visible group
                ${borderColor}
                ${cardStateClasses}
            `}
            onClick={handleCardClick}
            data-testid={`unit-card-${unit.id}`}
        >
            {/* Name Badge - Now at TOP and overlapping */}
            <div className="absolute -top-5 z-20 bg-[#1a120b] border-2 border-[#855e42] px-6 py-1.5 rounded-full shadow-lg">
                <h3 className="text-white font-display font-bold tracking-wide text-lg text-center leading-none whitespace-nowrap">
                    {unit.name}
                </h3>
            </div>

            {/* Background Image (Full Cover) */}
            <div className="absolute inset-0 z-0 bg-gray-900 rounded-[20px] overflow-hidden">
                {!isMonster && companionData ? (
                    <img
                        src={companionData.image}
                        alt={unit.name}
                        className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-8xl text-gray-600">
                        {unit.icon}
                    </div>
                )}
                {/* Gradient Overlay for Text Readability at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none" />

                {/* Visual Recharge Warning Overlay */}
                {unit.currentEnergy === 0 && !unit.hasActed && !isMonster && (
                    <div className="absolute inset-0 bg-yellow-900/30 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-full border-2 border-yellow-400 transform rotate-12 shadow-2xl">
                            <span className="text-4xl animate-bounce">⚡️</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Stats (Energy & Shield) - Pushed down slightly to clear name */}
            <div className="relative z-10 w-full flex justify-between px-3 pt-6">
                {/* Energy Pips */}
                {!isMonster && (
                    <div className="flex gap-1.5 bg-black/60 p-1.5 rounded-full backdrop-blur-md shadow-md border border-white/10">
                        {Array(unit.maxEnergy).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    w-3 h-3 rounded-full border border-gray-400
                                    ${i < unit.currentEnergy
                                        ? 'bg-[var(--color-brand-accent)] shadow-[0_0_8px_var(--color-brand-accent)]'
                                        : 'bg-gray-700'}
                                `}
                            />
                        ))}
                    </div>
                )}

                {/* Shield Indicator */}
                {unit.currentShield > 0 && (
                    <div className="bg-blue-600 border-2 border-white text-white font-bold text-xs px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                        🛡️ {unit.currentShield}
                    </div>
                )}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Info Panel */}
            <div className="relative z-10 w-full flex flex-col items-center pb-4 px-3 gap-3">

                {/* Description Box */}
                {!isMonster && companionData && (
                    <div className="w-full bg-[#e3dcd2]/95 border-2 border-[#855e42] rounded-xl p-3 shadow-lg min-h-[70px] flex items-center justify-center relative">
                        {/* Ability Name Tag */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#855e42] text-[#e3dcd2] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-[#4a3425]">
                            Ability
                        </div>
                        <p className="text-[#3c2f2f] text-xs font-serif font-semibold text-center leading-tight">
                            {companionData.abilityDescription}
                        </p>
                    </div>
                )}

                {/* Health Bar */}
                <div className="w-full h-6 bg-gray-900 rounded-full border-2 border-gray-500 relative overflow-hidden shadow-lg">
                    <div
                        className={`absolute inset-0 transition-all duration-500 ${isMonster ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'}`}
                        style={{ width: `${healthPercent}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] border-white/20">
                        <span className="mr-1">HP</span> {unit.currentHealth} / {unit.maxHealth}
                    </div>
                </div>
            </div>
        </div>
    );
};
