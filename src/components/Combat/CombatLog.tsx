import React, { useEffect, useRef } from 'react';
import styles from './CombatLog.module.css';

interface CombatLogProps {
    logs: string[];
    className?: string;
}

export const CombatLog: React.FC<CombatLogProps> = ({
    logs,
    className = ''
}) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when logs change
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    return (
        <div className={`${styles.container} ${className}`}>
            {logs.length === 0 ? (
                <div className={styles.entry} style={{ color: '#6b7280', fontStyle: 'italic' }}>
                    Battle started...
                </div>
            ) : (
                logs.map((log, index) => (
                    <div key={index} className={styles.entry}>
                        {log}
                    </div>
                ))
            )}
            <div ref={bottomRef} />
        </div>
    );
};
