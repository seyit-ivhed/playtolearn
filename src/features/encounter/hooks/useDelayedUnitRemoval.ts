import { useState, useEffect } from 'react';
import type { EncounterUnit } from '../../../types/encounter.types';

/**
 * Hook to manage visible units in the encounter, delaying removal of dead ones
 * to allow for death animations to complete.
 * 
 * @param monsters Current list of monsters from the store
 * @param delayMs Delay in milliseconds before removing dead monsters (default 1000)
 * @returns List of monster IDs that should be visible in the UI
 */
export const useDelayedUnitRemoval = (monsters: EncounterUnit[], delayMs: number = 1000) => {
    const [visibleMonsterIds, setVisibleMonsterIds] = useState<string[]>(
        monsters.filter(m => !m.isDead).map(m => m.id)
    );

    // Sync newly added monsters immediately during render
    const storeAliveIds = monsters.filter(m => !m.isDead).map(m => m.id);
    const missingIds = storeAliveIds.filter(id => !visibleMonsterIds.includes(id));
    if (missingIds.length > 0) {
        setVisibleMonsterIds(prev => [...prev, ...missingIds]);
    }

    useEffect(() => {
        const aliveIds = monsters.filter(m => !m.isDead).map(m => m.id);
        const justDiedIds = visibleMonsterIds.filter(id => !aliveIds.includes(id));

        if (justDiedIds.length > 0) {
            const timer = setTimeout(() => {
                setVisibleMonsterIds(prev => prev.filter(id => !justDiedIds.includes(id)));
            }, delayMs);
            return () => clearTimeout(timer);
        }
    }, [monsters, visibleMonsterIds, delayMs]);

    return visibleMonsterIds;
};
