import { motion } from 'framer-motion';
import { ScalePlate } from './ScalePlate';
import styles from '../BalancePuzzle.module.css';

interface ScaleVisualProps {
    leftWeights: number[];
    rightWeights: number[];
    leftTotal: number;
    rightTotal: number;
    scaleAngle: number;
    isCuneiform: boolean;
}

export const ScaleVisual = ({
    leftWeights,
    rightWeights,
    leftTotal,
    rightTotal,
    scaleAngle,
    isCuneiform
}: ScaleVisualProps) => {
    return (
        <div className={styles.scaleContainer}>
            <div className={styles.scaleBase}></div>

            <motion.div
                className={styles.scaleBeam}
                animate={{ rotate: scaleAngle }}
                transition={{ type: 'spring', damping: 10, stiffness: 60 }}
            >
                <ScalePlate
                    side="left"
                    weights={leftWeights}
                    total={leftTotal}
                    isCuneiform={isCuneiform}
                />
                <ScalePlate
                    side="right"
                    weights={rightWeights}
                    total={rightTotal}
                    isCuneiform={isCuneiform}
                />
            </motion.div>
        </div>
    );
};
