import { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAudioStore } from '../../stores/audio.store';
import { ADVENTURES } from '../../data/adventures.data';
import { getTargetMusicTrack, getRandomSuccessTrack } from './audio.utils';
import { useEncounterStore } from '../../stores/encounter/store';
import { EncounterPhase } from '../../types/encounter.types';

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
    const [successTrack, setSuccessTrack] = useState<string | null>(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    // Get encounter phase to detect victory
    const { phase } = useEncounterStore();

    // Determine target track based on route and game state
    const targetFilename = useMemo(() => {
        let currentSuccess = successTrack;

        // 1. Handle randomization for battle victory
        if (location.pathname.startsWith('/encounter') && phase === EncounterPhase.VICTORY && !currentSuccess) {
            currentSuccess = getRandomSuccessTrack(Object.keys(musicFiles));
            setSuccessTrack(currentSuccess);
        }

        // 2. Reset success track when leaving victory state
        if (successTrack && phase !== EncounterPhase.VICTORY) {
            setSuccessTrack(null);
            currentSuccess = null;
        }

        return getTargetMusicTrack(location.pathname, ADVENTURES, phase, currentSuccess);
    }, [location.pathname, phase, successTrack]);

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
