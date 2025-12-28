import { motion } from 'framer-motion';
import { CUNEIFORM_SYMBOLS } from '../constants';
import styles from '../BalancePuzzle.module.css';

interface WeightInventoryProps {
    title: string;
    inventory: number[];
    usedIndices: number[];
    onAddWeight: (weight: number, index: number, side: 'left' | 'right') => void;
    isSolved: boolean;
    isCuneiform: boolean;
    side: 'left' | 'right';
}

export const WeightInventory = ({
    title,
    inventory,
    usedIndices,
    onAddWeight,
    isSolved,
    isCuneiform,
    side
}: WeightInventoryProps) => {
    return (
        <div className={styles.inventoryColumn}>
            <p className={styles.inventoryTitle}>{title}</p>
            <div className={styles.weightsGrid}>
                {inventory.map((weight, idx) => {
                    const isUsed = usedIndices.includes(idx);
                    return (
                        <motion.button
                            key={`${side}-inv-${idx}`}
                            className={`${styles.weightItem} ${isUsed ? styles.used : ''}`}
                            whileHover={isUsed ? {} : { scale: 1.1 }}
                            whileTap={isUsed ? {} : { scale: 0.9 }}
                            onClick={() => onAddWeight(weight, idx, side)}
                            disabled={isSolved || isUsed}
                            style={side === 'right' ? { background: '#3e2723', borderColor: '#5d4037' } : undefined}
                        >
                            <span className={styles.weightIcon}>
                                {isCuneiform && (weight - 1 < CUNEIFORM_SYMBOLS.length) ? CUNEIFORM_SYMBOLS[weight - 1] : '🪨'}
                            </span>
                            <span className={styles.weightValue}>{weight}</span>
                        </motion.button>
                    );
                })}
                {inventory.length === 0 && <div className={styles.emptySlot}>Empty</div>}
            </div>
        </div>
    );
};
