import { useEffect, useState } from 'react';
import styles from './FloatingDamage.module.css';

interface DamageNumber {
    id: number;
    value: number;
    type: 'damage' | 'heal' | 'shield';
    x: number;
    y: number;
}

interface FloatingDamageProps {
    trigger?: {
        value: number;
        type: 'damage' | 'heal' | 'shield';
        x: number;
        y: number;
        timestamp: number;
    };
}

export const FloatingDamage: React.FC<FloatingDamageProps> = ({ trigger }) => {
    const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);

    useEffect(() => {
        if (trigger && trigger.timestamp > 0) {
            const newDamage: DamageNumber = {
                id: trigger.timestamp,
                value: trigger.value,
                type: trigger.type,
                x: trigger.x,
                y: trigger.y,
            };

            setDamageNumbers((prev) => [...prev, newDamage]);

            // Remove after animation completes
            setTimeout(() => {
                setDamageNumbers((prev) => prev.filter((d) => d.id !== newDamage.id));
            }, 1500);
        }
    }, [trigger]);

    if (damageNumbers.length === 0) return null;

    return (
        <div className={styles.container}>
            {damageNumbers.map((damage, index) => (
                <div
                    key={damage.id}
                    className={`${styles.damageNumber} ${styles[damage.type]}`}
                    style={{
                        left: `${damage.x}px`,
                        top: `${damage.y}px`,
                        animationDelay: `${index * 0.05}s`,
                    }}
                >
                    {damage.type === 'damage' && '-'}
                    {damage.type === 'heal' && '+'}
                    {damage.value}
                </div>
            ))}
        </div>
    );
};
