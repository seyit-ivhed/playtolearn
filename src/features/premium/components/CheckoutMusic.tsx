import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../../../stores/audio.store';
import successTrack from '../../../assets/music/success/success-2.mp3?url';

export const CheckoutMusic: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isMuted, volume, isVoiceOverPlaying } = useAudioStore();

    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.src = successTrack as string;
        audioRef.current.play().catch(e => {
            console.info("Autoplay blocked, waiting for user interaction.", e);
        });
    }, []);

    // Volume control effect
    useEffect(() => {
        if (audioRef.current) {
            const currentVolume = isVoiceOverPlaying ? volume * 0.25 : volume;
            audioRef.current.volume = isMuted ? 0 : currentVolume;
        }
    }, [isMuted, volume, isVoiceOverPlaying]);

    // Global interaction listener to retry playback if blocked
    useEffect(() => {
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.error("Failed to play on interaction:", e));
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    return (
        <audio
            ref={audioRef}
            loop
            preload="auto"
        />
    );
};
