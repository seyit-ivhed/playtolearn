import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudioStore } from '../../stores/audio.store';
import { ADVENTURES } from '../../data/adventures.data';
import { getTargetMusicTrack } from './audio.utils';

// Load all music files from the assets directory
const musicFiles = import.meta.glob('../../assets/music/**/*.mp3', {
    eager: true,
    query: '?url',
    import: 'default'
}) as Record<string, string>;

const getMusicUrl = (filename: string) => {
    const key = `../../assets/music/${filename}`;
    return musicFiles[key] || '';
};

export const BackgroundMusic = () => {
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { isMuted, volume } = useAudioStore();
    const [currentTrack, setCurrentTrack] = useState<string | null>(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    // Determine target track based on route
    const targetFilename = useMemo(() => {
        return getTargetMusicTrack(location.pathname, ADVENTURES);
    }, [location.pathname]);

    // Handle track switching
    useEffect(() => {
        if (targetFilename !== currentTrack) {
            setCurrentTrack(targetFilename);

            if (audioRef.current) {
                if (targetFilename) {
                    const url = getMusicUrl(targetFilename);
                    audioRef.current.src = url;

                    // Try to play
                    audioRef.current.play().then(() => {
                        setIsAudioUnlocked(true);
                    }).catch(e => {
                        // Browsers block autoplay if user hasn't interacted
                        console.info("Autoplay blocked, waiting for user interaction.", e);
                    });
                } else {
                    audioRef.current.pause();
                    audioRef.current.src = '';
                }
            }
        }
    }, [targetFilename, currentTrack]);

    // Global interaction listener to "unlock" audio
    useEffect(() => {
        if (isAudioUnlocked) return;

        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused && currentTrack) {
                audioRef.current.play()
                    .then(() => setIsAudioUnlocked(true))
                    .catch(e => console.error("Failed to play on interaction:", e));
            }
        };

        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, [isAudioUnlocked, currentTrack]);

    // Handle Volume & Mute changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [isMuted, volume]);

    return (
        <audio
            ref={audioRef}
            loop
            preload="auto"
        />
    );
};
