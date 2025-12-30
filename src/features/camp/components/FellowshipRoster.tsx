import React from 'react';
import { getCompanionById } from '../../../data/companions.data';
import { getCompanionSprite } from '../../../data/companion-sprites';
import styles from './FellowshipRoster.module.css';

interface FellowshipRosterProps {
    unlockedCompanions: string[];
    activeParty: string[];
    maxPartySize: number;
    companionStats: Record<string, { level: number; xp: number }>;
    onAdd: (id: string) => void;
}

export const FellowshipRoster: React.FC<FellowshipRosterProps> = ({
    unlockedCompanions,
    activeParty,
    maxPartySize,
    companionStats,
    onAdd
}) => {
    return (
        <section className={styles.rosterSidebar}>
            <h2 className={styles.rosterTitle}>Fellowship</h2>
            <div className={styles.rosterGrid}>
                {unlockedCompanions.map(id => {
                    const inParty = activeParty.includes(id);
                    const data = getCompanionById(id);
                    if (!data) return null;

                    return (
                        <div
                            key={id}
                            className={`${styles.rosterCard} ${inParty ? styles.rosterCardInParty : ''}`}
                            onClick={() => !inParty && activeParty.length < maxPartySize && onAdd(id)}
                        >
                            <img src={getCompanionSprite(id, companionStats[id]?.level || 1)} alt={data.name} className={styles.smallAvatar} />
                            {inParty && <div className={styles.inPartyIndicator}>In Camp</div>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
