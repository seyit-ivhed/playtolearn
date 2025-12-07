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

    // Define positions for each mission on the map (relative to 1000x600 container)
    const MISSION_POSITIONS: Record<string, { x: number; y: number }> = {
        '1': { x: 150, y: 500 },
        '2': { x: 350, y: 400 },
        '3': { x: 550, y: 250 },
        '4': { x: 750, y: 350 },
        '5': { x: 900, y: 150 },
    };

    const handleMissionClick = (mission: Mission) => {
        const status = getMissionStatus(mission.id);
        // Only allow clicking on available or completed missions (not locked)
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

    // Calculate connections lines
    const connections = MISSIONS.flatMap((mission) => {
        if (!mission.requirements?.previousMissionId) return [];

        const startPos = MISSION_POSITIONS[mission.requirements.previousMissionId];
        const endPos = MISSION_POSITIONS[mission.id];

        if (!startPos || !endPos) return [];

        const status = getMissionStatus(mission.id);
        const isLocked = status === 'LOCKED';

        return [{
            id: `${mission.requirements.previousMissionId}-${mission.id}`,
            x1: startPos.x,
            y1: startPos.y,
            x2: endPos.x,
            y2: endPos.y,
            isLocked
        }];
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>{t('mission_select')}</h2>
                <Link to="/party-camp" className={styles.partyCampButton} data-testid="party-camp-btn">
                    <span className={styles.partyCampIcon}>🏕️</span>
                    {t('party_camp')}
                </Link>
            </div>

            <div className={styles.mapContainer}>
                <div className={styles.mapContent}>
                    <svg className={styles.connections}>
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(0, 217, 255, 0.2)" />
                                <stop offset="100%" stopColor="rgba(0, 217, 255, 0.6)" />
                            </linearGradient>
                        </defs>
                        {connections.map((conn) => (
                            <line
                                key={conn.id}
                                x1={conn.x1}
                                y1={conn.y1}
                                x2={conn.x2}
                                y2={conn.y2}
                                stroke={conn.isLocked ? "rgba(255, 255, 255, 0.1)" : "url(#lineGradient)"}
                                strokeWidth="2"
                                strokeDasharray={conn.isLocked ? "5,5" : "none"}
                            />
                        ))}
                    </svg>

                    {MISSIONS.map((mission) => {
                        const status = getMissionStatus(mission.id);
                        const pos = MISSION_POSITIONS[mission.id] || { x: 0, y: 0 };

                        return (
                            <div
                                key={mission.id}
                                className={styles.missionNodeWrapper}
                                style={{ left: pos.x, top: pos.y }}
                            >
                                <MissionNode
                                    id={mission.id}
                                    status={status}
                                    title={mission.title}
                                    onClick={() => handleMissionClick(mission)}
                                />
                            </div>
                        );
                    })}
                </div>
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
