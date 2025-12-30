import { useState } from 'react';
import { useGameStore } from '../../../stores/game/store';
import { useAdventureStore } from '../../../stores/adventure.store';
import { DEBUG_COMMANDS } from '../utils/command-registry';

export const useDebugCommands = () => {
    const [history, setHistory] = useState<string[]>(['Debug console initialized. Type "help" for commands.']);
    const gameStore = useGameStore();
    const adventureStore = useAdventureStore();

    const log = (message: string) => {
        setHistory(prev => [...prev, message]);
    };

    const handleCommand = (input: string) => {
        const cmd = input.trim().toLowerCase();
        if (!cmd) return;

        log(`> ${input}`);

        const parts = cmd.split(' ');
        const baseCmd = parts[0];

        const command = DEBUG_COMMANDS[baseCmd];
        if (command) {
            command.execute(parts, {
                log,
                setHistory,
                stores: {
                    game: gameStore,
                    adventure: adventureStore
                }
            });
        } else {
            log(`Unknown command: "${baseCmd}". Type "help" for a list of commands.`);
        }
    };

    return {
        history,
        log,
        handleCommand,
        setHistory
    };
};
