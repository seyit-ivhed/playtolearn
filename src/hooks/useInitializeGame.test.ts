import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInitializeGame } from './useInitializeGame';
import { useAuth } from './useAuth';
import { usePremiumStore } from '../stores/premium.store';
import { PersistenceService } from '../services/persistence.service';

// Mocks
vi.mock('./useAuth');
vi.mock('../services/persistence.service');
vi.mock('../stores/premium.store');
vi.mock('../stores/game/store', () => ({
    useGameStore: {
        setState: vi.fn(),
    }
}));

describe('useInitializeGame', () => {
    const mockInitializePremium = vi.fn();
    const mockRefreshSession = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'log').mockImplementation(() => { });

        // Setup default mocks
        vi.mocked(usePremiumStore).mockImplementation((selector: any) => {
            if (typeof selector === 'function') {
                return mockInitializePremium;
            }
            return { initialize: mockInitializePremium } as any;
        });

        // Mock PersistenceService
        vi.mocked(PersistenceService.getOrCreateProfile).mockResolvedValue({ id: 'p1' });
        vi.mocked(PersistenceService.pullState).mockResolvedValue(null);
    });

    it('should force re-initialize premium when user changes (Reproduction Case)', async () => {
        // 1. Start as Anonymous
        vi.mocked(useAuth).mockReturnValue({
            session: { user: { id: 'anon-user' } } as any,
            isAuthenticated: true,
            user: { id: 'anon-user' } as any,
            loading: false,
            refreshSession: mockRefreshSession,
            signIn: vi.fn() as any,
            signInAnonymously: vi.fn() as any
        } as any);

        const { result, rerender } = renderHook(() => useInitializeGame());

        await waitFor(() => {
            expect(result.current.isInitializing).toBe(false);
        });

        // Verify initial call - expecting true because we now force it
        expect(mockInitializePremium).toHaveBeenCalledWith(true, expect.anything());

        mockInitializePremium.mockClear();

        // 2. Simulate Login (User changes)
        vi.mocked(useAuth).mockReturnValue({
            session: { user: { id: 'premium-user' } } as any,
            isAuthenticated: true,
            user: { id: 'premium-user' } as any,
            loading: false,
            refreshSession: mockRefreshSession,
            signIn: vi.fn() as any,
            signInAnonymously: vi.fn() as any
        } as any);

        rerender();

        await waitFor(() => {
            expect(result.current.isInitializing).toBe(false);
        });

        // THIS IS THE BUG REPRODUCTION:
        // We EXPECT it to be called with `true` (force) because the user changed.
        // Currently it is called with `false`, which causes the bug.
        // We assert `true` here to demonstrate the fix requirement.
        expect(mockInitializePremium).toHaveBeenCalledWith(true, expect.anything());
    });
});
