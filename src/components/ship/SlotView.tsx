import React from 'react';
import type { ShipSlot, ShipModule } from '../../types/ship.types';
import { ModuleType } from '../../types/ship.types';
import { ModuleCard } from './ModuleCard';
import styles from './SlotView.module.css';

interface SlotViewProps {
    slot: ShipSlot;
    equippedModule: ShipModule | null;
    onUnequip: (slotId: string) => void;
    onSelect: (slotId: string) => void;
    isSelected: boolean;
}

export const SlotView: React.FC<SlotViewProps> = ({
    slot,
    equippedModule,
    onUnequip,
    onSelect,
    isSelected
}) => {
    const getTypeIcon = (type: ModuleType) => {
        switch (type) {
            case ModuleType.WEAPON: return '⚔️';
            case ModuleType.SHIELD: return '🛡️';
            case ModuleType.SPECIAL: return '⚡';
            case ModuleType.CORE: return '💎';
            default: return '•';
        }
    };

    return (
        <div
            className={`${styles.slotContainer} ${isSelected ? styles.selected : ''}`}
            onClick={() => onSelect(slot.id)}
        >
            <div className={styles.slotHeader}>
                <span className={styles.slotTypeIcon}>{getTypeIcon(slot.type)}</span>
                <span className={styles.slotName}>{slot.name}</span>
            </div>

            <div className={styles.slotContent}>
                {equippedModule ? (
                    <ModuleCard
                        module={equippedModule}
                        state="equipped"
                        onUnequip={() => onUnequip(slot.id)}
                        className={styles.equippedCard}
                    />
                ) : (
                    <div className={styles.emptySlot}>
                        <span className={styles.emptyIcon}>⛌</span>
                        <span className={styles.emptyText}>Empty Slot</span>
                        <span className={styles.allowedTypes}>
                            Accepts: {slot.allowedTypes.join(', ')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
