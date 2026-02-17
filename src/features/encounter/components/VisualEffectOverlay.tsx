import { useEffect } from 'react';
import './VisualEffectOverlay.css';

interface VisualEffectOverlayProps {
    effectType: string;
    onComplete: () => void;
    targetId?: string;
}

export const VisualEffectOverlay = ({ effectType, onComplete, targetId }: VisualEffectOverlayProps) => {
    useEffect(() => {
        // Map effect types to their actual total completion time (CSS animation length + delays)
        const getEffectDuration = (type: string): number => {
            if (type.startsWith('precision_shot')) return 700; // 0.3s delay + 0.35s burst
            if (type.startsWith('blade_barrier')) return 1000; // 0.4s delay + 0.5s slash
            if (type.startsWith('ancestral_storm')) return 1200; // 0.4s delay + 0.8s impact
            if (type.startsWith('elixir_of_life')) return 1900; // 0.65s delay + 1.2s particle duration
            return 1200; // Default fallback
        };

        const duration = getEffectDuration(effectType);
        const timer = setTimeout(() => {
            onComplete();
        }, duration);

        return () => clearTimeout(timer);
    }, [onComplete, effectType]);

    const renderEffect = () => {
        if (effectType.startsWith('precision_shot')) {
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
                <div className="vfx-arrow-container" style={style}>
                    <div className="vfx-impact-flash" />
                    <div className="vfx-arrow-streak" />
                </div>
            );
        }

        if (effectType.startsWith('elixir_of_life')) {
            const style: React.CSSProperties = {};
            const partyGrid = document.querySelector('.party-grid');
            if (partyGrid) {
                const rect = partyGrid.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                style.position = 'fixed';
                style.left = `${centerX}px`;
                style.top = `${centerY}px`;
                style.transform = 'translate(-50%, -50%)';
                style.zIndex = 9999;
                style.width = '400px';
                style.height = '400px';
                style.overflow = 'visible';
            }

            return (
                <div className="vfx-heal-container" style={style}>
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

        if (effectType.startsWith('ancestral_storm')) {
            const style: React.CSSProperties = {};
            const monsterGrid = document.querySelector('.monster-grid');
            if (monsterGrid) {
                const rect = monsterGrid.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                style.position = 'fixed';
                style.left = `${centerX}px`;
                style.top = `${centerY}px`;
                style.transform = 'translate(-50%, -50%)';
                style.zIndex = 9999;
                style.width = '500px';
                style.height = '400px';
                style.overflow = 'visible';
            }

            return (
                <div className="vfx-storm-container" style={style}>
                    <div className="vfx-storm-cloud" />
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`vfx-storm-bolt vfx-storm-bolt-${i + 1}`} />
                    ))}
                    <div className="vfx-storm-impact" />
                </div>
            );
        }

        return null;

    };

    return (
        <div className="vfx-overlay-container" data-testid="visual-effect-overlay">
            {renderEffect()}
        </div>
    );
};
