import { motion } from 'framer-motion';
import styles from '../BalancePuzzle.module.css';

interface PressurePlateProps {
    weights: number[];
    total: number;
    side: 'left' | 'right';
    onRemove: (index: number) => void;
    isSolved: boolean;
}

export const PressurePlate = ({ weights, total, side, onRemove, isSolved }: PressurePlateProps) => {
    return (
        <div className={`${styles.plateContainer} ${side === 'left' ? styles.leftPlateContainer : styles.rightPlateContainer}`}>
            <div className={styles.stonesContainer}>
                {weights.map((w, i) => (
                    <motion.div
                        key={`${side}-${i}`}
                        className={`${styles.magicalStoneBlock} ${side === 'right' ? styles.stoneRight : ''} ${!isSolved ? styles.clickableStone : ''}`}
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => !isSolved && onRemove(i)}
                        whileHover={!isSolved ? { scale: 1.05, filter: 'brightness(1.2)' } : {}}
                        whileTap={!isSolved ? { scale: 0.95 } : {}}
                    >
                        <span className={styles.weightValue}>{w}</span>
                    </motion.div>
                ))}
            </div>
            {/* Total weight label */}
            <div className={styles.weightLabel}>{total}</div>
        </div>
    );
};

