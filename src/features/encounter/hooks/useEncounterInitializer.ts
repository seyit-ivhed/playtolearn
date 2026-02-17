import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEncounterStore } from '../../../stores/encounter/store';
import { useGameStore } from '../../../stores/game/store';
import { buildBattleEncounterData } from '../utils/encounter-initializer';

export function useEncounterInitializer(adventureId: string | undefined, nodeIndex: number) {
    const { initializeEncounter, party, nodeIndex: activeNodeIndex } = useEncounterStore();
    const { activeParty, companionStats, activeEncounterDifficulty } = useGameStore();
    const { t } = useTranslation();

    useLayoutEffect(() => {
        if (!adventureId) {
            return;
        }

        const data = buildBattleEncounterData(
            adventureId,
            nodeIndex,
            activeParty,
            companionStats,
            activeEncounterDifficulty,
            t
        );

        if (!data) {
            return;
        }

        const currentPartyIds = party.map(u => u.templateId).join(',');
        const hasPartyChanged = currentPartyIds !== data.activeParty.join(',');

        if (activeNodeIndex !== nodeIndex || party.length === 0 || hasPartyChanged) {
            initializeEncounter(
                data.activeParty,
                data.localizedEnemies,
                data.nodeIndex,
                data.difficulty,
                data.companionStats
            );
        }
    }, [adventureId, nodeIndex, activeParty, companionStats, activeEncounterDifficulty, initializeEncounter, t, activeNodeIndex, party]);
}
