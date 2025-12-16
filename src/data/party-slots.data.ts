import type { PartySlot } from '../types/party.types';

/**
 * Party slots - 4 generic slots for any companions
 * Player chooses which 4 companions to bring on each adventure
 */
export const PARTY_SLOTS: PartySlot[] = [
    {
        id: 'slot_1',
        name: 'Slot 1',
        equippedCompanionId: 'village_squire', // Default starter
        isEncounterSlot: true
    },
    {
        id: 'slot_2',
        name: 'Slot 2',
        equippedCompanionId: 'novice_archer', // Default starter
        isEncounterSlot: true
    },
    {
        id: 'slot_3',
        name: 'Slot 3',
        equippedCompanionId: null,
        isEncounterSlot: true
    },
    {
        id: 'slot_4',
        name: 'Slot 4',
        equippedCompanionId: null,
        isEncounterSlot: true
    }
];

/**
 * Get a specific slot by ID
 */
export const getSlotById = (id: string): PartySlot | undefined => {
    return PARTY_SLOTS.find(slot => slot.id === id);
};

/**
 * Get all encounter-ready party slots (currently all 4)
 */
export const getEncounterSlots = (): PartySlot[] => {
    return PARTY_SLOTS.filter(slot => slot.isEncounterSlot);
};
