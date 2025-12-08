import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/game.store';
import { getCompanionById } from '../data/companions.data';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const { unlockedCompanions, activeParty, addToParty, removeFromParty } = useGameStore();

    // Helper to get remaining slots
    const slots = Array(4).fill(null).map((_, i) => activeParty[i] || null);

    return (
        <div className="flex flex-col h-full p-4 gap-4 bg-[url('/camp-bg-pattern.png')] bg-cover">
            {/* Header */}
            <header className="flex justify-between items-center bg-[var(--color-bg-primary)] p-4 rounded-xl shadow-md border-b-4 border-[var(--color-bg-tertiary)]">
                <div>
                    <h1 className="text-3xl m-0" data-testid="camp-title">Fellowship Camp</h1>
                    <p className="text-[var(--color-text-secondary)]">Gather your heroes around the fire</p>
                </div>
                <button
                    onClick={() => navigate('/map')}
                    className="flex items-center gap-2"
                    data-testid="nav-map-btn"
                >
                    🗺️ Return to Map
                </button>
            </header>

            <div className="flex gap-4 flex-1 overflow-hidden">
                {/* Left: Active Party (Campfire) */}
                <section className="flex-[2] flex flex-col gap-4 bg-[var(--color-bg-primary)] p-6 rounded-2xl shadow-xl border-2 border-[var(--color-bg-tertiary)] bg-[url('/campfire-bg.png')] bg-no-repeat bg-bottom">
                    <h2 className="text-2xl text-center mb-4">Your Party ({activeParty.length}/{MAX_PARTY_SIZE})</h2>

                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {slots.map((companionId, idx) => {
                            if (!companionId) {
                                return (
                                    <div key={`empty-${idx}`} className="border-4 border-dashed border-[var(--color-bg-tertiary)] rounded-xl flex items-center justify-center bg-[rgba(0,0,0,0.05)]" data-testid="empty-slot">
                                        <div className="text-[var(--color-text-secondary)] font-bold">Empty Slot</div>
                                    </div>
                                );
                            }

                            const data = getCompanionById(companionId);
                            return (
                                <div key={companionId} className="relative group card flex flex-col items-center justify-center gap-2 hover:border-[var(--color-danger)] cursor-pointer transition-all overflow-hidden" onClick={() => removeFromParty(companionId)} data-testid={`party-card-${companionId}`}>
                                    <div className="flex flex-col items-center z-10">
                                        <img src={data.image} alt={data.name} className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mb-2" />
                                        <div className="font-bold text-lg text-shadow-sm">{data.name}</div>
                                        <div className="text-xs px-2 py-1 rounded bg-white/80 font-bold">{data.role}</div>
                                    </div>

                                    {/* Subtle background glow based on character color */}
                                    <div className="absolute inset-0 opacity-20" style={{ backgroundColor: data.color }}></div>

                                    <div className="absolute inset-0 bg-[var(--color-danger)] opacity-0 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute top-2 right-2 text-white drop-shadow-md opacity-0 group-hover:opacity-100 font-bold z-20">✕ Remove</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Right: Roster (Guild Hall) */}
                <section className="flex-1 flex flex-col gap-4 bg-[var(--color-bg-secondary)] p-6 rounded-2xl shadow-inner border-2 border-[var(--color-bg-tertiary)] overflow-y-auto">
                    <h2 className="text-xl text-center sticky top-0 bg-[var(--color-bg-secondary)] pb-2 border-b-2 border-gray-300">Roster</h2>

                    <div className="flex flex-col gap-3">
                        {unlockedCompanions.map(id => {
                            const inParty = activeParty.includes(id);
                            const data = getCompanionById(id);

                            return (
                                <div
                                    key={id}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all select-none
                                        ${inParty
                                            ? 'opacity-50 border-transparent bg-gray-200 cursor-not-allowed'
                                            : 'bg-white border-[var(--color-bg-tertiary)] hover:border-[var(--color-brand-primary)] cursor-pointer shadow-sm hover:translate-x-1'
                                        }
                                    `}
                                    onClick={() => !inParty && addToParty(id)}
                                >
                                    <img src={data.image} alt={data.name} className="w-12 h-12 object-cover rounded-full border-2 border-gray-300" />
                                    <div className="flex-1">
                                        <div className="font-bold">{data.name}</div>
                                        <div className="text-xs text-[var(--color-text-secondary)]">{data.role}</div>
                                    </div>
                                    {inParty && <div className="text-xs font-bold text-green-600">In Party</div>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CampPage;
