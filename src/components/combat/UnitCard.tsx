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
        ${unit.hasActed && !unit.isDead ? 'opacity-70 saturate-50 scale-95 border-gray-400' : ''}
        ${!isMonster && !unit.hasActed && canAct ? 'hover:scale-105 hover:z-10 cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]' : ''}
        ${!isMonster && !unit.hasActed && !canAct ? 'cursor-not-allowed' : ''}
    `;

    // Border Colors
    const borderColor = isMonster ? 'border-red-900' : 'border-[#2c1d11]'; // Dark brown vs Dark red

    return (
        <div
            className={`
                relative w-64 h-80 rounded-3xl border-8 transition-all duration-300 flex flex-col items-center
                bg-gray-800 shadow-2xl overflow-hidden group
                ${borderColor}
                ${cardStateClasses}
            `}
            onClick={handleCardClick}
            data-testid={`unit-card-${unit.id}`}
        >
            {/* Background Image (Full Cover) */}
            <div className="absolute inset-0 z-0 bg-gray-900">
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
                {/* Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
            </div>

            {/* Top Stats (Energy & Shield) */}
            <div className="relative z-10 w-full flex justify-between px-4 pt-4">
                {/* Energy Pips */}
                {!isMonster && (
                    <div className="flex gap-1.5 bg-black/50 p-1.5 rounded-full backdrop-blur-md">
                        {Array(unit.maxEnergy).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={`
                                    w-3 h-3 rounded-full border border-gray-400
                                    ${i < unit.currentEnergy
                                        ? 'bg-[var(--color-brand-accent)] shadow-[0_0_8px_var(--color-brand-accent)]'
                                        : 'bg-gray-600'}
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

            {/* Acted / Dead Overlays */}
            {unit.hasActed && !unit.isDead && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="bg-gray-900/90 text-gray-300 text-xl font-black px-6 py-2 rounded-xl border-2 border-gray-600 transform -rotate-12">
                        ZZZ...
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Info Panel */}
            <div className="relative z-10 w-full flex flex-col items-center pb-4 px-2">

                {/* Name Badge */}
                <div className="mb-2 bg-[#1a120b] border-2 border-[#855e42] px-6 py-1.5 rounded-full shadow-lg transform -translate-y-2">
                    <h3 className="text-white font-display font-bold tracking-wide text-lg text-center leading-none">
                        {unit.name}
                    </h3>
                </div>

                {/* Ability Description (The WoW/Hearthstone flavor text area) */}
                {!isMonster && companionData && (
                    <div className="w-full bg-[#e3dcd2] border-2 border-[#855e42] rounded-xl p-2.5 mb-2 shadow-inner min-h-[60px] flex items-center justify-center">
                        <p className="text-[#3c2f2f] text-xs font-serif font-semibold text-center leading-tight">
                            {companionData.abilityDescription}
                        </p>
                    </div>
                )}

                {/* Monster Description Placeholder */}
                {isMonster && (
                    <div className="w-full h-8" />
                )}

                {/* Health Bar (Thick & Visible) */}
                <div className="w-full h-5 bg-gray-900 rounded-full border border-gray-600 relative overflow-hidden shadow-inner">
                    <div
                        className={`absolute inset-0 transition-all duration-500 ${isMonster ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'}`}
                        style={{ width: `${healthPercent}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow-md">
                        {unit.currentHealth} / {unit.maxHealth}
                    </div>
                </div>

                {/* Call to Action Hint (Only if active player turn and clickable) */}
                {!isMonster && canAct && !unit.rechargeFailed && (
                    <div className="mt-2 text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-widest animate-pulse">
                        {unit.currentEnergy > 0 ? 'Click to Attack!' : 'Click to Recharge!'}
                    </div>
                )}
            </div>
        </div>
    );
};
