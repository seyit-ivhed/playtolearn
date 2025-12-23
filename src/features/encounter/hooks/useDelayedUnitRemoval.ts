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

    useEffect(() => {
        const storeAliveIds = monsters.filter(m => !m.isDead).map(m => m.id);

        // Find monsters that are dead in store but still in our "visible" list
        const justDiedIds = visibleMonsterIds.filter(id => !storeAliveIds.includes(id));

        if (justDiedIds.length > 0) {
            // Delay removal to allow UnitCard to play its "take damage/death" animations
            const timer = setTimeout(() => {
                setVisibleMonsterIds(prev => prev.filter(id => !justDiedIds.includes(id)));
            }, delayMs);
            return () => clearTimeout(timer);
        }

        // Also handle adding any new monsters if needed
        const newlyAddedIds = storeAliveIds.filter(id => !visibleMonsterIds.includes(id));
        if (newlyAddedIds.length > 0) {
            setVisibleMonsterIds(prev => [...prev, ...newlyAddedIds]);
        }
    }, [monsters, visibleMonsterIds, delayMs]);

    return visibleMonsterIds;
};
