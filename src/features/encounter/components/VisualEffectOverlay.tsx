import { useEffect } from 'react';
import './../styles/VisualEffectOverlay.css';

interface VisualEffectOverlayProps {
    effectType: string; // 'Protective Stance' | 'Piercing Shot' | etc. (matching updated names roughly or IDs)
    onComplete: () => void;
}

export const VisualEffectOverlay = ({ effectType, onComplete }: VisualEffectOverlayProps) => {

    useEffect(() => {
        // Duration depends on the animation length roughly
        // Shield: ~1s
        // Arrow: ~0.8s
        const timer = setTimeout(() => {
            onComplete();
        }, 1200); // 1.2s safety buffer for all effects

        return () => clearTimeout(timer);
    }, [onComplete]);

    const renderEffect = () => {
        if (effectType === 'protective_stance') {
            // Updated: Return null to hide global overlay (handled by per-card VFX now)
            // The useEffect timer still runs to trigger onComplete!
            return null;
        }

        if (effectType === 'piercing_shot') {
            return (
                <div className="vfx-arrow-container">
                    <div className="vfx-impact-flash" />
                    <div className="vfx-arrow-streak" />
                </div>
            );
        }

        return null;
    };

    return (
        <div className="vfx-overlay-container">
            {renderEffect()}
        </div>
    );
};
