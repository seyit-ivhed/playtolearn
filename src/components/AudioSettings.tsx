import { Volume2, VolumeX } from 'lucide-react';
import { useAudioStore } from '../stores/audio.store';
import styles from './AudioSettings.module.css';

export const AudioSettings = () => {
    const { isMuted, volume, toggleMute, setVolume } = useAudioStore();

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
    };

    const volumePercentage = Math.round(volume * 100);

    return (
        <div className={styles.container}>
            <button
                className={styles.muteButton}
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? (
                    <VolumeX className={styles.icon} />
                ) : (
                    <Volume2 className={styles.icon} />
                )}
            </button>

            <div className={styles.volumeControl}>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className={styles.slider}
                    aria-label="Volume"
                    disabled={isMuted}
                />
                <span className={styles.volumeLabel}>{volumePercentage}%</span>
            </div>
        </div>
    );
};
