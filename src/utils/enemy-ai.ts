import type { CombatAction, CombatEntity } from '../types/combat.types';

export const decideEnemyAction = (enemy: CombatEntity, player: CombatEntity): CombatAction => {
    // Simple logic:
    // If health < 30%, 50% chance to DEFEND (if not already shielded max)
    // Otherwise ATTACK

    const healthPercent = enemy.currentHealth / enemy.maxHealth;

    if (healthPercent < 0.3) {
        const shouldDefend = Math.random() > 0.5;
        if (shouldDefend) {
            return { type: 'defend', value: 5 }; // Restore 5 shield or reduce damage
        }
    }

    return { type: 'attack', value: 10 }; // Default attack damage
};
