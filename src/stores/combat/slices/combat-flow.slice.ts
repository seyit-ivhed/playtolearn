import type { StateCreator } from 'zustand';
import type { CombatStore, CombatFlowSlice } from '../interfaces';
import { CombatPhase, type CombatUnit } from '../../../types/combat.types';
import { getCompanionById } from '../../../data/companions.data';

export const createCombatFlowSlice: StateCreator<CombatStore, [], [], CombatFlowSlice> = (set, get) => ({
    initializeCombat: (partyIds, enemies) => {
        const party: CombatUnit[] = partyIds.map((id, index) => {
            const data = getCompanionById(id);
            return {
                id: `party_${id}_${index}`,
                templateId: id,
                name: data.name,
                isPlayer: true,
                maxHealth: data.maxHealth,
                currentHealth: data.maxHealth,
                maxShield: 0,
                currentShield: 0,
                icon: data.icon,
                color: data.color,
                isDead: false,
                hasActed: false,
                currentSpirit: Math.floor(Math.random() * 26) + 25, // 25-50 Initial
                maxSpirit: 100
            };
        });

        const monsters: CombatUnit[] = enemies.map((enemy, index) => {
            return {
                id: `monster_${enemy.id}_${index}`,
                templateId: enemy.id,
                name: enemy.name,
                isPlayer: false,
                maxHealth: enemy.maxHealth,
                currentHealth: enemy.maxHealth,
                maxShield: enemy.maxShield || 0,
                currentShield: 0,
                // Map 'attack' to 'damage' for now, or ensure types align
                damage: enemy.attack,
                icon: enemy.icon || '👾',
                image: enemy.sprite,
                color: '#e74c3c', // Default red for enemies
                isDead: false,
                hasActed: false,
                currentSpirit: 0,
                maxSpirit: 100
            } as any;
        });

        set({
            phase: CombatPhase.PLAYER_TURN,
            turnCount: 1,
            party,
            monsters,
            selectedUnitId: null,
            combatLog: ['Combat Started!']
        });
    },

    endPlayerTurn: () => {
        // Reset monster acted state for the new turn sequence
        const { monsters } = get();
        const newMonsters = monsters.map(m => ({ ...m, hasActed: false }));

        set({
            phase: CombatPhase.MONSTER_TURN,
            monsters: newMonsters
        });

        setTimeout(() => get().processMonsterTurn(), 1000);
    },

    processMonsterTurn: () => {
        const { monsters, party } = get();
        const activeMonsters = monsters.filter(m => !m.isDead);

        if (activeMonsters.length === 0) return; // Should be victory already

        // Simple AI: All monsters attack random party member
        let newParty = [...party];
        const newMonsters = [...monsters];
        const logs: string[] = [];

        activeMonsters.forEach(monster => {
            const livingTargets = newParty.filter(p => !p.isDead);
            if (livingTargets.length === 0) return;

            // Mark monster as acted
            const monsterIndex = newMonsters.findIndex(m => m.id === monster.id);
            if (monsterIndex !== -1) {
                newMonsters[monsterIndex] = { ...newMonsters[monsterIndex], hasActed: true };
            }

            const targetIdx = Math.floor(Math.random() * livingTargets.length);
            const actualTargetIndex = newParty.findIndex(p => p.id === livingTargets[targetIdx].id);
            const target = newParty[actualTargetIndex];

            // Calc Damage vs Shield
            // Using generic damage for now
            let damage = 8;
            // Ideally fetch from monster data using templateId

            if (target.currentShield > 0) {
                if (target.currentShield >= damage) {
                    target.currentShield -= damage;
                    damage = 0;
                } else {
                    damage -= target.currentShield;
                    target.currentShield = 0;
                }
            }

            target.currentHealth = Math.max(0, target.currentHealth - damage);
            if (target.currentHealth === 0) target.isDead = true;

            logs.push(`${monster.name} attacked ${target.name} for ${damage} damage!`);
        });

        // Reset party actions for next turn
        // Also reset rechargeFailed flag
        newParty = newParty.map(u => ({ ...u, hasActed: false }));

        // Passive Charge at start of Player Turn
        // +35 Spirit to all living party members
        newParty = newParty.map(p => {
            if (p.isDead) return p;
            return { ...p, currentSpirit: Math.min(100, p.currentSpirit + 35) };
        });

        set(state => ({
            party: newParty,
            monsters: newMonsters,
            phase: CombatPhase.PLAYER_TURN,
            turnCount: state.turnCount + 1,
            combatLog: [...state.combatLog, ...logs]
        }));

        if (newParty.every(p => p.isDead)) {
            set({ phase: CombatPhase.DEFEAT, combatLog: [...get().combatLog, 'Party Defeated...'] });
        }
    }
});
