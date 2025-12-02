import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { soundManager } from '../utils/sound-manager';

interface AudioState {
    isMuted: boolean;
    volume: number; // 0-1
    toggleMute: () => void;
    setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            isMuted: false,
            volume: 0.5,

            toggleMute: () => {
                const newMutedState = !get().isMuted;
                set({ isMuted: newMutedState });
                soundManager.toggleMute();
            },

            setVolume: (volume: number) => {
                const clampedVolume = Math.max(0, Math.min(1, volume));
                set({ volume: clampedVolume });
                soundManager.setVolume(clampedVolume);
            },
        }),
        {
            name: 'audio-settings',
            // Restore sound manager state on load
            onRehydrateStorage: () => (state) => {
                if (state) {
                    soundManager.setVolume(state.volume);
                    if (state.isMuted) {
                        soundManager.mute();
                    } else {
                        soundManager.unmute();
                    }
                }
            },
        }
    )
);
