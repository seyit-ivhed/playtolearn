import { PuzzleType, type PuzzleData } from '../../../../types/adventure.types';
import { type DifficultyLevel } from '../../../../types/math.types';

export interface GeometryShape {
    id: string;
    type: 'triangle' | 'square' | 'circle' | 'pentagon' | 'hexagon';
    color: string;
    rotation: number;
}

export interface GeometryPuzzleData extends PuzzleData {
    shapes: GeometryShape[];
    correctShapeId: string;
    questionKey: string; // Translation key for the question
    targetShapeType: 'triangle' | 'square' | 'circle' | 'pentagon' | 'hexagon';
}

const SHAPES = ['triangle', 'square', 'circle', 'pentagon', 'hexagon'] as const;
const COLORS = ['#FF5252', '#448AFF', '#69F0AE', '#FFD740', '#E040FB'];

export const generateGeometryData = (difficulty: DifficultyLevel): PuzzleData => {
    // Number of shapes to display
    const shapeCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;

    const shapes: GeometryShape[] = [];
    for (let i = 0; i < shapeCount; i++) {
        shapes.push({
            id: `shape-${i}`,
            type: SHAPES[Math.floor(Math.random() * SHAPES.length)],
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rotation: Math.floor(Math.random() * 360)
        });
    }

    const correctIndex = Math.floor(Math.random() * shapeCount);
    const correctShape = shapes[correctIndex];

    // Determine question based on difficulty
    let questionKey = 'puzzle.geometry.find_shape'; // Default
    // For now, let's keep it simple: "Find the [Shape]"
    // In a real implementation we might have "Find the shape with X sides" for higher difficulty

    return {
        puzzleType: PuzzleType.GEOMETRY,
        targetValue: 0, // Not used
        options: [], // Not used
        shapes,
        correctShapeId: correctShape.id,
        questionKey,
        targetShapeType: correctShape.type // Helper for the UI to know what to ask for
    };
};
