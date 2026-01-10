
interface Identity {
    deviceId: string;
    playerId?: string;
}

const STORAGE_KEY = 'playtolearn_identity';

export const IdentityService = {
    getIdentity: (): Identity => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                // Ignore parse errors, will recreate
            }
        }

        const newIdentity: Identity = {
            deviceId: crypto.randomUUID?.() || Math.random().toString(36).substring(2) + Date.now().toString(36)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity));
        return newIdentity;
    },

    setIdentity: (identity: Identity) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
    },

    getDeviceId: (): string => {
        return IdentityService.getIdentity().deviceId;
    },

    getPlayerId: (): string | undefined => {
        return IdentityService.getIdentity().playerId;
    },

    setPlayerId: (playerId: string) => {
        const identity = IdentityService.getIdentity();
        identity.playerId = playerId;
        IdentityService.setIdentity(identity);
    },

    clearPlayerId: () => {
        const identity = IdentityService.getIdentity();
        delete identity.playerId;
        IdentityService.setIdentity(identity);
    }
};
