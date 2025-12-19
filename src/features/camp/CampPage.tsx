import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/game.store';
import { getCompanionById } from '../../data/companions.data';
import { ADVENTURES } from '../../data/adventures.data';
import { getXpForNextLevel } from '../../utils/progression.utils';
import styles from './CampPage.module.css';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const {
        unlockedCompanions,
        activeParty,
        addToParty,
        removeFromParty,
        xpPool,
        companionStats,
        assignXpToCompanion,
        activeAdventureId,
        currentMapNode
    } = useGameStore();

    // Get active adventure and current camp info
    const adventure = ADVENTURES.find(a => a.id === activeAdventureId);
    const currentEncounter = adventure?.encounters[currentMapNode - 1];
    const storyBeat = currentEncounter?.storyBeat;

    // Helper to get remaining slots
    const slots = Array(4).fill(null).map((_, i) => activeParty[i] || null);

    const handleLevelUp = (companionId: string) => {
        // Assign 10 XP at a time for simple UI
        if (xpPool >= 10) {
            assignXpToCompanion(companionId, 10);
        }
    };

    return (
        <div className={styles.container}>
            {/* Minimal Header for Title & Story only */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 data-testid="camp-title">🔥 {currentEncounter?.label || 'Mountain Camp'}</h1>
                    <p className={styles.subtitle}>A moment of peace under the stars</p>
                </div>
                {/* Story Beat Display in Header */}
                {storyBeat && (
                    <div className={styles.storyBox}>
                        <div className={styles.speakerName}>{storyBeat.speaker}</div>
                        <p className={styles.storyText}>"{storyBeat.text}"</p>
                    </div>
                )}
            </header>

            <div className={styles.content}>
                {/* Main Campfire Scene */}
                <section className={styles.mainCampArea}>
                    <div className={styles.campfireScene}>
                        {/* Central Hub */}
                        <div className={styles.centralHub}>
                            <div className={styles.xpPoolDisplay}>
                                <span className={styles.xpLabel}>Shared XP</span>
                                <span className={styles.xpValue}>{xpPool}</span>
                            </div>

                            <div className={styles.fireEffect}>🔥</div>

                            <button
                                onClick={() => navigate('/map')}
                                className={styles.backButton}
                                data-testid="nav-map-btn"
                            >
                                🗺️ Pack Up & Go
                            </button>
                        </div>

                        {/* Radial Slots */}
                        {slots.map((companionId, idx) => {
                            if (!companionId) {
                                return (
                                    <div
                                        key={`empty-${idx}`}
                                        className={`${styles.companionSeat} ${styles[`pos${idx}`]}`}
                                        data-testid="empty-slot"
                                    >
                                        <div className={styles.emptyAvatar}>?</div>
                                    </div>
                                );
                            }

                            const data = getCompanionById(companionId);
                            const stats = companionStats[companionId] || { level: 1, xp: 0 };

                            return (
                                <div
                                    key={companionId}
                                    className={`${styles.companionSeat} ${styles[`pos${idx}`]}`}
                                    data-testid={`party-card-${companionId}`}
                                >
                                    <div className={styles.companionFocus}>
                                        <img src={data.image} alt={data.name} className={styles.largeAvatar} />
                                        <div className={styles.companionBadge}>
                                            <div className={styles.miniName}>{data.name}</div>
                                            <div className={styles.miniLevel}>Lv {stats.level}</div>
                                        </div>
                                        <button
                                            className={styles.leaveButton}
                                            onClick={() => removeFromParty(companionId)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Elevated XP Control */}
                                    <div className={styles.companionXpBar}>
                                        <button
                                            className={styles.levelUpBtn}
                                            disabled={xpPool < 10}
                                            onClick={() => handleLevelUp(companionId)}
                                        >
                                            ✨ +10 XP
                                        </button>
                                        <div className={styles.xpSmallBar}>
                                            <div
                                                className={styles.xpSmallFill}
                                                style={{ width: `${(stats.xp / getXpForNextLevel(stats.level)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Left/Right Roster Toggle or Sidebar */}
                <section className={styles.rosterSidebar}>
                    <h2 className={styles.rosterTitle}>Fellowship</h2>
                    <div className={styles.rosterGrid}>
                        {unlockedCompanions.map(id => {
                            const inParty = activeParty.includes(id);
                            const data = getCompanionById(id);

                            return (
                                <div
                                    key={id}
                                    className={`${styles.rosterCard} ${inParty ? styles.rosterCardInParty : ''}`}
                                    onClick={() => !inParty && activeParty.length < MAX_PARTY_SIZE && addToParty(id)}
                                >
                                    <img src={data.image} alt={data.name} className={styles.smallAvatar} />
                                    {inParty && <div className={styles.inPartyIndicator}>In Camp</div>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default CampPage;
