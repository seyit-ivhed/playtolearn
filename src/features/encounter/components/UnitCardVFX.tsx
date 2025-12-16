import React from 'react';

interface UnitCardVFXProps {
    activeVisualEffect?: string | null;
}

export const UnitCardVFX: React.FC<UnitCardVFXProps> = ({ activeVisualEffect }) => {
    if (!activeVisualEffect || (!activeVisualEffect.includes('protective_stance') && !activeVisualEffect.includes('village_squire'))) {
        return null;
    }

    return (
        <div className="vfx-large-shield-container">
            <svg className="vfx-large-shield-svg" viewBox="0 0 24 34" preserveAspectRatio="none">
                {/* Reuse same geometry but with glowy styles */}
                <g transform="translate(12, 16) scale(1.1) translate(-12, -15)">
                    <path
                        d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                        fill="none"
                        stroke="#ffd700" /* Gold Stroke */
                        strokeWidth="1"
                    />
                    {/* Holographic Fill */}
                    <path
                        d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                        fill="rgba(30, 144, 255, 0.5)"
                    />
                    {/* Inner Light */}
                    <path
                        d="M12,29 Q2,24 2,12 L2,4 Q7,2.5 12,2 Z"
                        fill="rgba(255, 255, 255, 0.2)"
                    />
                </g>
            </svg>
        </div>
    );
};
