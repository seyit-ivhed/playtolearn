import { render, screen, act } from '@testing-library/react';
import { TurnAnnouncer } from './TurnAnnouncer';
import { EncounterPhase } from '../../../types/encounter.types';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock react-i18next
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, defaultValue: string) => {
            if (key === 'combat.turn.player') return 'Din Tur';
            if (key === 'combat.turn.enemy') return 'Fiendens Tur';
            return defaultValue;
        },
    }),
}));

describe('TurnAnnouncer', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it('displays "Din Tur" when phase is PLAYER_TURN', () => {
        render(<TurnAnnouncer phase={EncounterPhase.PLAYER_TURN} />);
        expect(screen.getByText('Din Tur')).toBeDefined();
    });

    it('displays "Fiendens Tur" when phase is MONSTER_TURN', () => {
        render(<TurnAnnouncer phase={EncounterPhase.MONSTER_TURN} />);
        expect(screen.getByText('Fiendens Tur')).toBeDefined();
    });

    it('hides message after 1.6s', async () => {
        const onVisibilityChange = vi.fn();
        render(<TurnAnnouncer phase={EncounterPhase.PLAYER_TURN} onVisibilityChange={onVisibilityChange} />);

        expect(screen.getByText('Din Tur')).toBeDefined();

        act(() => {
            vi.advanceTimersByTime(1600);
        });

        expect(onVisibilityChange).toHaveBeenCalledWith(false);
    });
});
