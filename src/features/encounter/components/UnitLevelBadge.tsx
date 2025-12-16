import React from 'react';

interface UnitLevelBadgeProps {
    level: number;
}

export const UnitLevelBadge: React.FC<UnitLevelBadgeProps> = ({ level }) => {
    return (
        <div className="unit-level-badge" style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            width: '30px',
            height: '30px',
            backgroundColor: '#f39c12',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            border: '2px solid #fff',
            zIndex: 10,
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}>
            {level}
        </div>
    );
};
