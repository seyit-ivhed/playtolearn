import React from 'react';
import './UnitCardShield.css';

interface UnitCardShieldProps {
    currentShield: number;
    animationClass: string;
}

export const UnitCardShield: React.FC<UnitCardShieldProps> = ({ currentShield, animationClass }) => {
    if (!currentShield || currentShield <= 0) return null;

    return (
        <div className={`shield-overlay-container ${animationClass}`}>
            {/* Increased viewBox height to 34 to accommodate stroke and scale without clipping */}
            <svg className="shield-svg" viewBox="0 0 24 34" preserveAspectRatio="none">
                {/* 
                   Shield Shape: Wide top with corner points, curved sides to bottom point.
                   Two-tone effect: Left side lighter/darker than right side.
                */}
                <g transform="translate(12, 16) scale(1.1) translate(-12, -15)"> {/* Shifted center down slightly */}
                    {/* Full Shield Background (White Border) */}
                    <path
                        d="M2,4 Q2,4 2,4 L2,12 Q2,24 12,29 Q22,24 22,12 L22,4 Q12,1 2,4 Z"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                    />

                    {/* Left Half (Darker Blue) */}
                    <path
                        d="M12,29 Q2,24 2,12 L2,4 Q7,2.5 12,2 Z"
                        fill="#1e3a8a"
                    />

                    {/* Right Half (Lighter Blue) */}
                    <path
                        d="M12,29 Q22,24 22,12 L22,4 Q17,2.5 12,2 Z"
                        fill="#2563eb"
                    />
                </g>
            </svg>
            <span className="shield-amount-text">{currentShield}</span>
        </div>
    );
};
