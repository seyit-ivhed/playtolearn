import { motion } from 'framer-motion';
import styles from '../BalancePuzzle.module.css';

interface PressurePlateProps {
    weights: number[];
    total: number;
    side: 'left' | 'right';
    offsetY?: number;
}

export const PressurePlate = ({ weights, total, side, offsetY = 0 }: PressurePlateProps) => {
    return (
        <div className={`${styles.plateContainer} ${side === 'left' ? styles.leftPlateContainer : styles.rightPlateContainer}`}>
            <motion.div
                className={styles.pressurePlate}
                animate={{ y: offsetY }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className={styles.stonesContainer}>
                    {weights.map((w, i) => (
                        <motion.div
                            key={`${side}-${i}`}
                            className={`${styles.magicalStoneBlock} ${side === 'right' ? styles.stoneRight : ''}`}
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <span className={styles.weightValue}>{w}</span>
                        </motion.div>
                    ))}
                </div>
                {/* Optional: Show total weight if desired, or keep it hidden for a harder puzzle */}
                <div className={styles.weightLabel}>{total}</div>
            </motion.div>
        </div>
    );
};

