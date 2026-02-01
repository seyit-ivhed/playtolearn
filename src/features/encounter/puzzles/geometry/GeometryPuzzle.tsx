import React, { useState } from 'react';
import styles from './GeometryPuzzle.module.css';
import { type PuzzleData } from '../../../../types/adventure.types';
import { useTranslation } from 'react-i18next';
import { type GeometryPuzzleData } from './GeometryEngine';

interface GeometryPuzzleProps {
    data: PuzzleData;
    onSolve: () => void;
}

export const GeometryPuzzle: React.FC<GeometryPuzzleProps> = ({ data, onSolve }) => {
    const { t } = useTranslation();
    const geometryData = data as GeometryPuzzleData;
    const [isSolved, setIsSolved] = useState(false);
    const [wrongAttempt, setWrongAttempt] = useState<string | null>(null);

    if (!geometryData.targetShapeType) {
        console.error('GeometryPuzzle: targetShapeType is missing in puzzle data');
        return null;
    }

    if (!geometryData.shapes || geometryData.shapes.length === 0) {
        console.error('GeometryPuzzle: shapes are missing or empty in puzzle data');
        return null;
    }

    if (!geometryData.correctShapeId) {
        console.error('GeometryPuzzle: correctShapeId is missing in puzzle data');
        return null;
    }

    const handleShapeClick = (shapeId: string) => {
        if (isSolved) {
            return;
        }

        if (shapeId === geometryData.correctShapeId) {
            setIsSolved(true);
            setTimeout(() => {
                onSolve();
            }, 1000);
        } else {
            setWrongAttempt(shapeId);
            setTimeout(() => {
                setWrongAttempt(null);
            }, 500);
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
    const targetShapeType = geometryData.targetShapeType;
    const shapeName = t(`puzzle.geometry.shapes.${targetShapeType}`, targetShapeType.toUpperCase());

    return (
        <div className={styles.container} data-testid="geometry-puzzle">
            <div className={styles.question} data-testid="geometry-question">
                {t('puzzle.geometry.find_shape', { shape: shapeName })}
            </div>

            <div className={styles.shapesGrid} data-testid="geometry-shapes-grid">
                {geometryData.shapes?.map((shape) => (
                    <button
                        key={shape.id}
                        data-testid={`geometry-shape-${shape.id}`}
                        className={styles.shapeButton}
                        onClick={() => {
                            handleShapeClick(shape.id);
                        }}
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
            {isSolved && (
                <div
                    data-testid="geometry-success"
                    style={{ fontSize: '2rem', marginTop: '1rem' }}
                >
                    ✨
                </div>
            )}
        </div>
    );
};
