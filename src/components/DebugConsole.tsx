import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../stores/game/store';
import { useAdventureStore } from '../stores/adventure.store';
import { ADVENTURES } from '../data/adventures.data';
import styles from './DebugConsole.module.css';

interface DebugConsoleProps {
    onClose: () => void;
}

export const DebugConsole: React.FC<DebugConsoleProps> = ({ onClose }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['Debug console initialized. Type "help" for commands.']);
    const inputRef = useRef<HTMLInputElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    const {
        debugSetMapNode,
        debugAddXp,
        debugResetXpPool,
        debugResetCompanions,
        debugResetEncounterResults,
        debugUnlockAllCompanions,
        debugSetCompanionLevel,
        debugSetEncounterStars,
        xpPool,
        companionStats,
        currentMapNode,
        activeAdventureId,
        setActiveAdventure
    } = useGameStore();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [history]);

    const log = (message: string) => {
        setHistory(prev => [...prev, message]);
    };

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        log(`> ${input}`);
        setInput('');

        const parts = cmd.split(' ');
        const baseCmd = parts[0];

        switch (baseCmd) {
            case 'help':
                log('Available commands:');
                log('  unlock              - Unlock all adventures');
                log('  goto <index>        - Jump to encounter in current adventure');
                log('  goto <advId> <idx>  - Jump to encounter in specific adventure');
                log('  reset               - Reset progress in current adventure');
                log('  xp <amount>     - Add XP to pool');
                log('  companions      - Unlock all companions');
                log('  adv <id>        - Set active adventure by ID');
                log('  level <id> <v>  - Set companion level (e.g. level tara 5)');
                log('  stars <v>       - Set stars for current encounter (e.g. stars 3)');
                log('  stars <i> <v>   - Set stars for encounter in current adventure');
                log('  stars <a> <i> <v>- Set stars for specific adventure encounter');
                log('  status          - Show current game state');
                log('  clear           - Clear console history');
                break;

            case 'status':
                log(`Active Adventure: ${activeAdventureId}`);
                log(`XP Pool: ${xpPool}`);
                log('Companions:');
                Object.entries(companionStats).forEach(([id, stats]) => {
                    log(`  ${id}: Level ${stats.level} (${stats.xp} XP)`);
                });
                break;

            case 'unlock': {
                useAdventureStore.getState().debugUnlockAllAdventures();
                log('All adventures unlocked.');
                break;
            }

            case 'goto': {
                const arg1 = parts[1];
                const arg2 = parts[2];

                if (arg2) {
                    // Usage: goto <adventureId> <encounterIndex>
                    const advId = arg1;
                    const targetNode = parseInt(arg2);
                    const adventure = ADVENTURES.find(a => a.id === advId);

                    if (adventure && !isNaN(targetNode)) {
                        if (targetNode >= 1 && targetNode <= adventure.encounters.length + 1) {
                            // Ensure adventure is unlocked
                            useAdventureStore.getState().unlockAdventure(advId);
                            setActiveAdventure(advId);
                            debugSetMapNode(targetNode);
                            log(`Switched to adventure ${advId} and jumped to encounter ${targetNode}.`);
                        } else {
                            log(`Error: Invalid encounter index for adventure ${advId}.`);
                        }
                    } else {
                        log(`Error: Adventure ${advId} not found or invalid node.`);
                    }
                } else if (arg1) {
                    // Usage: goto <encounterIndex> (current adventure)
                    const targetNode = parseInt(arg1);
                    const currentAdventure = ADVENTURES.find(a => a.id === activeAdventureId);
                    if (!isNaN(targetNode) && currentAdventure) {
                        if (targetNode >= 1 && targetNode <= currentAdventure.encounters.length + 1) {
                            debugSetMapNode(targetNode);
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
                break;
            }

            case 'reset':
                debugSetMapNode(1);
                debugResetXpPool();
                debugResetCompanions();
                debugResetEncounterResults();
                useAdventureStore.getState().resetProgress();
                log('Adventure progress, XP pool, and companion levels reset to start.');
                break;

            case 'xp': {
                const amount = parseInt(parts[1]);
                if (!isNaN(amount)) {
                    debugAddXp(amount);
                    log(`Added ${amount} XP to pool.`);
                } else {
                    log('Error: Invalid amount. Usage: xp <amount>');
                }
                break;
            }

            case 'companions':
                debugUnlockAllCompanions();
                log('All companions unlocked.');
                break;

            case 'adv': {
                const advId = parts[1];
                if (advId) {
                    setActiveAdventure(advId);
                    log(`Active adventure set to "${advId}".`);
                } else {
                    log('Error: Missing ID. Usage: adv <id>');
                }
                break;
            }
            case 'level':
            case 'lv': {
                const id = parts[1];
                const level = parseInt(parts[2]);
                if (id && !isNaN(level)) {
                    debugSetCompanionLevel(id, level);
                    log(`Companion "${id}" level set to ${level}.`);
                } else {
                    log('Error: Invalid arguments. Usage: level <companionId> <level>');
                }
                break;
            }
            case 'star':
            case 'stars': {
                const arg1 = parts[1];
                const arg2 = parts[2];
                const arg3 = parts[3];

                if (arg3) {
                    // stars <advId> <nodeIdx> <stars>
                    const advId = arg1;
                    const nodeIdx = parseInt(arg2);
                    const stars = parseInt(arg3);
                    if (!isNaN(nodeIdx) && !isNaN(stars)) {
                        debugSetEncounterStars(advId, nodeIdx, stars);
                        log(`Stars for adventure ${advId}, node ${nodeIdx} set to ${stars}.`);
                    } else {
                        log('Error: Invalid arguments. Usage: stars <advId> <nodeIdx> <stars>');
                    }
                } else if (arg2) {
                    // stars <nodeIdx> <stars> (current adventure)
                    const nodeIdx = parseInt(arg1);
                    const stars = parseInt(arg2);
                    if (!isNaN(nodeIdx) && !isNaN(stars)) {
                        debugSetEncounterStars(activeAdventureId, nodeIdx, stars);
                        log(`Stars for node ${nodeIdx} in current adventure set to ${stars}.`);
                    } else {
                        log('Error: Invalid arguments. Usage: stars <nodeIdx> <stars>');
                    }
                } else if (arg1) {
                    // stars <stars> (current node, current adventure)
                    const stars = parseInt(arg1);
                    if (!isNaN(stars)) {
                        debugSetEncounterStars(activeAdventureId, currentMapNode, stars);
                        log(`Stars for current node (${currentMapNode}) set to ${stars}.`);
                    } else {
                        log('Error: Invalid arguments. Usage: stars <stars>');
                    }
                } else {
                    log('Error: Missing arguments. Usage: stars <val> OR stars <idx> <val> OR stars <adv> <idx> <val>');
                }
                break;
            }

            case 'clear':
                setHistory([]);
                break;

            default:
                log(`Unknown command: "${baseCmd}". Type "help" for a list of commands.`);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Debug Console</h2>
                    <button className={styles.closeButton} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.history} ref={historyRef}>
                    {history.map((line, i) => (
                        <div key={i} className={styles.logLine}>{line}</div>
                    ))}
                </div>
                <form onSubmit={handleCommand} className={styles.inputArea} aria-label="Debug command">
                    <span className={styles.prompt}>$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.input}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        autoComplete="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                </form>
            </div>
        </div>
    );
};
