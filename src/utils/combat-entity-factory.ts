import type { CombatEntity, CompanionInstance } from '../types/combat.types';
import type { PartyComposition, PartyStats, Companion } from '../types/party.types';
import { getCombatSlots } from '../data/party-slots.data';
import { getCompanionById } from '../data/companions.data';

/**
 * Creates a CombatEntity from party composition and stats
 * Converts equipped companions into CompanionInstances for combat
 */
export function createPlayerCombatEntity(
    partyComposition: PartyComposition,
    partyStats: PartyStats
): CombatEntity {
    const combatSlots = getCombatSlots();

    const equippedCompanions: CompanionInstance[] = combatSlots
        .map(slot => {
            const companionId = partyComposition[slot.id];
            if (!companionId) return null;

            const companion = getCompanionById(companionId);
            if (!companion || !companion.combatAction) return null;

            return {
                companionId: companion.id,
                slotId: slot.id,
                currentEnergy: companion.stats.maxEnergy || 1,
                maxEnergy: companion.stats.maxEnergy || 1,
                combatAction: companion.combatAction as string
            };
        })
        .filter((c): c is CompanionInstance => c !== null && c !== undefined);

    return {
        id: 'player',
        name: 'Player',
        maxHealth: partyStats.maxHealth,
        currentHealth: partyStats.health,
        maxShield: 50,
        currentShield: 50,
        equippedCompanions,
        // Legacy companions structure for backward compatibility
        companions: {
            attack: { currentEnergy: 3, maxEnergy: 3 },
            defend: { currentEnergy: 2, maxEnergy: 2 },
            special: { currentEnergy: 2, maxEnergy: 2 },
        },
        sprite: '/assets/images/party/player_party.png'
    };
}

/**
 * Creates an enemy CombatEntity with default companions
 */
export function createEnemyCombatEntity(
    name: string,
    health: number,
    companions?: Companion[]
): CombatEntity {
    const equippedCompanions: CompanionInstance[] = companions
        ? companions.map((companion, index) => ({
            companionId: companion.id,
            slotId: `enemy_slot_${index}`,
            currentEnergy: companion.stats.maxEnergy || 1,
            maxEnergy: companion.stats.maxEnergy || 1,
            combatAction: companion.combatAction || 'ATTACK'
        }))
        : [];

    return {
        id: 'enemy',
        name,
        maxHealth: health,
        currentHealth: health,
        maxShield: 0,
        currentShield: 0,
        equippedCompanions,
        // Legacy companions structure
        companions: {
            attack: { currentEnergy: 0, maxEnergy: 0 },
            defend: { currentEnergy: 0, maxEnergy: 0 },
            special: { currentEnergy: 0, maxEnergy: 0 },
        }
    };
}
