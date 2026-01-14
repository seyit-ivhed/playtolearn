import { motion } from 'framer-motion';
import { PressurePlate } from './PressurePlate';
import styles from '../BalancePuzzle.module.css';

interface GateVisualProps {
    leftWeights: number[];
    rightWeights: number[];
    leftTotal: number;
    rightTotal: number;
    isSolved: boolean;
}

export const GateVisual = ({
    leftWeights,
    rightWeights,
    leftTotal,
    rightTotal,
    isSolved
}: GateVisualProps) => {
    return (
        <div className={styles.gateScene}>
            {/* The background image and vignette are handled in CSS */}

            {/* Solved overlay/glow */}
            <motion.div
                className={styles.solvedOverlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: isSolved ? 1 : 0 }}
                transition={{ duration: 2 }}
            />

            <div className={styles.platesWrapper}>
                <PressurePlate
                    side="left"
                    weights={leftWeights}
                    total={leftTotal}
                />
                <PressurePlate
                    side="right"
                    weights={rightWeights}
                    total={rightTotal}
                />
            </div>
        </div>
    );
};
