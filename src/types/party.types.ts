export interface PartySlot {
    id: string;
    name: string;
    equippedCompanionId: string | null;
    isEncounterSlot?: boolean; // Marks if this slot is active in encounter
}