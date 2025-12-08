import { useNavigate } from 'react-router-dom';
import type { AdventureId } from '../types/adventure.types';

/**
 * Hook for handling adventure-related navigation
 */
export const useAdventureNavigation = () => {
    const navigate = useNavigate();

    const navigateToEncounter = (adventureId: AdventureId) => {
        // In the new flow, we might set current adventure in store then nav to /encounter or /map
        // For now, let's assume direct nav
        navigate(`/encounter?adventureId=${adventureId}`);
    };

    const navigateToAdventureSelect = () => {
        navigate('/map');
    };

    const navigateToCamp = () => {
        navigate('/camp');
    };

    const navigateToHome = () => {
        navigate('/camp');
    };

    return {
        navigateToEncounter,
        navigateToAdventureSelect,
        navigateToCamp,
        navigateToHome,
    };
};
