import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
    isMuted: boolean;
    volume: number; // 0.0 to 1.0
    isVoiceOverPlaying: boolean;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
    setVoiceOverPlaying: (isPlaying: boolean) => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set) => ({
            isMuted: false,
            volume: 0.5,
            isVoiceOverPlaying: false,
            toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
            setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
            setVoiceOverPlaying: (isPlaying) => set({ isVoiceOverPlaying: isPlaying }),
        }),
        {
            name: 'audio-storage',
            partialize: (state) => ({ isMuted: state.isMuted, volume: state.volume }),
        }
    )
);
