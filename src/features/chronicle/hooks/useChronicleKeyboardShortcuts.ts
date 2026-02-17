import { useEffect } from 'react';

interface UseChronicleKeyboardShortcutsProps {
    handleNext: () => void;
    handlePrev: () => void;
}

export const useChronicleKeyboardShortcuts = ({
    handleNext,
    handlePrev
}: UseChronicleKeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);
};
