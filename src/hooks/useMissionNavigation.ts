import { useNavigate } from 'react-router-dom';
import type { MissionId } from '../types/mission.types';

/**
 * Hook for handling mission-related navigation
 */
export const useMissionNavigation = () => {
    const navigate = useNavigate();

    const navigateToCombat = (missionId: MissionId) => {
        navigate(`/combat?missionId=${missionId}`);
    };

    const navigateToMissionSelect = () => {
        navigate('/');
    };

    const navigateToShipBay = () => {
        navigate('/ship-bay');
    };

    const navigateToHome = () => {
        navigate('/');
    };

    return {
        navigateToCombat,
        navigateToMissionSelect,
        navigateToShipBay,
        navigateToHome,
    };
};
