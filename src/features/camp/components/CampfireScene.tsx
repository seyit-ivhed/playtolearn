import React, { useState } from 'react';
import { CentralHub } from './CentralHub';
import { CompanionSeat } from './CompanionSeat';
import { CompanionTooltip } from './CompanionTooltip';
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
    const [hoveredCompanion, setHoveredCompanion] = useState<{ id: string; level: number } | null>(null);

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
                        onHover={(id, level) => setHoveredCompanion(id ? { id, level } : null)}
                    />
                ))}

                {hoveredCompanion && (
                    <CompanionTooltip
                        companionId={hoveredCompanion.id}
                        level={hoveredCompanion.level}
                    />
                )}
            </div>
        </section>
    );
};
