import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChronicleData } from './useChronicleData';
import { useGameStore } from '../../../stores/game/store';
import { AdventureStatus } from '../../../types/adventure.types';

// Mock the stores
vi.mock('../../../stores/game/store');

// Mock i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('useChronicleData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('initial adventure selection', () => {
        it('should default to adventure 1 for new players with no progress', () => {
            // Mock new player state - no encounter results
            vi.mocked(useGameStore).mockReturnValue({
                encounterResults: {},
                adventureStatuses: {
                    '1': AdventureStatus.AVAILABLE,
                },
            } as ReturnType<typeof useGameStore>);

            const { result } = renderHook(() => useChronicleData());

            expect(result.current.activeAdventureId).toBe('1');
        });

        it('should show highest unlocked adventure for returning players with progress', () => {
            // Mock returning player state - has encounter results
            vi.mocked(useGameStore).mockReturnValue({
                encounterResults: {
                    '1_1': { stars: 3, difficulty: 1, completedAt: Date.now() },
                },
                adventureStatuses: {
                    '1': AdventureStatus.COMPLETED,
                    '2': AdventureStatus.AVAILABLE,
                },
            } as ReturnType<typeof useGameStore>);

            const { result } = renderHook(() => useChronicleData());

            // Should show adventure 2 (highest unlocked)
            expect(result.current.activeAdventureId).toBe('2');
        });
    });
});
