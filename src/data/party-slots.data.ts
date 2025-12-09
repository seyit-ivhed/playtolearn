import type { PartySlot } from '../types/party.types';

/**
 * Party slots - 4 generic slots for any companions
 * Player chooses which 4 companions to bring on each adventure
 */
export const PARTY_SLOTS: PartySlot[] = [
    {
        id: 'slot_1',
        name: 'Slot 1',
        equippedCompanionId: 'companion_fire_knight', // Default starter
        isCombatSlot: true
    },
    {
        id: 'slot_2',
        name: 'Slot 2',
        equippedCompanionId: 'companion_crystal_guardian', // Default starter
        isCombatSlot: true
    },
    {
        id: 'slot_3',
        name: 'Slot 3',
        equippedCompanionId: null,
        isCombatSlot: true
    },
    {
        id: 'slot_4',
        name: 'Slot 4',
        equippedCompanionId: null,
        isCombatSlot: true
    }
];

/**
 * Get all combat-ready party slots (currently all 4)
 */
export const getCombatSlots = (): PartySlot[] => {
    return PARTY_SLOTS.filter(slot => slot.isCombatSlot);
};

/**
 * Get a specific slot by ID
 */
export const getSlotById = (id: string): PartySlot | undefined => {
    return PARTY_SLOTS.find(slot => slot.id === id);
};
