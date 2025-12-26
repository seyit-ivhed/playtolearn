import { useGameStore } from '../stores/game/store';
import { usePlayerStore } from '../stores/player.store';

export const resetGame = () => {
    usePlayerStore.getState().resetProgress();
    useGameStore.getState().resetAll();

    // Force reload to ensure all transient state is cleared
    window.location.reload();
};
