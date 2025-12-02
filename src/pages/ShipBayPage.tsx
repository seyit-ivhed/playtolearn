import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadoutManager } from '../components/ship/LoadoutManager';
import { getAllModules } from '../data/modules.data';
import { SHIP_SLOTS } from '../data/slots.data';
import { useShipStore } from '../stores/ship.store';
import { useInventoryStore } from '../stores/inventory.store';
import styles from './ShipBayPage.module.css';

export default function ShipBayPage() {
    const { t } = useTranslation();

    // Store hooks
    const { loadout, getTotalStats, equipModule, unequipModule } = useShipStore();
    const { ownedModuleIds } = useInventoryStore();

    // Derived state
    const slots = SHIP_SLOTS.map(slot => ({
        ...slot,
        equippedModuleId: loadout[slot.id] || null
    }));

    const availableModules = getAllModules();
    const totalStats = getTotalStats();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>{t('ship_bay')}</h1>
                <Link to="/" className={styles.backLink}>{t('back_to_home')}</Link>
            </div>

            <LoadoutManager
                slots={slots}
                availableModules={availableModules}
                ownedModuleIds={ownedModuleIds}
                onEquipModule={equipModule}
                onUnequipModule={unequipModule}
                baseStats={totalStats}
            />
        </div>
    );
}
