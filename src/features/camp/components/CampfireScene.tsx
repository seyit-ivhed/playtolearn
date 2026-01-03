import React from 'react';
import { CompanionSeat } from './CompanionSeat';
import styles from './CampfireScene.module.css';

interface CampfireSceneProps {
    slots: (string | null)[];
    xpPool: number;
    companionStats: Record<string, { level: number }>;
    onRemove?: (id: string) => void;
    onLevelUp?: (id: string) => void;
}

export const CampfireScene: React.FC<CampfireSceneProps> = ({
    slots,
    xpPool,
    companionStats,
    onRemove,
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
                        onRemove={onRemove}
                        onLevelUp={onLevelUp}
                    />
                ))}
            </div>
        </section>
    );
};
