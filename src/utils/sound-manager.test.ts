/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// Mock Web Audio API
const mockAudioContext = {
    createGain: vi.fn(() => ({
        connect: vi.fn(),
        gain: {
            value: 0,
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
        },
    })),
    createOscillator: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        type: 'sine',
        frequency: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
        },
    })),
    createBuffer: vi.fn(() => ({
        getChannelData: vi.fn(() => new Float32Array(100)),
    })),
    createBufferSource: vi.fn(() => ({
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        buffer: null,
    })),
    createBiquadFilter: vi.fn(() => ({
        connect: vi.fn(),
        type: 'lowpass',
        frequency: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
        },
    })),
    destination: {},
    currentTime: 0,
    state: 'running',
    resume: vi.fn(),
    sampleRate: 44100,
};

describe('SoundManager', () => {
    let soundManager: import('./sound-manager').SoundManager;
    let SoundType: typeof import('./sound-manager').SoundType;

    beforeAll(async () => {
        // Mock window.AudioContext
        vi.stubGlobal('AudioContext', vi.fn(function () {
            console.log('Mock AudioContext constructor called');
            return mockAudioContext;
        }));
        window.AudioContext = (globalThis as unknown as { AudioContext: typeof AudioContext }).AudioContext;

        const module = await import('./sound-manager');
        SoundType = module.SoundType;
        // Instantiate manually to ensure mock is used
        soundManager = new module.SoundManager();
    });

    beforeEach(() => {
        vi.clearAllMocks();
        if (soundManager) {
            soundManager.unmute();
            soundManager.setVolume(0.5);
        }
    });

    it('should initialize with default volume', () => {
        expect(soundManager.getVolume()).toBe(0.5);
        expect(soundManager.isMutedState()).toBe(false);
    });

    it('should update volume', () => {
        soundManager.setVolume(0.8);
        expect(soundManager.getVolume()).toBe(0.8);
    });

    it('should clamp volume between 0 and 1', () => {
        soundManager.setVolume(1.5);
        expect(soundManager.getVolume()).toBe(1);

        soundManager.setVolume(-0.5);
        expect(soundManager.getVolume()).toBe(0);
    });

    it('should handle mute/unmute', () => {
        soundManager.mute();
        expect(soundManager.isMutedState()).toBe(true);

        soundManager.unmute();
        expect(soundManager.isMutedState()).toBe(false);
    });

    it('should toggle mute', () => {
        soundManager.mute();
        soundManager.toggleMute();
        expect(soundManager.isMutedState()).toBe(false);

        soundManager.toggleMute();
        expect(soundManager.isMutedState()).toBe(true);
    });

    it('should attempt to play sound when not muted', () => {
        // Trigger initialization
        soundManager.playSound(SoundType.BUTTON_CLICK);

        // Should have created oscillator
        expect(mockAudioContext.createOscillator).toHaveBeenCalled();
    });

    it('should not play sound when muted', () => {
        soundManager.mute();
        soundManager.playSound(SoundType.BUTTON_CLICK);

        expect(mockAudioContext.createOscillator).not.toHaveBeenCalled();
    });
});
