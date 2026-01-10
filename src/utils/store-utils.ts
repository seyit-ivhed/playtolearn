import { usePlayerStore } from '../stores/player.store';

export const resetGame = () => {
    usePlayerStore.getState().resetProgress();

    // Force reload to ensure all transient state is cleared
    window.location.reload();
};
