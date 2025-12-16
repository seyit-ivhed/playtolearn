import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/game.store';

import { getCompanionById } from '../../data/companions.data';
import styles from './CampPage.module.css';

const MAX_PARTY_SIZE = 4;

const CampPage = () => {
    const navigate = useNavigate();
    const { unlockedCompanions, activeParty, addToParty, removeFromParty } = useGameStore();

    // Helper to get remaining slots
    const slots = Array(4).fill(null).map((_, i) => activeParty[i] || null);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 data-testid="camp-title">Fellowship Camp</h1>
                    <p className={styles.subtitle}>Gather your heroes around the fire</p>
                </div>
                <button
                    onClick={() => navigate('/map')}
                    className={styles.backButton}
                    data-testid="nav-map-btn"
                >
                    🗺️ Return to Map
                </button>
            </header>

            <div className={styles.content}>
                {/* Left: Active Party (Campfire) */}
                <section className={styles.partySection}>
                    <h2 className={styles.sectionTitle}>Your Party ({activeParty.length}/{MAX_PARTY_SIZE})</h2>

                    <div className={styles.partyGrid}>
                        {slots.map((companionId, idx) => {
                            if (!companionId) {
                                return (
                                    <div key={`empty-${idx}`} className={styles.emptySlot} data-testid="empty-slot">
                                        <div className={styles.emptyText}>Empty Slot</div>
                                    </div>
                                );
                            }

                            const data = getCompanionById(companionId);
                            return (
                                <div
                                    key={companionId}
                                    className={styles.characterCard}
                                    onClick={() => removeFromParty(companionId)}
                                    data-testid={`party-card-${companionId}`}
                                >
                                    <div className={styles.cardContent}>
                                        <img src={data.image} alt={data.name} className={styles.cardImage} />
                                        <div className={styles.cardName}>{data.name}</div>
                                        <div className={styles.cardRole}>{data.role}</div>
                                    </div>



                                    <div className={styles.removeOverlay} />
                                    <div className={styles.removeText}>✕ Remove</div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Right: Roster (Guild Hall) */}
                <section className={styles.rosterSection}>
                    <h2 className={styles.rosterTitle}>Roster</h2>

                    <div className={styles.rosterList}>
                        {unlockedCompanions.map(id => {
                            const inParty = activeParty.includes(id);
                            const data = getCompanionById(id);

                            return (
                                <div
                                    key={id}
                                    className={`${styles.rosterItem} ${inParty ? styles.rosterItemDisabled : ''}`}
                                    onClick={() => !inParty && addToParty(id)}
                                >
                                    <img src={data.image} alt={data.name} className={styles.rosterAvatar} />
                                    <div className={styles.rosterInfo}>
                                        <div className={styles.rosterName}>{data.name}</div>
                                        <div className={styles.rosterRole}>{data.role}</div>
                                    </div>
                                    {inParty && <div className={styles.inPartyTag}>In Party</div>}
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
