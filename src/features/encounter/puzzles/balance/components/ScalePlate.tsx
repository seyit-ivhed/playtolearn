import { motion } from 'framer-motion';
import { CUNEIFORM_SYMBOLS } from '../constants';
import styles from '../BalancePuzzle.module.css';

interface ScalePlateProps {
    weights: number[];
    total: number;
    isCuneiform: boolean;
    side: 'left' | 'right';
}

export const ScalePlate = ({ weights, total, isCuneiform, side }: ScalePlateProps) => {
    return (
        <div className={`${styles.plateContainer} ${side === 'left' ? styles.leftPlateContainer : styles.rightPlateContainer}`}>
            <div className={styles.chain}></div>
            <div className={styles.plate}>
                {weights.map((w, i) => (
                    <motion.div
                        key={`${side}-${i}`}
                        className={styles.placedWeight}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        {isCuneiform && (w - 1 < CUNEIFORM_SYMBOLS.length) ? CUNEIFORM_SYMBOLS[w - 1] : w}
                    </motion.div>
                ))}
                <div className={styles.weightLabel}>{total}</div>
            </div>
        </div>
    );
};
