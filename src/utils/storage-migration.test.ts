import { describe, it, expect, beforeEach } from 'vitest';
import { migrateLocalStorage } from './storage-migration';

describe('migrateLocalStorage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('migrates playtolearn-game-store to mathwithmagic-game-store', () => {
        const data = JSON.stringify({ state: { level: 5 }, version: 0 });
        localStorage.setItem('playtolearn-game-store', data);

        migrateLocalStorage();

        expect(localStorage.getItem('mathwithmagic-game-store')).toBe(data);
        expect(localStorage.getItem('playtolearn-game-store')).toBeNull();
    });

    it('migrates space-math-player-storage to mathwithmagic-player-storage', () => {
        const data = JSON.stringify({ state: { language: 'sv' }, version: 0 });
        localStorage.setItem('space-math-player-storage', data);

        migrateLocalStorage();

        expect(localStorage.getItem('mathwithmagic-player-storage')).toBe(data);
        expect(localStorage.getItem('space-math-player-storage')).toBeNull();
    });

    it('does not overwrite an existing new key if both old and new keys are present', () => {
        const oldData = JSON.stringify({ state: { level: 1 }, version: 0 });
        const newData = JSON.stringify({ state: { level: 10 }, version: 0 });
        localStorage.setItem('playtolearn-game-store', oldData);
        localStorage.setItem('mathwithmagic-game-store', newData);

        migrateLocalStorage();

        expect(localStorage.getItem('mathwithmagic-game-store')).toBe(newData);
        expect(localStorage.getItem('playtolearn-game-store')).toBe(oldData);
    });

    it('does nothing when no old keys are present', () => {
        migrateLocalStorage();

        expect(localStorage.getItem('mathwithmagic-game-store')).toBeNull();
        expect(localStorage.getItem('mathwithmagic-player-storage')).toBeNull();
    });

    it('is idempotent — running twice does not lose data', () => {
        const data = JSON.stringify({ state: { level: 3 }, version: 0 });
        localStorage.setItem('playtolearn-game-store', data);

        migrateLocalStorage();
        migrateLocalStorage();

        expect(localStorage.getItem('mathwithmagic-game-store')).toBe(data);
    });
});
