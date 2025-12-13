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
        // Normalize effect type string for loose matching (optional)
        // assuming passed exact special ability name
        const type = effectType.toLowerCase();

        if (type.includes('protective stance') || type.includes('village_squire')) {
            return (
                <div className="vfx-shield-container">
                    <div className="vfx-shield-pulse" />
                    <div className="vfx-shield-circle" />
                </div>
            );
        }

        if (type.includes('piercing shot') || type.includes('novice_archer')) {
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
