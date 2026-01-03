import { ADVENTURES } from '../../../data/adventures.data';
import type { GameStore } from '../../../stores/game/interfaces';
import type { AdventureState } from '../../../stores/adventure.store';

export interface DebugCommandContext {
    log: (message: string) => void;
    setHistory: React.Dispatch<React.SetStateAction<string[]>>;
    stores: {
        game: GameStore;
        adventure: AdventureState;
    };
}

export interface DebugCommand {
    name: string;
    description: string;
    execute: (parts: string[], context: DebugCommandContext) => void;
}

export const DEBUG_COMMANDS: Record<string, DebugCommand> = {
    help: {
        name: 'help',
        description: 'Show available commands',
        execute: (_parts, { log }) => {
            log('Available commands:');
            Object.values(DEBUG_COMMANDS).forEach(cmd => {
                log(`  ${cmd.name.padEnd(15)} - ${cmd.description}`);
            });
        }
    },
    status: {
        name: 'status',
        description: 'Show current game state',
        execute: (_parts, { log, stores }) => {
            const { activeAdventureId, xpPool, companionStats } = stores.game;
            log(`Active Adventure: ${activeAdventureId}`);
            log(`XP Pool: ${xpPool}`);
            log('Companions:');
            Object.entries(companionStats).forEach(([id, stats]) => {
                log(`  ${id}: Level ${stats.level}`);
            });
        }
    },
    unlock: {
        name: 'unlock',
        description: 'Unlock all adventures',
        execute: (_parts, { log, stores }) => {
            stores.adventure.debugUnlockAllAdventures();
            log('All adventures unlocked.');
        }
    },
    goto: {
        name: 'goto',
        description: 'Jump to encounter (goto <index> or <advId> <index>)',
        execute: (parts, { log, stores }) => {
            const arg1 = parts[1];
            const arg2 = parts[2];

            if (arg2) {
                const advId = arg1;
                const targetNode = parseInt(arg2);
                const adventure = ADVENTURES.find(a => a.id === advId);

                if (adventure && !isNaN(targetNode)) {
                    if (targetNode >= 1 && targetNode <= adventure.encounters.length + 1) {
                        stores.adventure.unlockAdventure(advId);
                        stores.game.setActiveAdventure(advId);
                        stores.game.debugSetMapNode(targetNode);
                        log(`Switched to adventure ${advId} and jumped to encounter ${targetNode}.`);
                    } else {
                        log(`Error: Invalid encounter index for adventure ${advId}.`);
                    }
                } else {
                    log(`Error: Adventure ${advId} not found or invalid node.`);
                }
            } else if (arg1) {
                const targetNode = parseInt(arg1);
                const currentAdventure = ADVENTURES.find(a => a.id === stores.game.activeAdventureId);
                if (!isNaN(targetNode) && currentAdventure) {
                    if (targetNode >= 1 && targetNode <= currentAdventure.encounters.length + 1) {
                        stores.game.debugSetMapNode(targetNode);
                        log(`Jumped to encounter ${targetNode} in current adventure.`);
                    } else {
                        log(`Error: Invalid encounter index. Must be between 1 and ${currentAdventure.encounters.length + 1}.`);
                    }
                } else {
                    log('Error: Invalid usage. Usage: goto <index> OR goto <advId> <index>');
                }
            } else {
                log('Error: Missing arguments. Usage: goto <index> OR goto <advId> <index>');
            }
        }
    },
    reset: {
        name: 'reset',
        description: 'Reset progress in current adventure',
        execute: (_parts, { log, stores }) => {
            stores.game.debugSetMapNode(1);
            stores.game.debugResetXpPool();
            stores.game.debugResetCompanions();
            stores.game.debugResetEncounterResults();
            stores.adventure.resetProgress();
            log('Adventure progress, XP pool, and companion levels reset to start.');
        }
    },
    xp: {
        name: 'xp',
        description: 'Add XP to pool (xp <amount>)',
        execute: (parts, { log, stores }) => {
            const amount = parseInt(parts[1]);
            if (!isNaN(amount)) {
                stores.game.debugAddXp(amount);
                log(`Added ${amount} XP to pool.`);
            } else {
                log('Error: Invalid amount. Usage: xp <amount>');
            }
        }
    },
    companions: {
        name: 'companions',
        description: 'Unlock all companions',
        execute: (_parts, { log, stores }) => {
            stores.game.debugUnlockAllCompanions();
            log('All companions unlocked.');
        }
    },
    adv: {
        name: 'adv',
        description: 'Set active adventure by ID (adv <id>)',
        execute: (parts, { log, stores }) => {
            const advId = parts[1];
            if (advId) {
                stores.game.setActiveAdventure(advId);
                log(`Active adventure set to "${advId}".`);
            } else {
                log('Error: Missing ID. Usage: adv <id>');
            }
        }
    },
    level: {
        name: 'level',
        description: 'Set companion level (level <id> <v>)',
        execute: (parts, { log, stores }) => {
            const id = parts[1];
            const level = parseInt(parts[2]);
            if (id && !isNaN(level)) {
                stores.game.debugSetCompanionLevel(id, level);
                log(`Companion "${id}" level set to ${level}.`);
            } else {
                log('Error: Invalid arguments. Usage: level <companionId> <level>');
            }
        }
    },
    lv: {
        name: 'lv',
        description: 'Alias for level',
        execute: (parts, context) => DEBUG_COMMANDS.level.execute(parts, context)
    },
    stars: {
        name: 'stars',
        description: 'Set stars (stars <v> or <idx> <v> or <adv> <idx> <v>)',
        execute: (parts, { log, stores }) => {
            const arg1 = parts[1];
            const arg2 = parts[2];
            const arg3 = parts[3];

            if (arg3) {
                const advId = arg1;
                const nodeIdx = parseInt(arg2);
                const stars = parseInt(arg3);
                if (!isNaN(nodeIdx) && !isNaN(stars)) {
                    stores.game.debugSetEncounterStars(advId, nodeIdx, stars);
                    log(`Stars for adventure ${advId}, node ${nodeIdx} set to ${stars}.`);
                } else {
                    log('Error: Invalid arguments. Usage: stars <advId> <nodeIdx> <stars>');
                }
            } else if (arg2) {
                const nodeIdx = parseInt(arg1);
                const stars = parseInt(arg2);
                if (!isNaN(nodeIdx) && !isNaN(stars)) {
                    stores.game.debugSetEncounterStars(stores.game.activeAdventureId, nodeIdx, stars);
                    log(`Stars for node ${nodeIdx} in current adventure set to ${stars}.`);
                } else {
                    log('Error: Invalid arguments. Usage: stars <nodeIdx> <stars>');
                }
            } else if (arg1) {
                const stars = parseInt(arg1);
                if (!isNaN(stars)) {
                    stores.game.debugSetEncounterStars(stores.game.activeAdventureId, stores.game.currentMapNode, stars);
                    log(`Stars for current node (${stores.game.currentMapNode}) set to ${stars}.`);
                } else {
                    log('Error: Invalid arguments. Usage: stars <stars>');
                }
            } else {
                log('Error: Missing arguments. Usage: stars <val> OR stars <idx> <val> OR stars <adv> <idx> <val>');
            }
        }
    },
    star: {
        name: 'star',
        description: 'Alias for stars',
        execute: (parts, context) => DEBUG_COMMANDS.stars.execute(parts, context)
    },
    clear: {
        name: 'clear',
        description: 'Clear console history',
        execute: (_parts, { setHistory }) => {
            setHistory([]);
        }
    }
};
