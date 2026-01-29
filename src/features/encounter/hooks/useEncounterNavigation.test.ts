import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEncounterNavigation } from './useEncounterNavigation';
import { useGameStore } from '../../../stores/game/store';
import { usePremiumStore } from '../../../stores/premium.store';
import { useEncounterStore } from '../../../stores/encounter/store';
import { checkNavigationAccess } from '../../../utils/navigation-security.utils';
import { EncounterPhase } from '../../../types/encounter.types';
import { useNavigate } from 'react-router-dom';

// Mocks
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../../stores/game/store');
vi.mock('../../../stores/premium.store');
vi.mock('../../../stores/encounter/store');
vi.mock('../../../utils/navigation-security.utils');

describe('useEncounterNavigation', () => {
    const mockNavigate = vi.fn();
    const mockCompleteEncounter = vi.fn();
    const mockAddCompanionExperience = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        // Default Game Store Mock
        vi.mocked(useGameStore).mockReturnValue({
            encounterResults: {},
            completeEncounter: mockCompleteEncounter,
            addCompanionExperience: mockAddCompanionExperience,
            companionStats: {
                'amara': { level: 1, experience: 0 },
                'tariq': { level: 5, experience: 100 }
            },
            activeParty: ['amara', 'tariq'],
            isAdventureUnlocked: vi.fn().mockReturnValue(true),
        } as ReturnType<typeof useGameStore>);

        // Default Premium Store Mock
        vi.mocked(usePremiumStore).mockReturnValue({
            isAdventureUnlocked: vi.fn().mockReturnValue(true),
            initialized: true,
        } as ReturnType<typeof usePremiumStore>);

        // Default Encounter Store Mock
        (useEncounterStore.getState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            monsters: [{ id: 'm1', isBoss: false }]
        });
    });

    describe('Safety Gate', () => {
        it('should redirect to chronicle if access is denied', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: false, reason: 'LOCKED' } as ReturnType<typeof checkNavigationAccess>);

            renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 1,
                phase: EncounterPhase.START
            }));

            expect(mockNavigate).toHaveBeenCalledWith('/chronicle', { replace: true });
        });

        it('should NOT redirect if access is allowed', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: true } as ReturnType<typeof checkNavigationAccess>);

            renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 1,
                phase: EncounterPhase.START
            }));

            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe('handleCompletionContinue - Victory', () => {
        it('should show experience screen and award XP for normal encounters', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: true } as ReturnType<typeof checkNavigationAccess>);

            const { result } = renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 1,
                phase: EncounterPhase.VICTORY
            }));

            act(() => {
                result.current.handleCompletionContinue();
            });

            // XP Screen should be shown
            expect(result.current.showExperienceScreen).toBe(true);

            // Previous stats should be snapshotted
            expect(result.current.previousCompanionStats['amara']).toEqual({ level: 1, experience: 0 });
            expect(result.current.previousCompanionStats['tariq']).toEqual({ level: 5, experience: 100 });

            // XP should be awarded (Adventure 1 max level is 4, so Tariq at lvl 5 should NOT get XP)
            // Amara (lvl 1) should get XP
            expect(mockAddCompanionExperience).toHaveBeenCalledWith('amara', expect.any(Number));
            expect(mockAddCompanionExperience).not.toHaveBeenCalledWith('tariq', expect.any(Number));

            // Should NOT navigate yet
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it('should skip experience screen for ENDING nodes', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: true } as ReturnType<typeof checkNavigationAccess>);

            // Node 1_11 is ENDING in adventure 1
            const { result } = renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 11,
                phase: EncounterPhase.VICTORY
            }));

            act(() => {
                result.current.handleCompletionContinue();
            });

            expect(result.current.showExperienceScreen).toBe(false);
            expect(mockCompleteEncounter).toHaveBeenCalledWith('1', 11);
            expect(mockNavigate).toHaveBeenCalled();
        });

        it('should navigate to map with adventureCompleted state on boss victory', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: true } as ReturnType<typeof checkNavigationAccess>);

            // Mock boss in store
            (useEncounterStore.getState as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
                monsters: [{ id: 'boss', isBoss: true }]
            });

            const { result } = renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 10, // Boss node
                phase: EncounterPhase.VICTORY
            }));

            // First call shows XP screen
            act(() => {
                result.current.handleCompletionContinue();
            });
            expect(result.current.showExperienceScreen).toBe(true);

            // Second call (after XP screen) navigates
            act(() => {
                result.current.handleCompletionContinue();
            });

            expect(mockCompleteEncounter).toHaveBeenCalledWith('1', 10);
            expect(mockNavigate).toHaveBeenCalledWith('/map/1', {
                state: { adventureCompleted: true, focalNode: 10 }
            });
        });
    });

    describe('handleCompletionContinue - Defeat', () => {
        it('should navigate back to the same node on map', () => {
            vi.mocked(checkNavigationAccess).mockReturnValue({ allowed: true } as ReturnType<typeof checkNavigationAccess>);

            const { result } = renderHook(() => useEncounterNavigation({
                adventureId: '1',
                nodeIndex: 5,
                phase: EncounterPhase.DEFEAT
            }));

            act(() => {
                result.current.handleCompletionContinue();
            });

            expect(mockNavigate).toHaveBeenCalledWith('/map/1', {
                state: { focalNode: 5 }
            });
            expect(mockCompleteEncounter).not.toHaveBeenCalled();
        });
    });
});
