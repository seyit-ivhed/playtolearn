import React from 'react';
import { CompanionSeat } from './CompanionSeat';
import styles from './CampfireScene.module.css';

interface CampfireSceneProps {
    slots: (string | null)[];
    xpPool: number;
    companionStats: Record<string, { level: number }>;
    onLevelUp?: (id: string) => void;
}

export const CampfireScene: React.FC<CampfireSceneProps> = ({
    slots,
    xpPool,
    companionStats,
    onLevelUp
}) => {
    return (
        <section className={styles.mainCampArea}>
            <div className={styles.campfireScene}>
                {slots.filter(id => id !== null).map((companionId) => (
                    <CompanionSeat
                        key={companionId!}
                        companionId={companionId!}
                        stats={companionStats[companionId!]}
                        xpPool={xpPool}
                        onLevelUp={onLevelUp}
                    />
                ))}
            </div>
        </section>
    );
};
