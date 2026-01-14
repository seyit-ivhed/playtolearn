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
