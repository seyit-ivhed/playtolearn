import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEncounterInitializer } from './useEncounterInitializer';
import { useEncounterStore } from '../../../stores/encounter/store';
import { useGameStore } from '../../../stores/game/store';
import { buildBattleEncounterData } from '../utils/encounter-initializer';

// Mocks
vi.mock('../../../stores/encounter/store');
vi.mock('../../../stores/game/store');
vi.mock('../utils/encounter-initializer');
vi.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (k: string) => k })
}));

describe('useEncounterInitializer', () => {
    const mockInitializeEncounter = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Default Encounter Store Mock
        vi.mocked(useEncounterStore).mockReturnValue({
            initializeEncounter: mockInitializeEncounter,
            party: [],
            monsters: [],
            nodeIndex: 0
        } as any);

        // Default Game Store Mock
        vi.mocked(useGameStore).mockReturnValue({
            activeParty: ['p1'],
            companionStats: {},
            activeEncounterDifficulty: 1
        } as any);

        // Default Initializer Utility Mock
        vi.mocked(buildBattleEncounterData).mockReturnValue({
            activeParty: ['p1'],
            localizedEnemies: [{ id: 'm1' } as any],
            nodeIndex: 1,
            difficulty: 1,
            companionStats: {}
        });
    });

    it('should initialize when store is empty', () => {
        renderHook(() => useEncounterInitializer('adv1', 1));

        expect(mockInitializeEncounter).toHaveBeenCalled();
    });

    it('should NOT initialize when already on the same node and adventure', () => {
        vi.mocked(useEncounterStore).mockReturnValue({
            initializeEncounter: mockInitializeEncounter,
            party: [{ templateId: 'p1' } as any],
            monsters: [{ templateId: 'm1' } as any],
            nodeIndex: 1
        } as any);

        renderHook(() => useEncounterInitializer('adv1', 1));

        expect(mockInitializeEncounter).not.toHaveBeenCalled();
    });

    it('should initialize when node index changes', () => {
        vi.mocked(useEncounterStore).mockReturnValue({
            initializeEncounter: mockInitializeEncounter,
            party: [{ templateId: 'p1' } as any],
            monsters: [{ templateId: 'm1' } as any],
            nodeIndex: 2 // Different node
        } as any);

        renderHook(() => useEncounterInitializer('adv1', 1));

        expect(mockInitializeEncounter).toHaveBeenCalled();
    });

    it('should initialize when party composition changes', () => {
        vi.mocked(useEncounterStore).mockReturnValue({
            initializeEncounter: mockInitializeEncounter,
            party: [{ templateId: 'p2' } as any], // Different party member
            monsters: [{ templateId: 'm1' } as any],
            nodeIndex: 1
        } as any);

        renderHook(() => useEncounterInitializer('adv1', 1));

        expect(mockInitializeEncounter).toHaveBeenCalled();
    });

    it('should initialize when expected monsters are different (Bug Fix Test)', () => {
        // Current store has 'm1' (maybe from a previous adventure's Node 1)
        vi.mocked(useEncounterStore).mockReturnValue({
            initializeEncounter: mockInitializeEncounter,
            party: [{ templateId: 'p1' } as any],
            monsters: [{ templateId: 'm1' } as any],
            nodeIndex: 1
        } as any);

        // Expected data for the NEW adventure's Node 1 is 'm2'
        vi.mocked(buildBattleEncounterData).mockReturnValue({
            activeParty: ['p1'],
            localizedEnemies: [{ id: 'm2' } as any], // Different monster!
            nodeIndex: 1,
            difficulty: 1,
            companionStats: {}
        });

        renderHook(() => useEncounterInitializer('adv2', 1));

        expect(mockInitializeEncounter).toHaveBeenCalled();
    });

    it('should NOT initialize if adventureId is missing', () => {
        renderHook(() => useEncounterInitializer(undefined, 1));

        expect(mockInitializeEncounter).not.toHaveBeenCalled();
    });

    it('should NOT initialize if buildBattleEncounterData returns null (e.g. puzzle node)', () => {
        vi.mocked(buildBattleEncounterData).mockReturnValue(null);

        renderHook(() => useEncounterInitializer('adv1', 1));

        expect(mockInitializeEncounter).not.toHaveBeenCalled();
    });
});
