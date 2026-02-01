import React, { useState } from 'react';
import styles from './GeometryPuzzle.module.css';
import { type PuzzleData } from '../../../../types/adventure.types';
import { type GeometryPuzzleData } from './GeometryEngine';
import { useTranslation } from 'react-i18next';

interface GeometryPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const GeometryPuzzle: React.FC<GeometryPuzzleProps> = ({ data, onSolve }) => {
    const { t } = useTranslation();
    const puzzleData = data as unknown as GeometryPuzzleData;
    const [isSolved, setIsSolved] = useState(false);
    const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);

    const handleShapeClick = (shapeId: string) => {
        if (isSolved) return;

        if (shapeId === puzzleData.correctShapeId) {
            setIsSolved(true);
            setTimeout(() => onSolve(), 1000);
        } else {
            setWrongAttempt(shapeId);
            setTimeout(() => setWrongAttempt(null), 500);
        }
    };

    const renderShape = (type: string, color: string, rotation: number) => {
        const style = {
            fill: color,
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'all 0.3s ease'
        };

        switch (type) {
            case 'triangle':
                return <polygon points="50,15 90,85 10,85" style={style} />;
            case 'square':
                return <rect x="20" y="20" width="60" height="60" style={style} />;
            case 'circle':
                return <circle cx="50" cy="50" r="35" style={style} />;
            case 'pentagon':
                return <polygon points="50,10 90,40 75,90 25,90 10,40" style={style} />;
            case 'hexagon':
                return <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" style={style} />;
            default:
                return null;
        }
    };

    // Construct the question
    // We need to make sure we have translations for these shapes or fallback
    const targetShapeType = (puzzleData as any).targetShapeType || 'triangle';
    const shapeName = t(`puzzle.geometry.shapes.${targetShapeType}`, targetShapeType.toUpperCase());

    return (
        <div className={styles.container}>
            <div className={styles.question}>
                {t(puzzleData.questionKey, `Find the ${shapeName}!`)}
            </div>

            <div className={styles.shapesGrid}>
                {puzzleData.shapes.map((shape) => (
                    <button
                        key={shape.id}
                        className={styles.shapeButton}
                        onClick={() => handleShapeClick(shape.id)}
                        style={{
                            opacity: wrongAttempt === shape.id ? 0.5 : 1,
                            transform: wrongAttempt === shape.id ? 'translateX(5px)' : 'none'
                        }}
                    >
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            {renderShape(shape.type, shape.color, shape.rotation)}
                        </svg>
                    </button>
                ))}
            </div>
            {isSolved && <div style={{ fontSize: '2rem', marginTop: '1rem' }}>✨</div>}
        </div>
    );
};
