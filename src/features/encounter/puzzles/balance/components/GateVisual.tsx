import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PressurePlate } from './PressurePlate';
import styles from '../BalancePuzzle.module.css';

interface GateVisualProps {
    leftWeights: number[];
    rightWeights: number[];
    leftTotal: number;
    rightTotal: number;
    isSolved: boolean;
    onReset: () => void;
    instruction: string;
}

export const GateVisual = ({
    leftWeights,
    rightWeights,
    leftTotal,
    rightTotal,
    isSolved,
    onReset,
    instruction
}: GateVisualProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.gateScene}>
            {/* Instruction Overlay */}
            <div className={styles.instructionOverImage}>
                {instruction}
            </div>

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

            {/* Reset Button positioned over the image */}
            {!isSolved && (
                <button
                    className={styles.resetBtnOverImage}
                    onClick={onReset}
                >
                    {t('common.start_over', 'Start Over')}
                </button>
            )}
        </div>
    );
};
