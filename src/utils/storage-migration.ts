const KEY_MIGRATIONS = [
    { from: 'playtolearn-game-store', to: 'mathwithmagic-game-store' },
    { from: 'space-math-player-storage', to: 'mathwithmagic-player-storage' },
] as const;

export const migrateLocalStorage = (): void => {
    try {
        for (const { from, to } of KEY_MIGRATIONS) {
            const oldValue = localStorage.getItem(from);
            if (oldValue !== null && localStorage.getItem(to) === null) {
                localStorage.setItem(to, oldValue);
                localStorage.removeItem(from);
            }
        }
    } catch (e) {
        console.warn('localStorage key migration failed', e);
    }
};
