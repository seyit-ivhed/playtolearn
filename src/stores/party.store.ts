import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PartyComposition, PartyStats, Companion } from '../types/party.types';
import { CompanionRole } from '../types/party.types';
import { getCompanionById } from '../data/companions.data';
import { PARTY_SLOTS, getCombatSlots } from '../data/party-slots.data';

export interface PartyState {
    composition: PartyComposition;
    baseStats: PartyStats;

    // Actions
    addCompanion: (slotId: string, companionId: string) => void;
    removeCompanion: (slotId: string) => void;
    resetParty: () => void;

    // Computed
    getTotalStats: () => PartyStats;
    getActiveCompanions: () => Companion[];
    isPartyCombatReady: () => boolean;
}

// Initialize composition from PARTY_SLOTS
const INITIAL_COMPOSITION: PartyComposition = PARTY_SLOTS.reduce((acc, slot) => {
    acc[slot.id] = slot.equippedCompanionId;
    return acc;
}, {} as PartyComposition);

const BASE_STATS: PartyStats = {
    health: 100,
    maxHealth: 100,
    energy: 50,
    maxEnergy: 50,
    attack: 0,
    defense: 0,
    speed: 10
};

export const usePartyStore = create<PartyState>()(
    persist(
        (set, get) => ({
            composition: INITIAL_COMPOSITION,
            baseStats: BASE_STATS,

            addCompanion: (slotId, companionId) =>
                set((state) => ({
                    composition: { ...state.composition, [slotId]: companionId }
                })),

            removeCompanion: (slotId) =>
                set((state) => ({
                    composition: { ...state.composition, [slotId]: null }
                })),

            resetParty: () => set({
                composition: INITIAL_COMPOSITION,
                baseStats: BASE_STATS
            }),

            getTotalStats: () => {
                const state = get();
                const totalStats = { ...state.baseStats };

                Object.values(state.composition).forEach(companionId => {
                    if (companionId) {
                        const companion = getCompanionById(companionId);
                        if (companion && companion.stats) {
                            if (companion.stats.health) totalStats.health += companion.stats.health;
                            if (companion.stats.energy) totalStats.energy += companion.stats.energy;
                            if (companion.stats.attack) totalStats.attack += companion.stats.attack;
                            if (companion.stats.defense) totalStats.defense += companion.stats.defense;
                            if (companion.stats.speed) totalStats.speed += companion.stats.speed;
                        }
                    }
                });

                return totalStats;
            },

            getActiveCompanions: () => {
                const state = get();
                const combatSlots = getCombatSlots();

                return combatSlots
                    .map(slot => {
                        const companionId = state.composition[slot.id];
                        return companionId ? getCompanionById(companionId) : null;
                    })
                    .filter((c): c is Companion => {
                        return c !== null && c !== undefined && c.combatAction !== undefined;
                    });
            },

            isPartyCombatReady: () => {
                const companions = get().getActiveCompanions();
                const warriorCount = companions.filter(c => c.role === CompanionRole.WARRIOR).length;

                // Must have at least 1 warrior companion equipped
                return warriorCount >= 1;
            }
        }),
        {
            name: 'party-storage',
        }
    )
);
