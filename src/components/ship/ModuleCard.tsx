import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ShipModule, ModuleType } from '../../types/ship.types';
import styles from './ModuleCard.module.css';

interface ModuleCardProps {
    module: ShipModule;
    state: 'equipped' | 'owned' | 'locked' | 'shop';
    onEquip?: (module: ShipModule) => void;
    onUnequip?: (module: ShipModule) => void;
    onBuy?: (module: ShipModule) => void;
    className?: string;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
    module,
    state,
    onEquip,
    onUnequip,
    onBuy,
    className = ''
}) => {
    const { t } = useTranslation();

    const getStatIcon = (statName: string) => {
        switch (statName) {
            case 'attack': return '⚔️';
            case 'defense': return '🛡️';
            case 'health': return '❤️';
            case 'speed': return '⚡';
            case 'energyCost': return '🔋';
            case 'cooldown': return '⏳';
            default: return '•';
        }
    };

    const getTypeColor = (type: ModuleType) => {
        switch (type) {
            case ModuleType.WEAPON: return styles.typeWeapon;
            case ModuleType.SHIELD: return styles.typeShield;
            case ModuleType.SPECIAL: return styles.typeSpecial;
            case ModuleType.CORE: return styles.typeCore;
            default: return '';
        }
    };

    return (
        <div className={`${styles.card} ${getTypeColor(module.type)} ${styles[state]} ${className}`}>
            <div className={styles.header}>
                <span className={styles.icon}>
                    {module.icon?.startsWith('/') ? (
                        <img src={module.icon} alt={t(`modules.${module.id}.name`)} className={styles.moduleIcon} />
                    ) : (
                        module.icon || '📦'
                    )}
                </span>
                <div className={styles.titleInfo}>
                    <h3 className={styles.name}>{t(`modules.${module.id}.name`)}</h3>
                    <span className={styles.type}>{module.type}</span>
                </div>
            </div>

            <div className={styles.content}>
                <p className={styles.description}>{t(`modules.${module.id}.description`)}</p>

                <div className={styles.stats}>
                    {Object.entries(module.stats).map(([key, value]) => (
                        <div key={key} className={styles.statItem}>
                            <span className={styles.statIcon} title={key}>{getStatIcon(key)}</span>
                            <span className={styles.statValue}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.actions}>
                {state === 'owned' && onEquip && (
                    <button className={styles.equipBtn} onClick={() => onEquip(module)}>
                        {t('loadout.equip')}
                    </button>
                )}
                {state === 'equipped' && onUnequip && (
                    <button className={styles.unequipBtn} onClick={() => onUnequip(module)}>
                        {t('loadout.unequip')}
                    </button>
                )}
                {state === 'shop' && onBuy && (
                    <button className={styles.buyBtn} onClick={() => onBuy(module)}>
                        {t('loadout.buy', { cost: module.cost })}
                    </button>
                )}
                {state === 'locked' && (
                    <span className={styles.lockedLabel}>{t('loadout.locked')}</span>
                )}
            </div>
        </div>
    );
};
