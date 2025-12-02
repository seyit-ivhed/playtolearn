import { describe, it, expect, beforeEach } from 'vitest';
import { useMissionStore } from './mission.store';
import { MissionStatus } from '../types/mission.types';

describe('MissionStore', () => {
    beforeEach(() => {
        useMissionStore.getState().resetProgress();
    });

    it('should initialize with mission 1 available', () => {
        const status = useMissionStore.getState().getMissionStatus('1');
        expect(status).toBe(MissionStatus.AVAILABLE);
    });

    it('should have other missions locked initially', () => {
        const status = useMissionStore.getState().getMissionStatus('2');
        expect(status).toBe(MissionStatus.LOCKED);
    });

    it('should complete a mission and unlock the next one', () => {
        const store = useMissionStore.getState();

        store.completeMission('1');

        expect(store.getMissionStatus('1')).toBe(MissionStatus.COMPLETED);
        expect(store.getMissionStatus('2')).toBe(MissionStatus.AVAILABLE);
    });

    it('should not unlock anything if last mission is completed', () => {
        const store = useMissionStore.getState();

        // Fast forward to last mission (assuming 5 missions)
        store.unlockMission('5');
        store.completeMission('5');

        expect(store.getMissionStatus('5')).toBe(MissionStatus.COMPLETED);
        // No crash, no side effects
    });

    it('should return all available missions', () => {
        const store = useMissionStore.getState();

        store.completeMission('1'); // 1 completed, 2 available

        const available = store.getAvailableMissions();
        expect(available).toContain('1');
        expect(available).toContain('2');
        expect(available).not.toContain('3');
    });
});
