import { useEffect } from 'react';
import './VisualEffectOverlay.css';

interface VisualEffectOverlayProps {
    effectType: string;
    onComplete: () => void;
    targetId?: string;
}

const getBaseTargetStyle = (selector: string): React.CSSProperties => {
    if (!selector) {
        return {};
    }
    const element = document.querySelector(selector);
    if (!element) {
        return {};
    }

    const rect = element.getBoundingClientRect();
    return {
        position: 'fixed',
        left: `${rect.left + rect.width / 2}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        overflow: 'visible',
    };
};

const PrecisionShotVFX: React.FC<{ targetId?: string }> = ({ targetId }) => (
    <div
        className="vfx-arrow-container"
        style={{ ...getBaseTargetStyle(`[data-unit-id="${targetId}"]`), width: 0, height: 0 }}
    >
        <div className="vfx-impact-flash" />
        <div className="vfx-arrow-streak" />
    </div>
);

const ElixirOfLifeVFX: React.FC = () => (
    <div
        className="vfx-heal-container"
        style={{ ...getBaseTargetStyle('.party-grid'), width: 400, height: 400 }}
    >
        <div className="vfx-heal-glow" />
        <div className="vfx-heal-particles">
            {[...Array(12)].map((_, i) => (
                <div key={i} className={`vfx-heal-particle vfx-heal-particle-${i + 1}`} />
            ))}
        </div>
        <div className="vfx-heal-ring" />
    </div>
);

const BladeBarrierVFX: React.FC<{ targetId?: string }> = ({ targetId }) => (
    <div
        className="vfx-kenji-blade-container"
        style={{ ...getBaseTargetStyle(`[data-unit-id="${targetId}"]`), width: 0, height: 0 }}
    >
        <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-1" />
        <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-2" />
        <div className="vfx-kenji-blade-slash vfx-kenji-blade-slash-3" />
    </div>
);

const AncestralStormVFX: React.FC = () => (
    <div
        className="vfx-storm-container"
        style={{ ...getBaseTargetStyle('.monster-grid'), width: 500, height: 400 }}
    >
        <div className="vfx-storm-cloud" />
        {[...Array(5)].map((_, i) => (
            <div key={i} className={`vfx-storm-bolt vfx-storm-bolt-${i + 1}`} />
        ))}
        <div className="vfx-storm-impact" />
    </div>
);

/**
 * Registry mapping effect names to durations and components.
 */
interface EffectConfig {
    duration: number;
    Component: React.ComponentType<{ targetId?: string }>;
}

const EFFECT_CONFIGS: Record<string, EffectConfig> = {
    precision_shot: { duration: 700, Component: PrecisionShotVFX },
    elixir_of_life: { duration: 1900, Component: ElixirOfLifeVFX },
    blade_barrier: { duration: 1000, Component: BladeBarrierVFX },
    ancestral_storm: { duration: 1200, Component: AncestralStormVFX },
};

const DEFAULT_DURATION = 1200;

export const VisualEffectOverlay = ({ effectType, onComplete, targetId }: VisualEffectOverlayProps) => {
    // Perform lookup to find matching config (supports exact match or prefix)
    const configKey = Object.keys(EFFECT_CONFIGS).find((key) => {
        return effectType.startsWith(key);
    });
    const config = configKey ? EFFECT_CONFIGS[configKey] : null;

    useEffect(() => {
        const duration = config?.duration ?? DEFAULT_DURATION;
        const timer = setTimeout(() => {
            onComplete();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [onComplete, config]);

    if (!config) {
        return null;
    }

    const { Component } = config;

    return (
        <div className="vfx-overlay-container" data-testid="visual-effect-overlay">
            <Component targetId={targetId} />
        </div>
    );
};
