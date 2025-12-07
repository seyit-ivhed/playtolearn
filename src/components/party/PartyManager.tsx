import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Companion, PartySlot } from '../../types/party.types';
import { CompanionCard } from './CompanionCard';
import { SlotView } from './SlotView';
import styles from './PartyManager.module.css';

interface PartyManagerProps {
    slots: PartySlot[];
    availableCompanions: Companion[];
    unlockedCompanions: string[];
    onAddCompanion: (slotId: string, companionId: string) => void;
    onRemoveCompanion: (slotId: string) => void;
}

export const PartyManager: React.FC<PartyManagerProps> = ({
    slots,
    availableCompanions,
    unlockedCompanions,
    onAddCompanion,
    onRemoveCompanion
}) => {
    const { t } = useTranslation();
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Get equipped companions
    const equippedCompanions = useMemo(() => {
        const equipped = new Map<string, Companion>();
        slots.forEach(slot => {
            if (slot.equippedCompanionId) {
                const companion = availableCompanions.find(c => c.id === slot.equippedCompanionId);
                if (companion) {
                    equipped.set(slot.id, companion);
                }
            }
        });
        return equipped;
    }, [slots, availableCompanions]);

    // Get unlocked but unequipped companions
    const unequippedCompanions = useMemo(() => {
        const equippedIds = new Set(Array.from(equippedCompanions.values()).map(c => c.id));
        return availableCompanions.filter(
            companion => unlockedCompanions.includes(companion.id) && !equippedIds.has(companion.id)
        );
    }, [availableCompanions, unlockedCompanions, equippedCompanions]);

    const handleAddCompanion = (companion: Companion) => {
        if (!selectedSlotId) return;

        onAddCompanion(selectedSlotId, companion.id);
        setSelectedSlotId(null);
    };

    const handleRemoveCompanion = (slotId: string) => {
        onRemoveCompanion(slotId);
    };

    const selectedSlot = selectedSlotId ? slots.find(s => s.id === selectedSlotId) : null;

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('party.title')}</h2>
                    <div className={styles.slotsGrid}>
                        {slots.map(slot => (
                            <SlotView
                                key={slot.id}
                                slot={slot}
                                equippedCompanion={equippedCompanions.get(slot.id) || null}
                                onRemove={handleRemoveCompanion}
                                onSelect={setSelectedSlotId}
                                isSelected={selectedSlotId === slot.id}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        {selectedSlot
                            ? t('party.select_companion', { slot: selectedSlot.name })
                            : t('party.available_companions')}
                    </h2>

                    {selectedSlot && (
                        <div className={styles.slotInfo}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setSelectedSlotId(null)}
                            >
                                {t('party.cancel_selection')}
                            </button>
                        </div>
                    )}

                    <div className={styles.companionsGrid}>
                        {unequippedCompanions.length > 0 ? (
                            unequippedCompanions.map(companion => (
                                <CompanionCard
                                    key={companion.id}
                                    companion={companion}
                                    state="unlocked"
                                    onAdd={selectedSlot ? handleAddCompanion : undefined}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyInventory}>
                                <span className={styles.emptyIcon}>🎭</span>
                                <p>{t('party.empty_roster')}</p>
                                <p className={styles.emptyHint}>
                                    {t('party.empty_hint')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
