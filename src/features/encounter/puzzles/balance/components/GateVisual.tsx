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
    const diff = rightTotal - leftTotal;
    // Calculate vertical offset (max +/- 30px)
    const maxOffset = 30;
    const sensitivity = 5;
    const offset = Math.min(Math.max(diff * sensitivity, -maxOffset), maxOffset);

    // If balanced, offset is 0. 
    // If right is heavier (diff > 0), right goes DOWN (positive Y), left goes UP (negative Y).
    // Note: In CSS translateY, positive is down.
    const rightOffsetY = offset;
    const leftOffsetY = -offset;

    return (
        <div className={styles.gateScene}>
            <div className={styles.gateStructure}>
                <div className={styles.gateArch}>
                    <motion.div
                        className={styles.gateDoor}
                        animate={{
                            y: isSolved ? -100 : 0,
                            opacity: isSolved ? 0.5 : 1,
                            filter: isSolved ? "brightness(1.5) drop-shadow(0 0 10px #d4af37)" : "brightness(1)"
                        }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    >
                        <div className={styles.gateSymbol}></div>
                    </motion.div>
                </div>
                <div className={styles.gateBase}></div>
            </div>

            <div className={styles.platesWrapper}>
                <PressurePlate
                    side="left"
                    weights={leftWeights}
                    total={leftTotal}
                    offsetY={leftOffsetY}
                />
                <PressurePlate
                    side="right"
                    weights={rightWeights}
                    total={rightTotal}
                    offsetY={rightOffsetY}
                />
            </div>
        </div>
    );
};
