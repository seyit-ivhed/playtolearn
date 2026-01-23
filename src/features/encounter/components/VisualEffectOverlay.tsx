import { useEffect } from 'react';
import './VisualEffectOverlay.css';

interface VisualEffectOverlayProps {
    effectType: string;
    onComplete: () => void;
    targetId?: string;
}

export const VisualEffectOverlay = ({ effectType, onComplete, targetId }: VisualEffectOverlayProps) => {

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
        if (effectType.startsWith('protective_stance')) {
            // Updated: Return null to hide global overlay (handled by per-card VFX now)
            // The useEffect timer still runs to trigger onComplete!
            return null;
        }

        if (effectType.startsWith('piercing_shot')) {
            return (
                <div className="vfx-arrow-container">
                    <div className="vfx-impact-flash" />
                    <div className="vfx-arrow-streak" />
                </div>
            );
        }

        if (effectType.startsWith('jaguar_strike')) {
            const style: React.CSSProperties = {};

            if (targetId) {
                const targetElement = document.querySelector(`[data-unit-id="${targetId}"]`);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    // Position roughly center of the card
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    style.position = 'fixed'; // Use fixed to be relative to viewport, safer than absolute if parents have transform
                    style.left = `${centerX}px`;
                    style.top = `${centerY}px`;
                    style.transform = 'translate(-50%, -50%)'; // Center the effect container on that point
                    style.zIndex = 9999;
                    style.width = '0px'; // Collapse container
                    style.height = '0px';
                    style.overflow = 'visible'; // Allow effect to spill out
                }
            }

            return (
                <div className="vfx-jaguar-container" style={style}>
                    <div className="vfx-jaguar-slash vfx-jaguar-slash-1" />
                    <div className="vfx-jaguar-slash vfx-jaguar-slash-2" />
                    <div className="vfx-jaguar-slash vfx-jaguar-slash-3" />
                    <div className="vfx-jaguar-impact" />
                </div>
            );
        }

        if (effectType.startsWith('elixir_of_life')) {
            return (
                <div className="vfx-heal-container">
                    <div className="vfx-heal-glow" />
                    <div className="vfx-heal-particles">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`vfx-heal-particle vfx-heal-particle-${i + 1}`} />
                        ))}
                    </div>
                    <div className="vfx-heal-ring" />
                </div>
            );
        }

        if (effectType.startsWith('blade_barrier')) {
            const style: React.CSSProperties = {};

            if (targetId) {
                const targetElement = document.querySelector(`[data-unit-id="${targetId}"]`);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    style.position = 'fixed';
                    style.left = `${centerX}px`;
                    style.top = `${centerY}px`;
                    style.transform = 'translate(-50%, -50%)';
                    style.zIndex = 9999;
                    style.width = '0px';
                    style.height = '0px';
                    style.overflow = 'visible';
                }
            }

            return (
                <div className="vfx-kenji-blade-container" style={style}>
                    <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-1" />
                    <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-2" />
                    <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-3" />
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
