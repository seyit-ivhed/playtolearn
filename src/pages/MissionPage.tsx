import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMissionStore } from '../stores/mission.store';
import { MISSIONS } from '../data/missions.data';
import { MissionNode } from '../components/Mission/MissionNode';
import { MissionInfoModal } from '../components/Mission/MissionInfoModal';
import { useMissionNavigation } from '../hooks/useMissionNavigation';
import type { Mission } from '../types/mission.types';
import styles from './MissionPage.module.css';

export default function MissionPage() {
    const { t } = useTranslation();
    const { getMissionStatus } = useMissionStore();
    const { navigateToCombat } = useMissionNavigation();
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

    const handleMissionClick = (mission: Mission) => {
        const status = getMissionStatus(mission.id);
        // Only allow clicking on available missions
        if (status !== 'LOCKED') {
            setSelectedMission(mission);
        }
    };

    const handleStartMission = () => {
        if (selectedMission) {
            navigateToCombat(selectedMission.id);
        }
    };

    const handleCloseModal = () => {
        setSelectedMission(null);
    };

    return (
        <div className="container">
            <div className={styles.header}>
                <h2>{t('mission_select')}</h2>
                <Link to="/">{t('back_to_home')}</Link>
            </div>

            <div className={styles.missionGrid}>
                {MISSIONS.map((mission) => {
                    const status = getMissionStatus(mission.id);
                    return (
                        <MissionNode
                            key={mission.id}
                            id={mission.id}
                            status={status}
                            title={mission.title}
                            onClick={() => handleMissionClick(mission)}
                            className={styles.missionNode}
                        />
                    );
                })}
            </div>

            {selectedMission && (
                <MissionInfoModal
                    mission={selectedMission}
                    onStart={handleStartMission}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}
