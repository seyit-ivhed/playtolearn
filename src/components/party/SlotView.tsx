import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PartySlot, Companion } from '../../types/party.types';
import { CompanionCard } from './CompanionCard';
import styles from './SlotView.module.css';

interface SlotViewProps {
    slot: PartySlot;
    equippedCompanion: Companion | null;
    onRemove: (slotId: string) => void;
    onSelect: (slotId: string) => void;
    isSelected: boolean;
}

export const SlotView: React.FC<SlotViewProps> = ({
    slot,
    equippedCompanion,
    onRemove,
    onSelect,
    isSelected
}) => {
    const { t } = useTranslation();

    return (
        <div
            className={`${styles.slotContainer} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelect(slot.id)}
        >
            <div className={styles.slotHeader}>
                <span className={styles.slotTypeIcon}>🎭</span>
                <span className={styles.slotName}>{slot.name}</span>
            </div>

            <div className={styles.slotContent}>
                {equippedCompanion ? (
                    <CompanionCard
                        companion={equippedCompanion}
                        state="equipped"
                        onRemove={() => onRemove(slot.id)}
                    />
                ) : (
                    <div className={styles.emptySlot}>
                        <span className={styles.emptyIcon}>⛌</span>
                        <span className={styles.emptyText}>{t('empty_slot')}</span>
                        <span className={styles.hint}>
                            {t('party.select_companion_hint')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
