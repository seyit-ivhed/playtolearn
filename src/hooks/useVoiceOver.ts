import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudioStore } from '../stores/audio.store';

// Eagerly load all voiceover paths
const voiceOverMap: Record<string, string> = import.meta.glob('/src/assets/voice/**/*.mp3', {
    eager: true,
    import: 'default'
});

export const useVoiceOver = (category: string, filename: string) => {
    const { i18n } = useTranslation();
    const { isMuted, volume } = useAudioStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!filename) {
            return;
        }

        // Find the right path in the preloaded map
        const pathSuffix = `/voice/${i18n.language}/${category}/${filename}.mp3`;
        const moduleKey = Object.keys(voiceOverMap).find(key => key.endsWith(pathSuffix));

        if (!moduleKey) {
            console.warn(`Voiceover file not found for ${pathSuffix}`);
            return;
        }

        const audioUrl = voiceOverMap[moduleKey];

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }

        const audio = new Audio(audioUrl);
        audio.volume = volume;
        audio.muted = isMuted;

        audioRef.current = audio;

        // Play the audio automatically
        audio.play().catch(e => {
            console.warn('Autoplay prevented for voiceover:', e);
        });

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, [i18n.language, category, filename, volume, isMuted]);
};
