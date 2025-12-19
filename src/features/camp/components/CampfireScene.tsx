import React from 'react';
import { CentralHub } from './CentralHub';
import { CompanionSeat } from './CompanionSeat';
import styles from './CampfireScene.module.css';

interface CampfireSceneProps {
    slots: (string | null)[];
    xpPool: number;
    companionStats: Record<string, { level: number; xp: number }>;
    onRemove: (id: string) => void;
    onLevelUp: (id: string) => void;
    onPackUp: () => void;
}

export const CampfireScene: React.FC<CampfireSceneProps> = ({
    slots,
    xpPool,
    companionStats,
    onRemove,
    onLevelUp,
    onPackUp
}) => {
    return (
        <section className={styles.mainCampArea}>
            <div className={styles.campfireScene}>
                <CentralHub
                    xpPool={xpPool}
                    onPackUp={onPackUp}
                />

                {slots.map((companionId, idx) => (
                    <CompanionSeat
                        key={companionId || `empty-${idx}`}
                        index={idx}
                        companionId={companionId}
                        stats={companionId ? companionStats[companionId] : undefined}
                        xpPool={xpPool}
                        onRemove={onRemove}
                        onLevelUp={onLevelUp}
                    />
                ))}
            </div>
        </section>
    );
};
