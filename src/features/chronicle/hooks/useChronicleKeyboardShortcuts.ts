import { useEffect } from 'react';

interface UseChronicleKeyboardShortcutsProps {
    isTocOpen: boolean;
    handleNext: () => void;
    handlePrev: () => void;
    setIsTocOpen: (open: boolean) => void;
}

export const useChronicleKeyboardShortcuts = ({
    isTocOpen,
    handleNext,
    handlePrev,
    setIsTocOpen
}: UseChronicleKeyboardShortcutsProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isTocOpen) return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'm' || e.key === 'Enter') {
                setIsTocOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, isTocOpen, setIsTocOpen]);
};
