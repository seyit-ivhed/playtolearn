
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { IdentityService } from './identity.service';

const STORAGE_KEY = 'playtolearn-identity';

describe('IdentityService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should generate a new deviceId if none exists', () => {
        const deviceId = IdentityService.getDeviceId();
        expect(deviceId).toBeDefined();
        expect(typeof deviceId).toBe('string');
        expect(deviceId.length).toBeGreaterThan(0);
        
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.deviceId).toBe(deviceId);
    });

    it('should return existing deviceId from storage', () => {
        const existingId = 'existing-device-id';
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ deviceId: existingId }));

        const deviceId = IdentityService.getDeviceId();
        expect(deviceId).toBe(existingId);
    });

    it('should set and get playerId', () => {
        // Ensure deviceId exists first
        IdentityService.getDeviceId();

        const playerId = 'test-player-id';
        IdentityService.setPlayerId(playerId);

        expect(IdentityService.getPlayerId()).toBe(playerId);
        
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.playerId).toBe(playerId);
        expect(stored.deviceId).toBeDefined(); // Should preserve deviceId
    });

    it('should clear playerId', () => {
        IdentityService.getDeviceId();
        IdentityService.setPlayerId('test-player-id');
        
        IdentityService.clearPlayerId();
        
        expect(IdentityService.getPlayerId()).toBeUndefined();
        
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.playerId).toBeUndefined();
        expect(stored.deviceId).toBeDefined(); // Should preserve deviceId
    });
});
