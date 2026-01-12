import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAnonymousLoginTrigger } from './useAnonymousLoginTrigger';
import * as useAuthHook from './useAuth';
import * as gameStore from '../stores/game/store';

// Mock dependencies
const signInAnonymouslyMock = vi.fn().mockResolvedValue({});

describe('useAnonymousLoginTrigger', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Default mocks
        vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
            isAuthenticated: false,
            loading: false,
            signInAnonymously: signInAnonymouslyMock,
            session: null,
            user: null,
            refreshSession: vi.fn(),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should trigger anonymous login when not authenticated and milestones reached (>= 3 encounters)', () => {
        // Mock game store to return 3 encounters
        vi.spyOn(gameStore, 'useGameStore').mockReturnValue(3);

        renderHook(() => useAnonymousLoginTrigger());

        expect(signInAnonymouslyMock).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger if already authenticated', () => {
        // Authenticated user
        vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
            isAuthenticated: true,
            loading: false,
            signInAnonymously: signInAnonymouslyMock,
            session: {} as any,
            user: {} as any,
            refreshSession: vi.fn(),
        });

        // 3 encounters
        vi.spyOn(gameStore, 'useGameStore').mockReturnValue(3);

        renderHook(() => useAnonymousLoginTrigger());

        expect(signInAnonymouslyMock).not.toHaveBeenCalled();
    });

    it('should NOT trigger if fewer than 3 encounters', () => {
        // 2 encounters
        vi.spyOn(gameStore, 'useGameStore').mockReturnValue(2);

        renderHook(() => useAnonymousLoginTrigger());

        expect(signInAnonymouslyMock).not.toHaveBeenCalled();
    });

    it('should NOT trigger if auth is loading', () => {
        // Loading state
        vi.spyOn(useAuthHook, 'useAuth').mockReturnValue({
            isAuthenticated: false,
            loading: true, // Still loading
            signInAnonymously: signInAnonymouslyMock,
            session: null,
            user: null,
            refreshSession: vi.fn(),
        });

        // 3 encounters
        vi.spyOn(gameStore, 'useGameStore').mockReturnValue(3);

        renderHook(() => useAnonymousLoginTrigger());

        expect(signInAnonymouslyMock).not.toHaveBeenCalled();
    });

    it('should NOT trigger multiple times (idempotency check)', () => {
        // 3 encounters
        vi.spyOn(gameStore, 'useGameStore').mockReturnValue(3);

        // Render twice with same state
        const { rerender } = renderHook(() => useAnonymousLoginTrigger());
        rerender();

        // Should still be called only once due to ref
        expect(signInAnonymouslyMock).toHaveBeenCalledTimes(1);
    });
});
