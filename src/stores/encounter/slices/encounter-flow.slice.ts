import type { StateCreator } from 'zustand';
import type { EncounterStore, EncounterFlowSlice } from '../interfaces';
import { EncounterPhase, type EncounterUnit } from '../../../types/encounter.types';
import { getCompanionById } from '../../../data/companions.data';

export const createEncounterFlowSlice: StateCreator<EncounterStore, [], [], EncounterFlowSlice> = (set, get) => ({
    initializeEncounter: (partyIds, enemies) => {
        const party: EncounterUnit[] = partyIds.map((id, index) => {
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
                isDead: false,
                hasActed: false,
                currentSpirit: data.initialSpirit || 0,
                maxSpirit: 100
            };
        });

        const monsters: EncounterUnit[] = enemies.map((enemy, index) => {
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
                image: enemy.sprite,
                isDead: false,
                hasActed: false,
                currentSpirit: 0,
                maxSpirit: 100
            } as any;
        });

        set({
            phase: EncounterPhase.PLAYER_TURN,
            turnCount: 1,
            party,
            monsters,
            selectedUnitId: null,
            encounterLog: ['Encounter Started!']
        });
    },

    endPlayerTurn: () => {
        // Reset monster acted state for the new turn sequence
        const { monsters } = get();
        const newMonsters = monsters.map(m => ({ ...m, hasActed: false }));

        set({
            phase: EncounterPhase.MONSTER_TURN,
            monsters: newMonsters
        });

        // Wait for "Enemy Turn" banner to complete (2s animation) before starting attacks
        setTimeout(() => get().processMonsterTurn(), 2500);
    },

    processMonsterTurn: () => {
        const { monsters, party } = get();
        const activeMonsters = monsters.filter(m => !m.isDead);

        if (activeMonsters.length === 0) return; // Should be victory already

        let newParty = [...party];
        const newMonsters = [...monsters];
        const logs: string[] = [];

        // Process each monster attack sequentially with delays
        const processMonsterAttack = (monsterIndex: number) => {
            if (monsterIndex >= activeMonsters.length) {
                // All monsters have attacked - prepare for next player turn
                // Reset party actions for next turn
                newParty = newParty.map(u => ({ ...u, hasActed: false }));

                // Passive Charge at start of Player Turn
                // +35 Spirit to all living party members
                newParty = newParty.map(p => {
                    if (p.isDead) return p;
                    return { ...p, currentSpirit: Math.min(100, p.currentSpirit + 35) };
                });

                // Add a cooldown before returning to player turn
                setTimeout(() => {
                    set(state => ({
                        party: newParty,
                        monsters: newMonsters,
                        phase: EncounterPhase.PLAYER_TURN,
                        turnCount: state.turnCount + 1,
                        encounterLog: [...state.encounterLog, ...logs]
                    }));

                    if (newParty.every(p => p.isDead)) {
                        set({ phase: EncounterPhase.DEFEAT, encounterLog: [...get().encounterLog, 'Party Defeated...'] });
                    }
                }, 1000); // 1s cooldown before player turn
                return;
            }

            const monster = activeMonsters[monsterIndex];
            const livingTargets = newParty.filter(p => !p.isDead);

            if (livingTargets.length === 0) {
                // All party members dead, end immediately
                processMonsterAttack(activeMonsters.length);
                return;
            }

            // Mark monster as acted
            const storeMonsterIndex = newMonsters.findIndex(m => m.id === monster.id);
            if (storeMonsterIndex !== -1) {
                newMonsters[storeMonsterIndex] = { ...newMonsters[storeMonsterIndex], hasActed: true };
            }

            const targetIdx = Math.floor(Math.random() * livingTargets.length);
            const actualTargetIndex = newParty.findIndex(p => p.id === livingTargets[targetIdx].id);
            const target = newParty[actualTargetIndex];

            // Calc Damage vs Shield
            let damage = 8;

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

            // Update state immediately so the UI reflects this attack
            set({
                party: newParty,
                monsters: newMonsters,
                encounterLog: [...get().encounterLog, logs[logs.length - 1]]
            });

            // Wait 1s before the next monster attacks
            setTimeout(() => {
                processMonsterAttack(monsterIndex + 1);
            }, 1000);
        };

        // Start processing from the first monster
        processMonsterAttack(0);
    }
});
