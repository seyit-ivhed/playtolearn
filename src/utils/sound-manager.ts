/**
 * Sound Manager - Handles all audio playback using Web Audio API
 * Generates retro-style sound effects programmatically
 */

export const SoundType = {
    LASER: 'LASER',
    EXPLOSION: 'EXPLOSION',
    SHIELD: 'SHIELD',
    HIT: 'HIT',
    BUTTON_CLICK: 'BUTTON_CLICK',
    CORRECT_ANSWER: 'CORRECT_ANSWER',
    WRONG_ANSWER: 'WRONG_ANSWER',
    VICTORY: 'VICTORY',
    DEFEAT: 'DEFEAT',
} as const;

export type SoundType = typeof SoundType[keyof typeof SoundType];

export class SoundManager {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.5; // Default volume 50%

    constructor() {
        this.initializeAudioContext();
    }

    private initializeAudioContext() {
        try {
            // Create audio context on first user interaction
            if (typeof window !== 'undefined' && 'AudioContext' in window) {
                this.audioContext = new AudioContext();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);
                this.masterGain.gain.value = this.volume;
            }
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    private ensureAudioContext() {
        if (!this.audioContext) {
            this.initializeAudioContext();
        }

        // Resume context if suspended (required for some browsers)
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * Play a sound effect
     */
    playSound(type: SoundType) {
        if (this.isMuted) {
            return;
        }

        this.ensureAudioContext();

        if (!this.audioContext || !this.masterGain) {
            return;
        }

        switch (type) {
            case SoundType.LASER:
                this.playLaser();
                break;
            case SoundType.EXPLOSION:
                this.playExplosion();
                break;
            case SoundType.SHIELD:
                this.playShield();
                break;
            case SoundType.HIT:
                this.playHit();
                break;
            case SoundType.BUTTON_CLICK:
                this.playButtonClick();
                break;
            case SoundType.CORRECT_ANSWER:
                this.playCorrectAnswer();
                break;
            case SoundType.WRONG_ANSWER:
                this.playWrongAnswer();
                break;
            case SoundType.VICTORY:
                this.playVictory();
                break;
            case SoundType.DEFEAT:
                this.playDefeat();
                break;
        }
    }

    /**
     * Laser sound - rising frequency sweep
     */
    private playLaser() {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    /**
     * Explosion sound - noise burst with low frequency
     */
    private playExplosion() {
        if (!this.audioContext || !this.masterGain) return;

        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.3);
    }

    /**
     * Shield sound - resonant hum
     */
    private playShield() {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    /**
     * Hit sound - short impact
     */
    private playHit() {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    /**
     * Button click - short blip
     */
    private playButtonClick() {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.03);
    }

    /**
     * Correct answer - ascending chime
     */
    private playCorrectAnswer() {
        if (!this.audioContext || !this.masterGain) return;

        const notes = [523.25, 659.25, 783.99]; // C, E, G
        notes.forEach((freq, index) => {
            const oscillator = this.audioContext!.createOscillator();
            const gainNode = this.audioContext!.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain!);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

            const startTime = this.audioContext!.currentTime + index * 0.08;
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.15);
        });
    }

    /**
     * Wrong answer - descending buzz
     */
    private playWrongAnswer() {
        if (!this.audioContext || !this.masterGain) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    /**
     * Victory - triumphant fanfare
     */
    private playVictory() {
        if (!this.audioContext || !this.masterGain) return;

        const melody = [
            { freq: 523.25, time: 0 },      // C
            { freq: 659.25, time: 0.15 },   // E
            { freq: 783.99, time: 0.3 },    // G
            { freq: 1046.5, time: 0.45 },   // C (high)
        ];

        melody.forEach(({ freq, time }) => {
            const oscillator = this.audioContext!.createOscillator();
            const gainNode = this.audioContext!.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain!);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

            const startTime = this.audioContext!.currentTime + time;
            gainNode.gain.setValueAtTime(0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    /**
     * Defeat - descending sad sound
     */
    private playDefeat() {
        if (!this.audioContext || !this.masterGain) return;

        const melody = [
            { freq: 523.25, time: 0 },      // C
            { freq: 493.88, time: 0.15 },   // B
            { freq: 440.00, time: 0.3 },    // A
            { freq: 392.00, time: 0.45 },   // G
        ];

        melody.forEach(({ freq, time }) => {
            const oscillator = this.audioContext!.createOscillator();
            const gainNode = this.audioContext!.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain!);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);

            const startTime = this.audioContext!.currentTime + time;
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    /**
     * Set master volume (0-1)
     */
    setVolume(volume: number) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
        }
    }

    /**
     * Get current volume
     */
    getVolume(): number {
        return this.volume;
    }

    /**
     * Mute all sounds
     */
    mute() {
        this.isMuted = true;
        if (this.masterGain) {
            this.masterGain.gain.value = 0;
        }
    }

    /**
     * Unmute sounds
     */
    unmute() {
        this.isMuted = false;
        if (this.masterGain) {
            this.masterGain.gain.value = this.volume;
        }
    }

    /**
     * Toggle mute state
     */
    toggleMute() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    /**
     * Check if muted
     */
    isMutedState(): boolean {
        return this.isMuted;
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
