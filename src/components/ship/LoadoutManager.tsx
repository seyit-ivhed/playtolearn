import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShipModule, ShipSlot, ShipStats } from '../../types/ship.types';
import { ModuleCard } from './ModuleCard';
import { SlotView } from './SlotView';
import { ShipStatsDisplay } from './ShipStatsDisplay';
import styles from './LoadoutManager.module.css';

interface LoadoutManagerProps {
    slots: ShipSlot[];
    availableModules: ShipModule[];
    ownedModuleIds: string[];
    onEquipModule: (slotId: string, moduleId: string) => void;
    onUnequipModule: (slotId: string) => void;
    baseStats: ShipStats;
}

export const LoadoutManager: React.FC<LoadoutManagerProps> = ({
    slots,
    availableModules,
    ownedModuleIds,
    onEquipModule,
    onUnequipModule,
    baseStats
}) => {
    const { t } = useTranslation();
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Get equipped modules
    const equippedModules = useMemo(() => {
        const equipped = new Map<string, ShipModule>();
        slots.forEach(slot => {
            if (slot.equippedModuleId) {
                const module = availableModules.find(m => m.id === slot.equippedModuleId);
                if (module) {
                    equipped.set(slot.id, module);
                }
            }
        });
        return equipped;
    }, [slots, availableModules]);

    // Calculate total stats
    const totalStats = useMemo(() => {
        const stats = { ...baseStats };

        equippedModules.forEach(module => {
            if (module.stats.attack) stats.attack += module.stats.attack;
            if (module.stats.defense) stats.defense += module.stats.defense;
            if (module.stats.health) stats.maxHealth += module.stats.health;
            if (module.stats.speed) stats.speed += module.stats.speed;
        });

        return stats;
    }, [baseStats, equippedModules]);

    // Get owned but unequipped modules
    const unequippedModules = useMemo(() => {
        const equippedIds = new Set(Array.from(equippedModules.values()).map(m => m.id));
        return availableModules.filter(
            module => ownedModuleIds.includes(module.id) && !equippedIds.has(module.id)
        );
    }, [availableModules, ownedModuleIds, equippedModules]);

    const handleEquipModule = (module: ShipModule) => {
        if (!selectedSlotId) return;

        const slot = slots.find(s => s.id === selectedSlotId);
        if (!slot) return;

        // Check if module type is allowed in this slot
        if (!slot.allowedTypes.includes(module.type)) {
            alert(`Cannot equip ${module.type} in this slot. Allowed types: ${slot.allowedTypes.join(', ')}`);
            return;
        }

        onEquipModule(selectedSlotId, module.id);
        setSelectedSlotId(null);
    };

    const handleUnequipModule = (slotId: string) => {
        onUnequipModule(slotId);
    };

    const selectedSlot = selectedSlotId ? slots.find(s => s.id === selectedSlotId) : null;

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>{t('loadout.title')}</h2>
                    <div className={styles.slotsGrid}>
                        {slots.map(slot => (
                            <SlotView
                                key={slot.id}
                                slot={slot}
                                equippedModule={equippedModules.get(slot.id) || null}
                                onUnequip={handleUnequipModule}
                                onSelect={setSelectedSlotId}
                                isSelected={selectedSlotId === slot.id}
                            />
                        ))}
                    </div>
                </div>

                <div className={styles.section}>
                    <ShipStatsDisplay stats={totalStats} />
                </div>
            </div>

            <div className={styles.rightPanel}>
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        {selectedSlot
                            ? t('loadout.select_module', { slot: t(`slots.${selectedSlot.name}`) })
                            : t('loadout.available_modules')}
                    </h2>

                    {selectedSlot && (
                        <div className={styles.slotInfo}>
                            <p>{t('loadout.allowed_types', { types: selectedSlot.allowedTypes.join(', ') })}</p>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setSelectedSlotId(null)}
                            >
                                {t('loadout.cancel_selection')}
                            </button>
                        </div>
                    )}

                    <div className={styles.modulesGrid}>
                        {unequippedModules.length > 0 ? (
                            unequippedModules
                                .filter(module =>
                                    !selectedSlot || selectedSlot.allowedTypes.includes(module.type)
                                )
                                .map(module => (
                                    <ModuleCard
                                        key={module.id}
                                        module={module}
                                        state="owned"
                                        onEquip={selectedSlot ? handleEquipModule : undefined}
                                    />
                                ))
                        ) : (
                            <div className={styles.emptyInventory}>
                                <span className={styles.emptyIcon}>📦</span>
                                <p>{t('loadout.empty_inventory')}</p>
                                <p className={styles.emptyHint}>
                                    {t('loadout.empty_hint')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
