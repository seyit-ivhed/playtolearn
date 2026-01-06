import React from 'react';
import { motion } from 'framer-motion';

interface ChapterIllustrationProps {
    illustration: string | null | undefined;
    adventureTitle: string;
    isLocked: boolean | undefined;
}

export const ChapterIllustration: React.FC<ChapterIllustrationProps> = ({
    illustration,
    adventureTitle,
    isLocked
}) => {
    return (
        <motion.div
            className="illustration-container"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {illustration ? (
                <img
                    src={illustration}
                    alt={adventureTitle}
                    className="chapter-illustration"
                />
            ) : (
                <div className="illustration-placeholder" />
            )}
            {isLocked && <div className="lock-icon">🔒</div>}
        </motion.div>
    );
};
