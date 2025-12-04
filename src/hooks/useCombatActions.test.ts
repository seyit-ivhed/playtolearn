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

describe('useCombatActions', () => {
    const mockPlayerAction = vi.fn();
    const mockSetPhase = vi.fn();
    const mockConsumeEnergy = vi.fn();
    const mockFullRecharge = vi.fn();
    const mockSetRechargedThisTurn = vi.fn();

    const mockGenerateNewProblem = vi.fn();
    const mockSubmitAnswer = vi.fn();
    const mockReset = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default store mocks
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            setPhase: mockSetPhase,
            playerAction: mockPlayerAction,
            consumeEnergy: mockConsumeEnergy,
            fullRecharge: mockFullRecharge,
            rechargedThisTurn: false,
            setRechargedThisTurn: mockSetRechargedThisTurn,
        });

        (useMathStore as any).mockReturnValue({
            currentProblem: { question: '1+1', answer: 2 },
            generateNewProblem: mockGenerateNewProblem,
            submitAnswer: mockSubmitAnswer,
            reset: mockReset,
        });
    });

    it('should handle ATTACK action', () => {
        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'ATTACK' });
        });

        expect(mockConsumeEnergy).toHaveBeenCalledWith(10);
        expect(mockPlayerAction).toHaveBeenCalledWith({ type: 'ATTACK', value: 10 });
        expect(mockSetPhase).not.toHaveBeenCalled(); // Should not trigger math modal
    });

    it('should handle RECHARGE action', () => {
        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'RECHARGE' });
        });

        expect(mockSetPhase).toHaveBeenCalledWith(CombatPhase.MATH_CHALLENGE);
        expect(result.current.showMathModal).toBe(true);
    });

    it('should prevent RECHARGE if already recharged this turn', () => {
        (useCombatStore as any).mockReturnValue({
            phase: CombatPhase.PLAYER_INPUT,
            rechargedThisTurn: true, // Already recharged
            setPhase: mockSetPhase,
        });

        const { result } = renderHook(() => useCombatActions());

        act(() => {
            result.current.handleActionSelect({ type: 'RECHARGE' });
        });

        expect(mockSetPhase).not.toHaveBeenCalled();
        expect(result.current.showMathModal).toBe(false);
    });

    it('should handle correct math answer for recharge', () => {
        const { result } = renderHook(() => useCombatActions());

        // Select recharge first to set state
        act(() => {
            result.current.handleActionSelect({ type: 'RECHARGE' });
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: true });

        act(() => {
            result.current.handleMathSubmit(2);
        });

        expect(mockFullRecharge).toHaveBeenCalled();
        expect(mockSetRechargedThisTurn).toHaveBeenCalledWith(true);
        expect(result.current.showMathModal).toBe(false);
    });

    it('should handle wrong math answer for recharge', () => {
        const { result } = renderHook(() => useCombatActions());

        // Select recharge first
        act(() => {
            result.current.handleActionSelect({ type: 'RECHARGE' });
        });

        mockSubmitAnswer.mockReturnValue({ isCorrect: false });

        act(() => {
            result.current.handleMathSubmit(3);
        });

        expect(mockFullRecharge).not.toHaveBeenCalled();
        expect(mockSetRechargedThisTurn).not.toHaveBeenCalled();
        expect(result.current.showMathModal).toBe(false);
    });
});
