import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PartyManager } from '../components/party/PartyManager';
import { getAllCompanions } from '../data/companions.data';
import { PARTY_SLOTS } from '../data/party-slots.data';
import { usePartyStore } from '../stores/party.store';
import { useInventoryStore } from '../stores/inventory.store';
import styles from './PartyCampPage.module.css';

export default function PartyCampPage() {
    const { t } = useTranslation();

    // Store hooks
    const { composition, addCompanion, removeCompanion } = usePartyStore();
    const { unlockedCompanions } = useInventoryStore();

    // Derived state
    const slots = PARTY_SLOTS.map(slot => ({
        ...slot,
        equippedCompanionId: composition[slot.id] || null
    }));

    const availableCompanions = getAllCompanions();

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>{t('party_camp')}</h1>
                <Link to="/" className={styles.backLink}>{t('mission_select')}</Link>
            </div>

            <PartyManager
                slots={slots}
                availableCompanions={availableCompanions}
                unlockedCompanions={unlockedCompanions}
                onAddCompanion={addCompanion}
                onRemoveCompanion={removeCompanion}
            />
        </div>
    );
}
