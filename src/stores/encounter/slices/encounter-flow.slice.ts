import type { StateCreator } from 'zustand';
import type { EncounterStore, EncounterFlowSlice } from '../interfaces';
import { EncounterPhase, type EncounterUnit } from '../../../types/encounter.types';
import { getCompanionById } from '../../../data/companions.data';
import { getStatsForLevel } from '../../../utils/progression.utils';
import { getMonsterSprite } from '../../../data/monster-sprites';
import { applyDamage } from '../../../utils/battle/damage.utils';
import { selectRandomTarget } from '../../../utils/battle/combat.utils';

export const createEncounterFlowSlice: StateCreator<EncounterStore, [], [], EncounterFlowSlice> = (set, get) => ({
    initializeEncounter: (partyIds, enemies, xpReward, nodeIndex, companionStats) => {
        const party: EncounterUnit[] = partyIds
            .filter(id => {
                const data = getCompanionById(id);
                if (!data) {
                    console.warn(`Companion "${id}" not found in data, skipping...`);
                    return false;
                }
                return true;
            })
            .map((id, index) => {
                const data = getCompanionById(id);
                const stats = companionStats[id] || { level: 1, xp: 0 };
                const calculatedStats = getStatsForLevel(data, stats.level);

                return {
                    id: `party_${id}_${index}`,
                    templateId: id,
                    name: data.name,
                    isPlayer: true,
                    maxHealth: calculatedStats.maxHealth,
                    currentHealth: calculatedStats.maxHealth,
                    maxShield: 0,
                    currentShield: 0,
                    damage: calculatedStats.abilityDamage || 0,
                    specialAbilityValue: calculatedStats.specialAbilityValue || 0,
                    isDead: false,
                    hasActed: false,
                    currentSpirit: data.initialSpirit || 0,
                    maxSpirit: 100,
                    spiritGain: calculatedStats.spiritGain || 0
                };
            });

        const monsters: EncounterUnit[] = enemies.map((enemy, index) => {
            return {
                id: `monster_${enemy.id}_${index}`,
                templateId: enemy.id,
                name: enemy.name || enemy.id,
                isPlayer: false,
                maxHealth: enemy.maxHealth,
                currentHealth: enemy.maxHealth,
                maxShield: enemy.maxShield || 0,
                currentShield: 0,
                // Map 'attack' to 'damage' for now, or ensure types align
                damage: enemy.attack,
                image: getMonsterSprite(enemy.id),
                isDead: false,
                hasActed: false,
                currentSpirit: 0,
                maxSpirit: 100,
                spiritGain: 0,
                isBoss: enemy.isBoss
            };
        });

        set({
            phase: EncounterPhase.PLAYER_TURN,
            turnCount: 1,
            party,
            monsters,
            selectedUnitId: null,
            encounterLog: ['Encounter Started!'],
            xpReward,
            nodeIndex
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

        // Wait for "Enemy Turn" banner to complete (1.6s animation) before starting attacks
        setTimeout(() => get().processMonsterTurn(), 1700);
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
                // Spirit to all living party members based on their spiritGain stat
                newParty = newParty.map(p => {
                    if (p.isDead) return p;
                    return { ...p, currentSpirit: Math.min(100, p.currentSpirit + p.spiritGain) };
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
                }, 500); // 0.5s cooldown before player turn
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

            // Random target selection
            const targetIdx = selectRandomTarget(newParty);
            if (targetIdx === -1) {
                // No valid targets, skip this monster's turn or end encounter if all party members are dead
                processMonsterAttack(monsterIndex + 1);
                return;
            }

            const target = newParty[targetIdx];
            const result = applyDamage(target, monster.damage || 8);
            newParty[targetIdx] = result.unit;

            logs.push(`${monster.name} attacked ${result.unit.name} for ${result.damageDealt} damage!`);

            // Update state immediately so the UI reflects this attack
            set({
                party: newParty,
                monsters: newMonsters,
                encounterLog: [...get().encounterLog, logs[logs.length - 1]]
            });

            // Wait 1s before the next monster attacks
            setTimeout(() => {
                processMonsterAttack(monsterIndex + 1);
            }, 600);
        };

        // Start processing from the first monster
        processMonsterAttack(0);
    }
});
