
import type { EncounterStore } from '../../interfaces';

export const performGuardianAction = (
    get: () => EncounterStore,
    set: any,
    _partyIndex: number,
    companionData: any,
    multiplier: number
): string => {
    const { party } = get();
    // Shield random ally
    const baseAmount = companionData.stats.abilityShield || 15;
    const amount = baseAmount * multiplier;

    const newParty = [...party];
    const targetIndex = Math.floor(Math.random() * newParty.length);
    newParty[targetIndex] = {
        ...newParty[targetIndex],
        currentShield: newParty[targetIndex].currentShield + amount
    };

    set({ party: newParty });
    return ` Shielded ${newParty[targetIndex].name} for ${amount}.`;
};
