import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCombatActions } from './useCombatActions';
import { useCombatStore } from '../stores/combat.store';
import { useMathStore } from '../stores/math.store';
import { CombatPhase } from '../types/combat.types';

// Mock stores
vi.mock('../stores/combat.store');
vi.mock('../stores/math.store');
vi.mock('../utils/sound-manager');
vi.mock('../data/companions.data', () => ({
    getCompanionById: vi.fn((id) => {
        if (id === 'companion_fire_knight') {
            return {
                id: 'companion_fire_knight',
                name: 'Fire Knight',
                combatAction: 'ATTACK',
                stats: { attack: 10, maxEnergy: 3 }
            };
        }
        return null;
    })
}));

describe('useCombatActions', () => {
    const mockPlayerAction = vi.fn();
    const mockSetPhase = vi.fn();
    const mockConsumeEnergy = vi.fn();
    const mockFullRecharge = vi.fn();

    const mockGenerateNewProblem = vi.fn();
    const mockSubmitAnswer = vi.fn();
    const mockReset = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default store mocks
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedCompanions: [
                    {
                        companionId: 'companion_fire_knight',
                        slotId: 'slot_1',
                        currentEnergy: 3,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeCompanionEnergy: mockConsumeEnergy,
            rechargeCompanion: mockFullRecharge,
            rechargedCompanions: [],
        });

        (useMathStore as any).mockReturnValue({
            currentProblem: { question: '1+1', answer: 2 },
            generateNewProblem: mockGenerateNewProblem,
            submitAnswer: mockSubmitAnswer,
            reset: mockReset,
        });
    });

    it('should handle ATTACK action with energy', () => {
        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('companion_fire_knight');
        });

        expect(mockConsumeEnergy).toHaveBeenCalledWith('companion_fire_knight');
        expect(mockPlayerAction).toHaveBeenCalledWith({
            companionId: 'companion_fire_knight',
            behavior: 'ATTACK',
            value: 10
        });
        expect(mockSetPhase).not.toHaveBeenCalled();
    });

    it('should trigger recharge when energy is 0', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedCompanions: [
                    {
                        companionId: 'companion_fire_knight',
                        slotId: 'slot_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeCompanionEnergy: mockConsumeEnergy,
            rechargedCompanions: [],
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('companion_fire_knight');
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(true);
        expect(result.current.pendingRechargeCompanion).toBe('companion_fire_knight');
        expect(mockConsumeEnergy).not.toHaveBeenCalled();
    });

    it('should prevent recharge if already recharged this companion', () => {
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedCompanions: [
                    {
                        companionId: 'companion_fire_knight',
                        slotId: 'slot_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedCompanions: ['companion_fire_knight'], // Already recharged
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect('companion_fire_knight');
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeCompanion).toBe(null);
    });

    it('should handle correct math answer for recharge', () => {
        // Mock player with 0 energy to trigger recharge first
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedCompanions: [
                    {
                        companionId: 'companion_fire_knight',
                        slotId: 'slot_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedCompanions: [],
            rechargeCompanion: mockFullRecharge,
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action to trigger recharge state
        act(() => {
            result.current.handleActionSelect('companion_fire_knight');
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: true });

        act(() => {
            result.current.handleMathSubmit(2);
        });

        expect(mockFullRecharge).toHaveBeenCalledWith('companion_fire_knight');
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeCompanion).toBe(null);
    });

    it('should handle wrong math answer for recharge', () => {
        // Mock player with 0 energy
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            player: {
                equippedCompanions: [
                    {
                        companionId: 'companion_fire_knight',
                        slotId: 'slot_1',
                        currentEnergy: 0,
                        maxEnergy: 3,
                        combatAction: 'ATTACK'
                    }
                ]
            },
            setPhase: mockSetPhase,
            rechargedCompanions: [],
            rechargeCompanion: mockFullRecharge,
        });

        const { result } = renderHook(() => useCombatActions());

        // Select action first
        act(() => {
            result.current.handleActionSelect('companion_fire_knight');
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: false });

        act(() => {
            result.current.handleMathSubmit(3);
        });

        expect(mockFullRecharge).not.toHaveBeenCalled();
        expect(result.current.showInlineRecharge).toBe(false);
        expect(result.current.pendingRechargeCompanion).toBe(null);
    });
});
