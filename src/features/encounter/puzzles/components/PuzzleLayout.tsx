import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './PuzzleLayout.module.css';

interface PuzzleLayoutProps {
    instruction: string;
    onReset: () => void;
    children: ReactNode;
    isSolved?: boolean;
}

export const PuzzleLayout = ({
    instruction,
    onReset,
    children,
    isSolved = false
}: PuzzleLayoutProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.layout}>
            {/* Top: Instructions */}
            <motion.div
                className={styles.instructionContainer}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <p className={styles.instructionText}>
                    {instruction}
                </p>
            </motion.div>

            {/* Middle: Puzzle Area */}
            <div className={styles.puzzleContainer}>
                {children}
            </div>

            {/* Bottom: Reset Button */}
            <div className={styles.controls}>
                <motion.button
                    className={styles.resetBtn}
                    onClick={onReset}
                    disabled={isSolved}
                    whileHover={!isSolved ? { scale: 1.05 } : {}}
                    whileTap={!isSolved ? { scale: 0.95 } : {}}
                >
                    {t('common.start_over', 'Start Over')}
                </motion.button>
            </div>
        </div>
    );
};
